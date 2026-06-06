import { NextResponse } from "next/server";
import {
  recommendNlpSessions,
  NLP_SESSIONS,
  type SessionContext,
} from "@/lib/algorithms/nlp-sessions";
import { nlpSessionRecommendSchema, nlpSessionCompleteSchema } from "@/lib/validations/schemas";

export async function GET() {
  return NextResponse.json({
    data: NLP_SESSIONS.map(({ steps, ...s }) => s),
    total: NLP_SESSIONS.length,
    techniques: ["reframing", "anchoring", "visualization", "progressive_relaxation", "pattern_interrupt", "grounding"],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "complete") {
      const parsed = nlpSessionCompleteSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      return NextResponse.json({
        data: {
          id: crypto.randomUUID(),
          ...parsed.data,
          completed: true,
          completed_at: new Date().toISOString(),
        },
      }, { status: 201 });
    }

    const parsed = nlpSessionRecommendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const context: SessionContext = parsed.data;
    const recommendations = recommendNlpSessions(context, body.limit ?? 4);

    if (body.session_id) {
      const session = NLP_SESSIONS.find((s) => s.id === body.session_id);
      if (!session) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
      return NextResponse.json({ data: session });
    }

    return NextResponse.json({
      data: recommendations,
      context_used: context,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
