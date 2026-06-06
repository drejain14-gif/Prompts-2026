"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateWellnessScore } from "@/lib/algorithms/wellness";
import type { ExamType } from "@/lib/types/database";
import { Sparkles } from "lucide-react";

const EXAM_TYPES: ExamType[] = ["NEET", "JEE", "CUET", "CAT", "GATE", "UPSC", "SSC", "Board Exams"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    full_name: "",
    age: 18,
    gender: "",
    exam_type: "NEET" as ExamType,
    target_exam_date: "",
    study_hours_per_day: 8,
  });
  const [assessment, setAssessment] = useState({
    stress_level: 5,
    anxiety_level: 5,
    sleep_quality: 7,
    motivation_level: 7,
    confidence_level: 6,
  });

  const wellnessScore = calculateWellnessScore(assessment);
  const progress = (step / 3) * 100;

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const finish = () => router.push("/dashboard");

  return (
    <div className="min-h-screen bg-background p-4 py-12">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl wellness-gradient">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Let&apos;s get to know you</h1>
          <Progress value={progress} className="mt-4" />
          <p className="mt-2 text-sm text-muted-foreground">Step {step} of 3</p>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader><CardTitle>Profile Setup</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Full Name</Label><Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></div>
              <div><Label>Age</Label><Input type="number" value={profile.age} onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })} /></div>
              <div><Label>Gender (optional)</Label><Input value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} /></div>
              <div>
                <Label>Exam Type</Label>
                <select className="mt-1 flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm" value={profile.exam_type} onChange={(e) => setProfile({ ...profile, exam_type: e.target.value as ExamType })}>
                  {EXAM_TYPES.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div><Label>Target Exam Date</Label><Input type="date" value={profile.target_exam_date} onChange={(e) => setProfile({ ...profile, target_exam_date: e.target.value })} /></div>
              <div>
                <Label>Study Hours Per Day: {profile.study_hours_per_day}h</Label>
                <input type="range" min={1} max={16} value={profile.study_hours_per_day} onChange={(e) => setProfile({ ...profile, study_hours_per_day: Number(e.target.value) })} className="mt-2 w-full accent-primary" />
              </div>
              <Button variant="wellness" className="w-full" onClick={next}>Continue</Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader><CardTitle>Initial Wellness Assessment</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "stress_level" as const, label: "Stress Level" },
                { key: "anxiety_level" as const, label: "Anxiety Level" },
                { key: "sleep_quality" as const, label: "Sleep Quality" },
                { key: "motivation_level" as const, label: "Motivation Level" },
                { key: "confidence_level" as const, label: "Confidence Level" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <Label>{label}: {assessment[key]}/10</Label>
                  <input type="range" min={1} max={10} value={assessment[key]} onChange={(e) => setAssessment({ ...assessment, [key]: Number(e.target.value) })} className="mt-2 w-full accent-primary" />
                </div>
              ))}
              <Button variant="wellness" className="w-full" onClick={next}>See My Results</Button>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="wellness-gradient-soft">
            <CardHeader><CardTitle>Your Wellness Plan</CardTitle></CardHeader>
            <CardContent className="space-y-6 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Initial Wellness Score</p>
                <p className="text-5xl font-bold text-primary">{wellnessScore}/10</p>
              </div>
              <div className="rounded-xl bg-card p-4 text-left text-sm space-y-2">
                <p className="font-semibold">Personalized Plan for {profile.exam_type}:</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Daily mood check-ins</li>
                  <li>Weekly journal reflections</li>
                  <li>Habit tracking for sleep & exercise</li>
                  <li>AI coach support tailored to exam prep</li>
                </ul>
              </div>
              <Button variant="wellness" className="w-full" onClick={finish}>Start My Journey</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
