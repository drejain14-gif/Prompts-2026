"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MoodTrendChartProps {
  data: { date: string; mood: number }[];
}

export function MoodTrendChart({ data }: MoodTrendChartProps) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        label: new Date(d.date).toLocaleDateString("en-IN", {
          weekday: "short",
        }),
      })),
    [data]
  );

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No mood data yet. Start your daily check-in!
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
        <YAxis domain={[1, 10]} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
          }}
        />
        <Line
          type="monotone"
          dataKey="mood"
          stroke="#2dd4bf"
          strokeWidth={3}
          dot={{ fill: "#8b5cf6", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface ProgressRingProps {
  value: number;
  max?: number;
  label: string;
  size?: number;
}

export function ProgressRing({ value, max = 100, label, size = 80 }: ProgressRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--secondary)"
          strokeWidth={6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-lg font-bold">{Math.round(value)}%</span>
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function MoodHeatmap({ data }: { data: { date: string; mood: number }[] }) {
  const getColor = (mood: number) => {
    if (mood >= 8) return "bg-wellness-teal";
    if (mood >= 6) return "bg-wellness-mint";
    if (mood >= 4) return "bg-amber-300";
    return "bg-wellness-coral";
  };

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {data.slice(0, 28).map((entry) => (
        <div
          key={entry.date}
          className={`aspect-square rounded-md ${getColor(entry.mood)} opacity-80 hover:opacity-100 transition-opacity`}
          title={`${entry.date}: ${entry.mood}/10`}
          role="img"
          aria-label={`Mood ${entry.mood} on ${entry.date}`}
        />
      ))}
    </div>
  );
}
