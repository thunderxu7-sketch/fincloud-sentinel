# Runbook index

| Runbook | Trigger | Primary safe action |
|---|---|---|
| [Incident response](incident-response.md) | SEV alert/customer report | assign commander, contain, preserve evidence |
| [Ledger reconciliation](ledger-reconciliation.md) | mismatch/unbalanced entry | pause affected route after approval; never auto-repair |
| [Model degradation](model-degradation.md) | model latency/error/drift budget | open breaker; deterministic fail-closed rules |
| [Deployment and rollback](deployment-rollback.md) | planned release or SLO regression | canary same artifact; rollback safely |
| [Disaster recovery](disaster-recovery.md) | zone/region/data loss | establish truth, restore, validate, reconcile |
| [Chaos game day](chaos-game-day.md) | scheduled controlled exercise | synthetic isolation, abort limits, evidence |
| [SLO and alert catalog](slo-alert-catalog.md) | burn-rate or correctness signal | policy-based escalation |

Production forks replace roles, endpoints, dashboards and escalation contacts with approved values.
