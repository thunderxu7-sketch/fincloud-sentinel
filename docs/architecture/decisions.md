# Architecture decision records

| ID | Decision | Status | Why | Consequence |
|---|---|---|---|---|
| ADR-001 | Represent money as integer atomic units | Accepted | Floating point can silently change value | Formatting is separate from accounting |
| ADR-002 | Explicit finite state machine with optimistic version | Accepted | Prevent impossible transitions and lost updates | Every new state requires migration/tests |
| ADR-003 | Idempotency key plus durable unique constraint | Accepted | Clients and brokers retry | Same key returns original effect |
| ADR-004 | Double-entry append-only ledger | Accepted | Every value movement needs a balancing explanation | Corrections use compensation, not mutation |
| ADR-005 | Transactional outbox + consumer inbox | Accepted | DB commit and message send cannot be one atomic local action | Delivery is at-least-once; business effect is once |
| ADR-006 | Partition event order by transaction ID | Accepted | Per-flow order matters; global order would limit throughput | Cross-transaction consumers cannot assume order |
| ADR-007 | Reconciliation is independent and cannot silently repair | Accepted | Detection and repair need separate authorization | Mismatches create incidents and pause policy |
| ADR-008 | AI is read-only by default | Accepted | Model output is probabilistic and input may be hostile | Financial actions need typed command + two approvals |
| ADR-009 | Rules fallback is fail-closed | Accepted | Model timeout cannot become a risk bypass | More reviews during degradation |
| ADR-010 | Managed cloud mapping, portable domain core | Accepted | Reduce undifferentiated operations without hiding lock-in | Adapters and exit plan are documented |
| ADR-011 | Public demo is static and synthetic | Accepted | Avoid custody, identity, key, and privacy risk | Backend scenarios are deterministic simulations |
| ADR-012 | Active-passive regional recovery first | Proposed | Easier to prove financial consistency than multi-writer | Higher RTO than active-active, lower correctness risk |

## Decision template

```text
Title / date / owner / status
Context and measurable decision drivers
Options considered
Decision and explicit non-goals
Security, compliance, cost, availability, and reversibility impact
Validation evidence and review date
```
