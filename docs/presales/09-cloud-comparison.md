# Alibaba Cloud, AWS, and Azure decision framework

This is a workload decision framework, not a universal ranking. Validate current region availability,
service editions, contracts, certifications, quotas, team competence, latency and prices.

## Comparable capability map

| Need | Alibaba Cloud reference | AWS reference | Azure reference |
|---|---|---|---|
| Kubernetes/registry | ACK / ACR | EKS / ECR | AKS / ACR |
| Transaction database | OceanBase or RDS variants | Aurora/RDS | Azure SQL/PostgreSQL |
| Cache | Tair | ElastiCache | Azure Managed Redis |
| Event/messaging | ApsaraMQ RocketMQ | MSK, SQS/SNS, EventBridge | Service Bus, Event Hubs |
| Stream processing | Realtime Compute for Apache Flink | Managed Service for Apache Flink | Stream Analytics / Fabric event streams |
| Real-time analytical serving | Hologres | Redshift/OpenSearch/DynamoDB patterns | Fabric/Synapse/Cosmos DB patterns |
| AI platform/model serving | Model Studio + PAI-EAS | Bedrock + SageMaker AI | Azure AI Foundry/OpenAI + Azure ML |
| Metrics/logs/APM | Managed Prometheus, SLS, ARMS | Managed Prometheus, CloudWatch, X-Ray | Azure Monitor, Managed Prometheus, Application Insights |
| IAM/key/audit | RAM, RRSA, KMS, ActionTrail | IAM/IRSA, KMS, CloudTrail | Entra ID/workload identity, Key Vault, Activity Log |
| Global edge/security | GA, WAF, ALB, Anti-DDoS | Global Accelerator/CloudFront, WAF, ALB, Shield | Front Door, WAF, Application Gateway, DDoS Protection |

## Weighted selection criteria

Customer assigns weights before vendor workshops to avoid post-hoc scoring.

| Criterion | Example weight | Evidence required |
|---|---:|---|
| Target market/region/data residency | 18 | legal review, product availability, measured latency |
| Financial consistency and recovery | 18 | architecture, SLA terms, failover/restore test |
| Security/compliance and key ownership | 15 | independent reports, control mapping, IAM/KMS demonstration |
| Existing operating skills/landing zone | 12 | team assessment and support model |
| Event/real-time/AI fit | 12 | target-workload POC results, not feature checklist |
| Reliability/observability | 10 | SLO, game-day and evidence workflow |
| Three-year TCO and commercial terms | 10 | normalized quote and sensitivity model |
| Portability/exit and ecosystem | 5 | export, adapter, data egress and migration rehearsal |
| **Total** | **100** | — |

## Contextual strengths to validate

### Alibaba Cloud may be favored when

- primary users, integrations and regulated deployment are in China/Asia and measured network fit is strong;
- OceanBase/RocketMQ/Hologres/Flink and Alibaba-native operational expertise align to the workload;
- an integrated Alibaba Cloud commercial/support route materially shortens delivery.

### AWS may be favored when

- the organization already operates a mature AWS landing zone, IAM, data and SRE practice globally;
- existing Bedrock/SageMaker or event/data investments make incremental adoption lower risk;
- required partner products and regions are strongest in the current AWS estate.

### Azure may be favored when

- Entra ID, Microsoft security/governance, .NET and enterprise data estates are dominant;
- Azure AI/OpenAI procurement and data boundaries satisfy the model policy;
- existing enterprise agreement and operations reduce migration and training effort.

These are hypotheses. Each needs customer-specific evidence.

## POC comparison rules

- Same transaction semantics, dataset seed, load profile, SLO, failure scenarios and scorecard.
- Normalize managed responsibility; do not compare a fully managed service to unpaid self-hosted labor.
- Include three environments, DR, support, telemetry, data transfer, migration and exit.
- Record region, service edition, configuration and date with every result.
- Score operational recovery and evidence, not only happy-path throughput.
- Treat commercial discounts confidentially and separate from technical score.
