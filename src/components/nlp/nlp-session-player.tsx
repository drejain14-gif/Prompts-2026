"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { RecommendedSession, NlpSessionStep, WellnessGoal } from "@/lib/algorithms/nlp-sessions";
import { WELLNESS_GOAL_LABELS } from "@/lib/algorithms/nlp-sessions";
import { cn } from "@/lib/utils";
import { Play, Clock, Sparkles, ChevronRight, Check, X } from "lucide-react";

const TECHNIQUE_LABELS: Record<string, string> = {
  reframing: "Cognitive Reframing",
  anchoring: "State Anchoring",
  visualization: "Visualization",
  progressive_relaxation: "Progressive Relaxation",
  pattern_interrupt: "Pattern Interrupt",
  positive_affirmation: "Affirmations",
  grounding: "Grounding",
};

interface SessionCardProps {
  session: RecommendedSession;
  onStart: (session: RecommendedSession) => void;
}

export function NlpSessionCard({ session, onStart }: SessionCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary">{TECHNIQUE_LABELS[session.technique]}</Badge>
              <Badge variant="default">{session.match_score}% match</Badge>
            </div>
            <h3 className="font-semibold text-foreground">{session.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{session.description}</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {session.duration_minutes} min
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                +{session.xp_reward} XP
              </span>
            </div>
            {session.match_reasons.length > 0 && (
              <ul className="mt-3 space-y-1">
                {session.match_reasons.map((reason) => (
                  <li key={reason} className="text-xs text-primary">• {reason}</li>
                ))}
              </ul>
            )}
          </div>
          <Button variant="wellness" size="sm" onClick={() => onStart(session)}>
            <Play className="h-4 w-4" />
            Start
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface SessionPlayerProps {
  session: RecommendedSession;
  onComplete: (reflection?: string) => void;
  onClose: () => void;
}

export function NlpSessionPlayer({ session, onComplete, onClose }: SessionPlayerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(session.steps[0]?.duration_seconds ?? 60);
  const [isRunning, setIsRunning] = useState(false);
  const [reflection, setReflection] = useState("");
  const [finished, setFinished] = useState(false);

  const currentStep: NlpSessionStep | undefined = session.steps[stepIndex];
  const progress = ((stepIndex + (1 - secondsLeft / (currentStep?.duration_seconds ?? 1))) / session.steps.length) * 100;

  useEffect(() => {
    if (!isRunning || finished) return;
    if (secondsLeft <= 0) {
      if (stepIndex < session.steps.length - 1) {
        setStepIndex((i) => i + 1);
        setSecondsLeft(session.steps[stepIndex + 1].duration_seconds);
      } else {
        setFinished(true);
        setIsRunning(false);
      }
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [isRunning, secondsLeft, stepIndex, session.steps, finished]);

  const startStep = useCallback(() => {
    setIsRunning(true);
  }, []);

  const nextStep = () => {
    if (stepIndex < session.steps.length - 1) {
      setStepIndex((i) => i + 1);
      setSecondsLeft(session.steps[stepIndex + 1].duration_seconds);
      setIsRunning(false);
    } else {
      setFinished(true);
      setIsRunning(false);
    }
  };

  if (finished) {
    return (
      <Card className="wellness-gradient-soft">
        <CardContent className="p-6 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Session Complete!</h3>
          <p className="text-sm text-muted-foreground">
            You earned +{session.xp_reward} XP. How do you feel now?
          </p>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Optional reflection..."
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm min-h-[80px]"
            aria-label="Session reflection"
          />
          <div className="flex gap-3">
            <Button variant="wellness" className="flex-1" onClick={() => onComplete(reflection)}>
              Save & Finish
            </Button>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">{session.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Step {stepIndex + 1} of {session.steps.length}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close session">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={progress} />

        {currentStep && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium text-primary">{currentStep.title}</p>
              <div className="mt-4 text-4xl font-bold tabular-nums">
                {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
              </div>
            </div>

            <p className="text-center text-foreground/90 leading-relaxed">
              {currentStep.instruction}
            </p>

            {currentStep.prompt && (
              <div className="rounded-xl bg-secondary/50 p-4 text-sm italic text-muted-foreground">
                Reflect: {currentStep.prompt}
              </div>
            )}

            <div className="flex gap-3">
              {!isRunning ? (
                <Button variant="wellness" className="flex-1" onClick={startStep}>
                  <Play className="h-4 w-4" />
                  {stepIndex === 0 ? "Begin Session" : "Continue"}
                </Button>
              ) : (
                <Button variant="outline" className="flex-1" onClick={() => setIsRunning(false)}>
                  Pause
                </Button>
              )}
              <Button variant="ghost" onClick={nextStep}>
                Skip
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface GoalSelectorProps {
  selected: WellnessGoal[];
  onChange: (goals: WellnessGoal[]) => void;
}

const ALL_GOALS: WellnessGoal[] = [
  "reduce_anxiety", "improve_sleep", "build_confidence",
  "manage_stress", "improve_focus", "emotional_balance",
];

export function WellnessGoalSelector({ selected, onChange }: GoalSelectorProps) {
  const toggle = (goal: WellnessGoal) => {
    if (selected.includes(goal)) {
      onChange(selected.filter((g) => g !== goal));
    } else {
      onChange([...selected, goal]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_GOALS.map((goal) => (
        <button
          key={goal}
          type="button"
          onClick={() => toggle(goal)}
          className={cn(
            "rounded-xl px-3 py-2 text-sm font-medium transition-all",
            selected.includes(goal)
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {WELLNESS_GOAL_LABELS[goal]}
        </button>
      ))}
    </div>
  );
}
