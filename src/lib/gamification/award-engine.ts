/**
 * Gamification engine — XP awards and badge checks.
 * Centralizes GAM-001 / GAM-002 from FRD.
 */

import { BADGES } from "@/lib/algorithms/wellness";
import type { Achievement, MoodEntry, Journal, HabitLog } from "@/lib/types/database";

export const XP_REWARDS = {
  mood_checkin: 10,
  journal_entry: 15,
  habit_complete: 5,
  voice_checkin: 15,
  nlp_session: 25,
} as const;

export interface GamificationState {
  xp_points: number;
  achievements: Achievement[];
  moodEntries: MoodEntry[];
  journals: Journal[];
  habitLogs: HabitLog[];
}

export interface AwardResult {
  xpEarned: number;
  newBadges: Achievement[];
  totalXp: number;
}

/**
 * Awards XP and evaluates badge eligibility.
 */
export function awardXp(
  state: GamificationState,
  action: keyof typeof XP_REWARDS
): AwardResult {
  const xpEarned = XP_REWARDS[action];
  const totalXp = state.xp_points + xpEarned;
  const newBadges = evaluateBadges({ ...state, xp_points: totalXp });
  const existingKeys = new Set(state.achievements.map((a) => a.badge_key));
  const earned = newBadges.filter((b) => !existingKeys.has(b.badge_key));

  return { xpEarned, newBadges: earned, totalXp };
}

function evaluateBadges(state: GamificationState): Achievement[] {
  const earned: Achievement[] = [...state.achievements];
  const keys = new Set(earned.map((a) => a.badge_key));

  const streak = computeMoodStreak(state.moodEntries);
  if (streak >= 7 && !keys.has("streak_7")) {
    earned.push(makeBadge("streak_7", BADGES[0].name, BADGES[0].xp));
  }
  if (streak >= 30 && !keys.has("streak_30")) {
    earned.push(makeBadge("streak_30", BADGES[1].name, BADGES[1].xp));
  }

  const journalCount = state.journals.filter((j) => !j.is_draft).length;
  if (journalCount >= 10 && !keys.has("reflection_master")) {
    earned.push(makeBadge("reflection_master", BADGES[2].name, BADGES[2].xp));
  }

  const lowAnxietyDays = state.moodEntries
    .slice(0, 7)
    .filter((e) => e.anxiety_level <= 4).length;
  if (lowAnxietyDays >= 7 && !keys.has("calm_mind")) {
    earned.push(makeBadge("calm_mind", BADGES[3].name, BADGES[3].xp));
  }

  return earned;
}

export function computeMoodStreak(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;
  const sorted = [...entries].sort(
    (a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
  );
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].entry_date);
    const curr = new Date(sorted[i].entry_date);
    const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (Math.round(diffDays) === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function makeBadge(key: string, name: string, xp: number): Achievement {
  return {
    id: `ach-${key}-${Date.now()}`,
    user_id: "demo",
    badge_key: key,
    badge_name: name,
    xp_earned: xp,
    earned_at: new Date().toISOString(),
  };
}
