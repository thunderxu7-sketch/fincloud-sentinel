# Ledger reconciliation mismatch

## Trigger

`UNBALANCED_LEDGER`, `MISSING_CHAIN_SETTLEMENT`, `CHAIN_AMOUNT_MISMATCH`, or overdue insufficient
confirmations for a completed/expected transaction.

## Safe procedure

1. Do not replay, complete, compensate or edit the transaction from an alert alone.
2. Fetch immutable transaction ID, state/version, atomic amount/asset, ledger entries and outbox events.
3. Fetch external settlement from at least the authoritative provider/source and capture finality context.
4. Recalculate debit/credit totals in atomic units; classify internal, external, timing or data-source issue.
5. For material/unknown exposure, request two-person pause of the affected route—not the whole platform by default.
6. Preserve evidence and enumerate every transaction in the same failure window/version/provider.
7. Repair through approved compensating workflow; never update/delete append-only ledger entries.
8. Re-run reconciliation and obtain finance/risk sign-off before reopen.

## Escalate SEV-1 when

Any confirmed duplicate/unbalanced effect, unknown material exposure, unauthorized change, widespread
mismatch, corrupted authority, or inability to reconcile within the agreed threshold.

## Evidence

Query/transaction/event IDs, expected vs observed atomic amount, state/version, entry totals, external
source/confirmation, release/config/policy/model, operator/approver and before/after report hashes.
