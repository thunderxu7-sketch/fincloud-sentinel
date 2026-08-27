"use client";

import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  CloudCog,
  Code2,
  Database,
  FileCheck2,
  Fingerprint,
  Gauge,
  Globe2,
  Languages,
  LockKeyhole,
  Network,
  Play,
  RefreshCw,
  SearchCheck,
  ServerCog,
  ShieldAlert,
  Waypoints,
} from "lucide-react";
import { useState } from "react";
import { OperationsLab } from "./operations-lab";

type Locale = "en" | "zh-CN";

const copy = {
  en: {
    nav: ["Operations lab", "Architecture", "Evidence", "POC kit"],
    eyebrow: "OPEN FINTECH REFERENCE SOLUTION",
    title: "Make every financial decision explainable.",
    subtitle:
      "A runnable transaction assurance platform that combines deterministic money controls, real-time reconciliation, cloud-native operations, and a human-approved AI copilot.",
    runDemo: "Open the operations lab",
    viewArchitecture: "Inspect architecture",
    proof: "Reference implementation · Synthetic data only · No real funds",
    architecture: "One solution, nine architecture conversations",
    architectureSub:
      "The implementation runs locally; the production reference maps each concern to an Alibaba Cloud capability without forcing unnecessary services into the POC.",
    layers: [
      ["Global edge", "GA · WAF · ALB", "Low-latency ingress and protected APIs"],
      ["Cloud native", "ACK · ACR · Helm", "Versioned workloads and progressive delivery"],
      ["Transaction core", "State machine · Outbox", "Idempotent orchestration and ordered events"],
      ["Data plane", "OceanBase · Tair · RocketMQ", "Consistent ledger, cache, and event delivery"],
      ["Real-time risk", "Flink · Hologres", "Streaming features and sub-second analytics"],
      ["AI platform", "Model Studio · PAI-EAS", "RAG, evaluation, inference, and fallback"],
      ["Security", "RAM · KMS · ActionTrail", "Least privilege, key custody, and auditability"],
      ["Observability", "ARMS · SLS · Prometheus", "Metrics, logs, traces, SLOs, and alerts"],
      ["Continuity", "Multi-AZ · runbooks", "RPO/RTO targets and tested recovery"],
    ],
    evidenceTitle: "Built to withstand the second question",
    evidenceSub:
      "The repository stores the decisions, tests, and operating evidence behind the diagram—not just a polished UI.",
    evidenceCards: [
      ["Financial integrity", "Integer money, double-entry settlement, immutable identifiers, reconciliation, and failure compensation."],
      ["AI governance", "Grounded citations, prompt-injection detection, secret redaction, tool allowlists, and human approval."],
      ["Production readiness", "OpenTelemetry, SLOs, load tests, chaos scenarios, multi-AZ design, and rollback runbooks."],
      ["Solution practice", "Discovery guide, POC scorecard, RFP response, TCO model, cloud comparison, and executive proposal."],
    ],
    pocTitle: "A complete presales evidence pack",
    pocSub: "Everything needed to take the conversation from discovery to a measurable production decision.",
    openPack: "Open the evidence pack",
    tested: "TESTED & DOCUMENTED",
    docs: [
      "Customer discovery questionnaire",
      "Business requirements and NFRs",
      "Bilingual executive proposal",
      "High-level architecture and ADRs",
      "Product selection and configuration",
      "POC plan and acceptance scorecard",
      "Security threat model",
      "DR and business continuity plan",
      "Cost, TCO, and ROI model",
      "AWS/Azure competitive comparison",
      "RFP response template",
      "Deployment and incident runbooks",
    ],
    footer: "Designed as an interview-ready, production-minded reference—not a production financial service.",
  },
  "zh-CN": {
    nav: ["交易实验台", "解决方案架构", "验证证据", "POC材料"],
    eyebrow: "开放的金融科技参考方案",
    title: "让每一次金融决策都有依据。",
    subtitle:
      "一个可运行的交易保障平台，将确定性资金控制、实时对账、云原生运维与需人工审批的 AI Copilot 组合成完整闭环。",
    runDemo: "打开交易实验台",
    viewArchitecture: "查看解决方案",
    proof: "参考实现 · 仅使用合成数据 · 不涉及真实资金",
    architecture: "一个项目，覆盖九类架构对话",
    architectureSub:
      "实现可在本地完整运行；生产参考架构按需映射阿里云能力，而不是为了堆产品把所有服务塞进POC。",
    layers: [
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
    evidenceTitle: "经得住面试官的第二次追问",
    evidenceSub: "仓库不仅有漂亮页面，还保存架构图背后的决策、测试与运行证据。",
    evidenceCards: [
      ["资金正确性", "整数金额、复式记账、不可变业务号、自动对账与失败补偿。"],
      ["AI治理", "可追溯引用、提示注入检测、敏感信息脱敏、工具白名单与人工审批。"],
      ["生产准备", "OpenTelemetry、SLO、压测、故障注入、多可用区方案与回滚手册。"],
      ["售前实践", "需求访谈、POC计分卡、RFP应答、TCO模型、竞品分析与高层方案。"],
    ],
    pocTitle: "完整售前证据包",
    pocSub: "从客户需求发现到生产决策，提供可以衡量、验证和复用的全部材料。",
    openPack: "打开售前证据包",
    tested: "已测试并形成文档",
    docs: [
      "客户需求访谈问卷",
      "业务需求与非功能指标",
      "中英文高层方案书",
      "高阶架构与架构决策记录",
      "产品选型与配置策略",
      "POC计划与验收计分卡",
      "安全威胁模型",
      "容灾与业务连续性方案",
      "成本、TCO与ROI模型",
      "AWS/Azure竞争对比",
      "RFP技术应答模板",
      "部署与事故运行手册",
    ],
    footer: "面向技术面试与生产决策的参考实现，不是实际金融生产系统。",
  },
} as const;

const layerIcons = [Globe2, CloudCog, Waypoints, Database, Activity, Bot, LockKeyhole, Gauge, RefreshCw];
const evidenceIcons = [CircleDollarSign, SearchCheck, ServerCog, FileCheck2];

export function SentinelConsole() {
  const [locale, setLocale] = useState<Locale>("zh-CN");
  const t = copy[locale];

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="FinCloud Sentinel home">
          <span className="brand-mark"><Fingerprint size={20} /></span>
          <span>FinCloud <strong>Sentinel</strong></span>
        </a>
        <nav aria-label="Primary navigation">
          {t.nav.map((item, index) => (
            <a key={item} href={`#${["scenario", "architecture", "evidence", "poc"][index]}`}>{item}</a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="language-button"
            type="button"
            onClick={() => setLocale(locale === "en" ? "zh-CN" : "en")}
            aria-label="Switch language"
          >
            <Languages size={16} /> {locale === "en" ? "中文" : "EN"}
          </button>
          <a className="github-button" href="https://github.com/thunderxu7-sketch/fincloud-sentinel" target="_blank" rel="noreferrer">
            <Code2 size={17} /> GitHub
          </a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span />{t.eyebrow}</div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <div className="hero-actions">
            <a className="primary-button" href="#scenario"><Play size={17} fill="currentColor" />{t.runDemo}</a>
            <a className="secondary-button" href="#architecture">{t.viewArchitecture}<ArrowRight size={17} /></a>
          </div>
          <div className="proof-line"><ShieldAlert size={15} />{t.proof}</div>
        </div>
        <div className="hero-visual" aria-label="Transaction assurance layers">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="core-sphere"><Fingerprint size={34} /><span>TRUST<br />CORE</span></div>
          <div className="floating-node node-one"><Network size={17} /><span>EVENTS</span><strong>ORDERED</strong></div>
          <div className="floating-node node-two"><Database size={17} /><span>LEDGER</span><strong>BALANCED</strong></div>
          <div className="floating-node node-three"><Bot size={17} /><span>AI ACTION</span><strong>APPROVED</strong></div>
          <div className="floating-node node-four"><LockKeyhole size={17} /><span>RISK</span><strong>CONTAINED</strong></div>
        </div>
      </section>

      <OperationsLab locale={locale} />

      <section className="section architecture-section" id="architecture">
        <div className="section-heading compact"><div><span className="section-index">02 / CLOUD DESIGN</span><h2>{t.architecture}</h2><p>{t.architectureSub}</p></div></div>
        <div className="architecture-grid">
          {t.layers.map(([title, products, description], index) => {
            const Icon = layerIcons[index];
            return <article className="architecture-card" key={title}><span><Icon size={20} /></span><div><small>{products}</small><h3>{title}</h3><p>{description}</p></div><em>{String(index + 1).padStart(2, "0")}</em></article>;
          })}
        </div>
      </section>

      <section className="section evidence-section" id="evidence">
        <div className="section-heading compact"><div><span className="section-index">03 / VERIFIABLE EVIDENCE</span><h2>{t.evidenceTitle}</h2><p>{t.evidenceSub}</p></div></div>
        <div className="evidence-grid">
          {t.evidenceCards.map(([title, description], index) => {
            const Icon = evidenceIcons[index];
            return <article key={title}><span><Icon size={22} /></span><h3>{title}</h3><p>{description}</p><div className="evidence-check"><CheckCircle2 size={15} /> {t.tested}</div></article>;
          })}
        </div>
      </section>

      <section className="section poc-section" id="poc">
        <div className="poc-copy"><span className="section-index">04 / PRESALES KIT</span><h2>{t.pocTitle}</h2><p>{t.pocSub}</p><a className="secondary-button light" href="https://github.com/thunderxu7-sketch/fincloud-sentinel/tree/main/docs/presales" target="_blank" rel="noreferrer">{t.openPack}<ArrowRight size={17} /></a></div>
        <div className="document-grid">{t.docs.map((doc, index) => <div key={doc}><span>{String(index + 1).padStart(2, "0")}</span><p>{doc}</p><CheckCircle2 size={17} /></div>)}</div>
      </section>

      <footer><div className="brand"><span className="brand-mark"><Fingerprint size={18} /></span><span>FinCloud <strong>Sentinel</strong></span></div><p>{t.footer}</p><a href="https://github.com/thunderxu7-sketch/fincloud-sentinel" target="_blank" rel="noreferrer"><Code2 size={16} /> Apache-2.0</a></footer>
    </main>
  );
}
