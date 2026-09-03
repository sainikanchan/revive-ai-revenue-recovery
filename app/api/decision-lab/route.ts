
import { NextResponse } from "next/server";
import { getCase } from "../../../lib/recovery";
import { bestStrategy, evaluateStrategies, fatigueGuard } from "../../../lib/decision-lab";
import { strategyAnalytics } from "../../../lib/learning";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("caseId") || "RC-1039";
  const c = await getCase(id);

  if (!c) return NextResponse.json({ error: "Recovery case not found" }, { status: 404 });

  const candidates = evaluateStrategies(c);
  const best = bestStrategy(c);
  const fatigue = fatigueGuard(c);

  return NextResponse.json({
  case: c,
  amount: Number((c as any).amount ?? 0),
  candidates,
  recommendation: fatigue.fatigued
    ? {
        strategy: "escalate",
        reason: fatigue.recommendation,
        probability: 0
      }
    : best,
  fatigue,
  strategyAnalytics: strategyAnalytics()
});
}