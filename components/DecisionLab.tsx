"use client";

import { useEffect, useState } from "react";

type Props = { caseId: string };

export default function DecisionLab({ caseId }: Props) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/decision-lab?caseId=${caseId}`)
      .then((r) => r.json())
      .then(setData);
  }, [caseId]);

  if (!data) {
    return (
      <div className="rounded-2xl border p-5">
        Loading Decision Lab…
      </div>
    );
  }

  const amount = Number(data.amount ?? data.case?.amount ?? 0);
  const recommendation = data.recommendation ?? {};

  const expectedRecovery = (probability: number) =>
    Math.round(amount * Number(probability ?? 0));

  const recommendedStrategy = recommendation.strategy;

  return (
    <section className="rounded-2xl border p-5 space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs uppercase tracking-[0.2em] opacity-60">
          Decision intelligence
        </div>

        <h2 className="text-2xl font-semibold mt-1">
          REVIVE Decision Lab
        </h2>

        <p className="text-sm opacity-70 mt-1">
          Optimize expected recovered value under customer and policy
          constraints.
        </p>
      </div>

      {/* Strategy cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.candidates.map((c: any) => {
          const probability = Number(c.probability ?? 0);
          const recovery = expectedRecovery(probability);
          const isRecommended = c.strategy === recommendedStrategy;

          return (
            <div
              key={c.strategy}
              className={`rounded-xl border p-4 transition ${
                isRecommended
                  ? "ring-1 ring-white/40"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide opacity-50">
                    Strategy
                  </div>

                  <div className="text-lg font-semibold capitalize mt-1">
                    {c.strategy.replaceAll("_", " ")}
                  </div>
                </div>

                <div className="text-lg font-semibold">
                  {Math.round(probability * 100)}%
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs uppercase tracking-wide opacity-50">
                  Expected recovery
                </div>

                <div className="text-2xl font-semibold mt-1">
                  ₹{recovery.toLocaleString("en-IN")}
                </div>
              </div>

              <div className="text-xs opacity-65 mt-3 leading-relaxed">
                {c.rationale}
              </div>

              {isRecommended && (
                <div className="mt-4 text-xs font-semibold uppercase tracking-wide">
                  ✓ AI recommended
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recommendation */}
      <div className="rounded-2xl border p-5">
        <div className="text-xs uppercase tracking-[0.18em] opacity-55">
          AI recommendation
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mt-2">
          <div>
            <div className="text-2xl font-semibold capitalize">
              {recommendation.strategy
                ? recommendation.strategy.replaceAll("_", " ")
                : "No recommendation"}
            </div>

            {recommendation.reason && (
              <div className="text-sm opacity-65 mt-1">
                {recommendation.reason}
              </div>
            )}
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide opacity-50">
              Expected recovery
            </div>

            <div className="text-2xl font-semibold">
              ₹
              {expectedRecovery(
                recommendation.probability
              ).toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* Customer fatigue guard */}
      <div className="rounded-2xl border p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] opacity-55">
              Safety guard
            </div>

            <div className="text-lg font-semibold mt-1">
              Customer fatigue guard
            </div>
          </div>

          <div className="text-sm font-semibold">
            {data.fatigue?.attempts ?? 0}/
            {data.fatigue?.limit ?? 3}
          </div>
        </div>

        <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(
                100,
                ((data.fatigue?.attempts ?? 0) /
                  (data.fatigue?.limit ?? 3)) *
                  100
              )}%`,
            }}
          />
        </div>

        <div className="text-sm opacity-65 mt-3">
          {data.fatigue?.recommendation ??
            "Continue within policy budget"}
        </div>
      </div>
    </section>
  );
}