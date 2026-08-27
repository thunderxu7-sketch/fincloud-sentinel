# 20-minute customer demo script

## Before the meeting

- Use tagged commit/image, deterministic dataset, clean browser and preflight `npm run check`.
- Open demo, architecture, test output, Grafana and POC scorecard; keep a recorded fallback.
- Confirm audience roles and the one decision required. Never use real customer data or keys.

## 0:00–2:00 — establish outcome

> “This is not a trading or custody demo. It shows how one financial effect stays correct under
> retries and failure, and how an AI assistant helps investigate without receiving authority to move
> funds.”

Ask the sponsor to confirm the target problem and success metric. If different, adapt the flow.

## 2:00–5:00 — explain the invariant

Show the architecture and transaction state machine. Point to integer money, idempotency, balanced
posting, outbox/inbox and reconciliation. Explain that at-least-once delivery is made safe rather
than marketed as exactly-once transport.

## 5:00–8:00 — healthy and retry path

1. Run **Healthy withdrawal**.
2. Show completed state, 12 synthetic confirmations and debit=credit evidence.
3. POST one transaction twice with the same key; show `201`, then `200 replayed=true` and one ID.
4. Explain durable DB uniqueness remains authoritative even if cache is lost.

## 8:00–12:00 — funds-safety incident

1. Run **Ledger mismatch**.
2. Show independent reconciliation, SEV-1, affected route paused and evidence retained.
3. Emphasize: AI proposes containment but cannot execute it; two-person approval is outside model.
4. Open `ledger-reconciliation.md` and show citation/immutable transaction ID.

## 12:00–15:00 — model degradation and AI governance

1. Run **Risk model timeout**; show circuit breaker and deterministic fail-closed fallback.
2. Show injection/redaction test and AI evaluation result.
3. Explain model/version, feature time, canary, fallback and zero unsafe auto-action metric.

## 15:00–17:00 — cloud and operations

Show ACK/Helm multi-zone controls, Prometheus SLO rules, Grafana, k6 and chaos/restore plan. Map each
responsibility to an Alibaba Cloud service; do not imply every product is required before discovery.

## 17:00–19:00 — measurable POC and economics

Open the POC scorecard and TCO workbook. Explain critical fail conditions, normalized comparison,
customer inputs, sensitivity and budget expiry. No benchmark or price is stated without context.

## 19:00–20:00 — close

Ask for one of three decisions: qualified POC workshop, specific gap owner/date, or stop. Confirm
business owner, target region/data scope, peak volume, RPO/RTO and next decision meeting.

## Objection handling

- **“Can the agent auto-fix?”** Read-only investigation can be automated; funds/network/policy actions
  remain typed, authorized, audited and human-approved until a separately validated policy permits otherwise.
- **“Is RocketMQ exactly once?”** We do not rely on that claim. Redelivery is handled by durable
  idempotency, inbox receipts and state/ledger constraints.
- **“Why these Alibaba products?”** Each maps to a failure/control responsibility; POC keeps only
  services that produce decision evidence.
- **“Is this production-ready?”** It is production-minded reference evidence. Production readiness
  requires customer integration, security/model/compliance approval and target-environment tests.
