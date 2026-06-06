import { NextResponse } from "next/server";
import { z } from "zod";
import { moderateTranscript } from "@/lib/safety/content-moderator";

const voiceCheckInSchema = z.object({
  transcript: z.string().max(5000),
  voice_analysis: z.object({
    averagePitchHz: z.number(),
    pitchVariance: z.number(),
    averageVolume: z.number().optional(),
    toneLabel: z.string(),
    stressIndicator: z.number(),
    confidenceScore: z.number().optional(),
  }),
  mood_score: z.number().min(1).max(10),
  check_in_slot: z.string().optional(),
});

/**
 * POST /api/voice-checkin
 * Processes voice check-in with content moderation and guardian alert logic.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = voiceCheckInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const moderation = moderateTranscript(parsed.data.transcript);
    const guardianAlertSent = moderation.requiresGuardianAlert;

    const record = {
      id: crypto.randomUUID(),
      transcript_redacted: moderation.sanitizedTranscript,
      mood_score: parsed.data.mood_score,
      voice_analysis: parsed.data.voice_analysis,
      moderation: {
        severity: moderation.severity,
        is_flagged: moderation.isFlagged,
        matched_terms_count: moderation.matchedTerms.length,
      },
      guardian_alert_sent: guardianAlertSent,
      check_in_slot: parsed.data.check_in_slot,
      created_at: new Date().toISOString(),
    };

    if (guardianAlertSent) {
      // Client persists guardian alert via demo-store; server returns flag only.
    }

    return NextResponse.json({
      data: {
        ...record,
        guardian_alert_payload: guardianAlertSent
          ? {
              severity: moderation.severity === "threat_to_life" ? "threat_to_life" as const : "abusive" as const,
              summary: `Voice check-in flagged (${moderation.severity}). Immediate review recommended.`,
            }
          : null,
      },
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Voice check-in processing failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    description: "Voice-only wellness check-in API",
    features: ["pitch/tone analysis", "content moderation", "guardian alerts"],
    input_mode: "voice_only",
  });
}
