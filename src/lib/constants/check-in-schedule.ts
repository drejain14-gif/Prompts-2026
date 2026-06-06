/**
 * Fixed daily NLP check-in notification schedule.
 * Times are in 24-hour format (local timezone).
 */
export const DEFAULT_CHECK_IN_SCHEDULE = {
  morning: { hour: 8, minute: 0, label: "Morning Wellness Check", sessionType: "motivation-boost" as const },
  afternoon: { hour: 14, minute: 0, label: "Midday Voice Check-In", sessionType: "calm-exam-reframe" as const },
  evening: { hour: 20, minute: 0, label: "Evening Reflection", sessionType: "sleep-reset" as const },
} as const;

export type CheckInSlot = keyof typeof DEFAULT_CHECK_IN_SCHEDULE;

export interface ScheduledCheckIn {
  slot: CheckInSlot;
  hour: number;
  minute: number;
  label: string;
  sessionType: string;
  enabled: boolean;
}

export function buildDefaultSchedule(): ScheduledCheckIn[] {
  return (Object.entries(DEFAULT_CHECK_IN_SCHEDULE) as [CheckInSlot, typeof DEFAULT_CHECK_IN_SCHEDULE[CheckInSlot]][]).map(
    ([slot, config]) => ({
      slot,
      hour: config.hour,
      minute: config.minute,
      label: config.label,
      sessionType: config.sessionType,
      enabled: true,
    })
  );
}

/**
 * Returns true if current time is within the notification window for a slot.
 * Window: exact minute match (checked every 60s by scheduler).
 */
export function isCheckInDue(
  slot: ScheduledCheckIn,
  now: Date = new Date()
): boolean {
  if (!slot.enabled) return false;
  return now.getHours() === slot.hour && now.getMinutes() === slot.minute;
}

/**
 * Builds a unique key for deduplication — one notification per slot per day.
 */
export function getCheckInDedupeKey(slot: CheckInSlot, date: Date = new Date()): string {
  return `checkin-${slot}-${date.toISOString().split("T")[0]}`;
}
