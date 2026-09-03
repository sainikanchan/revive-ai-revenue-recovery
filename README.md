# REVIVE — AI Revenue Recovery Control Plane

> **AI proposes. Policy authorizes. Razorpay executes.**

REVIVE is an AI-powered revenue recovery control plane built for the **Razorpay Buildathon 2026 — AI Revenue Recovery track**.

Instead of blindly retrying failed payments, REVIVE evaluates a recovery case, compares multiple recovery strategies, estimates expected recovered revenue, applies deterministic policy guardrails, executes recovery through Razorpay, and reconciles the final payment state through signed webhooks.

## 🎯 North-Star Metric

# ₹ Recovered

REVIVE is designed around the business outcome that matters most:

**How much revenue can actually be recovered?**

Not the number of retries.

Not the number of messages.

Not the number of AI calls.

---

# 🚨 Problem

Payment failures create revenue leakage for businesses.

A traditional recovery flow often looks like:

```text
Payment Failed
      ↓
Retry
      ↓
Retry Again
      ↓
Send Reminder

But different payment failures require different recovery actions.

A temporary UPI failure may benefit from a retry.

An abandoned checkout may benefit from a fresh payment link.

A customer who has already received several recovery attempts may need to stop receiving automated actions.

REVIVE treats recovery as a decision problem instead of a simple retry problem.

💡 Solution

REVIVE evaluates the recovery context and compares multiple strategies before deciding what to do.

The system considers:

Payment amount
Recovery score
Recovery context
Previous attempts
Strategy success probability
Expected recovered value
Customer fatigue
Deterministic policy constraints

The core calculation is:

Expected Recovery
= Payment Amount × Recovery Probability

This allows the system to compare strategies using their potential financial impact.

🧠 REVIVE Recovery Loop
Observe
   ↓
Diagnose
   ↓
Score Recovery Risk
   ↓
Evaluate Strategies
   ↓
Apply Policy Guardrails
   ↓
Choose Strategy
   ↓
Execute via Razorpay
   ↓
Receive Signed Webhook
   ↓
Reconcile Payment
   ↓
Persist Outcome
   ↓
Improve Future Decisions

REVIVE is designed as a closed-loop recovery system rather than a one-time retry workflow.

🔬 Decision Lab

REVIVE includes a Decision Lab that makes the recovery decision visible.

For each recovery case, the system evaluates four possible strategies:

Strategy	Purpose
Retry UPI	Attempt recovery for temporary payment failures
Payment Link	Provide a fresh payment path
Promise to Pay	Defer immediate recovery when appropriate
Escalate	Move the case to a higher-touch workflow

Each strategy receives an estimated recovery probability.

REVIVE then calculates:

Expected Recovery
= Amount × Probability

The highest-value strategy becomes the preferred recommendation unless a safety guard prevents automated execution.

The Decision Lab displays:

Recovery probability
Expected recovered ₹
Strategy rationale
AI recommendation
Customer fatigue status
Recovery attempt budget
🛡️ Bounded Autonomy

REVIVE follows a simple architectural principle:

AI proposes. Policy authorizes. Razorpay executes.

The AI decision layer does not directly control financial execution.

Instead:

AI Recommendation
       ↓
Policy Guard
       ↓
   ┌───┴───┐
   ↓       ↓
Allowed   Blocked
   ↓       ↓
Execute   Escalate

This creates a bounded-autonomy architecture where financial actions remain subject to deterministic business rules.

Guardrails include:

Recovery attempt limits
Valid strategy checks
Payment amount validation
Duplicate event protection
Webhook signature verification
Recovery state validation
💳 Razorpay Integration

REVIVE integrates with Razorpay Test Mode for the payment execution and recovery flow.

The implementation includes:

Razorpay Payment Link creation
Unique Payment Link reference IDs
Recovery case metadata
Razorpay Payment Link API
payment_link.paid webhook handling
HMAC-SHA256 webhook signature verification
Exact payment amount verification
Idempotent payment processing
Persistent recovery state
Audit logging

The original REVIVE recovery case ID is stored in the Payment Link metadata so that the incoming Razorpay event can be mapped back to the correct recovery case.

🔐 Secure Webhook Reconciliation

REVIVE verifies Razorpay webhook signatures before changing payment state.

The reconciliation flow is:

Razorpay
    ↓
POST /api/webhooks/razorpay
    ↓
Read Raw Request Body
    ↓
Verify Razorpay Signature
    ↓
Validate Event
    ↓
Find Recovery Case
    ↓
Verify Payment Amount
    ↓
Check Idempotency
    ↓
Persist Payment
    ↓
Mark Case Recovered

An invalid webhook signature is rejected and cannot modify recovery state.

🔁 Idempotency

Webhook systems can receive duplicate events.

REVIVE therefore checks whether a payment event has already been processed before updating the recovery state.

A payment is accepted only when:

The Razorpay webhook signature is valid.
The recovery case exists.
The paid amount exactly matches the expected recovery amount.
The payment event has not already been processed.

Only after these checks does REVIVE mark the recovery case as:

RECOVERED

This prevents duplicate webhook deliveries from incorrectly increasing recovered revenue.

💰 End-to-End Recovery Demonstration

REVIVE has been tested using Razorpay Test Mode.

Example Recovery
Recovery Case
RC-1039

Recovery Amount
₹7,499

The successful recovery journey:

RC-1039
   ↓
REVIVE evaluates recovery
   ↓
Razorpay Payment Link created
   ↓
Test Mode payment completed
   ↓
Razorpay sends webhook
   ↓
REVIVE verifies webhook signature
   ↓
Payment amount verified
   ↓
Payment reconciled
   ↓
Case marked RECOVERED
   ↓
₹7,499 counted as recovered revenue

This demonstrates the complete path:

At-Risk Revenue → Decision → Razorpay Execution → Verified Webhook → Recovered Revenue

📊 Recovery Dashboard

REVIVE provides a dashboard focused on recovery outcomes.

The dashboard tracks:

At-risk revenue
Recoverable revenue
Recovered revenue
Recovery rate
Recovery cases
Recovery actions
Audit events

The goal is to make revenue recovery measurable as a business outcome.

🧠 Strategy Intelligence

REVIVE contains a strategy evaluation layer that compares possible recovery actions.

Conceptually:

             Recovery Case
                   │
       ┌───────────┼───────────┐
       ↓           ↓           ↓
    Strategy 1  Strategy 2  Strategy 3 ...
       │           │           │
       ↓           ↓           ↓
 Probability  Probability  Probability
       │           │           │
       └───────────┼───────────┘
                   ↓
          Expected Recovery ₹
                   ↓
          Best Available Action

The architecture is designed so that historical recovery outcomes can be fed back into strategy performance over time.

The current buildathon implementation uses the strategy evaluation and persistent outcome infrastructure, providing a foundation for more advanced online learning and merchant-specific optimization.

🏗️ Architecture
                         ┌───────────────────────┐
                         │    REVIVE Dashboard   │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │ Recovery Intelligence │
                         │                       │
                         │ • Diagnosis           │
                         │ • Risk Scoring        │
                         │ • Strategy Ranking    │
                         │ • Expected Recovery   │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   Policy Guardrails   │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   Razorpay Test Mode  │
                         │   Payment Links       │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │ Signed Razorpay       │
                         │ Webhooks              │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │ Payment Reconciliation│
                         │                       │
                         │ • Signature Check     │
                         │ • Amount Check        │
                         │ • Idempotency         │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │ Persistent Recovery   │
                         │ State + Audit Log     │
                         └───────────────────────┘
📁 Project Structure
revive-ai-revenue-recovery/
│
├── api/
│   ├── policy.ts
│   └── razorpay.ts
│
├── app/
│   ├── api/
│   │   ├── audit/
│   │   ├── dashboard/
│   │   ├── decision-lab/
│   │   ├── health/
│   │   ├── razorpay/
│   │   ├── recovery/
│   │   └── webhooks/
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   └── DecisionLab.tsx
│
├── lib/
│   ├── audit.ts
│   ├── data.ts
│   ├── decision-lab.ts
│   ├── learning.ts
│   ├── recovery.ts
│   └── store.ts
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
⚙️ Tech Stack
Frontend
Next.js
React
TypeScript
Backend
Next.js API Routes
TypeScript
Persistent JSON store
Payments
Razorpay Test Mode
Razorpay Payment Links
Razorpay Webhooks
Security & Reliability
HMAC-SHA256 webhook verification
Exact amount verification
Idempotent event processing
Deterministic policy guardrails
Persistent recovery state
Audit logging
🚀 Run Locally
1. Install dependencies
npm install
2. Configure environment variables

Create a .env.local file using .env.example.

Add your Razorpay Test Mode credentials and webhook secret.

Never commit .env.local.

3. Start REVIVE
npm run dev

The application runs at:

http://localhost:3000
4. Configure the Razorpay webhook

Expose the local application through a public HTTPS endpoint.

The webhook endpoint is:

/api/webhooks/razorpay

Configure the corresponding public URL in the Razorpay Test Mode webhook settings.

The primary Payment Link event handled by REVIVE is:

payment_link.paid
🔒 Security

Sensitive credentials are intentionally excluded from Git.

The repository includes:

.env.example

but excludes:

.env.local

The .gitignore also excludes:

node_modules/
.next/
data/revive-db.json

Never commit Razorpay API secrets or webhook secrets.

🔮 Future Evolution

REVIVE's architecture can be extended into a production-scale recovery platform.

Potential next steps include:

PostgreSQL production persistence
Distributed recovery workers
Queue-based event processing
Customer-level recovery propensity models
Merchant-specific recovery policies
Real historical strategy performance
Online strategy learning
Recovery experimentation
Channel optimization
Human-in-the-loop escalation
Production observability

The goal is to move from static recovery rules toward continuously improving, merchant-specific revenue recovery intelligence.

🏆 What Makes REVIVE Different?

A conventional recovery system asks:

"Should we retry the payment?"

REVIVE asks:

"Which recovery action should we take, for this customer and this payment situation, to maximize expected recovered revenue while respecting business and customer constraints?"

That changes recovery from a simple retry workflow into a:

Revenue Recovery Decision System

REVIVE combines:

AI Decisioning
      +
Expected ₹ Optimization
      +
Deterministic Guardrails
      +
Razorpay Execution
      +
Signed Webhook Reconciliation
      +
Persistent State
      +
Outcome Tracking

The result is a bounded, explainable recovery loop focused on measurable revenue impact.

🎯 Core Principle

AI proposes. Policy authorizes. Razorpay executes.

Observe → Decide → Recover → Verify → Learn
