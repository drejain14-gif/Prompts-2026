import { NextResponse } from "next/server";
import { journalSchema } from "@/lib/validations/schemas";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  return NextResponse.json({
    data: [],
    query,
    message: "Connect Supabase for journal search.",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = journalSchema.safeParse(body);

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
