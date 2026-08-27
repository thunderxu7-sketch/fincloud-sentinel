# Chain confirmation delay runbook

Trigger when `confirming_age_p95_seconds` breaches 600 seconds or the RPC error rate exceeds 5%.

## Safe diagnosis

Correlate the transaction identifier across the watcher, message broker, and ledger. Query the
primary and secondary RPC endpoints without rebroadcasting the transaction. Confirm whether the
original transaction hash exists before any retry.

## Containment

Fail over reads to the verified secondary endpoint. Keep withdrawals in `CONFIRMING`; never create
a second ledger settlement. Replaying or rebroadcasting requires operations approval.

## Recovery evidence

Confirmation age returns below the SLO, queue lag drains, and reconciliation reports no mismatch.
