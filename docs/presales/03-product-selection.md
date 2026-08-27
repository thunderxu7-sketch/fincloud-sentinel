# Alibaba Cloud product selection and configuration strategy

Product selection follows workload and control responsibility—not logo count. Confirm regional
availability, editions, quotas, compliance eligibility, SLAs, and price in the customer account.

## Selection matrix

| Concern | Recommended capability | Why it fits | Configuration starting point | Exit / alternative |
|---|---|---|---|---|
| Global API entry | Global Accelerator + WAF + ALB | proximity, DDoS/WAF policy, health routing | private origin; TLS 1.2+; managed rules in observe→block; rate limit by identity/API | CDN/Anycast + portable ingress |
| Containers | ACK Managed Pro + ACR | managed control plane, multi-zone scheduling, supply chain | 3 zones; RRSA; private API; PDB/HPA; digest-pinned images | Kubernetes/OCI workload is portable |
| Transaction DB | OceanBase | distributed ACID and strong consistency for ledger authority | multi-replica, private endpoint, PITR, separate accounts, slow/audit logs | PostgreSQL-compatible repository abstraction |
| Ephemeral controls | Tair | fast idempotency reservation, rate/velocity state, cache | HA instance, TLS, ACL, eviction alerts; cache is never ledger authority | Redis protocol adapter |
| Event backbone | ApsaraMQ for RocketMQ | ordered events per business key; transactional delivery patterns | transaction ID sharding key; DLQ; bounded retry; schema/version; message trace | Kafka/other broker behind event port |
| Stream features | Realtime Compute for Apache Flink | event-time features, windows, backpressure/checkpoints | checkpoint to durable storage; versioned job; replay and late-data policy | portable SQL/DataStream jobs where feasible |
| Online analytics | Hologres | high-throughput ingestion and sub-second queries for real-time risk/ops | row store for point serving, column for analytics; workload isolation | PostgreSQL interface + export path |
| Model lifecycle | Model Studio + PAI-EAS | governed model access plus online inference, autoscaling, canary and monitoring | VPC access, min replicas, p95 budget, canary, fallback model/rules, no training reuse | OpenAI-compatible/model adapter + OCI image |
| Secrets/identity | RAM + RRSA + KMS | short-lived workload identity and managed key custody | least privilege, no static keys, separation of duties, 30–90 day rotation by key type | standard OIDC/KMS abstraction |
| Evidence/operations | SLS + ARMS + Managed Prometheus + ActionTrail | logs, APM/traces, metrics, cloud audit | redaction at collection; immutable tier; SLO/burn alerts; cost controls | OpenTelemetry/Prometheus export |
| Data engineering | DataWorks | governed pipelines, lineage and quality for offline/reporting data | separate workspaces, approvals, quality rules, least privilege | SQL/dbt/orchestrator portability |

## Financial-control-specific configuration

### OceanBase

- One local transaction persists business state, version, balanced ledger entries, and outbox event.
- Durable unique constraint on the idempotency key; no cache-only guarantee.
- Append-only ledger permissions; correction via compensating entries.
- Backups are encrypted and restore-tested; replicas are not backups.
- Report measured commit/p95 under the target topology; do not quote generic benchmark results.

### RocketMQ

Use transaction ID as the sharding key when relative order within a transaction matters. Consumers
still deduplicate by event ID because redelivery is expected. Ordered and transactional message
semantics are distinct product modes; choose from the actual consistency pattern, not both by
default. Size advanced-message TPS with its edition-specific billing multiplier.

Official references: [ordered messages](https://www.alibabacloud.com/help/en/apsaramq-for-rocketmq/cloud-message-queue-rocketmq-4-x-series/developer-reference/ordered-messages),
[transactional messages](https://www.alibabacloud.com/help/en/apsaramq-for-rocketmq/cloud-message-queue-rocketmq-5-x-series/developer-reference/transactional-messages),
[message traces](https://www.alibabacloud.com/help/en/apsaramq-for-rocketmq/cloud-message-queue-rocketmq-5-x-series/user-guide/message-traces).

### Hologres and Flink

- Derive velocity, novelty and behavior features by event time with explicit late-data policy.
- Store feature event time, computation version and source lineage; prevent training/serving skew.
- Separate online point-serving workload from analyst/ad-hoc workload.
- Hologres is not the ledger. It can be rebuilt from governed sources.

Official reference: [Hologres overview and real-time risk use case](https://www.alibabacloud.com/help/en/hologres/product-overview/what-is-hologres).

### PAI-EAS

- Prefer private/VPC endpoints and a dedicated baseline for critical inference.
- Configure min/max replicas from measured concurrency and cold-start time.
- Release model versions by shadow/mirror, canary, then promotion; store decision/model version.
- Circuit-break on timeout/error/drift; deterministic rules fail closed to review/block.
- Use asynchronous inference only for non-transactional long-running work, not inline risk latency.

Official references: [EAS overview](https://www.alibabacloud.com/help/en/pai/overview-2),
[custom deployment](https://www.alibabacloud.com/help/en/pai/model-service-deployment-by-using-the-pai-console/), and
[asynchronous inference](https://www.alibabacloud.com/help/en/pai/queue-service-and-asynchronous-inference).

### Observability

ACK's managed observability maps metrics to Managed Prometheus, application traces/APM to ARMS, and
logs/audit evidence to SLS. Estimate and govern each ingestion/retention cost separately.

Official references: [ACK observability best practices](https://www.alibabacloud.com/help/en/ack/ack-managed-and-ack-dedicated/user-guide/observability-best-practices) and
[billing dimensions](https://www.alibabacloud.com/help/en/ack/ack-managed-and-ack-dedicated/user-guide/observable-billing-description).

## Do not select yet when

- transaction semantics, peak load, data region, RPO/RTO or regulated scope are unknown;
- a requested managed service has no accountable operator or measurable success criterion;
- the POC needs only a portable local component and cloud deployment would add cost without evidence;
- the customer expects a product to replace application-level idempotency, accounting or governance.
