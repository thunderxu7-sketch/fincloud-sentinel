# Business requirements and non-functional requirements

All targets below are **POC proposal defaults**, not customer facts or service guarantees. Replace
and sign them during discovery.

## Functional scope

| ID | Requirement | Acceptance evidence | Priority |
|---|---|---|---|
| FR-01 | Accept deposit/withdrawal intent with immutable ID and idempotency key | same request ×100 creates one transaction | Must |
| FR-02 | Validate amount, asset, address and policy before movement | invalid requests rejected with typed reason | Must |
| FR-03 | Evaluate versioned risk signals into allow/review/block | reproducible decision and reason codes | Must |
| FR-04 | Enforce legal state transitions and optimistic version | impossible/out-of-order transition rejected | Must |
| FR-05 | Post balanced, append-only settlement entries | debit equals credit per transaction/asset | Must |
| FR-06 | Publish state events without DB/message loss gap | commit + outbox test; redelivery safe | Must |
| FR-07 | Reconcile internal ledger and external settlement | mismatch detected and classified | Must |
| FR-08 | Pause affected route under approved containment | two-person approval and audit record | Should |
| FR-09 | Investigate incident using cited, redacted evidence | expected runbook retrieved in eval set | Should |
| FR-10 | Export audit evidence by transaction/incident/version | traceable evidence bundle | Should |

## NFR and SLO proposal

| ID | Attribute | POC target | Measurement / gate |
|---|---|---:|---|
| NFR-01 | Eligible API availability | ≥99.9% during test window | Prometheus SLI; exclude signed maintenance only |
| NFR-02 | API latency | p95 <250 ms, p99 <500 ms | k6 at agreed 1.5× peak, external finality excluded |
| NFR-03 | Idempotency | 100% one business effect | concurrent/replayed requests, DB unique key |
| NFR-04 | Ledger balance | 100% debit=credit | invariant test and reconciliation report |
| NFR-05 | Reconciliation detection | ≤60 s synthetic mismatch | timestamped incident evidence |
| NFR-06 | Risk-model budget | p95 <200 ms | PAI-EAS/ARMS metric in target region |
| NFR-07 | Model timeout safety | 0 false allow in injected timeout | deterministic fallback counter/review status |
| NFR-08 | AI grounding | 100% test answers cite approved source | versioned eval report |
| NFR-09 | Unsafe AI action | 0 without approval | policy tests and audit trail |
| NFR-10 | Zone fault RTO | ≤5 min for stateless service | controlled game day |
| NFR-11 | Regional RPO/RTO | proposed ≤5 min / ≤60 min | restore/failover rehearsal; customer to confirm |
| NFR-12 | Recovery correctness | 100% reconciled before reopen | post-recovery invariant and sign-off |
| NFR-13 | Accessibility | WCAG 2.2 AA critical journeys | automated + keyboard/manual evidence |
| NFR-14 | Supply chain | no unresolved critical/high release finding | CodeQL/SCA/secret/container/IaC scans |
| NFR-15 | Cost governance | POC spend within approved cap | budget alert + daily cost view + expiry |

## Data requirements

| Data | Authority | Classification | Retention proposal | Model access |
|---|---|---|---|---|
| Transaction intent/state | OceanBase | confidential financial | policy-defined | tokenized minimum only |
| Ledger entries | OceanBase + immutable archive | restricted | regulatory policy | prohibited |
| Risk features | Hologres | confidential/derived | model policy | approved features only |
| Logs/traces | SLS/ARMS | confidential, redacted | 30–180 days by tier | approved redacted fields |
| Runbooks | versioned repository/index | internal | version history | allowlisted retrieval |
| Model prompts/output | governed audit store | confidential | minimum justified period | no training reuse by default |

## Exclusions for the public reference

Real custody/signing, KYC/AML decisions, sanctions screening, fiat rails, customer identity, regulated
record retention, cross-border production deployment, and contractual SLA are explicitly excluded.
