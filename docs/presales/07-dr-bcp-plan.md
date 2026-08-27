# Disaster recovery and business continuity plan

Availability is not financial correctness. A recovery is successful only when service, data,
ledger invariants, external settlement and operator control are all verified.

## Proposed service tiers

Customer must replace these defaults after business impact analysis.

| Tier | Capability | RPO | RTO | Strategy |
|---|---|---:|---:|---|
| T0 | ledger, transaction state, idempotency authority | 0 within region; ≤5 min region | ≤60 min | multi-zone strong replicas + warm regional standby/log shipping |
| T1 | settlement orchestration, risk rules, event path | ≤5 min | ≤30 min | multi-zone active, versioned config, warm regional capacity |
| T2 | model serving, online risk features | ≤15 min | ≤60 min | model artifact/config copy; deterministic rules remain available |
| T3 | analytics, dashboards, AI copilot | ≤24 h | ≤4 h | rebuild/replay; never blocks safe core transaction state |

## Failure modes

| Event | Automatic response | Declared/manual response |
|---|---|---|
| Pod/node loss | readiness removal, reschedule, PDB/HPA | investigate capacity if error budget burns |
| Zone loss | ALB removes targets; replicas maintain service | scale surviving zones; freeze risky releases |
| Database leader failure | managed failover, clients retry idempotently | verify commit uncertainty and reconcile |
| Broker degradation | backpressure, retry/DLQ; no duplicate effect | pause affected settlement if lag exceeds policy |
| Model/Hologres failure | breaker opens, versioned rules fail closed | approve controlled recovery/canary |
| Region loss | preserve state, stop unsafe routing | incident commander declares regional failover |
| Corruption/ransomware | isolate, revoke credentials, immutable backup | restore clean point to isolated environment |

## Regional failover runbook

1. **Declare:** incident commander confirms trigger; freeze deployments and financial policy changes.
2. **Contain:** stop/hold uncertain settlement paths; preserve audit and dependency evidence.
3. **Establish truth:** identify last durable transaction/event/ledger positions and external status.
4. **Promote:** restore/promote data and event checkpoints in standby; rotate compromised credentials.
5. **Validate:** health, schema/version, debit=credit, idempotency, outbox/inbox, reconciliation, model fallback.
6. **Route:** canary internal/read traffic, then capped writes, then volume bands with rollback triggers.
7. **Communicate:** business, risk, compliance, providers and customers per notification matrix.
8. **Reconcile:** compare all in-flight transactions; resolve uncertainty before normal limits resume.
9. **Failback:** treat as a separate planned migration after root cause and consistency review.

## Backup policy

- Encrypt with KMS; separate backup administration from database administration.
- Point-in-time logs plus periodic full backups; cross-account/region immutable copy where permitted.
- Inventory application, database, broker offsets/schema, model, feature job, policy, IaC and runbooks.
- Retention follows legal and business policy; deletion is tested, auditable and subject to hold.
- Restore at least quarterly into an isolated environment; a successful backup job is not restore proof.

## Game-day scorecard

| Evidence | Pass |
|---|---|
| Detection, declaration and role assignment timestamps | within escalation target |
| Service restoration | within tier RTO |
| Data position | within tier RPO |
| Ledger balance and idempotency | 100% |
| External settlement reconciliation | all known in-flight items classified |
| Secret rotation / access review | complete when scenario requires |
| Business/risk approval before reopening | recorded |
| Gaps have owner and due date | 100% |

## Communication matrix

Maintain named contacts—not job titles only—for incident commander, transaction owner, SRE,
security, legal/privacy, compliance/model risk, provider support, executive sponsor and customer
communications. Pre-approve status templates but publish only verified facts and timestamps.
