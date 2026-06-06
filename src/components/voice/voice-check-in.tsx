"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  analyzeVoiceSamples,
  toneToMoodScore,
  type PitchSample,
  type VoiceAnalysisResult,
} from "@/lib/voice/voice-analyzer";
import { Mic, MicOff, Shield, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addVoiceCheckIn, addGuardianAlert } from "@/lib/demo-store";
import { CRISIS_RESOURCES } from "@/lib/constants/crisis-resources";

type CheckInPhase = "intro" | "recording" | "processing" | "complete" | "crisis";

interface VoiceCheckInResult {
  transcript: string;
  voiceAnalysis: VoiceAnalysisResult;
  moodScore: number;
  moderationSeverity: string;
  guardianAlertSent: boolean;
}

const RECORDING_DURATION_MS = 15_000;
const SAMPLE_INTERVAL_MS = 200;

/**
 * Voice-only wellness check-in. No text input — speech captured and analyzed.
 */
export function VoiceCheckIn() {
  const router = useRouter();
  const [phase, setPhase] = useState<CheckInPhase>("intro");
  const [elapsed, setElapsed] = useState(0);
  const [liveTone, setLiveTone] = useState<string>("neutral");
  const [result, setResult] = useState<VoiceCheckInResult | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const samplesRef = useRef<PitchSample[]>([]);
  const transcriptRef = useRef("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    recognitionRef.current?.stop();
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close();
    mediaStreamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      samplesRef.current = [];
      transcriptRef.current = "";
      setElapsed(0);
      setPhase("recording");

      const SpeechRecognitionCtor =
        window.SpeechRecognition ?? window.webkitSpeechRecognition;
      if (SpeechRecognitionCtor) {
        const recognition = new SpeechRecognitionCtor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let text = "";
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          transcriptRef.current = text;
        };
        recognition.start();
        recognitionRef.current = recognition;
      }

      const freqData = new Float32Array(analyser.frequencyBinCount);
      const startTime = Date.now();

      timerRef.current = setInterval(() => {
        const elapsedMs = Date.now() - startTime;
        setElapsed(Math.min(100, (elapsedMs / RECORDING_DURATION_MS) * 100));

        analyser.getFloatFrequencyData(freqData);
        const volume = computeVolume(freqData);
        const pitch = estimatePitchSimple(freqData, audioContext.sampleRate);
        if (pitch > 0) {
          samplesRef.current.push({ frequencyHz: pitch, volume });
          const partial = analyzeVoiceSamples(samplesRef.current.slice(-10));
          setLiveTone(partial.toneLabel);
        }

        if (elapsedMs >= RECORDING_DURATION_MS) {
          finishRecording();
        }
      }, SAMPLE_INTERVAL_MS);
    } catch {
      toast.error("Microphone access required for voice check-in.");
    }
  };

  const finishRecording = async () => {
    cleanup();
    setPhase("processing");

    const voiceAnalysis = analyzeVoiceSamples(samplesRef.current);
    const moodScore = toneToMoodScore(voiceAnalysis);

    try {
      const res = await fetch("/api/voice-checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcriptRef.current,
          voice_analysis: voiceAnalysis,
          mood_score: moodScore,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error("Check-in failed. Please try again.");
        setPhase("intro");
        return;
      }

      const checkInResult: VoiceCheckInResult = {
        transcript: data.data.transcript_redacted ?? "",
        voiceAnalysis,
        moodScore: data.data.mood_score,
        moderationSeverity: data.data.moderation.severity,
        guardianAlertSent: data.data.guardian_alert_sent,
      };

      addVoiceCheckIn({
        user_id: "demo",
        transcript_redacted: data.data.transcript_redacted ?? "",
        mood_score: data.data.mood_score,
        voice_analysis: {
          averagePitchHz: voiceAnalysis.averagePitchHz,
          pitchVariance: voiceAnalysis.pitchVariance,
          toneLabel: voiceAnalysis.toneLabel,
          stressIndicator: voiceAnalysis.stressIndicator,
        },
        moderation_severity: data.data.moderation.severity,
        guardian_alert_sent: data.data.guardian_alert_sent,
      });

      if (data.data.guardian_alert_payload) {
        addGuardianAlert({
          student_id: "demo",
          guardian_id: "guardian-1",
          severity: data.data.guardian_alert_payload.severity,
          message_summary: data.data.guardian_alert_payload.summary,
        });
        checkInResult.guardianAlertSent = true;
      }

      setResult(checkInResult);

      if (data.data.moderation.severity === "threat_to_life") {
        setPhase("crisis");
        toast.error("Support resources activated. A guardian has been notified.");
      } else {
        setPhase("complete");
        toast.success(`Voice check-in saved! Mood: ${data.data.mood_score}/10`);
      }
    } catch {
      toast.error("Network error during check-in.");
      setPhase("intro");
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <Card aria-live="polite" aria-atomic="true">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" aria-hidden="true" />
            Voice Wellness Check-In
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Speak naturally about how you feel. Your voice tone and pitch are analyzed —
            no typing required.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {phase === "intro" && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <Mic className="h-12 w-12 text-primary" aria-hidden="true" />
              </div>
              <p className="text-sm text-muted-foreground">
                Tap the button and speak for 15 seconds. Example: &quot;I feel stressed about
                tomorrow&apos;s mock test but I studied well today.&quot;
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4" aria-hidden="true" />
                Protected by safety filtering. Crisis phrases alert guardians.
              </div>
              <Button variant="wellness" size="lg" onClick={startRecording} className="w-full">
                <Mic className="h-5 w-5" aria-hidden="true" />
                Start Voice Recording
              </Button>
            </div>
          )}

          {phase === "recording" && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-24 w-24 animate-pulse items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <Mic className="h-12 w-12 text-red-500" aria-hidden="true" />
              </div>
              <p className="font-medium" aria-live="assertive">
                Recording… speak now
              </p>
              <Badge variant="secondary">Live tone: {liveTone}</Badge>
              <Progress value={elapsed} aria-label="Recording progress" />
              <Button variant="outline" onClick={finishRecording}>
                <MicOff className="h-4 w-4" aria-hidden="true" />
                Stop Early
              </Button>
            </div>
          )}

          {phase === "processing" && (
            <div className="py-8 text-center text-muted-foreground" role="status">
              Analyzing voice pitch, tone, and safety…
            </div>
          )}

          {phase === "complete" && result && (
            <div className="space-y-4">
              <div className="rounded-xl bg-primary/10 p-4 text-center">
                <p className="text-sm text-muted-foreground">Estimated Mood Score</p>
                <p className="text-4xl font-bold text-primary">{result.moodScore}/10</p>
                <Badge className="mt-2" variant="secondary">
                  Tone: {result.voiceAnalysis.toneLabel}
                </Badge>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Avg Pitch</dt>
                  <dd className="font-medium">{result.voiceAnalysis.averagePitchHz} Hz</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Stress Indicator</dt>
                  <dd className="font-medium">{Math.round(result.voiceAnalysis.stressIndicator * 100)}%</dd>
                </div>
              </dl>
              <Button variant="wellness" className="w-full" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          )}

          {phase === "crisis" && (
            <div className="space-y-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
              <h3 className="font-semibold text-red-800 dark:text-red-300">
                You&apos;re not alone — help is available
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400">
                We detected language that suggests you may be in distress. Your parent/guardian
                has been notified as per your settings.
              </p>
              <ul className="space-y-2 text-sm">
                {CRISIS_RESOURCES.map((r) => (
                  <li key={r.number}>
                    <strong>{r.name}:</strong> {r.number} ({r.hours})
                  </li>
                ))}
              </ul>
              {result?.guardianAlertSent && (
                <Badge variant="danger">Guardian alert sent</Badge>
              )}
              <Button variant="wellness" className="w-full" onClick={() => router.push("/coach")}>
                Talk to SweatJoy Coach
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function computeVolume(freqData: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < freqData.length; i++) {
    sum += Math.pow(10, freqData[i] / 20);
  }
  return sum / freqData.length;
}

function estimatePitchSimple(freqData: Float32Array, sampleRate: number): number {
  let maxIndex = 0;
  let maxVal = -Infinity;
  const minBin = 2;
  const maxBin = Math.min(freqData.length - 1, 500);
  for (let i = minBin; i < maxBin; i++) {
    if (freqData[i] > maxVal) {
      maxVal = freqData[i];
      maxIndex = i;
    }
  }
  if (maxVal < -50) return 0;
  return (maxIndex * sampleRate) / (freqData.length * 2);
}

// Web Speech API types (not in all TS libs)
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: { [index: number]: { transcript: string } };
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}
