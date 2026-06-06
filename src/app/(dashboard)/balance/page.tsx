"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { calculateBalanceScore } from "@/lib/algorithms/wellness";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function BalancePage() {
  const [studyHours, setStudyHours] = useState(8);
  const [breakHours, setBreakHours] = useState(2);
  const [sleepHours, setSleepHours] = useState(7);
  const [saved, setSaved] = useState(false);

  const balanceScore = calculateBalanceScore(studyHours, breakHours, sleepHours);

  const suggestions: string[] = [];
  if (studyHours > 10) suggestions.push("Consider reducing study hours — quality over quantity.");
  if (sleepHours < 7) suggestions.push("Aim for 7–8 hours of sleep for optimal retention.");
  if (breakHours < 1.5) suggestions.push("Take more breaks — the Pomodoro technique helps!");
  if (suggestions.length === 0) suggestions.push("Great balance! Keep maintaining this rhythm.");

  const handleSave = () => {
    setSaved(true);
    toast.success("Balance log saved!");
  };

  return (
    <div>
      <AppHeader title="Study-Life Balance" subtitle="Find harmony between prep and wellbeing" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Log Today&apos;s Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: "Study Hours", value: studyHours, set: setStudyHours, max: 16 },
              { label: "Break Hours", value: breakHours, set: setBreakHours, max: 6 },
              { label: "Sleep Hours", value: sleepHours, set: setSleepHours, max: 12 },
            ].map(({ label, value, set, max }) => (
              <div key={label} className="space-y-2">
                <div className="flex justify-between">
                  <Label>{label}</Label>
                  <span className="font-semibold text-primary">{value}h</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={max}
                  step={0.5}
                  value={value}
                  onChange={(e) => { set(Number(e.target.value)); setSaved(false); }}
                  className="w-full accent-primary"
                />
              </div>
            ))}
            <Button variant="wellness" onClick={handleSave}>Save Log</Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="wellness-gradient-soft">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">Balance Score</p>
              <p className="text-5xl font-bold text-primary">{balanceScore}</p>
              <Progress value={balanceScore} className="mt-4" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {saved && (
            <Card>
              <CardHeader>
                <CardTitle>Weekly Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="w-8 text-xs text-muted-foreground">{day}</span>
                      <div className="flex-1 h-3 rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-wellness-teal to-wellness-purple"
                          style={{ width: `${60 + i * 5}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
