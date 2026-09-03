
import { Strategy } from "./decision-lab";

type Outcome = "success" | "failure";

const strategyStats: Record<Strategy, { attempts: number; successes: number }> = {
  retry_upi: { attempts: 32, successes: 25 },
  payment_link: { attempts: 21, successes: 14 },
  promise_to_pay: { attempts: 14, successes: 7 },
  escalate: { attempts: 8, successes: 3 }
};

export function strategyAnalytics() {
  return Object.entries(strategyStats).map(([strategy, s]) => ({
    strategy,
    attempts: s.attempts,
    successes: s.successes,
    recoveryRate: Math.round((s.successes / s.attempts) * 100)
  }));
}

export function recordOutcome(strategy: Strategy, outcome: Outcome) {
  strategyStats[strategy].attempts += 1;
  if (outcome === "success") strategyStats[strategy].successes += 1;
  return strategyAnalytics();
}
