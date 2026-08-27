"use client";

import {
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  CloudCog,
  Database,
  FileCheck2,
  Fingerprint,
  Gauge,
  LockKeyhole,
  Network,
  Play,
  SearchCheck,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "./locale-provider";

const copy = {
  en: {
    eyebrow: "OPEN FINTECH REFERENCE SOLUTION",
    title: "Make every financial decision explainable.",
    subtitle: "A runnable transaction assurance platform with a dedicated control plane, production architecture, and versioned operating runbooks.",
    openConsole: "Open control plane",
    inspectArchitecture: "Inspect architecture",
    proof: "Reference implementation · Synthetic data only · No real funds",
    metrics: [["Automated checks", "20"], ["Browser workflows", "4 E2E"], ["Architecture domains", "9"], ["Versioned runbooks", "7"]],
    surfaceIndex: "01 / PRODUCT SURFACES",
    surfaceTitle: "One entry point, three dedicated work surfaces.",
    surfaceSub: "The marketing story, operator workflow, architecture decisions, and incident procedures now live on separate routes with clear responsibilities.",
    surfaces: [
      ["CONTROL PLANE", "Operate transactions", "Submit, review, settle, reconcile, inject failures, investigate evidence, and approve containment.", "Open console", "/console"],
      ["SOLUTION DESIGN", "Explain the architecture", "Walk from global ingress to the transaction core, data plane, AI governance, and continuity controls.", "View architecture", "/architecture"],
      ["OPERATIONS", "Execute runbooks", "Use explicit triggers, first actions, evidence requirements, rollback gates, and escalation paths.", "Browse runbooks", "/runbooks"],
    ],
    evidenceIndex: "02 / VERIFIABLE EVIDENCE",
    evidenceTitle: "Built to withstand the second question.",
    evidenceSub: "The repository stores executable controls and operating evidence behind the diagram—not just a polished UI.",
    evidenceCards: [
      ["Financial integrity", "Integer money, double-entry settlement, immutable identifiers, reconciliation, and failure compensation."],
      ["AI governance", "Grounded citations, deterministic fallback, tool boundaries, and explicit human approval."],
      ["Production readiness", "OpenTelemetry, SLOs, containers, Helm, Terraform, security scans, and rollback procedures."],
      ["Solution practice", "Discovery, NFRs, POC scorecards, RFP response, TCO model, and executive proposal."],
    ],
    guidesIndex: "03 / INTERVIEW EXPLAINERS",
    guidesTitle: "Five capabilities, explained without the jargon.",
    guidesSub: "Each standalone guide starts with a familiar analogy, then connects the concept to implementation evidence, follow-up questions, and a 90-second interview answer.",
    guideItems: [
      ["01", "Financial transactions", "Idempotency, state machines, double-entry accounting, reconciliation, and risk control.", "guides/01-financial-transaction.html"],
      ["02", "Cloud architecture", "Containers, Kubernetes, Helm, Terraform, observability, and disaster recovery.", "guides/02-cloud-architecture.html"],
      ["03", "AI delivery", "RAG, redaction, guardrails, evaluation, and explicit human approval.", "guides/03-ai-delivery.html"],
      ["04", "Presales delivery", "Discovery, solution selection, POC, RFP, TCO/ROI, and delivery planning.", "guides/04-presales-delivery.html"],
      ["05", "Engineering evidence", "Tests, CI, CodeQL, Trivy, public code, and an online demonstration.", "guides/05-engineering-evidence.html"],
    ],
    openGuide: "Read explainer",
    openAllGuides: "Open the complete guide",
    packIndex: "04 / PRESALES EVIDENCE PACK",
    packTitle: "From discovery to a measurable decision.",
    packSub: "Architecture alone is not a solution engagement. The project includes the artifacts needed to qualify, prove, secure, cost, and hand over the platform.",
    packItems: ["Discovery and NFRs", "POC acceptance scorecard", "Security and compliance", "DR and continuity", "TCO and ROI", "Deployment handover"],
    openPack: "Open repository evidence",
  },
  "zh-CN": {
    eyebrow: "开放的金融科技参考方案",
    title: "让每一次金融决策都有依据。",
    subtitle: "一个可运行的交易保障平台，具备独立控制平台、生产参考架构和版本化运行手册。",
    openConsole: "打开控制平台",
    inspectArchitecture: "查看解决方案架构",
    proof: "参考实现 · 仅使用合成数据 · 不涉及真实资金",
    metrics: [["自动化检查", "20"], ["浏览器流程", "4 E2E"], ["架构领域", "9"], ["版本化手册", "7"]],
    surfaceIndex: "01 / 产品功能面",
    surfaceTitle: "一个入口，三个职责清晰的工作面。",
    surfaceSub: "产品介绍、操作工作流、架构决策与事故处置已拆分到独立路由，不再混在一张长页面中。",
    surfaces: [
      ["控制平台", "操作交易闭环", "提交、审核、结算、对账、故障注入、证据调查以及人工批准风险隔离。", "进入控制平台", "/console"],
      ["解决方案设计", "讲清生产架构", "从全球接入讲到交易核心、数据平面、AI治理、安全与业务连续性。", "查看架构", "/architecture"],
      ["生产运维", "执行运行手册", "明确触发条件、第一操作、证据要求、回滚门禁以及升级路径。", "浏览运行手册", "/runbooks"],
    ],
    evidenceIndex: "02 / 可验证证据",
    evidenceTitle: "经得住面试官的第二次追问。",
    evidenceSub: "仓库保存架构图背后的可执行控制和运行证据，而不只是一套好看的界面。",
    evidenceCards: [
      ["资金正确性", "整数金额、复式记账、不可变业务编号、自动对账与失败补偿。"],
      ["AI治理", "可追溯引用、确定性降级、工具边界与显式人工审批。"],
      ["生产准备", "OpenTelemetry、SLO、容器、Helm、Terraform、安全扫描与回滚流程。"],
      ["售前实践", "需求访谈、NFR、POC计分卡、RFP应答、TCO模型与高层方案。"],
    ],
    guidesIndex: "03 / 面试通俗讲解",
    guidesTitle: "五项能力，不堆名词也能讲清楚。",
    guidesSub: "每篇独立 HTML 都从生活类比出发，再连到实现证据、高频追问与 90 秒面试口述稿。",
    guideItems: [
      ["01", "金融交易", "幂等、状态机、复式记账、对账与风险控制。", "guides/01-financial-transaction.html"],
      ["02", "云架构", "容器、Kubernetes、Helm、Terraform、监控与灾备。", "guides/02-cloud-architecture.html"],
      ["03", "AI 落地", "RAG、数据脱敏、Guardrails、评测与人工确认。", "guides/03-ai-delivery.html"],
      ["04", "售前能力", "需求调研、方案选型、POC、RFP、TCO/ROI 与交付规划。", "guides/04-presales-delivery.html"],
      ["05", "工程能力", "测试、CI、CodeQL、Trivy、公开代码与在线演示。", "guides/05-engineering-evidence.html"],
    ],
    openGuide: "阅读讲解",
    openAllGuides: "打开完整手册",
    packIndex: "04 / 售前证据包",
    packTitle: "从需求发现走到可衡量的生产决策。",
    packSub: "只有架构图还不算解决方案。本项目同时提供需求澄清、验证、安全、成本分析和交付所需材料。",
    packItems: ["需求访谈与NFR", "POC验收计分卡", "安全与合规", "容灾与业务连续性", "TCO与ROI", "部署交接"],
    openPack: "打开仓库证据包",
  },
} as const;

const surfaceIcons: LucideIcon[] = [CircleDollarSign, CloudCog, FileCheck2];
const evidenceIcons: LucideIcon[] = [Database, SearchCheck, Gauge, CheckCircle2];
const guideIcons: LucideIcon[] = [CircleDollarSign, CloudCog, Bot, FileCheck2, SearchCheck];

export function LandingPage() {
  const { locale } = useLocale();
  const t = copy[locale];

  return (
    <main data-testid="landing-page">
      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span />{t.eyebrow}</div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/console"><Play size={17} fill="currentColor" />{t.openConsole}</Link>
            <Link className="secondary-button" href="/architecture">{t.inspectArchitecture}<ArrowRight size={17} /></Link>
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

      <section className="platform-metrics" aria-label="Project verification metrics">
        {t.metrics.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </section>

      <section className="section surface-section">
        <div className="section-heading compact"><div><span className="section-index">{t.surfaceIndex}</span><h2>{t.surfaceTitle}</h2><p>{t.surfaceSub}</p></div></div>
        <div className="surface-grid">
          {t.surfaces.map(([eyebrow, title, description, action, href], index) => {
            const Icon = surfaceIcons[index];
            return (
              <Link className="surface-card" href={href} key={href}>
                <span className="surface-icon"><Icon size={22} /></span>
                <small>{eyebrow}</small><h3>{title}</h3><p>{description}</p>
                <strong>{action}<ArrowRight size={16} /></strong>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section evidence-section home-evidence">
        <div className="section-heading compact"><div><span className="section-index">{t.evidenceIndex}</span><h2>{t.evidenceTitle}</h2><p>{t.evidenceSub}</p></div></div>
        <div className="evidence-grid">
          {t.evidenceCards.map(([title, description], index) => {
            const Icon = evidenceIcons[index];
            return <article key={title}><span><Icon size={22} /></span><h3>{title}</h3><p>{description}</p><div className="evidence-check"><CheckCircle2 size={15} /> VERIFIED IN REPOSITORY</div></article>;
          })}
        </div>
      </section>

      <section className="section interview-guides">
        <div className="section-heading compact"><div><span className="section-index">{t.guidesIndex}</span><h2>{t.guidesTitle}</h2><p>{t.guidesSub}</p></div><a className="secondary-button" href="guides/index.html">{t.openAllGuides}<ArrowRight size={17} /></a></div>
        <div className="guide-link-grid">
          {t.guideItems.map(([number, title, description, href], index) => {
            const Icon = guideIcons[index];
            return (
              <a className="guide-link-card" href={href} key={href}>
                <div><span>{number}</span><Icon size={20} /></div>
                <h3>{title}</h3><p>{description}</p>
                <strong>{t.openGuide}<ArrowRight size={15} /></strong>
              </a>
            );
          })}
        </div>
      </section>

      <section className="home-pack">
        <div><span className="section-index">{t.packIndex}</span><h2>{t.packTitle}</h2><p>{t.packSub}</p><a className="secondary-button light" href="https://github.com/thunderxu7-sketch/fincloud-sentinel/tree/main/docs/presales" target="_blank" rel="noreferrer">{t.openPack}<ArrowRight size={17} /></a></div>
        <div className="pack-grid">{t.packItems.map((item, index) => <span key={item}><em>{String(index + 1).padStart(2, "0")}</em>{item}<CheckCircle2 size={16} /></span>)}</div>
      </section>
    </main>
  );
}
