import { NextResponse } from "next/server";
import { coachMessageSchema } from "@/lib/validations/schemas";
import { buildCoachSystemPrompt } from "@/lib/coach/prompt-builder";
import OpenAI from "openai";

function getFallbackResponse(message: string, context?: { exam_mode?: string }): string {
  const lower = message.toLowerCase();
  const phaseHint = context?.exam_mode === "exam_week"
    ? " Exam week is here — focus on staying calm, not cramming."
    : "";

  if (lower.includes("breath") || lower.includes("anxious") || lower.includes("stress")) {
    return `Let's try box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat 4 times.${phaseHint} You're doing great by reaching out!`;
  }
  if (lower.includes("sleep")) {
    return "For better sleep: avoid screens 1 hour before bed, keep your room cool, try a 5-minute body scan. Sleep is your memory consolidation superpower!";
  }
  if (lower.includes("motivat") || lower.includes("demotivat")) {
    return "Every topper was once where you are. Progress isn't linear — focus on today's small win. You've got this!";
  }
  return `Your feelings are valid during exam prep.${phaseHint} Would you like a breathing exercise, meditation, or study break activity?`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = coachMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const systemPrompt = buildCoachSystemPrompt(parsed.data.context);
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: parsed.data.message },
        ],
        max_tokens: 300,
        temperature: 0.7,
      });
      const response =
        completion.choices[0]?.message?.content ??
        getFallbackResponse(parsed.data.message, parsed.data.context);
      return NextResponse.json({ response, source: "openai" });
    }

    return NextResponse.json({
      response: getFallbackResponse(parsed.data.message, parsed.data.context),
      source: "fallback",
    });
  } catch {
    return NextResponse.json({ error: "Coach unavailable" }, { status: 500 });
  }
}
