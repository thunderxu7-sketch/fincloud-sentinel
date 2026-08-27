# Risk model timeout runbook

Open the circuit breaker when model latency or error rate breaches policy. New high-risk withdrawals
must fail closed or enter manual review; low-risk traffic may use versioned deterministic rules.

Check PAI-EAS instance health, autoscaling saturation, model version, input size, and downstream
feature-store latency. Rollback or capacity changes require approval. Recovery requires a successful
canary, acceptable p95 latency, and no increase in false-negative risk decisions.
