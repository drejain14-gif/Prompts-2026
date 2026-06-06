"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MoodTrendChart, MoodHeatmap } from "@/components/dashboard/charts";
import { getDemoData } from "@/lib/demo-store";
import { getExamMode, getExamModeLabel } from "@/lib/utils";
import { EMOTION_CONFIG } from "@/lib/algorithms/wellness";
import { recommendNlpSessions, buildContextFromDemoData } from "@/lib/algorithms/nlp-sessions";
import { Flame, Trophy, TrendingUp, AlertCircle, Brain } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [data, setData] = useState<ReturnType<typeof getDemoData> | null>(null);

  useEffect(() => {
    setData(getDemoData());
  }, []);

  if (!data) return null;

  const todayMood = data.moodEntries[0];
  const weeklyMood = data.moodEntries.slice(0, 7).map((e) => ({
    date: e.entry_date,
    mood: e.mood_score,
  }));

  const daysUntilExam = Math.ceil(
    (new Date(data.profile.target_exam_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const examMode = getExamMode(daysUntilExam);
  const burnout = data.burnoutScores[0];
  const nlpContext = buildContextFromDemoData(data);
  const topNlpSession = recommendNlpSessions(nlpContext, 1)[0];

  return (
    <div>
      <AppHeader
        title={`Welcome back, ${data.profile.full_name.split(" ")[0]}! 👋`}
        subtitle={`Preparing for ${data.profile.exam_type} · ${daysUntilExam} days to exam`}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge variant="secondary">{getExamModeLabel(examMode)}</Badge>
        <Badge variant="success">Wellness Score: {data.profile.wellness_score}/10</Badge>
        <Badge variant="default">{data.profile.xp_points} XP</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Weekly Mood Trend</CardTitle>
            <Link href="/mood">
              <Button variant="ghost" size="sm">Check In</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <MoodTrendChart data={weeklyMood} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Mood</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {todayMood ? (
              <>
                <span className="text-5xl">
                  {EMOTION_CONFIG[todayMood.emotion]?.emoji ?? "😊"}
                </span>
                <p className="text-3xl font-bold">{todayMood.mood_score}/10</p>
                <p className="text-sm text-muted-foreground capitalize">
                  Feeling {EMOTION_CONFIG[todayMood.emotion]?.label ?? todayMood.emotion}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">No check-in today</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Burnout Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-center justify-between">
              <Badge
                variant={
                  burnout.risk_level === "low" ? "success" :
                  burnout.risk_level === "medium" ? "warning" : "danger"
                }
              >
                {burnout.risk_level.toUpperCase()} RISK
              </Badge>
              <span className="text-sm font-medium">{burnout.score}%</span>
            </div>
            <Progress value={burnout.score} className="mb-4" />
            <Link href="/analytics">
              <Button variant="outline" size="sm" className="w-full">View Details</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-wellness-coral" />
              Mood Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MoodHeatmap data={data.moodEntries.map((e) => ({ date: e.entry_date, mood: e.mood_score }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-wellness-purple" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.achievements.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
                  <span className="text-sm font-medium">{a.badge_name}</span>
                  <Badge variant="secondary">+{a.xp_earned} XP</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 wellness-gradient-soft">
        <CardContent className="flex items-center gap-4 p-6">
          <TrendingUp className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <p className="font-semibold">Quick Actions</p>
            <p className="text-sm text-muted-foreground">
              Complete your daily check-in, journal, and habits for maximum XP
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="wellness" size="sm" asChild>
              <Link href="/mood">Mood</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/nlp-sessions">NLP Session</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/coach">Talk to Coach</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {topNlpSession && (
        <Card className="mt-4 border-primary/20">
          <CardContent className="flex items-center gap-4 p-5">
            <Brain className="h-8 w-8 text-wellness-purple shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold">Recommended NLP Session</p>
              <p className="text-sm text-muted-foreground truncate">
                {topNlpSession.title} · {topNlpSession.duration_minutes} min · +{topNlpSession.xp_reward} XP
              </p>
              {topNlpSession.match_reasons[0] && (
                <p className="text-xs text-primary mt-1">{topNlpSession.match_reasons[0]}</p>
              )}
            </div>
            <Button variant="wellness" size="sm" asChild>
              <Link href="/nlp-sessions">Start</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
