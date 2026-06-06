import { NextResponse } from "next/server";
import { wellnessAssessmentSchema, studyBalanceSchema } from "@/lib/validations/schemas";
import { calculateWellnessScore, calculateBalanceScore } from "@/lib/algorithms/wellness";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.type === "assessment") {
      const parsed = wellnessAssessmentSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const score = calculateWellnessScore(parsed.data);
      return NextResponse.json({ data: { score, type: "wellness" } });
    }

    if (body.type === "balance") {
      const parsed = studyBalanceSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const score = calculateBalanceScore(
        parsed.data.study_hours,
        parsed.data.break_hours,
        parsed.data.sleep_hours
      );
      return NextResponse.json({ data: { score, type: "balance" } });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
