"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/dashboard/charts";
import { updateHabitLog, getDemoData } from "@/lib/demo-store";
import type { HabitType } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import { Droplets, Dumbbell, Brain, Moon, Sun, BookOpen, Check } from "lucide-react";
import { toast } from "sonner";

const HABITS: { type: HabitType; label: string; icon: typeof Droplets; target: number }[] = [
  { type: "water", label: "Water Intake", icon: Droplets, target: 8 },
  { type: "exercise", label: "Exercise", icon: Dumbbell, target: 1 },
  { type: "meditation", label: "Meditation", icon: Brain, target: 1 },
  { type: "sleep", label: "Sleep (hrs)", icon: Moon, target: 8 },
  { type: "outdoor", label: "Outdoor Activity", icon: Sun, target: 1 },
  { type: "study", label: "Study Session", icon: BookOpen, target: 1 },
];

export default function HabitsPage() {
  const today = new Date().toISOString().split("T")[0];
  const [logs, setLogs] = useState(getDemoData().habitLogs);

  const toggleHabit = (habitType: HabitType) => {
    const existing = logs.find((l) => l.habit_type === habitType && l.log_date === today);
    const completed = !existing?.completed;
    const log = updateHabitLog({
      user_id: "demo",
      habit_type: habitType,
      completed,
      log_date: today,
    });
    setLogs([
      log,
      ...logs.filter((l) => !(l.habit_type === habitType && l.log_date === today)),
    ]);
    if (completed) toast.success(`${habitType} completed! +5 XP`);
  };

  const completedCount = HABITS.filter((h) =>
    logs.some((l) => l.habit_type === h.type && l.log_date === today && l.completed)
  ).length;
  const completionPct = Math.round((completedCount / HABITS.length) * 100);

  return (
    <div>
      <AppHeader title="Habit Tracker" subtitle="Build healthy routines, one day at a time" />

      <div className="mb-8 flex justify-center">
        <div className="relative">
          <ProgressRing value={completionPct} label="Today's Progress" size={120} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HABITS.map(({ type, label, icon: Icon }) => {
          const done = logs.some(
            (l) => l.habit_type === type && l.log_date === today && l.completed
          );
          return (
            <Card
              key={type}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                done && "ring-2 ring-primary/50"
              )}
              onClick={() => toggleHabit(type)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && toggleHabit(type)}
              aria-pressed={done}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  done ? "bg-primary/20 text-primary" : "bg-secondary"
                )}>
                  {done ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                </div>
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">
                    {done ? "Completed!" : "Tap to complete"}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Weekly Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-10 flex-1 rounded-lg",
                  i < 5 ? "bg-primary/60" : "bg-secondary"
                )}
                title={`Day ${i + 1}`}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">5-day streak — keep it up!</p>
        </CardContent>
      </Card>
    </div>
  );
}
