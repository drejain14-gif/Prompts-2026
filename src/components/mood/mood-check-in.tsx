"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EMOTION_CONFIG } from "@/lib/algorithms/wellness";
import type { Emotion } from "@/lib/types/database";
import { cn } from "@/lib/utils";

interface MoodCheckInProps {
  onSubmit: (data: {
    mood_score: number;
    emotion: Emotion;
    sleep_quality: number;
    energy_level: number;
    anxiety_level: number;
    confidence_level: number;
  }) => void;
  onSkip?: () => void;
}

function ScaleInput({
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  lowLabel?: string;
  highLabel?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label>{label}</Label>
        <span className="text-sm font-semibold text-primary">{value}/10</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
        aria-label={label}
        aria-valuemin={1}
        aria-valuemax={10}
        aria-valuenow={value}
      />
      {(lowLabel || highLabel) && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      )}
    </div>
  );
}

export function MoodCheckIn({ onSubmit, onSkip }: MoodCheckInProps) {
  const [moodScore, setMoodScore] = useState(7);
  const [emotion, setEmotion] = useState<Emotion>("calm");
  const [sleepQuality, setSleepQuality] = useState(7);
  const [energyLevel, setEnergyLevel] = useState(7);
  const [anxietyLevel, setAnxietyLevel] = useState(4);
  const [confidenceLevel, setConfidenceLevel] = useState(7);

  const handleSubmit = () => {
    onSubmit({
      mood_score: moodScore,
      emotion,
      sleep_quality: sleepQuality,
      energy_level: energyLevel,
      anxiety_level: anxietyLevel,
      confidence_level: confidenceLevel,
    });
  };

  return (
    <Card className="wellness-gradient-soft">
      <CardHeader>
        <CardTitle>Daily Check-In</CardTitle>
        <p className="text-sm text-muted-foreground">
          How are you feeling today? Take 30 seconds to check in with yourself.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <ScaleInput
          label="Mood Score"
          value={moodScore}
          onChange={setMoodScore}
          lowLabel="Low"
          highLabel="Great"
        />

        <div className="space-y-2">
          <Label>How would you describe your emotion?</Label>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Emotion selector">
            {(Object.keys(EMOTION_CONFIG) as Emotion[]).map((key) => {
              const config = EMOTION_CONFIG[key];
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={emotion === key}
                  onClick={() => setEmotion(key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                    emotion === key
                      ? "ring-2 ring-primary " + config.color
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  <span aria-hidden="true">{config.emoji}</span>
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        <ScaleInput label="Sleep Quality" value={sleepQuality} onChange={setSleepQuality} />
        <ScaleInput label="Energy Level" value={energyLevel} onChange={setEnergyLevel} />
        <ScaleInput
          label="Anxiety Level"
          value={anxietyLevel}
          onChange={setAnxietyLevel}
          lowLabel="Calm"
          highLabel="Anxious"
        />
        <ScaleInput label="Confidence Level" value={confidenceLevel} onChange={setConfidenceLevel} />

        <div className="flex gap-3 pt-2">
          <Button variant="wellness" className="flex-1" onClick={handleSubmit}>
            Save Check-In
          </Button>
          {onSkip && (
            <Button variant="ghost" onClick={onSkip}>
              Skip
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
