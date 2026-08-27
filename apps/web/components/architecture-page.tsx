"use client";

import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  CloudCog,
  Database,
  Gauge,
  GitBranch,
  Globe2,
  Layers3,
  LockKeyhole,
  RefreshCw,
  ServerCog,
  ShieldCheck,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "./locale-provider";

const copy = {
  en: {
    eyebrow: "PRODUCTION REFERENCE ARCHITECTURE",
    title: "Separate the invariant from the infrastructure.",
    subtitle: "Financial correctness stays deterministic in the transaction core; cloud services add scale, isolation, observability, and recovery around it.",
    publicLabel: "PUBLIC IMPLEMENTATION",
    publicValue: "Browser domain engine + static export",
    targetLabel: "PRODUCTION TARGET",
    targetValue: "Multi-AZ Alibaba Cloud deployment",
    boundary: "The cloud products below are an explicit production mapping, not a claim that the public Pages sandbox runs those managed services.",
    flowIndex: "01 / END-TO-END TOPOLOGY",
    flowTitle: "Six bounded layers with evidence at every handoff.",
    flowSub: "Each layer owns a small set of concerns, exposes measurable contracts, and can fail without silently corrupting money state.",
    topology: [
      ["Channels & global edge", "Web · Mobile · Partner API", "GA · WAF · ALB", "Protected ingress, locality, throttling"],
      ["Application & orchestration", "Next.js · BFF · Core API", "ACK · ACR · Helm", "Versioned workloads, progressive delivery"],
      ["Transaction assurance", "Risk · State machine · Outbox", "Domain service", "Idempotency, ordered transitions, compensation"],
      ["Ledger & event data", "Double entry · Reconciliation", "OceanBase · Tair · RocketMQ", "Consistent postings and durable events"],
      ["Analytics & governed AI", "Streaming features · RAG · Evals", "Flink · Hologres · Model Studio", "Evidence-grounded diagnosis and fallback"],
      ["Security & operations", "Identity · Keys · SLO · DR", "RAM · KMS · SLS · ARMS", "Auditability, detection, recovery"],
    ],
    domainsIndex: "02 / DESIGN CONVERSATIONS",
    domainsTitle: "Nine architecture domains, one traceable decision chain.",
    domainsSub: "Use these domains to move an interview from products to requirements, trade-offs, failure modes, and acceptance evidence.",
    domains: [
      ["Global edge", "GA · WAF · ALB", "Low-latency ingress and protected APIs"],
      ["Cloud native", "ACK · ACR · Helm", "Versioned workloads and progressive delivery"],
      ["Transaction core", "State machine · Outbox", "Idempotent orchestration and ordered events"],
      ["Data plane", "OceanBase · Tair · RocketMQ", "Consistent ledger, cache, and event delivery"],
      ["Real-time risk", "Flink · Hologres", "Streaming features and sub-second analytics"],
      ["AI platform", "Model Studio · PAI-EAS", "RAG, evaluation, inference, and fallback"],
      ["Security", "RAM · KMS · ActionTrail", "Least privilege, key custody, and auditability"],
      ["Observability", "ARMS · SLS · Prometheus", "Metrics, logs, traces, SLOs, and alerts"],
      ["Continuity", "Multi-AZ · Runbooks", "RPO/RTO targets and tested recovery"],
    ],
    decisionsIndex: "03 / NON-NEGOTIABLE DECISIONS",
    decisionsTitle: "Controls that remain true in every deployment mode.",
    decisions: [
      ["Idempotent command boundary", "A client key maps one business intent to one immutable transaction result."],
      ["Explicit transaction state machine", "Only allowed transitions can move funds; retries cannot skip risk or approval gates."],
      ["Double-entry settlement", "Every completed movement posts balanced debits and credits before external reconciliation."],
      ["Transactional outbox", "Business state and event intent commit together, avoiding the database/message dual-write gap."],
      ["Evidence-bounded AI", "The investigator cites transaction, ledger, settlement, event, and runbook evidence."],
      ["Human-approved containment", "AI can recommend a pause; an authorized operator must approve the control action."],
    ],
    modesIndex: "04 / DEPLOYMENT MODES",
    modesTitle: "One domain model, three increasingly realistic environments.",
    modes: [
      ["Public sandbox", "GitHub Pages", "Static export, in-browser domain engine, local synthetic session", "Interview walkthrough and zero-cost evaluation"],
      ["Reference stack", "Docker Compose", "Next.js, Fastify, FastAPI, Prometheus, Grafana", "Local integration, API and observability demonstration"],
      ["Production target", "Alibaba Cloud", "Multi-AZ ACK plus managed data, messaging, security, and observability", "Customer POC and production planning"],
    ],
    docs: "Read architecture decisions",
    console: "Operate the control plane",
  },
  "zh-CN": {
    eyebrow: "生产参考架构",
    title: "把资金不变量与基础设施能力分开。",
    subtitle: "资金正确性由交易核心中的确定性规则保证；云服务负责在外围提供扩展、隔离、可观测性与恢复能力。",
    publicLabel: "公开实现",
    publicValue: "浏览器领域引擎 + 静态导出",
    targetLabel: "生产目标",
    targetValue: "阿里云多可用区部署",
    boundary: "下列云产品是明确的生产映射，并不表示公开 Pages 沙箱实际运行了这些托管服务。",
    flowIndex: "01 / 端到端拓扑",
    flowTitle: "六个边界清晰的层级，每次交接都有证据。",
    flowSub: "每层只承担有限职责，通过可度量契约协作，并能在故障时避免静默破坏资金状态。",
    topology: [
      ["渠道与全球接入", "Web · 移动端 · 合作方API", "GA · WAF · ALB", "入口防护、就近接入与限流"],
      ["应用与编排", "Next.js · BFF · Core API", "ACK · ACR · Helm", "版本化工作负载与渐进发布"],
      ["交易保障核心", "风控 · 状态机 · Outbox", "领域服务", "幂等、有序流转与失败补偿"],
      ["账本与事件数据", "复式记账 · 自动对账", "OceanBase · Tair · RocketMQ", "一致记账与持久事件"],
      ["分析与受控AI", "流式特征 · RAG · 评测", "Flink · Hologres · 百炼", "证据驱动诊断与确定性降级"],
      ["安全与生产运维", "身份 · 密钥 · SLO · 容灾", "RAM · KMS · SLS · ARMS", "审计、检测与恢复"],
    ],
    domainsIndex: "02 / 架构对话领域",
    domainsTitle: "九类架构领域，一条可追溯决策链。",
    domainsSub: "面试时从产品名称继续讲到需求、取舍、故障模式与验收证据。",
    domains: [
      ["全球接入", "GA · WAF · ALB", "低延迟接入与API入口防护"],
      ["云原生", "ACK · ACR · Helm", "工作负载版本化与渐进式交付"],
      ["交易核心", "状态机 · Outbox", "幂等编排与有序事件"],
      ["数据平面", "OceanBase · Tair · RocketMQ", "一致性账本、缓存与消息投递"],
      ["实时风控", "Flink · Hologres", "流式特征与亚秒分析"],
      ["AI平台", "百炼 · PAI-EAS", "RAG、评测、推理与降级"],
      ["安全治理", "RAM · KMS · ActionTrail", "最小权限、密钥托管与审计"],
      ["可观测性", "ARMS · SLS · Prometheus", "指标、日志、链路、SLO与告警"],
      ["业务连续性", "多可用区 · Runbook", "RPO/RTO与演练验证"],
    ],
    decisionsIndex: "03 / 不可妥协的设计决策",
    decisionsTitle: "在所有部署模式中都必须成立的控制。",
    decisions: [
      ["幂等命令边界", "一个客户端幂等键只对应一个业务意图和一个不可变交易结果。"],
      ["显式交易状态机", "只有允许的状态转换才能移动资金，重试不能跳过风控或审批门禁。"],
      ["复式结算记账", "每笔完成的资金移动先生成平衡借贷分录，再与外部结算进行核对。"],
      ["事务性Outbox", "业务状态与事件意图一起提交，避免数据库与消息系统的双写缺口。"],
      ["证据约束AI", "调查助手必须引用交易、账本、结算、事件及运行手册证据。"],
      ["人工批准风险隔离", "AI可以建议暂停通道，但控制操作必须由授权人员明确批准。"],
    ],
    modesIndex: "04 / 部署模式",
    modesTitle: "同一套领域模型，三个逐步逼近生产的环境。",
    modes: [
      ["公开沙箱", "GitHub Pages", "静态导出、浏览器领域引擎、本地合成会话", "面试演示与零成本评估"],
      ["参考环境", "Docker Compose", "Next.js、Fastify、FastAPI、Prometheus、Grafana", "本地集成、API及可观测性演示"],
      ["生产目标", "阿里云", "多可用区ACK及托管数据、消息、安全和可观测服务", "客户POC与生产规划"],
    ],
    docs: "阅读架构决策",
    console: "操作控制平台",
  },
} as const;

const domainIcons: LucideIcon[] = [Globe2, CloudCog, Waypoints, Database, Activity, Bot, LockKeyhole, Gauge, RefreshCw];
const topologyIcons: LucideIcon[] = [Globe2, ServerCog, GitBranch, Database, Bot, ShieldCheck];

export function ArchitecturePage() {
  const { locale } = useLocale();
  const t = copy[locale];

  return (
    <main className="content-page" data-testid="architecture-page">
      <section className="page-hero architecture-hero">
        <div><span className="page-eyebrow"><Layers3 size={15} />{t.eyebrow}</span><h1>{t.title}</h1><p>{t.subtitle}</p></div>
        <div className="architecture-boundary">
          <div><span>{t.publicLabel}</span><strong>{t.publicValue}</strong></div>
          <ArrowRight size={20} />
          <div><span>{t.targetLabel}</span><strong>{t.targetValue}</strong></div>
          <p>{t.boundary}</p>
        </div>
      </section>

      <section className="section topology-section">
        <div className="section-heading compact"><div><span className="section-index">{t.flowIndex}</span><h2>{t.flowTitle}</h2><p>{t.flowSub}</p></div></div>
        <div className="topology-stack">
          {t.topology.map(([title, implementation, cloud, outcome], index) => {
            const Icon = topologyIcons[index];
            return <article key={title}><span className="topology-number">{String(index + 1).padStart(2, "0")}</span><span className="topology-icon"><Icon size={20} /></span><div><h3>{title}</h3><p>{implementation}</p></div><code>{cloud}</code><strong>{outcome}</strong></article>;
          })}
        </div>
      </section>

      <section className="section architecture-section architecture-page-domains">
        <div className="section-heading compact"><div><span className="section-index">{t.domainsIndex}</span><h2>{t.domainsTitle}</h2><p>{t.domainsSub}</p></div></div>
        <div className="architecture-grid">
          {t.domains.map(([title, products, description], index) => {
            const Icon = domainIcons[index];
            return <article className="architecture-card" key={title}><span><Icon size={20} /></span><div><small>{products}</small><h3>{title}</h3><p>{description}</p></div><em>{String(index + 1).padStart(2, "0")}</em></article>;
          })}
        </div>
      </section>

      <section className="section decision-section">
        <div className="section-heading compact"><div><span className="section-index">{t.decisionsIndex}</span><h2>{t.decisionsTitle}</h2></div></div>
        <div className="decision-grid">{t.decisions.map(([title, description], index) => <article key={title}><span><CheckCircle2 size={17} /></span><div><small>ADR-{String(index + 1).padStart(2, "0")}</small><h3>{title}</h3><p>{description}</p></div></article>)}</div>
      </section>

      <section className="deployment-section">
        <div><span className="section-index">{t.modesIndex}</span><h2>{t.modesTitle}</h2></div>
        <div className="deployment-table">
          {t.modes.map(([mode, platform, composition, purpose]) => <article key={mode}><span>{mode}</span><strong>{platform}</strong><p>{composition}</p><em>{purpose}</em></article>)}
        </div>
        <div className="page-actions"><a className="secondary-button light" href="https://github.com/thunderxu7-sketch/fincloud-sentinel/tree/main/docs/architecture" target="_blank" rel="noreferrer">{t.docs}<ArrowRight size={16} /></a><Link className="primary-button" href="/console">{t.console}<ArrowRight size={16} /></Link></div>
      </section>
    </main>
  );
}
