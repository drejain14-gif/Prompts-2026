"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  getDemoData,
  updateCheckInSchedule,
  updateGuardianContact,
} from "@/lib/demo-store";
import type { ScheduledCheckInConfig, GuardianContact } from "@/lib/types/database";
import { toast } from "sonner";

export default function SettingsPage() {
  const [schedule, setSchedule] = useState<ScheduledCheckInConfig[]>([]);
  const [guardian, setGuardian] = useState<GuardianContact | null>(null);

  useEffect(() => {
    const data = getDemoData();
    setSchedule(data.checkInSchedule);
    setGuardian(data.guardianContact);
  }, []);

  const saveSchedule = () => {
    updateCheckInSchedule(schedule);
    toast.success("Check-in schedule saved");
  };

  const saveGuardian = () => {
    if (guardian) {
      updateGuardianContact(guardian);
      toast.success("Guardian settings saved");
    }
  };

  return (
    <div>
      <AppHeader title="Settings" subtitle="Notifications, guardian alerts, and preferences" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Voice Check-Ins</CardTitle>
            <p className="text-sm text-muted-foreground">
              Fixed daily times for in-app NLP voice check-in notifications
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedule.map((slot, index) => (
              <div key={slot.slot} className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`slot-${slot.slot}`}>{slot.label}</Label>
                  <input
                    id={`slot-${slot.slot}`}
                    type="checkbox"
                    checked={slot.enabled}
                    onChange={(e) => {
                      const updated = [...schedule];
                      updated[index] = { ...slot, enabled: e.target.checked };
                      setSchedule(updated);
                    }}
                    className="accent-primary"
                    aria-label={`Enable ${slot.label}`}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label htmlFor={`hour-${slot.slot}`}>Hour (24h)</Label>
                    <Input
                      id={`hour-${slot.slot}`}
                      type="number"
                      min={0}
                      max={23}
                      value={slot.hour}
                      onChange={(e) => {
                        const updated = [...schedule];
                        updated[index] = { ...slot, hour: Number(e.target.value) };
                        setSchedule(updated);
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`minute-${slot.slot}`}>Minute</Label>
                    <Input
                      id={`minute-${slot.slot}`}
                      type="number"
                      min={0}
                      max={59}
                      value={slot.minute}
                      onChange={(e) => {
                        const updated = [...schedule];
                        updated[index] = { ...slot, minute: Number(e.target.value) };
                        setSchedule(updated);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="wellness" onClick={saveSchedule}>Save Schedule</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guardian / Parent Alerts</CardTitle>
            <p className="text-sm text-muted-foreground">
              Notified when voice check-ins detect abusive or life-threatening language
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {guardian && (
              <>
                <div>
                  <Label htmlFor="guardian-name">Guardian Name</Label>
                  <Input
                    id="guardian-name"
                    value={guardian.name}
                    onChange={(e) => setGuardian({ ...guardian, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="guardian-email">Email</Label>
                  <Input
                    id="guardian-email"
                    type="email"
                    value={guardian.email}
                    onChange={(e) => setGuardian({ ...guardian, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="guardian-phone">Phone</Label>
                  <Input
                    id="guardian-phone"
                    value={guardian.phone ?? ""}
                    onChange={(e) => setGuardian({ ...guardian, phone: e.target.value })}
                  />
                </div>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Alert on abusive language</span>
                  <input
                    type="checkbox"
                    checked={guardian.alert_on_abuse}
                    onChange={(e) => setGuardian({ ...guardian, alert_on_abuse: e.target.checked })}
                    className="accent-primary"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Alert on life-threatening statements</span>
                  <input
                    type="checkbox"
                    checked={guardian.alert_on_threat}
                    onChange={(e) => setGuardian({ ...guardian, alert_on_threat: e.target.checked })}
                    className="accent-primary"
                  />
                </label>
                <Button variant="wellness" onClick={saveGuardian}>Save Guardian Settings</Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Full Name</Label><p className="text-sm">Demo Student</p></div>
            <div><Label>Exam</Label><p className="text-sm">NEET · May 5, 2026</p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Privacy</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full">Export My Data</Button>
            <Button variant="destructive" className="w-full">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
