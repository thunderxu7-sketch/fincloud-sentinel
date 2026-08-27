# SLO and alert catalog

| Signal | Window | Page/ticket policy | Runbook |
|---|---|---|---|
| Duplicate or unbalanced business effect | immediate | SEV-1 page, contain | ledger reconciliation |
| Reconciliation critical mismatch | ≤60 s detection | SEV-1 page | ledger reconciliation |
| API availability error-budget burn | fast 5m/1h + slow 30m/6h | page only on sustained multi-window burn | incident response |
| API p95 >250 ms | 10 min | ticket unless correctness affected | incident response |
| Broker lag over settlement policy | 5 min | SEV-2; pause by materiality | incident response |
| Model timeout/error/fallback | 5 min | SEV-2 if fallback safe; SEV-1 on false allow | model degradation |
| AI conclusion without citation | evaluation/release | block release | model degradation |
| Consequential AI action without approval | immediate | SEV-1 security/funds page | incident response |
| Backup/restore test missed | daily/quarterly | ticket to service owner | disaster recovery |
| Cost forecast >budget threshold | daily | FinOps ticket; scale/retention review | deployment/handover |

Alerts identify customer/funds risk and a safe action. Dashboards without ownership/runbooks are not
alerts. Production thresholds come from signed NFRs and measured baselines.
