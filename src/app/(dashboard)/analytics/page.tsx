"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoodTrendChart } from "@/components/dashboard/lazy-charts";
import { getDemoData } from "@/lib/demo-store";
import { calculateBurnoutScore } from "@/lib/algorithms/burnout";
import { Progress } from "@/components/ui/progress";

export default function AnalyticsPage() {
  const [data, setData] = useState<ReturnType<typeof getDemoData> | null>(null);

  useEffect(() => {
    setData(getDemoData());
  }, []);

  if (!data) return null;

  const moodData = data.moodEntries.slice(0, 14).map((e) => ({
    date: e.entry_date,
    mood: e.mood_score,
  }));

  const anxietyData = data.moodEntries.slice(0, 14).map((e) => ({
    date: e.entry_date,
    mood: e.anxiety_level,
  }));

  const burnout = calculateBurnoutScore({
    moodTrend: data.moodEntries.slice(0, 7).map((e) => e.mood_score),
    anxietyTrend: data.moodEntries.slice(0, 7).map((e) => e.anxiety_level),
    sleepQuality: data.moodEntries[0]?.sleep_quality ?? 7,
    confidenceScore: data.moodEntries[0]?.confidence_level ?? 7,
    studyHours: 8,
    triggerFrequency: data.triggers.length,
  });

  const widgets = [
    { title: "Wellness Score", value: `${data.profile.wellness_score}/10`, progress: (data.profile.wellness_score ?? 0) * 10 },
    { title: "Burnout Score", value: `${burnout.score}%`, progress: burnout.score, risk: burnout.riskLevel },
    { title: "Habit Completion", value: "67%", progress: 67 },
    { title: "XP Points", value: String(data.profile.xp_points), progress: (data.profile.xp_points / 1000) * 100 },
  ];

  return (
    <div>
      <AppHeader title="Analytics Dashboard" subtitle="Understand your wellness patterns" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {widgets.map((w) => (
          <Card key={w.title}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{w.title}</p>
              <p className="text-2xl font-bold">{w.value}</p>
              {"risk" in w && w.risk && (
                <Badge variant={w.risk === "low" ? "success" : "warning"} className="mt-1">
                  {String(w.risk).toUpperCase()}
                </Badge>
              )}
              <Progress value={w.progress} className="mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Mood Trends</CardTitle></CardHeader>
          <CardContent><MoodTrendChart data={moodData} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Anxiety Trends</CardTitle></CardHeader>
          <CardContent><MoodTrendChart data={anxietyData} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Sleep Correlation</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Higher sleep quality correlates with better mood scores
            </p>
            <div className="space-y-2">
              {data.moodEntries.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center gap-3 text-sm">
                  <span className="w-20 text-muted-foreground">{e.entry_date.slice(5)}</span>
                  <span>Sleep: {e.sleep_quality}/10</span>
                  <span>Mood: {e.mood_score}/10</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Burnout Factors</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(burnout.factors).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span>{Math.round(value)}%</span>
                  </div>
                  <Progress value={value} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
