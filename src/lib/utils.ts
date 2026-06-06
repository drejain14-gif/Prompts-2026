import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getExamMode(daysUntilExam: number): string {
  if (daysUntilExam < 0) return "result_waiting";
  if (daysUntilExam <= 7) return "exam_week";
  if (daysUntilExam <= 30) return "final_sprint";
  if (daysUntilExam <= 90) return "stress_management";
  return "habit_building";
}

export function getExamModeLabel(mode: string): string {
  const labels: Record<string, string> = {
    habit_building: "Habit Building Phase",
    stress_management: "Stress Management Phase",
    final_sprint: "Final Sprint (0–30 days)",
    exam_week: "Exam Week",
    result_waiting: "Result Waiting Phase",
  };
  return labels[mode] ?? mode;
}
