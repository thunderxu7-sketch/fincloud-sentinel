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

Open **Operations lab / 交易实验台**. Explain that the browser calls the shared domain modules used
by the API and tests; it is not a timeline animation. Point to integer money, idempotency, explicit
state transitions, balanced posting and reconciliation. Explain that at-least-once delivery is made
safe rather than marketed as exactly-once transport.

## 5:00–8:00 — healthy and retry path

1. Load **Normal / 正常交易**, submit the withdrawal, and show the calculated low-risk decision.
2. Select **Broadcast & settle / 广播并结算**. Follow the state/event trace through completion.
3. Show the generated debit and credit entries plus 12 synthetic confirmations.
4. Select **Replay same request / 使用相同幂等键重放**. Show one more attempt and replay event but
   no additional transaction or ledger posting.
5. Explain durable DB uniqueness remains authoritative in production even if cache is lost.

## 8:00–12:00 — funds-safety incident

1. Select the completed transaction and inject **Amount mismatch / 结算金额不一致**.
2. The UI executes reconciliation immediately; show the run ID, expected/received atomic amounts,
   balanced internal ledger, and critical external mismatch.
3. Run the governed investigator and follow the reconciliation, event and Runbook citations.
4. Emphasize that the investigator only proposes containment. Click **Approve containment** to add
   an explicit operator-approved route-pause event, then export the evidence JSON.

## 12:00–15:00 — model degradation and AI governance

1. Load **Review / 人工审核** and submit it. Show the policy reasons and absence of ledger entries.
2. Explicitly approve the review, then settle. Explain that uncertain requests never fail open.
3. Show the FastAPI injection/redaction tests and 4/4 offline AI evaluation from CI or local output.
4. Explain model/version, feature time, canary, fallback and why the Pages investigator is labeled
   deterministic offline mode rather than presented as a live LLM.

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
