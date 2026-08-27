"use client";

import {
  Activity,
  ArrowRight,
  BookOpenCheck,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
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
  Sparkles,
  Waypoints,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Locale = "en" | "zh-CN";
type ScenarioKey = "healthy" | "risk" | "ledger" | "model";

interface Scenario {
  label: Record<Locale, string>;
  severity: "Healthy" | "SEV-1" | "SEV-2" | "SEV-3";
  status: "COMPLETED" | "RISK_REVIEW" | "PAUSED" | "DEGRADED";
  timeline: Record<Locale, readonly string[]>;
  diagnosis: Record<Locale, string>;
  evidence: readonly string[];
  metrics: readonly { label: string; value: string; tone: "good" | "warn" | "bad" }[];
}

const copy = {
  en: {
    nav: ["Live scenario", "Architecture", "Evidence", "POC kit"],
    eyebrow: "OPEN FINTECH REFERENCE SOLUTION",
    title: "Make every financial decision explainable.",
    subtitle:
      "A runnable transaction assurance platform that combines deterministic money controls, real-time reconciliation, cloud-native operations, and a human-approved AI copilot.",
    runDemo: "Run an incident",
    viewArchitecture: "Inspect architecture",
    proof: "Reference implementation · Synthetic data only · No real funds",
    kpis: ["Idempotency coverage", "Ledger invariant", "Agent citations", "Unsafe auto-actions"],
    scenarioTitle: "Incident command center",
    scenarioSubtitle: "Run one of four deterministic scenarios. Every conclusion is linked to evidence.",
    selectScenario: "Scenario",
    run: "Run scenario",
    running: "Running controls",
    eventStream: "Control timeline",
    copilot: "Evidence-grounded copilot",
    confidence: "confidence",
    evidence: "Evidence",
    proposed: "Proposed control",
    approval: "Human approval required",
    actionHealthy: "Continue observation",
    actionPause: "Pause affected route and preserve evidence",
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
    nav: ["场景演示", "解决方案架构", "验证证据", "POC材料"],
    eyebrow: "开放的金融科技参考方案",
    title: "让每一次金融决策都有依据。",
    subtitle:
      "一个可运行的交易保障平台，将确定性资金控制、实时对账、云原生运维与需人工审批的 AI Copilot 组合成完整闭环。",
    runDemo: "运行事故场景",
    viewArchitecture: "查看解决方案",
    proof: "参考实现 · 仅使用合成数据 · 不涉及真实资金",
    kpis: ["幂等覆盖率", "账本平衡率", "Agent引用率", "未授权自动操作"],
    scenarioTitle: "金融事故指挥台",
    scenarioSubtitle: "运行四个确定性场景之一；每一条结论都可追溯到运行证据。",
    selectScenario: "选择场景",
    run: "运行场景",
    running: "正在执行控制链",
    eventStream: "控制时间线",
    copilot: "证据驱动的 AI Copilot",
    confidence: "置信度",
    evidence: "引用证据",
    proposed: "建议控制措施",
    approval: "必须人工审批",
    actionHealthy: "继续观察",
    actionPause: "暂停受影响通道并保存证据",
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

const scenarios: Record<ScenarioKey, Scenario> = {
  healthy: {
    label: { en: "Healthy withdrawal", "zh-CN": "正常提现" },
    severity: "Healthy",
    status: "COMPLETED",
    timeline: {
      en: ["Request accepted", "Risk policy allowed", "Settlement broadcast", "12 confirmations observed", "Ledger reconciled"],
      "zh-CN": ["请求已接收", "风控策略放行", "交易已广播", "已达到12次确认", "账本对账完成"],
    },
    diagnosis: {
      en: "All transaction, ledger, and external settlement invariants are satisfied.",
      "zh-CN": "交易、内部账本与外部结算的全部一致性约束均已满足。",
    },
    evidence: ["transaction-version=6", "ledger debit=credit", "confirmations=12"],
    metrics: [
      { label: "API p95", value: "84 ms", tone: "good" },
      { label: "Queue lag", value: "0", tone: "good" },
      { label: "Mismatch", value: "0", tone: "good" },
    ],
  },
  risk: {
    label: { en: "High-risk destination", "zh-CN": "高风险地址" },
    severity: "SEV-3",
    status: "RISK_REVIEW",
    timeline: {
      en: ["Request accepted", "Velocity threshold breached", "New destination detected", "Settlement held", "Reviewer notified"],
      "zh-CN": ["请求已接收", "触发频率阈值", "识别到新地址", "结算已挂起", "已通知审核人员"],
    },
    diagnosis: {
      en: "The request combines abnormal velocity with a new destination. It must remain in review; no funds have moved.",
      "zh-CN": "本次请求同时存在异常频率和新地址信号，必须停留在人工审核阶段；资金尚未移动。",
    },
    evidence: ["velocity=11/hour", "destination_age=0d", "ledger_entries=0"],
    metrics: [
      { label: "Risk score", value: "75", tone: "warn" },
      { label: "Funds moved", value: "0", tone: "good" },
      { label: "Review SLA", value: "4m 12s", tone: "good" },
    ],
  },
  ledger: {
    label: { en: "Ledger mismatch", "zh-CN": "账本不一致" },
    severity: "SEV-1",
    status: "PAUSED",
    timeline: {
      en: ["Reconciliation started", "Amount mismatch found", "Asset route paused", "Evidence preserved", "Two-person review opened"],
      "zh-CN": ["开始执行对账", "发现结算金额不一致", "资产通道已暂停", "证据已留存", "已发起双人复核"],
    },
    diagnosis: {
      en: "The external amount differs from the immutable double-entry ledger. Contain first, preserve evidence, and reconcile by business ID.",
      "zh-CN": "外部结算金额与不可变复式账本不一致。应先隔离风险、保存证据，再按业务唯一号核对。",
    },
    evidence: ["runbook: ledger-reconciliation.md", "mismatch_total=1", "unmatched_value=2,500 USDT"],
    metrics: [
      { label: "Mismatch", value: "1", tone: "bad" },
      { label: "Exposure", value: "2,500 USDT", tone: "bad" },
      { label: "Route", value: "PAUSED", tone: "warn" },
    ],
  },
  model: {
    label: { en: "Risk model timeout", "zh-CN": "风控模型超时" },
    severity: "SEV-2",
    status: "DEGRADED",
    timeline: {
      en: ["Inference budget breached", "Circuit breaker opened", "Rules fallback enabled", "High risk moved to review", "Canary requested"],
      "zh-CN": ["推理延迟超出预算", "熔断器已开启", "规则降级已启用", "高风险请求转人工", "已申请灰度验证"],
    },
    diagnosis: {
      en: "PAI-EAS latency breached policy. The system failed closed and activated versioned deterministic rules.",
      "zh-CN": "PAI-EAS推理延迟超过策略预算；系统已采用失败关闭策略，并启用版本化确定性规则。",
    },
    evidence: ["model p95=4,350ms", "timeout_rate=22%", "fallback_rule_total=91"],
    metrics: [
      { label: "Model p95", value: "4.35 s", tone: "bad" },
      { label: "Fallback", value: "ACTIVE", tone: "warn" },
      { label: "False allow", value: "0", tone: "good" },
    ],
  },
};

const metricValues = ["100%", "100%", "100%", "0"];

const layerIcons = [Globe2, CloudCog, Waypoints, Database, Activity, Bot, LockKeyhole, Gauge, RefreshCw];
const evidenceIcons = [CircleDollarSign, SearchCheck, ServerCog, FileCheck2];

export function SentinelConsole() {
  const [locale, setLocale] = useState<Locale>("zh-CN");
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("ledger");
  const [runNonce, setRunNonce] = useState(0);
  const [progress, setProgress] = useState(5);
  const [running, setRunning] = useState(false);
  const t = copy[locale];
  const scenario = scenarios[scenarioKey];

  useEffect(() => {
    if (runNonce === 0) return;
    const timers = scenario.timeline[locale].map((_, index) =>
      window.setTimeout(() => {
        setProgress(index + 1);
        if (index === scenario.timeline[locale].length - 1) setRunning(false);
      }, 360 * (index + 1)),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [locale, runNonce, scenario.timeline]);

  const completion = useMemo(
    () => Math.round((progress / scenario.timeline[locale].length) * 100),
    [locale, progress, scenario.timeline],
  );

  const startScenario = () => {
    setProgress(0);
    setRunning(true);
    setRunNonce((value) => value + 1);
  };

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

      <section className="kpi-strip" aria-label="Solution targets">
        {t.kpis.map((label, index) => (
          <div className="kpi" key={label}>
            <span>{label}</span><strong>{metricValues[index]}</strong>
            <div className="kpi-bar"><i style={{ width: index === 3 ? "4%" : "100%" }} /></div>
          </div>
        ))}
      </section>

      <section className="section scenario-section" id="scenario">
        <div className="section-heading">
          <div><span className="section-index">01 / LIVE CONTROL</span><h2>{t.scenarioTitle}</h2><p>{t.scenarioSubtitle}</p></div>
          <div className="scenario-control">
            <label htmlFor="scenario-select">{t.selectScenario}</label>
            <div className="select-wrap">
              <select id="scenario-select" value={scenarioKey} onChange={(event) => { setScenarioKey(event.target.value as ScenarioKey); setProgress(5); }}>
                {(Object.keys(scenarios) as ScenarioKey[]).map((key) => <option key={key} value={key}>{scenarios[key].label[locale]}</option>)}
              </select>
              <ChevronDown size={16} />
            </div>
            <button type="button" className="run-button" onClick={startScenario} disabled={running}>
              {running ? <RefreshCw size={16} className="spin" /> : <Play size={16} fill="currentColor" />}
              {running ? t.running : t.run}
            </button>
          </div>
        </div>

        <div className="command-grid">
          <article className="panel event-panel">
            <div className="panel-header">
              <div><span className={`severity severity-${scenario.severity.toLowerCase().replace("-", "")}`}>{scenario.severity}</span><strong>{scenario.label[locale]}</strong></div>
              <span className="status-badge">{scenario.status}</span>
            </div>
            <div className="progress-track"><i style={{ width: `${completion}%` }} /></div>
            <div className="timeline">
              {scenario.timeline[locale].map((item, index) => {
                const done = index < progress;
                return (
                  <div className={`timeline-item ${done ? "done" : ""}`} key={item}>
                    <span className="timeline-icon">{done ? <Check size={14} /> : index + 1}</span>
                    <div><strong>{item}</strong><small>{done ? `T+${(index * 1.7).toFixed(1)}s` : "—"}</small></div>
                  </div>
                );
              })}
            </div>
            <div className="scenario-metrics">
              {scenario.metrics.map((metric) => <div key={metric.label}><span>{metric.label}</span><strong className={`tone-${metric.tone}`}>{metric.value}</strong></div>)}
            </div>
          </article>

          <article className="panel copilot-panel">
            <div className="copilot-title"><span><Sparkles size={17} /></span><div><small>FINCLOUD AI</small><strong>{t.copilot}</strong></div><em>0.92 {t.confidence}</em></div>
            <div className="diagnosis"><span>DIAGNOSIS</span><p>{scenario.diagnosis[locale]}</p></div>
            <div className="evidence-list"><span>{t.evidence}</span>{scenario.evidence.map((item) => <div key={item}><BookOpenCheck size={14} /><code>{item}</code></div>)}</div>
            <div className="proposed-action">
              <div><span>{t.proposed}</span><strong>{scenarioKey === "healthy" ? t.actionHealthy : t.actionPause}</strong></div>
              <div className="approval-pill"><LockKeyhole size={13} />{t.approval}</div>
            </div>
          </article>
        </div>
      </section>

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
