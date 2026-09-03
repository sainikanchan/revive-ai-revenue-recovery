
# REVIVE V5 — Adaptive Recovery Intelligence

V5 keeps the working V4 Razorpay/webhook/reconciliation core and adds:

- Decision Lab API
- Candidate recovery strategies
- Expected recovered value optimization
- Customer-affinity scoring
- Customer fatigue guardrail
- Strategy outcome analytics
- Reusable DecisionLab UI component

## Decision flow

Failed payment -> candidate strategies -> expected recovery -> fatigue/policy constraints -> recommendation.

## API

GET /api/decision-lab?caseId=RC-1039

The V4 payment/webhook flow remains unchanged.
