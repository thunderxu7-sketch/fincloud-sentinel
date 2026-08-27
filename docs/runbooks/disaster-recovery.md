# Disaster recovery execution

1. Incident commander declares DR using approved trigger; freeze releases and uncertain writes.
2. Confirm failure scope and last known durable transaction, ledger, event and external settlement positions.
3. Isolate suspected corruption/compromise; revoke/rotate identity where required.
4. Promote warm standby or restore encrypted backup into an isolated recovery environment.
5. Apply matching application, schema, policy, feature and model versions.
6. Run health, idempotency, legal-transition, debit=credit, outbox/inbox and reconciliation checks.
7. Canary reads, internal synthetic writes, then capped customer writes with rollback limits.
8. Risk/finance/operations approve reopen; communicate verified RPO/RTO and impact.
9. Reconcile all in-flight transactions; retain evidence. Failback is a separate planned change.

Abort and escalate if transaction truth is ambiguous, invariant fails, external authority cannot be
verified, or access/key compromise remains open.
