/**
 * In-app notification scheduler for fixed-time NLP check-ins.
 */

import {
  type ScheduledCheckIn,
  type CheckInSlot,
  buildDefaultSchedule,
  isCheckInDue,
  getCheckInDedupeKey,
} from "@/lib/constants/check-in-schedule";

export interface PendingCheckInNotification {
  slot: CheckInSlot;
  label: string;
  sessionType: string;
  dedupeKey: string;
}

const DISMISSED_KEY_PREFIX = "sweatjoy_dismissed_checkin_";

/**
 * Returns check-in notifications due now that haven't been dismissed today.
 */
export function getDueCheckInNotifications(
  schedule: ScheduledCheckIn[] = buildDefaultSchedule(),
  now: Date = new Date(),
  dismissedKeys: readonly string[] = []
): PendingCheckInNotification[] {
  const dismissed = new Set(dismissedKeys);

  return schedule
    .filter((slot) => isCheckInDue(slot, now))
    .map((slot) => ({
      slot: slot.slot,
      label: slot.label,
      sessionType: slot.sessionType,
      dedupeKey: getCheckInDedupeKey(slot.slot, now),
    }))
    .filter((n) => !dismissed.has(n.dedupeKey));
}

/**
 * Builds localStorage key for dismissed notification.
 */
export function getDismissedStorageKey(dedupeKey: string): string {
  return `${DISMISSED_KEY_PREFIX}${dedupeKey}`;
}

/**
 * Parses dismissed keys from localStorage (client-side only).
 */
export function loadDismissedCheckIns(): string[] {
  if (typeof window === "undefined") return [];
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(DISMISSED_KEY_PREFIX)) {
      keys.push(key.replace(DISMISSED_KEY_PREFIX, ""));
    }
  }
  return keys;
}

export function dismissCheckInNotification(dedupeKey: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getDismissedStorageKey(dedupeKey), "1");
}

export function getNextCheckInTime(
  schedule: ScheduledCheckIn[] = buildDefaultSchedule(),
  now: Date = new Date()
): Date | null {
  const enabled = schedule.filter((s) => s.enabled);
  if (enabled.length === 0) return null;

  const candidates: Date[] = [];
  for (const slot of enabled) {
    const today = new Date(now);
    today.setHours(slot.hour, slot.minute, 0, 0);
    if (today <= now) {
      today.setDate(today.getDate() + 1);
    }
    candidates.push(today);
  }

  return candidates.sort((a, b) => a.getTime() - b.getTime())[0] ?? null;
}
