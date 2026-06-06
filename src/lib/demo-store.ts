import type { MoodEntry, Journal, HabitLog, Trigger, BurnoutScore, Achievement, NlpSessionLog, WellnessGoal } from "@/lib/types/database";

const STORAGE_KEY = "sweatjoy_demo_data";

interface DemoData {
  profile: {
    full_name: string;
    exam_type: string;
    target_exam_date: string;
    wellness_score: number;
    xp_points: number;
    onboarding_completed: boolean;
  };
  moodEntries: MoodEntry[];
  journals: Journal[];
  habitLogs: HabitLog[];
  triggers: Trigger[];
  burnoutScores: BurnoutScore[];
  achievements: Achievement[];
  nlpSessions: NlpSessionLog[];
  wellness_goals: WellnessGoal[];
}

function getDefaultData(): DemoData {
  const today = new Date();
  const moodEntries: MoodEntry[] = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return {
      id: `mood-${i}`,
      user_id: "demo",
      mood_score: 5 + Math.floor(Math.random() * 4),
      emotion: (["calm", "motivated", "happy", "nervous", "stressed"] as const)[i % 5],
      sleep_quality: 6 + Math.floor(Math.random() * 3),
      energy_level: 5 + Math.floor(Math.random() * 4),
      anxiety_level: 3 + Math.floor(Math.random() * 4),
      confidence_level: 5 + Math.floor(Math.random() * 4),
      entry_date: date.toISOString().split("T")[0],
      created_at: date.toISOString(),
    };
  });

  return {
    profile: {
      full_name: "Demo Student",
      exam_type: "NEET",
      target_exam_date: "2026-05-05",
      wellness_score: 7.2,
      xp_points: 450,
      onboarding_completed: true,
    },
    moodEntries,
    journals: [],
    habitLogs: [],
    triggers: [
      { id: "trig-1", user_id: "demo", category: "exam_pressure", intensity: 7, occurred_at: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: "trig-2", user_id: "demo", category: "study_backlog", intensity: 6, occurred_at: new Date(Date.now() - 86400000).toISOString(), created_at: new Date().toISOString() },
    ],
    burnoutScores: [{
      id: "burnout-1",
      user_id: "demo",
      score: 28,
      risk_level: "low",
      factors: { mood: 20, anxiety: 25, sleep: 15 },
      calculated_at: new Date().toISOString(),
    }],
    achievements: [
      { id: "ach-1", user_id: "demo", badge_key: "streak_7", badge_name: "7 Day Streak", xp_earned: 100, earned_at: new Date().toISOString() },
    ],
    nlpSessions: [],
    wellness_goals: ["reduce_anxiety", "manage_stress"] as WellnessGoal[],
  };
}

export function getDemoData(): DemoData {
  if (typeof window === "undefined") return getDefaultData();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const data = getDefaultData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }
  const parsed = JSON.parse(stored) as Partial<DemoData>;
  const defaults = getDefaultData();
  return {
    ...defaults,
    ...parsed,
    nlpSessions: parsed.nlpSessions ?? [],
    wellness_goals: parsed.wellness_goals ?? defaults.wellness_goals,
  };
}

export function saveDemoData(data: DemoData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function addMoodEntry(entry: Omit<MoodEntry, "id" | "created_at">): MoodEntry {
  const data = getDemoData();
  const newEntry: MoodEntry = {
    ...entry,
    id: `mood-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  data.moodEntries = [newEntry, ...data.moodEntries.filter((e) => e.entry_date !== entry.entry_date)];
  saveDemoData(data);
  return newEntry;
}

export function addJournal(journal: Omit<Journal, "id" | "created_at" | "updated_at">): Journal {
  const data = getDemoData();
  const newJournal: Journal = {
    ...journal,
    id: `journal-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  data.journals.unshift(newJournal);
  saveDemoData(data);
  return newJournal;
}

export function addTrigger(trigger: Omit<Trigger, "id" | "created_at">): Trigger {
  const data = getDemoData();
  const newTrigger: Trigger = {
    ...trigger,
    id: `trigger-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  data.triggers.unshift(newTrigger);
  saveDemoData(data);
  return newTrigger;
}

export function updateHabitLog(log: Omit<HabitLog, "id" | "created_at">): HabitLog {
  const data = getDemoData();
  const existing = data.habitLogs.find(
    (h) => h.habit_type === log.habit_type && h.log_date === log.log_date
  );
  if (existing) {
    Object.assign(existing, log);
  } else {
    data.habitLogs.push({
      ...log,
      id: `habit-${Date.now()}`,
      created_at: new Date().toISOString(),
    });
  }
  saveDemoData(data);
  return existing ?? data.habitLogs[data.habitLogs.length - 1];
}

export function completeNlpSession(
  session: Omit<NlpSessionLog, "id" | "started_at" | "completed" | "completed_at">
): NlpSessionLog {
  const data = getDemoData();
  const log: NlpSessionLog = {
    ...session,
    id: `nlp-${Date.now()}`,
    completed: true,
    started_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
  };
  data.nlpSessions.unshift(log);
  data.profile.xp_points += session.xp_earned;
  saveDemoData(data);
  return log;
}
