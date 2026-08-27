# Interview discussion guide

## 60-second opening

FinCloud Sentinel is a runnable reference for a financial transaction assurance platform. The
interesting part is not the dashboard: it is how integer money, an explicit state machine,
idempotency, double-entry posting, outbox/inbox delivery, and independent reconciliation compose
into one funds-safety invariant. Alibaba Cloud services map to operational responsibilities, and
the AI copilot can investigate evidence but cannot move funds without human approval.

## Likely second questions

- **Why not exactly-once messages?** Transport retries are normal. Durable unique keys and idempotent
  consumers guarantee one business effect without pretending the broker can erase distributed
  failure.
- **Why OceanBase and not only a cache?** Accounting needs durable ACID consistency; Tair is a
  latency aid and can be lost without changing truth.
- **What happens when the risk model times out?** A circuit breaker activates versioned deterministic
  rules. High-risk or uncertain requests move to review; there is no fail-open path.
- **How do you prove no fund loss?** Atomic ledger posting, debit=credit invariant, external
  reconciliation, immutable identifiers, and alert/incident evidence. "Zero loss" is a target
  verified by tests and reconciliation, not a marketing claim.
- **Why not active-active across regions?** Multi-writer financial truth introduces conflict and
  split-brain semantics. Start with multi-zone plus warm regional standby; adopt active-active only
  after ownership partitioning and recovery evidence.
- **How is the AI grounded?** Approved, versioned runbooks; citations; input redaction and injection
  detection; typed allowlisted tools; offline eval; read-only default; approval gate.
- **How would you size it?** Derive peak TPS, event amplification, payload size, retention, p95/p99,
  model concurrency, and recovery objectives; load test at 1.5× projected peak; benchmark each
  managed service in the actual region/edition.

## Whiteboard order

1. Outcome and invariant.
2. Critical transaction sequence.
3. Consistency and retry model.
4. Failure/containment paths.
5. Cloud product mapping and why each product is needed.
6. Security/data/model boundaries.
7. SLO, DR, cost, migration, and evidence.
