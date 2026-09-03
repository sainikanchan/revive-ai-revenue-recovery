# REVIVE V4 — Persistent AI Revenue Recovery Control Plane

V4 adds a persistent local recovery store, signed Razorpay webhook reconciliation, amount verification, and idempotency. The local JSON store is intentionally dependency-free for the buildathon demo; it can be replaced with Postgres without changing the recovery API contracts.

## Run
1. Keep your existing `.env.local` Razorpay TEST credentials and webhook secret.
2. `npm install`
3. `npm run dev`

## Webhook
`https://YOUR-NGROK-HOST/api/webhooks/razorpay`
Event: `payment_link.paid`

The original REVIVE case ID is stored in the Payment Link notes as `recovery_case_id`.

## Reconciliation
A `payment_link.paid` event is accepted only when:
- Razorpay signature is valid against the raw body
- a REVIVE recovery case is found
- the paid amount exactly matches the case amount
- the payment event has not already been processed

Only then does REVIVE mark the case recovered and add the recovered amount to the dashboard.
