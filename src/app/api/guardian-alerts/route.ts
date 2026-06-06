import { NextResponse } from "next/server";
import { z } from "zod";

const guardianAlertSchema = z.object({
  severity: z.enum(["abusive", "threat_to_life"]),
  summary: z.string().min(1).max(500),
  studentId: z.string().min(1),
});

const guardianContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  relationship: z.string().min(2).max(50),
  alert_on_abuse: z.boolean().default(true),
  alert_on_threat: z.boolean().default(true),
});

/**
 * GET /api/guardian-alerts — list alerts for guardian dashboard.
 */
export async function GET() {
  return NextResponse.json({
    data: [],
    message: "Connect Supabase for persistent guardian alerts. Demo uses localStorage.",
  });
}

/**
 * POST /api/guardian-alerts — create alert when safety filter triggers.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "register_guardian") {
      const parsed = guardianContactSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      return NextResponse.json({
        data: { id: crypto.randomUUID(), ...parsed.data, opt_in_confirmed: true },
      }, { status: 201 });
    }

    const parsed = guardianAlertSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const alert = {
      id: crypto.randomUUID(),
      student_id: parsed.data.studentId,
      guardian_id: "guardian-demo",
      severity: parsed.data.severity,
      message_summary: parsed.data.summary,
      acknowledged: false,
      notification_channels: ["in_app", "email"],
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ data: alert }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Guardian alert failed" }, { status: 500 });
  }
}
