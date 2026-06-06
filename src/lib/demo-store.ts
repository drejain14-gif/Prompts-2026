import type {
  MoodEntry, Journal, HabitLog, Trigger, BurnoutScore, Achievement,
  NlpSessionLog, WellnessGoal, VoiceCheckInLog, GuardianAlert, GuardianContact,
  ScheduledCheckInConfig, StudyBalanceLog,
} from "@/lib/types/database";
import { buildDefaultSchedule } from "@/lib/constants/check-in-schedule";
import { awardXp, type GamificationState } from "@/lib/gamification/award-engine";
import { calculateBalanceScore } from "@/lib/algorithms/wellness";

const STORAGE_KEY = "sweatjoy_demo_data";

interface DemoData {
  profile: {
    full_name: string;
    exam_type: string;
    target_exam_date: string;
    wellness_score: number;
    xp_points: number;
    onboarding_completed: boolean;
    parent_opt_in: boolean;
  };
  moodEntries: MoodEntry[];
  journals: Journal[];
  habitLogs: HabitLog[];
  triggers: Trigger[];
  burnoutScores: BurnoutScore[];
  achievements: Achievement[];
  nlpSessions: NlpSessionLog[];
  wellness_goals: WellnessGoal[];
  voiceCheckIns: VoiceCheckInLog[];
  guardianAlerts: GuardianAlert[];
  guardianContact: GuardianContact | null;
  checkInSchedule: ScheduledCheckInConfig[];
  balanceLogs: StudyBalanceLog[];
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
      parent_opt_in: true,
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
    voiceCheckIns: [],
    guardianAlerts: [],
    guardianContact: {
      id: "guardian-1",
      student_id: "demo",
      name: "Parent/Guardian",
      email: "guardian@example.com",
      phone: "+91-9876543210",
      relationship: "Parent",
      alert_on_abuse: true,
      alert_on_threat: true,
      opt_in_confirmed: true,
    },
    checkInSchedule: buildDefaultSchedule(),
    balanceLogs: [],
  };
}

function applyGamification(data: DemoData, action: Parameters<typeof awardXp>[1]): void {
  const state: GamificationState = {
    xp_points: data.profile.xp_points,
    achievements: data.achievements,
    moodEntries: data.moodEntries,
    journals: data.journals,
    habitLogs: data.habitLogs,
  };
  const result = awardXp(state, action);
  data.profile.xp_points = result.totalXp;
  for (const badge of result.newBadges) {
    if (!data.achievements.some((a) => a.badge_key === badge.badge_key)) {
      data.achievements.push(badge);
      data.profile.xp_points += badge.xp_earned;
    }
  }
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
    voiceCheckIns: parsed.voiceCheckIns ?? [],
    guardianAlerts: parsed.guardianAlerts ?? [],
    guardianContact: parsed.guardianContact ?? defaults.guardianContact,
    checkInSchedule: parsed.checkInSchedule ?? defaults.checkInSchedule,
    balanceLogs: parsed.balanceLogs ?? [],
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
  applyGamification(data, "mood_checkin");
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
  if (!journal.is_draft) applyGamification(data, "journal_entry");
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
  if (log.completed) applyGamification(data, "habit_complete");
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

export function addVoiceCheckIn(
  entry: Omit<VoiceCheckInLog, "id" | "created_at">
): VoiceCheckInLog {
  const data = getDemoData();
  const log: VoiceCheckInLog = {
    ...entry,
    id: `voice-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  data.voiceCheckIns.unshift(log);
  data.profile.xp_points += 15;
  saveDemoData(data);
  return log;
}

export function addGuardianAlert(
  alert: Omit<GuardianAlert, "id" | "created_at" | "acknowledged">
): GuardianAlert {
  const data = getDemoData();
  const record: GuardianAlert = {
    ...alert,
    id: `alert-${Date.now()}`,
    acknowledged: false,
    created_at: new Date().toISOString(),
  };
  data.guardianAlerts.unshift(record);
  saveDemoData(data);
  return record;
}

export function updateCheckInSchedule(schedule: ScheduledCheckInConfig[]): void {
  const data = getDemoData();
  data.checkInSchedule = schedule;
  saveDemoData(data);
}

export function updateGuardianContact(contact: GuardianContact): void {
  const data = getDemoData();
  data.guardianContact = contact;
  saveDemoData(data);
}

export function acknowledgeGuardianAlert(alertId: string): void {
  const data = getDemoData();
  const alert = data.guardianAlerts.find((a) => a.id === alertId);
  if (alert) alert.acknowledged = true;
  saveDemoData(data);
}

export function setParentOptIn(optIn: boolean): void {
  const data = getDemoData();
  data.profile.parent_opt_in = optIn;
  saveDemoData(data);
}

export function addBalanceLog(
  log: Omit<StudyBalanceLog, "id">
): StudyBalanceLog {
  const data = getDemoData();
  const score = calculateBalanceScore(log.study_hours, log.break_hours, log.sleep_hours);
  const entry: StudyBalanceLog = {
    ...log,
    id: `balance-${Date.now()}`,
  };
  data.balanceLogs = [
    entry,
    ...data.balanceLogs.filter((b) => b.log_date !== log.log_date),
  ];
  saveDemoData(data);
  return entry;
}

export function getWeeklyBalanceScores(): { day: string; score: number }[] {
  const data = getDemoData();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result: { day: string; score: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const log = data.balanceLogs.find((b) => b.log_date === dateStr);
    const score = log
      ? calculateBalanceScore(log.study_hours, log.break_hours, log.sleep_hours)
      : 0;
    result.push({ day: days[d.getDay()], score });
  }
  return result;
}
