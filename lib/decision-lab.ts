
import { RecoveryCase } from "./data";

export type Strategy = "retry_upi" | "payment_link" | "promise_to_pay" | "escalate";

export type StrategyCandidate = {
  strategy: Strategy;
  probability: number;
  expectedRecovery: number;
  rationale: string;
};

function clamp(n: number) {
  return Math.max(0.05, Math.min(0.99, n));
}

function customerAffinity(c: RecoveryCase, strategy: Strategy) {
  if (strategy === "retry_upi") return c.reason === "Bank timeout" ? 0.92 : 0.68;
  if (strategy === "payment_link") return c.reason === "Price hesitation" ? 0.88 : 0.62;
  if (strategy === "promise_to_pay") return c.reason === "Promise to pay" ? 0.90 : 0.55;
  return 0.35;
}

export function evaluateStrategies(c: RecoveryCase): StrategyCandidate[] {
  const score = Number((c as any).score ?? (c as any).aiScore ?? 0);
  const base = score / 100;
  const strategies: Strategy[] = ["retry_upi", "payment_link", "promise_to_pay", "escalate"];

  return strategies.map(strategy => {
    const affinity = customerAffinity(c, strategy);
    const probability = clamp(0.45 * base + 0.55 * affinity);
    const amount = Number(c.amount ?? 0);
    const expectedRecovery = Math.round(amount * probability);

    const rationale =
      strategy === "retry_upi"
        ? "Best when the failure is temporary and the customer historically uses UPI."
        : strategy === "payment_link"
        ? "Creates a fresh payment path and reduces checkout friction."
        : strategy === "promise_to_pay"
        ? "Useful when intent to pay exists but immediate collection may add friction."
        : "Safer when autonomous recovery has low expected value or guardrails are exhausted.";

    return { strategy, probability, expectedRecovery, rationale };
  }).sort((a, b) => b.expectedRecovery - a.expectedRecovery);
}

export function bestStrategy(c: RecoveryCase) {
  return evaluateStrategies(c)[0];
}

export function fatigueGuard(c: RecoveryCase) {
  const attempts = c.id === "RC-1028" ? 3 : c.id === "RC-1042" ? 1 : 0;
  return {
    attempts,
    limit: 3,
    fatigued: attempts >= 3,
    recommendation: attempts >= 3 ? "Escalate and stop autonomous outreach" : "Continue within policy budget"
  };
}
