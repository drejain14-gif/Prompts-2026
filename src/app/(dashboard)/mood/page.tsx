"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/sidebar";
import { MoodCheckIn } from "@/components/mood/mood-check-in";
import { MoodTrendChart } from "@/components/dashboard/lazy-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addMoodEntry, getDemoData } from "@/lib/demo-store";
import type { Emotion } from "@/lib/types/database";
import { toast } from "sonner";

export default function MoodPage() {
  const [entries, setEntries] = useState(getDemoData().moodEntries);

  const handleSubmit = (data: {
    mood_score: number;
    emotion: Emotion;
    sleep_quality: number;
    energy_level: number;
    anxiety_level: number;
    confidence_level: number;
  }) => {
    const entry = addMoodEntry({
      user_id: "demo",
      ...data,
      entry_date: new Date().toISOString().split("T")[0],
    });
    setEntries([entry, ...entries.filter((e) => e.entry_date !== entry.entry_date)]);
    toast.success("Check-in saved! +10 XP");
  };

  return (
    <div>
      <AppHeader title="Daily Mood Tracker" subtitle="Track how you feel every day" />
      <div className="grid gap-6 lg:grid-cols-2">
        <MoodCheckIn onSubmit={handleSubmit} />
        <Card>
          <CardHeader>
            <CardTitle>Your Mood History</CardTitle>
          </CardHeader>
          <CardContent>
            <MoodTrendChart
              data={entries.slice(0, 14).map((e) => ({
                date: e.entry_date,
                mood: e.mood_score,
              }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
