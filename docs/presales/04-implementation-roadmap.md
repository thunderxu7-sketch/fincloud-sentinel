# Implementation roadmap and RACI

## Phase 0 — qualify and mobilize (week 0)

**Outputs:** signed problem statement, baseline, scope/exclusions, architecture hypotheses, data and
security classification, named owners, POC scorecard, budget cap, exit date.

**Gate:** no work begins without a business owner, authorized synthetic/masked data, success metrics,
and a production decision meeting.

## Phase 1 — four-week POC

| Week | Workstream | Deliverable | Review gate |
|---|---|---|---|
| 1 | Landing zone + integrity skeleton | isolated account/VPC, CI, identity, state machine, idempotency, ledger | threat model + invariant tests pass |
| 2 | Events + risk + reconciliation | outbox/inbox, broker, synthetic adapter, Flink/Hologres feature path, mismatch detection | replay and mismatch tests pass |
| 3 | AI + operations | PAI-EAS/fallback, governed retrieval, metrics/logs/traces, dashboards/runbooks | AI eval and no-unsafe-action gate pass |
| 4 | NFR + economics + decision | load/chaos/restore tests, TCO, security findings, handover and executive readout | signed scorecard and go/remediate/stop decision |

## Phase 2 — production pilot (indicative 6–10 weeks)

1. Complete detailed design, privacy impact, model validation, key/signing design and vendor review.
2. Implement durable repositories/adapters, customer identity, policy service and evidence retention.
3. Integrate one low-risk asset/rail with limits, shadow reconciliation and manual release.
4. Run capacity, penetration, dependency, restore and regional recovery tests.
5. Canary internal users, capped customer cohort, then volume bands with automated rollback.

## Phase 3 — scale and optimize

- add assets/regions only through the same control and scorecard gates;
- tune capacity and storage from actual percentiles and event amplification;
- reduce toil only after the manual control is measured and understood;
- quarterly restore, incident and model-fallback game days;
- semiannual architecture/TCO/exit-plan review.

## Work breakdown and ownership

| Work package | Customer | Alibaba Cloud / SA | Delivery team | Security/risk |
|---|---|---|---|---|
| Outcome, rules, financial semantics | **A/R** | C | C | C |
| Cloud architecture and product mapping | C | **A/R** | R | C |
| Application/domain implementation | C | C | **A/R** | C |
| Landing zone/RAM/network | A | C | **R** | **C/approve** |
| Data classification and legal basis | **A/R** | I | I | **R** |
| Model validation and risk policy | **A** | C | R | **R/approve** |
| Test execution and evidence | A | C | **R** | C |
| Production operations/on-call | **A/R** | support per contract | R during handover | C |
| Go-live acceptance | **A** | C | R | **approve** |

R = Responsible, A = Accountable, C = Consulted, I = Informed. One accountable owner per row must be
named in the customer plan.

## Change and risk management

- Weekly architecture/risk decision log; daily POC blockers; no silent scope expansion.
- Every assumption has owner and expiry date.
- Critical security/funds-safety failure pauses the POC and preserves evidence.
- Any production claim includes workload, region, edition, configuration, timestamp and result.
