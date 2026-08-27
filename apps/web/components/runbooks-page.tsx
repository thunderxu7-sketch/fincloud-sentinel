"use client";

import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  ClipboardCheck,
  CloudOff,
  Database,
  Gauge,
  GitCompareArrows,
  History,
  RefreshCcw,
  ShieldAlert,
  Siren,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "./locale-provider";

const repository = "https://github.com/thunderxu7-sketch/fincloud-sentinel/blob/main/docs/runbooks";

const copy = {
  en: {
    eyebrow: "OPERATIONS / VERSIONED PROCEDURES",
    title: "Incidents are handled by procedure, not improvisation.",
    subtitle: "Each runbook defines the trigger, first safe action, evidence to preserve, decision owner, rollback gate, and recovery verification.",
    commandTitle: "Incident command loop",
    commandSub: "A common operating rhythm keeps financial incidents controlled even when the underlying failure differs.",
    phases: [
      ["Detect", "SLO, reconciliation, security, or model alert creates an immutable incident ID."],
      ["Triage", "Classify blast radius, affected assets, customer impact, and evidence gaps."],
      ["Contain", "Apply the smallest reversible control; money-moving actions require approval."],
      ["Recover", "Restore service behind explicit health and reconciliation gates."],
      ["Learn", "Preserve a timeline, root cause, control gap, and owned follow-up actions."],
    ],
    libraryIndex: "01 / RUNBOOK LIBRARY",
    libraryTitle: "Seven procedures aligned to the control plane.",
    librarySub: "The public console exercises the same concepts: transaction state, ledger balance, settlement evidence, reconciliation, and approved containment.",
    labels: { trigger: "TRIGGER", action: "FIRST SAFE ACTION", evidence: "REQUIRED EVIDENCE", open: "Open full procedure" },
    runbooks: [
      ["SEV-1", "Incident response", "Customer-impacting transaction failure or integrity signal", "Declare incident, freeze the timeline, assign commander and finance owner", "Incident ID, affected transaction IDs, alerts, logs, traces", "incident-response.md"],
      ["SEV-1", "Ledger reconciliation", "Mismatch, missing settlement, low finality, or unbalanced postings", "Pause the narrow asset route and preserve both internal and external records", "Run ID, ledger entries, settlement proof, issue code", "ledger-reconciliation.md"],
      ["SEV-1", "Disaster recovery", "Region or primary data service cannot meet the recovery objective", "Fence the failed writer before promoting the recovery environment", "RPO/RTO timestamps, replication state, reconciliation result", "disaster-recovery.md"],
      ["SEV-2", "Deployment rollback", "Error budget burn or critical regression after release", "Stop rollout and restore the last verified artifact without schema reversal", "Release SHA, metrics delta, migration state, rollback checks", "deployment-rollback.md"],
      ["SEV-2", "Model degradation", "Grounding, latency, safety, or evaluation threshold breached", "Disable AI actions and fall back to deterministic read-only diagnosis", "Model version, eval set, citations, latency and guardrail output", "model-degradation.md"],
      ["GAME DAY", "Chaos validation", "Scheduled resilience exercise with an approved hypothesis", "Confirm abort conditions, observers, synthetic scope, and rollback path", "Hypothesis, injected fault, SLO response, recovery timeline", "chaos-game-day.md"],
      ["CATALOG", "SLO alert catalog", "Any defined availability, latency, integrity, or AI quality threshold", "Route to the owning service and linked runbook using burn-rate severity", "Alert labels, dashboard window, trace or transaction sample", "slo-alert-catalog.md"],
    ],
    matrixIndex: "02 / CONTROL MATRIX",
    matrixTitle: "Know which signal opens which procedure.",
    matrix: [
      ["Ledger mismatch", "Financial integrity", "SEV-1", "Reconciliation"],
      ["Settlement confirmation lag", "External finality", "SEV-2 → SEV-1", "Reconciliation"],
      ["API error-budget burn", "Availability", "SEV-2", "Incident / rollback"],
      ["Region unavailable", "Continuity", "SEV-1", "Disaster recovery"],
      ["AI groundedness regression", "AI governance", "SEV-2", "Model degradation"],
    ],
    headers: ["Signal", "Control domain", "Severity", "Procedure"],
    repository: "Open the complete runbook library",
    console: "Practice in the control plane",
  },
  "zh-CN": {
    eyebrow: "生产运维 / 版本化流程",
    title: "事故依靠流程处置，而不是现场发挥。",
    subtitle: "每份运行手册都明确触发条件、第一安全操作、证据留存、决策负责人、回滚门禁与恢复验证。",
    commandTitle: "事故指挥闭环",
    commandSub: "无论底层故障如何变化，都使用统一节奏控制金融事故。",
    phases: [
      ["发现", "SLO、对账、安全或模型告警创建不可变事故编号。"],
      ["研判", "确认影响范围、相关资产、客户影响与证据缺口。"],
      ["隔离", "应用最小且可逆的控制；涉及资金移动的操作必须审批。"],
      ["恢复", "通过明确的健康检查和对账门禁后恢复服务。"],
      ["复盘", "保存时间线、根因、控制缺口以及有负责人的后续行动。"],
    ],
    libraryIndex: "01 / 运行手册库",
    libraryTitle: "七份流程，与控制平台逐项对应。",
    librarySub: "公开控制平台实际演示相同概念：交易状态、账本平衡、外部结算证据、对账与审批后风险隔离。",
    labels: { trigger: "触发条件", action: "第一安全操作", evidence: "必须保留的证据", open: "打开完整流程" },
    runbooks: [
      ["SEV-1", "事故响应", "影响客户的交易故障或资金完整性信号", "宣布事故、冻结时间线，并指定指挥官和资金负责人", "事故编号、相关交易编号、告警、日志与链路", "incident-response.md"],
      ["SEV-1", "账本对账", "金额不一致、结算缺失、确认不足或分录不平衡", "暂停最小范围资产通道，并保存内部与外部双方记录", "运行编号、账本分录、结算证明与问题代码", "ledger-reconciliation.md"],
      ["SEV-1", "灾难恢复", "区域或主数据服务无法满足恢复目标", "先隔离失效写入端，再提升恢复环境", "RPO/RTO时间点、复制状态与对账结果", "disaster-recovery.md"],
      ["SEV-2", "发布回滚", "发布后错误预算燃烧或出现严重回归", "停止发布并恢复最后验证版本，不盲目反向执行Schema", "发布SHA、指标变化、迁移状态与回滚检查", "deployment-rollback.md"],
      ["SEV-2", "模型降级", "引用完整性、时延、安全或评测阈值不达标", "关闭AI控制操作，降级为确定性的只读诊断", "模型版本、评测集、引用、时延及护栏输出", "model-degradation.md"],
      ["演练", "混沌验证", "带审批假设的计划内韧性演练", "确认终止条件、观察人、合成数据范围与回滚路径", "演练假设、注入故障、SLO响应与恢复时间线", "chaos-game-day.md"],
      ["目录", "SLO告警目录", "任何已定义的可用性、时延、完整性或AI质量阈值", "根据燃烧率严重级别路由到负责服务和关联手册", "告警标签、仪表盘窗口、链路或交易样本", "slo-alert-catalog.md"],
    ],
    matrixIndex: "02 / 控制矩阵",
    matrixTitle: "知道每类信号应该启动哪份流程。",
    matrix: [
      ["账本金额不一致", "资金完整性", "SEV-1", "自动对账"],
      ["外部确认延迟", "结算最终性", "SEV-2 → SEV-1", "自动对账"],
      ["API错误预算燃烧", "可用性", "SEV-2", "事故响应 / 回滚"],
      ["区域不可用", "业务连续性", "SEV-1", "灾难恢复"],
      ["AI引用质量下降", "AI治理", "SEV-2", "模型降级"],
    ],
    headers: ["信号", "控制领域", "严重级别", "处置流程"],
    repository: "打开完整运行手册库",
    console: "进入控制平台演练",
  },
} as const;

const runbookIcons: LucideIcon[] = [Siren, GitCompareArrows, CloudOff, RefreshCcw, Sparkles, ShieldAlert, Gauge];

export function RunbooksPage() {
  const { locale } = useLocale();
  const t = copy[locale];

  return (
    <main className="content-page" data-testid="runbooks-page">
      <section className="page-hero runbook-hero">
        <div><span className="page-eyebrow"><BookOpenCheck size={15} />{t.eyebrow}</span><h1>{t.title}</h1><p>{t.subtitle}</p></div>
        <div className="command-loop">
          <div><Siren size={20} /><span><strong>{t.commandTitle}</strong><small>{t.commandSub}</small></span></div>
          <ol>{t.phases.map(([phase, description], index) => <li key={phase}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{phase}</strong><p>{description}</p></div></li>)}</ol>
        </div>
      </section>

      <section className="section runbook-library">
        <div className="section-heading compact"><div><span className="section-index">{t.libraryIndex}</span><h2>{t.libraryTitle}</h2><p>{t.librarySub}</p></div></div>
        <div className="runbook-grid">
          {t.runbooks.map(([severity, title, trigger, action, evidence, file], index) => {
            const Icon = runbookIcons[index];
            return (
              <article key={file}>
                <div className="runbook-card-header"><span><Icon size={20} /></span><em className={severity === "SEV-1" ? "sev-one" : severity === "SEV-2" ? "sev-two" : "sev-info"}>{severity}</em></div>
                <h3>{title}</h3>
                <dl><div><dt>{t.labels.trigger}</dt><dd>{trigger}</dd></div><div><dt>{t.labels.action}</dt><dd>{action}</dd></div><div><dt>{t.labels.evidence}</dt><dd>{evidence}</dd></div></dl>
                <a href={`${repository}/${file}`} target="_blank" rel="noreferrer">{t.labels.open}<ArrowRight size={15} /></a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section control-matrix-section">
        <div className="section-heading compact"><div><span className="section-index">{t.matrixIndex}</span><h2>{t.matrixTitle}</h2></div></div>
        <div className="control-matrix" role="table" aria-label="Runbook control matrix">
          <div className="matrix-row matrix-header" role="row">{t.headers.map((header) => <strong role="columnheader" key={header}>{header}</strong>)}</div>
          {t.matrix.map((row) => <div className="matrix-row" role="row" key={row[0]}>{row.map((cell, index) => <span role="cell" key={cell}>{index === 0 ? <AlertTriangle size={14} /> : index === 3 ? <ClipboardCheck size={14} /> : index === 2 ? <History size={14} /> : <Database size={14} />}{cell}</span>)}</div>)}
        </div>
        <div className="page-actions runbook-actions"><a className="secondary-button" href="https://github.com/thunderxu7-sketch/fincloud-sentinel/tree/main/docs/runbooks" target="_blank" rel="noreferrer">{t.repository}<ArrowRight size={16} /></a><Link className="primary-button" href="/console">{t.console}<ArrowRight size={16} /></Link></div>
      </section>
    </main>
  );
}
