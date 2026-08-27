# Controlled failure scenarios

| Experiment | Injection | Expected safe behavior | Evidence |
|---|---|---|---|
| Broker redelivery | Replay the same event ID 100 times | Inbox key accepts one ledger posting | duplicate counter, balanced ledger |
| RPC degradation | Add 2 s latency and 20% failures | Circuit opens; secondary provider is verified before switch | p95, breaker state, confirmation backlog |
| Model timeout | Return inference after 4 s | Request fails closed into deterministic rules/review | fallback counter, zero false allow |
| Ledger mismatch | Alter synthetic settlement amount | Asset route pauses, SEV-1 opens, evidence preserved | reconciliation issue, audit event |
| Zone loss | Terminate one replica set | PDB/HPA keep service within SLO | availability, RTO stopwatch |

Run only in an isolated environment with synthetic data. Follow `docs/runbooks/chaos-game-day.md`.
