/**
 * Voice analysis utilities for pitch, tone, and emotional indicators.
 * Uses frequency data from Web Audio API AnalyserNode.
 */

export type ToneLabel = "calm" | "neutral" | "tense" | "distressed" | "energetic";

export interface VoiceAnalysisResult {
  averagePitchHz: number;
  pitchVariance: number;
  averageVolume: number;
  toneLabel: ToneLabel;
  stressIndicator: number;
  confidenceScore: number;
}

export interface PitchSample {
  frequencyHz: number;
  volume: number;
}

/** Minimum samples required for reliable analysis. */
export const MIN_PITCH_SAMPLES = 5;

/**
 * Estimates pitch from frequency bin data (simplified autocorrelation proxy).
 * @param floatFrequencyData FFT frequency data from AnalyserNode.
 * @param sampleRate Audio context sample rate.
 */
export function estimatePitchFromFrequencyData(
  floatFrequencyData: Float32Array,
  sampleRate: number
): number {
  let maxIndex = 0;
  let maxValue = 0;
  const minIndex = Math.floor(80 / (sampleRate / floatFrequencyData.length));
  const maxIndexLimit = Math.floor(400 / (sampleRate / floatFrequencyData.length));

  for (let i = minIndex; i < maxIndexLimit && i < floatFrequencyData.length; i++) {
    if (floatFrequencyData[i] > maxValue) {
      maxValue = floatFrequencyData[i];
      maxIndex = i;
    }
  }

  if (maxValue < 0.01) return 0;
  return (maxIndex * sampleRate) / (floatFrequencyData.length * 2);
}

/**
 * Analyzes collected pitch/volume samples into tone and stress metrics.
 * @param samples Array of pitch and volume readings during recording.
 */
export function analyzeVoiceSamples(samples: PitchSample[]): VoiceAnalysisResult {
  if (samples.length < MIN_PITCH_SAMPLES) {
    return {
      averagePitchHz: 0,
      pitchVariance: 0,
      averageVolume: 0,
      toneLabel: "neutral",
      stressIndicator: 0,
      confidenceScore: 0.3,
    };
  }

  const validSamples = samples.filter((s) => s.frequencyHz > 0);
  const pitches = validSamples.map((s) => s.frequencyHz);
  const volumes = samples.map((s) => s.volume);

  const averagePitchHz = mean(pitches) || 0;
  const pitchVariance = variance(pitches);
  const averageVolume = mean(volumes);

  const stressIndicator = computeStressIndicator(averagePitchHz, pitchVariance, averageVolume);
  const toneLabel = classifyTone(averagePitchHz, pitchVariance, averageVolume, stressIndicator);
  const confidenceScore = Math.min(0.95, 0.5 + validSamples.length * 0.05);

  return {
    averagePitchHz: Math.round(averagePitchHz),
    pitchVariance: Math.round(pitchVariance * 100) / 100,
    averageVolume: Math.round(averageVolume * 1000) / 1000,
    toneLabel,
    stressIndicator: Math.round(stressIndicator * 100) / 100,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
  };
}

function computeStressIndicator(
  avgPitch: number,
  pitchVar: number,
  avgVolume: number
): number {
  const pitchStress = avgPitch > 220 ? Math.min(1, (avgPitch - 180) / 120) : 0;
  const varianceStress = Math.min(1, pitchVar / 800);
  const volumeStress = avgVolume > 0.6 ? 0.3 : avgVolume < 0.15 ? 0.2 : 0;
  return Math.min(1, pitchStress * 0.4 + varianceStress * 0.4 + volumeStress * 0.2);
}

function classifyTone(
  avgPitch: number,
  pitchVar: number,
  avgVolume: number,
  stress: number
): ToneLabel {
  if (stress > 0.7) return "distressed";
  if (stress > 0.45 || pitchVar > 500) return "tense";
  if (avgVolume > 0.5 && avgPitch > 180) return "energetic";
  if (stress < 0.25 && pitchVar < 200) return "calm";
  return "neutral";
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function variance(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  return values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length;
}

/**
 * Maps voice tone analysis to a mood score (1–10).
 */
export function toneToMoodScore(analysis: VoiceAnalysisResult): number {
  const toneScores: Record<ToneLabel, number> = {
    calm: 8,
    neutral: 6,
    energetic: 7,
    tense: 4,
    distressed: 2,
  };
  const base = toneScores[analysis.toneLabel];
  const stressPenalty = Math.round(analysis.stressIndicator * 2);
  return Math.max(1, Math.min(10, base - stressPenalty));
}
