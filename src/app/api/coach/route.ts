import { NextResponse } from "next/server";
import { coachMessageSchema } from "@/lib/validations/schemas";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are SweatJoy Coach, a compassionate AI wellness assistant for Indian students preparing for competitive exams (NEET, JEE, CUET, CAT, GATE, UPSC, SSC, Board Exams).

Your role:
- Provide emotional support and motivation
- Suggest practical stress management techniques
- Recommend breathing exercises, meditation, sleep tips
- Be warm, concise, and culturally aware
- Never provide medical diagnoses
- Encourage professional help for severe distress

Keep responses under 150 words. Use emojis sparingly.`;

function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("breath") || lower.includes("anxious") || lower.includes("stress")) {
    return "Let's try box breathing together: Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat 4 times. This activates your parasympathetic nervous system and helps calm exam anxiety. You're doing great by reaching out! 🌿";
  }
  if (lower.includes("sleep")) {
    return "For better sleep before exams: avoid screens 1 hour before bed, keep your room cool, and try a 5-minute body scan meditation. Consistent sleep is your secret weapon for memory retention! 😴";
  }
  if (lower.includes("motivat") || lower.includes("demotivat")) {
    return "Remember: every topper was once where you are now. Progress isn't linear — bad days don't erase your hard work. Focus on today's small win, whether it's one chapter or one practice question. You've got this! 💪";
  }
  return "Thank you for sharing. Your feelings are valid, especially during intense exam prep. Take a moment to breathe deeply. Would you like a breathing exercise, meditation recommendation, or study break activity? I'm here for you. 🌟";
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

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: parsed.data.message },
        ],
        max_tokens: 300,
        temperature: 0.7,
      });
      const response = completion.choices[0]?.message?.content ?? getFallbackResponse(parsed.data.message);
      return NextResponse.json({ response, source: "openai" });
    }

    return NextResponse.json({
      response: getFallbackResponse(parsed.data.message),
      source: "fallback",
    });
  } catch {
    return NextResponse.json({ error: "Coach unavailable" }, { status: 500 });
  }
}
