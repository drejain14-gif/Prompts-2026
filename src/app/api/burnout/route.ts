import { NextResponse } from "next/server";
import { calculateBurnoutScore } from "@/lib/algorithms/burnout";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      moodTrend = [],
      anxietyTrend = [],
      sleepQuality = 7,
      confidenceScore = 7,
      studyHours = 8,
      triggerFrequency = 0,
    } = body;

    const result = calculateBurnoutScore({
      moodTrend,
      anxietyTrend,
      sleepQuality,
      confidenceScore,
      studyHours,
      triggerFrequency,
    });

    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    description: "Burnout Detection Engine",
    riskLevels: ["low", "medium", "high", "critical"],
    inputs: ["moodTrend", "anxietyTrend", "sleepQuality", "confidenceScore", "studyHours", "triggerFrequency"],
  });
}
