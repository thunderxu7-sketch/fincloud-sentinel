# Incident response

## Severity

- **SEV-1:** suspected duplicate/unbalanced fund effect, unauthorized action, key/data compromise,
  unreconciled material exposure, or broad inability to establish truth.
- **SEV-2:** degraded settlement/risk dependency, rising backlog/error budget with safe containment.
- **SEV-3:** limited noncritical degradation with no funds-safety or sensitive-data impact.

## First 15 minutes

1. Acknowledge, assign incident commander, operations lead, communications and scribe.
2. State known facts, uncertainty, customer/funds/data scope and current safe posture.
3. Freeze deployments/policy/model changes; preserve commit/config/model identifiers.
4. If financial integrity is uncertain, fail closed and request approved route/asset containment.
5. Correlate by request, transaction, event and model version; use redacted evidence only.
6. Establish next update time and notify security/compliance/provider per matrix.

## Investigation order

1. **Truth:** transaction state/version and ledger invariant.
2. **External:** settlement/provider status and confirmations/finality.
3. **Delivery:** outbox/inbox/event trace, lag, retry and DLQ.
4. **Risk:** policy/model/feature versions, timeout/fallback and decision reason.
5. **Platform:** release, dependency, capacity, zone, identity and audit changes.

AI output is a hypothesis linked to evidence. It does not replace incident command or authorization.

## Resolution and recovery

- Implement reversible containment; do not delete evidence or silently edit ledger/state.
- Test fix in isolation; canary within limits; monitor correctness before availability.
- Reconcile all in-flight/affected business IDs before lifting holds.
- Record decision, approver, command, result, timestamps and residual risk.

## Closure

Timeline, customer impact, financial/data exposure, detection gap, root/contributing causes, recovery,
what went well/poorly, corrective owners/dates, control/test/runbook updates and regulatory review.
Blamelessness does not remove accountable action owners.
