# Ledger reconciliation mismatch runbook

A mismatch between the external settlement and the internal double-entry ledger is a SEV-1 funds
safety incident.

## Immediate containment

Pause the affected asset settlement route after human approval. Preserve the outbox event,
transaction version, external transaction hash, and both debit and credit entries. Do not edit or
delete ledger rows.

## Diagnosis

Reconcile by immutable business identifier. Verify amount atomic units, asset decimals, event
version, inbox idempotency key, and finality threshold. Distinguish a delayed observation from a
true amount mismatch.

## Exit criteria

The ledger is balanced, the external amount matches, the root cause is documented, and two-person
approval authorizes resumption.
