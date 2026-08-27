# Risk model degradation

## Triggers

p95/p99 latency, timeout/error rate, saturation, feature staleness, drift/performance threshold,
version mismatch, unexplained decision distribution, or provider outage.

## Automatic safe response

- Open circuit breaker at policy threshold.
- Activate signed/versioned deterministic rule fallback.
- Route uncertain/high-risk traffic to review or block; never fail open.
- Preserve input feature timestamps, model/rule version, reason and fallback decision.

## Operator procedure

1. Confirm customer/funds impact and that fallback metric is increasing as expected.
2. Check PAI-EAS instances, autoscaling/cold start, VPC/endpoint, feature freshness and release changes.
3. Compare current and last-known-good latency/error/decision distribution; do not infer only from CPU.
4. Roll back model/config or repair capacity; test in shadow with recorded synthetic cases.
5. Canary recovery at capped traffic while fallback remains available.
6. Close breaker only after stability window and model-risk/operations approval.
7. Review false allow/review/block, manual backlog and affected customer journey.

Never bypass the fallback to improve availability metrics.
