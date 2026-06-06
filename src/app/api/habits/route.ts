import { NextResponse } from "next/server";
import { habitLogSchema } from "@/lib/validations/schemas";

export async function GET() {
  return NextResponse.json({ data: [], streaks: { daily: 0, weekly: 0 } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = habitLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { data: { id: crypto.randomUUID(), ...parsed.data, created_at: new Date().toISOString() } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
