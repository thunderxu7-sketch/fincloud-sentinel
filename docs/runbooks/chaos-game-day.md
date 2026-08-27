# Chaos game day

## Guardrails

Synthetic data and isolated POC/staging only; named commander/observer; no real settlement or keys;
approved experiment/abort threshold; verified rollback; stakeholder notification; hard time limit.

## Steps

1. Record steady-state hypothesis and baseline dashboard/export.
2. Verify backups, feature flags, pause control and clean test dataset.
3. Inject one failure from `tests/chaos/scenarios.md`—never combine unknowns first.
4. Observe detection, alert quality, automatic safety, operator decision and customer impact.
5. Abort on funds-safety invariant, prohibited data exposure, unexpected blast radius, missing owner,
   or recovery approaching the agreed limit.
6. Recover, reconcile and compare all invariants before declaring normal.
7. Publish evidence, learned gap, control/test/runbook change, owner and due date.

A game day “passes” only if the organization learns and closes gaps; survival without observable
control evidence is not success.
