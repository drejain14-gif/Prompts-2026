"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getDueCheckInNotifications,
  dismissCheckInNotification,
  loadDismissedCheckIns,
  type PendingCheckInNotification,
} from "@/lib/notifications/scheduler";
import { getDemoData } from "@/lib/demo-store";
import { buildDefaultSchedule, type ScheduledCheckIn } from "@/lib/constants/check-in-schedule";

interface CheckInNotificationContextValue {
  pendingNotification: PendingCheckInNotification | null;
  dismiss: () => void;
  openVoiceCheckIn: () => void;
}

const CheckInNotificationContext = createContext<CheckInNotificationContextValue | null>(null);

const POLL_INTERVAL_MS = 30_000;

export function useCheckInNotification(): CheckInNotificationContextValue {
  const ctx = useContext(CheckInNotificationContext);
  if (!ctx) {
    throw new Error("useCheckInNotification must be used within CheckInNotificationProvider");
  }
  return ctx;
}

interface CheckInNotificationProviderProps {
  children: ReactNode;
}

/**
 * Polls for scheduled NLP check-in times and shows in-app notifications.
 */
export function CheckInNotificationProvider({ children }: CheckInNotificationProviderProps) {
  const router = useRouter();
  const [pendingNotification, setPendingNotification] =
    useState<PendingCheckInNotification | null>(null);

  const checkSchedule = useCallback(() => {
    const data = getDemoData();
    const schedule: ScheduledCheckIn[] =
      data.checkInSchedule ?? buildDefaultSchedule();
    const dismissed = loadDismissedCheckIns();
    const due = getDueCheckInNotifications(schedule, new Date(), dismissed);
    if (due.length > 0) {
      setPendingNotification(due[0]);
    }
  }, []);

  useEffect(() => {
    checkSchedule();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        checkSchedule();
      }
    }, POLL_INTERVAL_MS);

    const onVisibility = () => {
      if (document.visibilityState === "visible") checkSchedule();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [checkSchedule]);

  const dismiss = useCallback(() => {
    if (pendingNotification) {
      dismissCheckInNotification(pendingNotification.dedupeKey);
      setPendingNotification(null);
    }
  }, [pendingNotification]);

  const openVoiceCheckIn = useCallback(() => {
    if (pendingNotification) {
      dismissCheckInNotification(pendingNotification.dedupeKey);
      setPendingNotification(null);
    }
    router.push("/voice-checkin");
  }, [pendingNotification, router]);

  return (
    <CheckInNotificationContext.Provider
      value={{ pendingNotification, dismiss, openVoiceCheckIn }}
    >
      {children}
      {pendingNotification && (
        <div
          role="alertdialog"
          aria-labelledby="checkin-notification-title"
          aria-describedby="checkin-notification-desc"
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-primary/30 bg-card p-4 shadow-xl lg:left-auto lg:right-6"
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15"
              aria-hidden="true"
            >
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p id="checkin-notification-title" className="font-semibold">
                {pendingNotification.label}
              </p>
              <p id="checkin-notification-desc" className="mt-1 text-sm text-muted-foreground">
                Time for your voice wellness check-in. Speak freely — no typing needed.
              </p>
              <div className="mt-3 flex gap-2">
                <Button variant="wellness" size="sm" onClick={openVoiceCheckIn}>
                  Start Voice Check-In
                </Button>
                <Button variant="ghost" size="sm" onClick={dismiss}>
                  Later
                </Button>
              </div>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </CheckInNotificationContext.Provider>
  );
}
