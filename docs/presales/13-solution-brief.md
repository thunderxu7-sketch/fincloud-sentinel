# FinCloud Sentinel — solution brief / 解决方案简介

## One sentence

A cloud-native control layer that makes financial transaction state, accounting, reconciliation,
risk decisions and AI-assisted operations explainable and testable end to end.

一个将金融交易状态、账务、对账、风险决策与 AI 辅助运维连接成可解释、可验证闭环的云原生保障层。

## Why now / 为什么现在

Retries, asynchronous settlement, real-time risk models and generative AI create more distributed
failure modes than a traditional request/response application. A correct happy path is not enough:
the organization must prove what happens when responses are lost, events repeat, external truth
differs, a model times out, evidence contains hostile instructions, or a region is unavailable.

重试、异步结算、实时模型和生成式 AI 使金融系统的故障组合快速增加。方案价值不在于“正常时能跑”，
而在于响应丢失、消息重复、内外账不一致、模型超时、提示注入或区域故障时仍能保护资金并留下证据。

## The solution / 方案

```mermaid
flowchart LR
  TX[Idempotent transaction] --> ST[Versioned state machine]
  ST --> RK[Risk allow / review / block]
  RK --> LD[Double-entry ledger]
  LD --> EV[Outbox + ordered event]
  EV --> SE[External settlement]
  SE --> RC[Independent reconciliation]
  RC --> OP[Metrics, logs, traces]
  OP --> AI[Evidence-grounded copilot]
  AI --> HU[Human-approved consequential action]
```

### Deterministic money controls

- integer atomic-unit amounts, durable idempotency and legal state transitions;
- append-only balanced posting and compensation rather than destructive correction;
- external reconciliation that detects and contains rather than silently repairs.

### Cloud-native resilience

- ACK multi-zone workloads; OceanBase durable authority; Tair ephemeral acceleration;
- RocketMQ events; Flink/Hologres real-time features; PAI-EAS governed inference/fallback;
- ARMS/SLS/Prometheus correlation, SLO burn alerts, load/chaos/restore evidence.

### Governed AI operations

- approved versioned runbooks, citations and source ACLs;
- secret/PII redaction and prompt-injection detection;
- typed allowlisted tools, read-only default and two-person financial approval;
- offline evaluation, model canary, timeout circuit breaker and deterministic fallback.

## Measurable decision

A four-week POC uses synthetic or authorized masked data. Critical gates include one business effect
under 100 retries, 100% balanced completed transactions, mismatch detection/containment, zero false
allow during model timeout, zero unapproved consequential AI action, a successful restore and a
customer-operated incident runbook. Success requires all critical gates plus ≥85/100 score.

## What the customer receives

Runnable reference code, OpenAPI and SQL schema; Docker/Helm/Terraform delivery assets; dashboards,
SLOs, load/chaos/evaluation suites; architecture and threat model; POC/RFP/TCO/competitive materials;
DR, deployment, incident and handover runbooks; executive deck and editable cost model.

## Boundaries

The public project uses synthetic data and does not perform custody, payment, KYC/AML or regulated
advice. Product fit, performance, certifications, price and service levels require validation in the
customer's target region, account, contract and workload.
