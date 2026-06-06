"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDemoData, acknowledgeGuardianAlert } from "@/lib/demo-store";
import { calculateBurnoutScore } from "@/lib/algorithms/burnout";
import type { GuardianAlert } from "@/lib/types/database";
import { Shield, AlertTriangle, Heart, TrendingUp } from "lucide-react";

export default function GuardianPage() {
  const [alerts, setAlerts] = useState<GuardianAlert[]>([]);
  const [studentName, setStudentName] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [wellness, setWellness] = useState({ score: 0, moodAvg: 0, burnoutRisk: "low", streak: 0 });

  const refresh = () => {
    const data = getDemoData();
    setAlerts(data.guardianAlerts ?? []);
    setStudentName(data.profile.full_name);
    setOptIn(data.profile.parent_opt_in ?? false);

    if (data.profile.parent_opt_in) {
      const moods = data.moodEntries.slice(0, 7);
      const moodAvg = moods.length
        ? moods.reduce((s, m) => s + m.mood_score, 0) / moods.length
        : 0;
      const burnout = calculateBurnoutScore({
        moodTrend: moods.map((m) => m.mood_score),
        anxietyTrend: moods.map((m) => m.anxiety_level),
        sleepQuality: moods[0]?.sleep_quality ?? 7,
        confidenceScore: moods[0]?.confidence_level ?? 7,
        studyHours: 8,
        triggerFrequency: data.triggers.length,
      });
      setWellness({
        score: data.profile.wellness_score,
        moodAvg: Math.round(moodAvg * 10) / 10,
        burnoutRisk: burnout.riskLevel,
        streak: moods.length,
      });
    }
  };

  useEffect(() => { refresh(); }, []);

  const handleAcknowledge = (alertId: string) => {
    acknowledgeGuardianAlert(alertId);
    refresh();
  };

  return (
    <div>
      <AppHeader
        title="Guardian Dashboard"
        subtitle="Wellness trends, safety alerts, and student monitoring (opt-in required)"
      />

      <Card className="mb-6 border-primary/20">
        <CardContent className="flex items-center gap-4 p-5">
          <Shield className="h-10 w-10 text-primary shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Monitoring: {studentName}</p>
            <p className="text-sm text-muted-foreground">
              {optIn
                ? "Wellness summary shared with your consent. Crisis alerts always enabled."
                : "Student has not opted in to wellness sharing. Only crisis alerts visible."}
            </p>
          </div>
        </CardContent>
      </Card>

      {optIn && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Heart, label: "Wellness Score", value: `${wellness.score}/10` },
            { icon: TrendingUp, label: "7-Day Mood Avg", value: `${wellness.moodAvg}/10` },
            { icon: Shield, label: "Burnout Risk", value: wellness.burnoutRisk.toUpperCase() },
            { icon: TrendingUp, label: "Check-ins (7d)", value: String(wellness.streak) },
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label}>
              <CardContent className="flex items-center gap-3 p-4">
                <Icon className="h-8 w-8 text-primary shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-semibold">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Safety Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground" role="status">
              No alerts. Your student&apos;s check-ins are within safe parameters.
            </p>
          ) : (
            <ul className="space-y-3" aria-label="Guardian safety alerts">
              {alerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex items-start gap-3 rounded-xl border border-border p-4"
                >
                  <AlertTriangle
                    className={`h-5 w-5 shrink-0 ${
                      alert.severity === "threat_to_life" ? "text-red-500" : "text-amber-500"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.severity === "threat_to_life" ? "danger" : "warning"}>
                        {alert.severity === "threat_to_life" ? "CRISIS" : "CONCERN"}
                      </Badge>
                      {!alert.acknowledged && <Badge variant="secondary">New</Badge>}
                    </div>
                    <p className="mt-2 text-sm">{alert.message_summary}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(alert.created_at).toLocaleString("en-IN")}
                    </p>
                  </div>
                  {!alert.acknowledged && (
                    <Button variant="outline" size="sm" onClick={() => handleAcknowledge(alert.id)}>
                      Acknowledge
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
