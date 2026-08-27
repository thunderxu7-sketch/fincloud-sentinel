# Deployment and rollback

## Before release

Confirm immutable image digest/SBOM/signature, migration compatibility, tests/scans/evals, capacity,
change approval, dashboards, rollback artifact, feature flags, on-call and blackout window.

## Progressive release

1. Deploy same artifact to staging and run smoke/invariant/integration checks.
2. Production internal/synthetic canary; verify request/transaction/event/model correlation.
3. Increase 1% → 10% → 50% → 100% only when correctness, errors, p95/p99 and dependency budgets pass.
4. Hold at each band for the minimum observation window; record approver/evidence.

## Rollback triggers

Any duplicate/unbalanced effect, unauthorized action, reconciliation anomaly, data leak, critical
security signal, or SLO burn beyond policy. Correctness triggers roll back/contain immediately; do
not wait for statistical significance.

## Rollback

- Stop promotion; disable affected feature/path if safer than binary rollback.
- Roll application to prior digest. Do not reverse an irreversible database migration blindly.
- For schema change use expand/contract and forward repair/compensation plan.
- Reconcile in-flight transactions and verify outbox/inbox before normal traffic.
- Preserve release/config/audit evidence and open follow-up.
