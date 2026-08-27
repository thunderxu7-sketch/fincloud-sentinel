# Executive proposal / 高层方案书

## 中文摘要

### 业务问题

金融交易链路同时面临三类风险：重试或消息重复导致的重复入账、内部账本与外部结算不一致、
以及风险模型或依赖故障时的错误放行。传统方案把交易、风控、对账和运维拆成多个孤岛，事故
发现慢、证据分散、恢复过程依赖个人经验。

### 建议方案

以“资金正确性优先”为原则建设 FinCloud Sentinel：交易核心采用幂等键、显式状态机、复式
记账和独立对账；事件通过 Outbox/Inbox 保证重复投递不会形成重复业务效果；实时特征与模型
采用 Flink、Hologres、PAI-EAS，并在超时或不确定时自动降级到确定性规则与人工复核；AI
Copilot 只能基于经批准的 Runbook 和脱敏证据诊断，任何资金相关动作必须双人审批。

### 预期价值（需用客户基线验证）

- 将重复入账和不平账从“事后排查”转为可执行的不变量与自动检测。
- 通过统一业务号和可观测证据缩短事故定位/恢复时间。
- 将新规则、模型和服务发布纳入灰度、评测和回滚门禁。
- 以 ACK、OceanBase、RocketMQ、Hologres、PAI-EAS、ARMS/SLS 等托管能力减少自建运维。
- 用 POC 计分卡和 TCO 模型形成可审计的生产决策，而非只做演示。

### 需要管理层确认的决策

1. 批准 4 周受控 POC（仅合成/授权脱敏数据）。
2. 指定业务、交易、风险、安全、合规和运维负责人。
3. 确认目标区域、数据驻留、峰值交易量、RPO/RTO、决策日期与预算范围。
4. 以 POC 验收门槛决定生产试点、整改后重测或终止，不自动承诺上线。

## English executive summary

### Business problem

Financial transaction flows can create duplicate business effects under retries, drift between the
internal ledger and external settlement, and unsafe decisions when models or dependencies degrade.
Siloed transaction, risk, reconciliation, and operations evidence makes detection and recovery slow.

### Recommendation

Adopt a funds-safety-first assurance layer: idempotent state transitions, append-only double-entry
posting, independent reconciliation, durable outbox/inbox delivery, real-time risk features, and a
fail-closed model fallback. An evidence-grounded operations copilot accelerates investigation but is
read-only by default; every consequential action requires explicit two-person approval.

### Decision requested

Approve a four-week, synthetic-data POC with named business, security, risk, operations, and
integration owners. Confirm success gates, region/data-residency constraints, peak load, RPO/RTO,
budget range, and the production decision date before work starts.

## Proposed target architecture

| Capability | Alibaba Cloud reference | Rationale |
|---|---|---|
| Edge protection | Global Accelerator, WAF, ALB | global latency, API protection, health routing |
| Compute/delivery | ACK, ACR, Helm | immutable releases, scaling, multi-zone scheduling |
| Ledger/transactions | OceanBase | durable ACID transaction authority |
| Idempotency/cache | Tair | low-latency ephemeral control; not accounting truth |
| Events | ApsaraMQ for RocketMQ | per-transaction order, transactional delivery patterns |
| Streaming/risk | Realtime Compute for Apache Flink, Hologres | streaming features and sub-second analysis |
| Model serving | Model Studio, PAI-EAS | governed model access, scaling, canary and fallback |
| Security/evidence | RAM, KMS, ActionTrail, SLS | least privilege, key custody, audit evidence |
| Observability | ARMS, Managed Prometheus, SLS | metrics, traces, logs, SLO and incident correlation |

## Commercial and delivery principles

- Architecture and product editions are finalized only after workload and compliance discovery.
- Costs come from the target region's calculator/quote and customer usage assumptions; no public
  demo number is a commercial offer.
- POC resources have budget alerts and an expiry date. Production uses a separate landing zone.
- Customer retains accountability for business rules, regulated decisions, data, keys, and operations.
