"use client";

import { AppHeader } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div>
      <AppHeader title="Settings" subtitle="Manage your account and preferences" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Full Name</Label><p className="text-sm">Demo Student</p></div>
            <div><Label>Exam</Label><p className="text-sm">NEET · May 5, 2026</p></div>
            <Button variant="outline">Edit Profile</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {["Daily check-in reminder", "Weekly wellness report", "Burnout alerts", "Parent sharing"].map((item) => (
              <label key={item} className="flex items-center justify-between">
                <span className="text-sm">{item}</span>
                <input type="checkbox" defaultChecked className="accent-primary" />
              </label>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
          <CardContent>
            <Label>Theme</Label>
            <select className="mt-2 flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
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
