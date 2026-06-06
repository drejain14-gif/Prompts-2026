"use client";

import dynamic from "next/dynamic";

/** Lazy-loaded Recharts wrapper — reduces initial bundle size (Efficiency). */
export const MoodTrendChart = dynamic(
  () => import("@/components/dashboard/charts").then((m) => m.MoodTrendChart),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-48 items-center justify-center rounded-xl bg-secondary/50 text-sm text-muted-foreground"
        role="status"
        aria-label="Loading chart"
      >
        Loading chart…
      </div>
    ),
  }
);

export const MoodHeatmap = dynamic(
  () => import("@/components/dashboard/charts").then((m) => m.MoodHeatmap),
  { ssr: false, loading: () => <div className="h-24 animate-pulse rounded-xl bg-secondary/50" /> }
);

export const ProgressRing = dynamic(
  () => import("@/components/dashboard/charts").then((m) => m.ProgressRing),
  { ssr: false }
);
