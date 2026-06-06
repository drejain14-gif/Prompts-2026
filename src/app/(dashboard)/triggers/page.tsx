"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TRIGGER_LABELS } from "@/lib/algorithms/wellness";
import { addTrigger, getDemoData } from "@/lib/demo-store";
import type { TriggerCategory } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const categories = Object.keys(TRIGGER_LABELS) as TriggerCategory[];

export default function TriggersPage() {
  const [triggers, setTriggers] = useState(getDemoData().triggers);
  const [selected, setSelected] = useState<TriggerCategory | null>(null);
  const [intensity, setIntensity] = useState(5);

  const frequency = categories.map((cat) => ({
    category: cat,
    count: triggers.filter((t) => t.category === cat).length,
  })).sort((a, b) => b.count - a.count);

  const handleAdd = () => {
    if (!selected) return;
    const trigger = addTrigger({
      user_id: "demo",
      category: selected,
      intensity,
      occurred_at: new Date().toISOString(),
    });
    setTriggers([trigger, ...triggers]);
    setSelected(null);
    toast.success("Trigger logged");
  };

  return (
    <div>
      <AppHeader title="Stress Trigger Analysis" subtitle="Identify what causes your stress" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Log a Trigger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelected(cat)}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-all",
                    selected === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  {TRIGGER_LABELS[cat]}
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium">Intensity: {intensity}/10</label>
              <input
                type="range"
                min={1}
                max={10}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
              />
            </div>

            <Button variant="wellness" onClick={handleAdd} disabled={!selected}>
              Add Trigger
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Frequent Triggers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {frequency.slice(0, 5).map(({ category, count }) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm">{TRIGGER_LABELS[category]}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min(count * 20, 100)}%` }}
                      />
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                </div>
              ))}
              {triggers.length === 0 && (
                <p className="text-sm text-muted-foreground">No triggers logged yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
