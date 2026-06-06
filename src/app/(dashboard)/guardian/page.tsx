"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDemoData } from "@/lib/demo-store";
import type { GuardianAlert } from "@/lib/types/database";
import { Shield, AlertTriangle } from "lucide-react";

/**
 * Guardian dashboard — view wellness alerts triggered by voice check-in safety filter.
 */
export default function GuardianPage() {
  const [alerts, setAlerts] = useState<GuardianAlert[]>([]);
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const data = getDemoData();
    setAlerts(data.guardianAlerts ?? []);
    setStudentName(data.profile.full_name);
  }, []);

  return (
    <div>
      <AppHeader
        title="Guardian Dashboard"
        subtitle="Wellness alerts and student safety notifications"
      />

      <Card className="mb-6 border-primary/20">
        <CardContent className="flex items-center gap-4 p-5">
          <Shield className="h-10 w-10 text-primary shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Monitoring: {studentName}</p>
            <p className="text-sm text-muted-foreground">
              Alerts trigger when voice check-ins detect abusive language or life-threatening statements.
            </p>
          </div>
        </CardContent>
      </Card>

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
                      {!alert.acknowledged && (
                        <Badge variant="secondary">New</Badge>
                      )}
                    </div>
                    <p className="mt-2 text-sm">{alert.message_summary}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(alert.created_at).toLocaleString("en-IN")}
                    </p>
                  </div>
                  {!alert.acknowledged && (
                    <Button variant="outline" size="sm">
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
