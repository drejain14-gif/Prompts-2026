"use client";

import { useEffect, useState, useMemo } from "react";
import { AppHeader } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  NlpSessionCard,
  NlpSessionPlayer,
  WellnessGoalSelector,
} from "@/components/nlp/nlp-session-player";
import {
  recommendNlpSessions,
  buildContextFromDemoData,
  WELLNESS_GOAL_LABELS,
  type RecommendedSession,
  type WellnessGoal,
} from "@/lib/algorithms/nlp-sessions";
import { getDemoData, saveDemoData, completeNlpSession } from "@/lib/demo-store";
import { EMOTION_CONFIG, TRIGGER_LABELS } from "@/lib/algorithms/wellness";
import { Brain, Target, Activity, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function NlpSessionsPage() {
  const [data, setData] = useState<ReturnType<typeof getDemoData> | null>(null);
  const [goals, setGoals] = useState<WellnessGoal[]>([]);
  const [activeSession, setActiveSession] = useState<RecommendedSession | null>(null);

  useEffect(() => {
    const demo = getDemoData();
    setData(demo);
    setGoals(demo.wellness_goals ?? []);
  }, []);

  const context = useMemo(() => {
    if (!data) return null;
    return buildContextFromDemoData({ ...data, wellness_goals: goals });
  }, [data, goals]);

  const recommendations = useMemo(() => {
    if (!context) return [];
    return recommendNlpSessions(context, 6);
  }, [context]);

  const handleGoalsChange = (newGoals: WellnessGoal[]) => {
    setGoals(newGoals);
    if (data) {
      saveDemoData({ ...data, wellness_goals: newGoals });
    }
  };

  const handleComplete = (reflection?: string) => {
    if (!activeSession || !data) return;
    completeNlpSession({
      user_id: "demo",
      session_id: activeSession.id,
      session_title: activeSession.title,
      technique: activeSession.technique,
      goals: activeSession.goals,
      mood_snapshot: {
        emotion: data.moodEntries[0]?.emotion,
        mood_score: data.moodEntries[0]?.mood_score,
        anxiety_level: data.moodEntries[0]?.anxiety_level,
      },
      triggers_snapshot: data.triggers.slice(0, 3).map((t) => t.category),
      reflection,
      xp_earned: activeSession.xp_reward,
    });
    setData(getDemoData());
    setActiveSession(null);
    toast.success(`Session complete! +${activeSession.xp_reward} XP`);
  };

  if (!data || !context) return null;

  const latestMood = data.moodEntries[0];
  const topTriggers = data.triggers.slice(0, 3);

  return (
    <div>
      <AppHeader
        title="NLP Sessions"
        subtitle="Guided wellness sessions personalized to your mood, goals, activity & triggers"
      />

      {activeSession ? (
        <NlpSessionPlayer
          session={activeSession}
          onComplete={handleComplete}
          onClose={() => setActiveSession(null)}
        />
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Brain className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Current Mood</p>
                  <p className="font-semibold">
                    {latestMood
                      ? `${EMOTION_CONFIG[latestMood.emotion]?.emoji} ${EMOTION_CONFIG[latestMood.emotion]?.label} (${latestMood.mood_score}/10)`
                      : "No check-in yet"}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Target className="h-8 w-8 text-wellness-purple shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Wellness Goals</p>
                  <p className="font-semibold">{goals.length || "Auto-detected"}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Activity className="h-8 w-8 text-wellness-teal shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Today&apos;s Activity</p>
                  <p className="font-semibold capitalize">{context.recent_activity ?? "Rest"}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <AlertTriangle className="h-8 w-8 text-wellness-coral shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Recent Triggers</p>
                  <p className="font-semibold text-sm truncate">
                    {topTriggers.length > 0
                      ? topTriggers.map((t) => TRIGGER_LABELS[t.category]).join(", ")
                      : "None logged"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Wellness Goals</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select goals to personalize session recommendations
              </p>
            </CardHeader>
            <CardContent>
              <WellnessGoalSelector selected={goals} onChange={handleGoalsChange} />
            </CardContent>
          </Card>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recommended for You</h2>
            <Badge variant="secondary">{recommendations.length} sessions</Badge>
          </div>

          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Complete a mood check-in and log triggers to get personalized NLP sessions.
                </CardContent>
              </Card>
            ) : (
              recommendations.map((session) => (
                <NlpSessionCard
                  key={session.id}
                  session={session}
                  onStart={setActiveSession}
                />
              ))
            )}
          </div>

          {data.nlpSessions.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Session History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.nlpSessions.slice(0, 5).map((s) => (
                    <div key={s.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                      <div>
                        <p className="font-medium text-sm">{s.session_title}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.goals.map((g) => WELLNESS_GOAL_LABELS[g as WellnessGoal]).join(" · ")}
                        </p>
                      </div>
                      <Badge variant="success">+{s.xp_earned} XP</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
