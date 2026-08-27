"use client";

import { formatAtomicUnits } from "@fincloud/domain";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Ban,
  BookOpenCheck,
  Bot,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Database,
  Download,
  FileWarning,
  Fingerprint,
  GitCompareArrows,
  ListRestart,
  LockKeyhole,
  Play,
  RefreshCw,
  RotateCcw,
  SearchCheck,
  Send,
  ShieldCheck,
  ShieldQuestion,
  Sparkles,
  TestTube2,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  approveContainment,
  approveTransaction,
  completeTransaction,
  createSeededLabState,
  failTransaction,
  getTransactionEntries,
  getTransactionEvents,
  injectSettlementFault,
  investigate,
  isTransactionBalanced,
  runReconciliation,
  submitTransaction,
  type CopilotFinding,
  type LabState,
  type SettlementFault,
} from "../lib/lab-engine";

type Locale = "en" | "zh-CN";

interface TransactionFormState {
  idempotencyKey: string;
  accountId: string;
  amount: string;
  address: string;
  country: string;
  recentTransactionCount: number;
  newAddress: boolean;
}

const STORAGE_KEY = "fincloud-sentinel-lab-v1";

const words = {
  en: {
    index: "01 / RUNNABLE FINANCIAL CONTROL PLANE",
    title: "Operate the transaction lifecycle—not a scripted animation.",
    subtitle: "Every click executes the shared domain rules for risk, state transitions, double-entry settlement, reconciliation, and human-approved containment.",
    runtime: "DOMAIN ENGINE ACTIVE",
    synthetic: "Synthetic session · persisted in this browser",
    attempts: "Submission attempts",
    unique: "Unique transactions",
    replay: "Idempotent replays",
    integrity: "Balanced postings",
    matched: "Reconciled",
    transactionDesk: "Transaction desk",
    presets: "Load test case",
    normal: "Normal",
    review: "Review",
    blocked: "Deny list",
    account: "Account",
    amount: "Amount (USDT)",
    destination: "Destination address",
    key: "Idempotency key",
    country: "Origin",
    velocity: "Last-hour requests",
    newAddress: "New destination address",
    submit: "Submit withdrawal",
    queue: "Transaction queue",
    select: "Select a transaction to inspect its real state and evidence.",
    risk: "Risk",
    action: "Control action",
    approve: "Approve review",
    settle: "Broadcast & settle",
    fail: "Fail safely",
    retry: "Replay same request",
    created: "New transaction created",
    replayed: "Existing result returned; no duplicate transaction or ledger entry was created",
    rejected: "Policy blocked this request before funds moved",
    trace: "State and event trace",
    noEvents: "No events for this transaction.",
    reconciliation: "Reconciliation & fault laboratory",
    reconSub: "Inject a controlled external-settlement fault, then run the same reconciliation function covered by automated tests.",
    healthy: "Restore healthy",
    missing: "Missing settlement",
    mismatch: "Amount mismatch",
    confirmations: "Only 3 confirmations",
    runRecon: "Run reconciliation",
    ledger: "Double-entry ledger",
    noLedger: "Complete an approved transaction to generate ledger postings.",
    settlement: "External settlement evidence",
    report: "Latest reconciliation report",
    allMatched: "All completed transactions match the external settlement evidence.",
    noReport: "Run reconciliation to produce a signed run ID and issue list.",
    copilot: "Evidence-grounded investigation",
    copilotSub: "Offline governed mode: deterministic diagnosis over the transaction, ledger, settlement, event, and versioned runbook evidence. No claim of a live LLM.",
    question: "What happened and what is the safest next action?",
    investigate: "Investigate evidence",
    confidence: "confidence",
    evidence: "Cited evidence",
    proposed: "Proposed action",
    approval: "Human approval required",
    approveContainment: "Approve containment",
    contained: "Settlement route paused by an explicit operator approval",
    audit: "Audit trail",
    export: "Export evidence JSON",
    reset: "Reset synthetic session",
    noSelection: "Choose a transaction from the queue.",
    error: "Control rejected",
  },
  "zh-CN": {
    index: "01 / 可运行的金融控制平面",
    title: "操作真实交易链路，而不是观看预设动画。",
    subtitle: "每次点击都会执行共用领域规则，涵盖风控、状态机、复式记账、对账以及人工审批后的风险隔离。",
    runtime: "领域引擎运行中",
    synthetic: "合成会话 · 数据保存在当前浏览器",
    attempts: "提交尝试",
    unique: "唯一交易",
    replay: "幂等重放",
    integrity: "平衡记账",
    matched: "对账匹配",
    transactionDesk: "交易工作台",
    presets: "加载测试用例",
    normal: "正常交易",
    review: "人工审核",
    blocked: "命中黑名单",
    account: "客户账户",
    amount: "金额（USDT）",
    destination: "目标地址",
    key: "幂等键",
    country: "请求来源",
    velocity: "近一小时请求数",
    newAddress: "首次使用的目标地址",
    submit: "提交提现",
    queue: "交易队列",
    select: "选择交易，查看真实状态、资金记录和运行证据。",
    risk: "风险",
    action: "控制操作",
    approve: "批准人工审核",
    settle: "广播并结算",
    fail: "安全失败",
    retry: "使用相同幂等键重放",
    created: "已创建新交易",
    replayed: "已返回原结果，没有创建重复交易或账本记录",
    rejected: "策略已在资金移动前拦截该请求",
    trace: "状态与事件轨迹",
    noEvents: "该交易尚无事件。",
    reconciliation: "对账与故障实验室",
    reconSub: "注入受控的外部结算故障，再运行自动化测试覆盖的同一套对账函数。",
    healthy: "恢复正常证据",
    missing: "结算记录缺失",
    mismatch: "结算金额不一致",
    confirmations: "仅有 3 次确认",
    runRecon: "执行对账",
    ledger: "复式账本",
    noLedger: "完成一笔已批准交易后，系统会生成借贷双方记账。",
    settlement: "外部结算证据",
    report: "最新对账报告",
    allMatched: "所有已完成交易均与外部结算证据匹配。",
    noReport: "执行对账后会生成运行编号和问题清单。",
    copilot: "证据驱动的调查助手",
    copilotSub: "离线治理模式：基于交易、账本、结算、事件与版本化 Runbook 做确定性诊断，不冒充在线大模型。",
    question: "发生了什么？最安全的下一步是什么？",
    investigate: "调查运行证据",
    confidence: "置信度",
    evidence: "引用证据",
    proposed: "建议操作",
    approval: "需要人工审批",
    approveContainment: "批准风险隔离",
    contained: "结算通道已由操作员明确审批后暂停",
    audit: "审计日志",
    export: "导出证据 JSON",
    reset: "重置合成会话",
    noSelection: "请从交易队列中选择一笔交易。",
    error: "控制操作被拒绝",
  },
} as const;

const presets = {
  normal: {
    accountId: "cust-7788",
    amount: "860",
    address: "TR8TRUSTEDDESTINATION",
    country: "CN",
    recentTransactionCount: 2,
    newAddress: false,
  },
  review: {
    accountId: "cust-8866",
    amount: "18000",
    address: "TA7NEWDESTINATION",
    country: "SG",
    recentTransactionCount: 4,
    newAddress: true,
  },
  blocked: {
    accountId: "cust-9900",
    amount: "120",
    address: "T-BLOCKED-DEMO-ADDRESS",
    country: "CN",
    recentTransactionCount: 1,
    newAddress: false,
  },
} as const;

function newKey() {
  return `wd-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`;
}

function statusTone(status: string) {
  if (status === "COMPLETED" || status === "APPROVED") return "good";
  if (status === "REJECTED" || status === "FAILED") return "bad";
  return "warn";
}

function shortId(value: string) {
  return value.length > 16 ? `${value.slice(0, 9)}…${value.slice(-5)}` : value;
}

function displayTime(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

function localizeFinding(finding: CopilotFinding, locale: Locale, asset: string): CopilotFinding {
  if (locale === "en") return finding;
  const diagnoses: Record<CopilotFinding["issueCode"], string> = {
    UNBALANCED_LEDGER: "借方与贷方合计破坏了复式记账不变量。补偿处理前应停止结算并检查记账边界。",
    MISSING_CHAIN_SETTLEMENT: "内部交易已经完成，但缺少外部结算确认。应隔离相关资产通道，并按不可变交易编号核对。",
    CHAIN_AMOUNT_MISMATCH: "外部确认金额与内部账本金额不一致。应保存证据，并在双人复核完成前禁止自动重放。",
    INSUFFICIENT_CONFIRMATIONS: "结算尚未达到 12 次确认的最终性策略。应保持等待状态并继续监控确认数。",
    RISK_REVIEW: "本次请求被风险策略挂起，资金尚未记账或向外结算，需要授权人员完成审核。",
    NO_ACTIVE_ISSUE: "当前交易、账本、外部结算和事件证据中没有发现正在发生的资金完整性问题。",
  };
  const actions: Record<CopilotFinding["issueCode"], string> = {
    UNBALANCED_LEDGER: `暂停 ${asset} 结算、保存证据并发起双人复核。`,
    MISSING_CHAIN_SETTLEMENT: `暂停 ${asset} 结算、保存证据并发起双人复核。`,
    CHAIN_AMOUNT_MISMATCH: `暂停 ${asset} 结算、保存证据并发起双人复核。`,
    INSUFFICIENT_CONFIRMATIONS: "继续进行只读确认数监控，不要重放结算。",
    RISK_REVIEW: "由有权限的审核人员批准或拒绝本次请求。",
    NO_ACTIVE_ISSUE: "执行或复核对账结果后继续观察。",
  };
  return { ...finding, diagnosis: diagnoses[finding.issueCode], proposedAction: actions[finding.issueCode] };
}

function loadStoredState(): LabState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LabState;
    return parsed.version === 1 && Array.isArray(parsed.transactions) ? parsed : null;
  } catch {
    return null;
  }
}

export function OperationsLab({ locale }: { locale: Locale }) {
  const t = words[locale];
  const initial = useMemo(() => createSeededLabState(), []);
  const [lab, setLab] = useState<LabState>(initial);
  const [selectedId, setSelectedId] = useState(() => initial.transactions.find((item) => item.status === "COMPLETED")?.id ?? initial.transactions[0]?.id ?? "");
  const [hydrated, setHydrated] = useState(false);
  const [form, setForm] = useState<TransactionFormState>({
    idempotencyKey: "wd-interview-001",
    accountId: presets.normal.accountId,
    amount: presets.normal.amount,
    address: presets.normal.address,
    country: presets.normal.country,
    recentTransactionCount: presets.normal.recentTransactionCount,
    newAddress: presets.normal.newAddress,
  });
  const [notice, setNotice] = useState<{ tone: "good" | "warn" | "bad"; text: string } | null>(null);
  const [question, setQuestion] = useState("");
  const [finding, setFinding] = useState<CopilotFinding | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = loadStoredState();
      if (stored) {
        setLab(stored);
        setSelectedId(stored.transactions[0]?.id ?? "");
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lab));
  }, [hydrated, lab]);

  const selected = lab.transactions.find((item) => item.id === selectedId) ?? null;
  const entries = selected ? getTransactionEntries(lab, selected.id) : [];
  const events = selected ? getTransactionEvents(lab, selected.id) : [];
  const settlement = selected ? lab.settlements.find((item) => item.transactionId === selected.id) : undefined;
  const reportIssues = selected ? lab.reconciliation?.issues.filter((item) => item.transactionId === selected.id) ?? [] : [];
  const completed = lab.transactions.filter((item) => item.status === "COMPLETED");
  const balanced = completed.filter((item) => isTransactionBalanced(lab, item.id) === true).length;
  const matched = lab.reconciliation?.matchedCount ?? 0;
  const visibleFinding = finding && selected ? localizeFinding(finding, locale, selected.asset) : finding;
  const liveMetrics: readonly [string, string | number, LucideIcon][] = [
    [t.attempts, lab.attempts, Activity],
    [t.unique, lab.transactions.length, Fingerprint],
    [t.replay, lab.replays, ListRestart],
    [t.integrity, completed.length ? `${balanced}/${completed.length}` : "—", Database],
    [t.matched, lab.reconciliation ? `${matched}/${lab.reconciliation.transactionCount}` : "—", GitCompareArrows],
  ];

  const loadPreset = (name: keyof typeof presets) => {
    const preset = presets[name];
    setForm({ ...preset, idempotencyKey: newKey() });
    setNotice(null);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    try {
      const result = submitTransaction(lab, {
        idempotencyKey: form.idempotencyKey,
        accountId: form.accountId,
        kind: "WITHDRAWAL",
        asset: "USDT",
        amount: form.amount,
        address: form.address,
        country: form.country,
        newAddress: form.newAddress,
        recentTransactionCount: Number(form.recentTransactionCount),
      });
      setLab(result.state);
      setSelectedId(result.transaction.id);
      setFinding(null);
      setNotice({
        tone: result.replayed ? "warn" : result.risk.action === "BLOCK" ? "bad" : "good",
        text: result.replayed ? t.replayed : result.risk.action === "BLOCK" ? t.rejected : `${t.created} · ${result.risk.action} / ${result.risk.score}`,
      });
      if (!result.replayed) setForm((current) => ({ ...current, idempotencyKey: newKey() }));
    } catch (error) {
      setNotice({ tone: "bad", text: `${t.error}: ${error instanceof Error ? error.message : "Unknown error"}` });
    }
  };

  const apply = (operation: (current: LabState) => LabState, success?: string) => {
    try {
      setLab((current) => operation(current));
      setFinding(null);
      if (success) setNotice({ tone: "good", text: success });
    } catch (error) {
      setNotice({ tone: "bad", text: `${t.error}: ${error instanceof Error ? error.message : "Unknown error"}` });
    }
  };

  const replaySelected = () => {
    if (!selected) return;
    const input = lab.inputs[selected.id];
    if (!input) return;
    const result = submitTransaction(lab, input);
    setLab(result.state);
    setNotice({ tone: "warn", text: t.replayed });
  };

  const injectAndReconcile = (fault: SettlementFault) => {
    if (!selected) return;
    apply((current) => runReconciliation(injectSettlementFault(current, selected.id, fault)));
  };

  const runInvestigation = () => {
    if (!selected) return;
    setFinding(investigate(lab, selected.id, question || t.question));
  };

  const reset = () => {
    const next = createSeededLabState();
    setLab(next);
    setSelectedId(next.transactions.find((item) => item.status === "COMPLETED")?.id ?? next.transactions[0]?.id ?? "");
    setFinding(null);
    setNotice(null);
  };

  const exportEvidence = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      synthetic: true,
      selectedTransaction: selected,
      ledgerEntries: entries,
      settlement,
      reconciliation: lab.reconciliation,
      events,
      finding,
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `fincloud-evidence-${selected?.id ?? "session"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="section operations-section" id="scenario" data-testid="operations-lab">
      <div className="section-heading operations-heading">
        <div>
          <span className="section-index">{t.index}</span>
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>
        <div className="runtime-status">
          <span><i />{t.runtime}</span>
          <small>{t.synthetic}</small>
        </div>
      </div>

      <div className="live-kpis" aria-label="Live session metrics">
        {liveMetrics.map(([label, value, Icon], index) => (
          <div key={String(label)} data-testid={`live-metric-${index}`}><span><Icon size={15} />{label}</span><strong>{String(value)}</strong></div>
        ))}
      </div>

      <div className="lab-shell">
        <div className="lab-titlebar">
          <div><CircleDollarSign size={18} /><strong>{t.transactionDesk}</strong></div>
          <button type="button" className="text-button" onClick={reset}><RotateCcw size={14} />{t.reset}</button>
        </div>

        <div className="transaction-workspace">
          <form className="transaction-form" onSubmit={onSubmit}>
            <div className="form-section-title"><Send size={16} /><strong>{t.submit}</strong></div>
            <div className="preset-row"><span>{t.presets}</span><div>
              <button type="button" onClick={() => loadPreset("normal")}><CheckCircle2 size={13} />{t.normal}</button>
              <button type="button" onClick={() => loadPreset("review")}><ShieldQuestion size={13} />{t.review}</button>
              <button type="button" onClick={() => loadPreset("blocked")}><Ban size={13} />{t.blocked}</button>
            </div></div>
            <label>{t.account}<input value={form.accountId} onChange={(event) => setForm({ ...form, accountId: event.target.value })} required /></label>
            <div className="form-pair">
              <label>{t.amount}<input inputMode="decimal" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required /></label>
              <label>{t.country}<select value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })}><option value="CN">CN</option><option value="SG">SG</option><option value="HK">HK</option><option value="US">US</option></select></label>
            </div>
            <label>{t.destination}<input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} required /></label>
            <label>{t.key}<input className="mono-input" value={form.idempotencyKey} onChange={(event) => setForm({ ...form, idempotencyKey: event.target.value })} required /></label>
            <div className="form-pair form-pair-bottom">
              <label>{t.velocity}<input type="number" min="0" max="99" value={form.recentTransactionCount} onChange={(event) => setForm({ ...form, recentTransactionCount: Number(event.target.value) })} /></label>
              <label className="check-label"><input type="checkbox" checked={form.newAddress} onChange={(event) => setForm({ ...form, newAddress: event.target.checked })} /><span><Check size={12} /></span>{t.newAddress}</label>
            </div>
            <button className="submit-transaction" type="submit"><Play size={15} fill="currentColor" />{t.submit}</button>
            {notice && <div className={`operation-notice notice-${notice.tone}`} role="status" data-testid="operation-notice"><span>{notice.tone === "bad" ? <AlertTriangle size={15} /> : notice.tone === "warn" ? <ListRestart size={15} /> : <BadgeCheck size={15} />}</span>{notice.text}</div>}
          </form>

          <div className="transaction-queue">
            <div className="workspace-heading"><div><strong>{t.queue}</strong><small>{t.select}</small></div><span>{lab.transactions.length}</span></div>
            <div className="transaction-list">
              {lab.transactions.map((transaction) => (
                <button type="button" className={transaction.id === selectedId ? "selected" : ""} key={transaction.id} onClick={() => { setSelectedId(transaction.id); setFinding(null); setNotice(null); }}>
                  <span className={`transaction-icon tone-bg-${statusTone(transaction.status)}`}><CircleDollarSign size={16} /></span>
                  <span className="transaction-main"><strong>{transaction.amount} {transaction.asset}</strong><small>{shortId(transaction.id)} · {transaction.accountId}</small></span>
                  <span className="transaction-state"><strong className={`tone-${statusTone(transaction.status)}`}>{transaction.status}</strong><small>{transaction.riskLevel} · {transaction.riskScore}</small></span>
                </button>
              ))}
            </div>
          </div>

          <div className="transaction-detail">
            {selected ? <>
              <div className="workspace-heading"><div><strong>{t.action}</strong><small>{shortId(selected.id)}</small></div><span className={`detail-risk tone-${statusTone(selected.status)}`} data-testid="selected-status">{selected.status}</span></div>
              <div className="transaction-summary">
                <div><span>{t.risk}</span><strong>{selected.riskLevel} · {selected.riskScore}</strong></div>
                <div><span>VERSION</span><strong>v{selected.version}</strong></div>
                <div><span>ADDRESS</span><strong title={selected.address}>{shortId(selected.address)}</strong></div>
                <div><span>LEDGER</span><strong>{isTransactionBalanced(lab, selected.id) === null ? "NOT POSTED" : isTransactionBalanced(lab, selected.id) ? "BALANCED" : "BROKEN"}</strong></div>
              </div>
              <div className="risk-reasons">{selected.riskReasons.map((reason) => <span key={reason}><ShieldCheck size={13} />{reason}</span>)}</div>
              <div className="transaction-actions">
                {selected.status === "RISK_REVIEW" && <button type="button" onClick={() => apply((current) => approveTransaction(current, selected.id))}><UserCheck size={14} />{t.approve}</button>}
                {selected.status === "APPROVED" && <button type="button" className="primary-control" onClick={() => apply((current) => completeTransaction(current, selected.id))}><Send size={14} />{t.settle}</button>}
                {["RISK_REVIEW", "APPROVED"].includes(selected.status) && <button type="button" className="danger-control" onClick={() => apply((current) => failTransaction(current, selected.id))}><Ban size={14} />{t.fail}</button>}
                <button type="button" onClick={replaySelected}><ListRestart size={14} />{t.retry}</button>
              </div>
              <div className="trace-heading"><strong>{t.trace}</strong><span>{events.length} events</span></div>
              <div className="event-trace">{events.length ? events.slice().reverse().slice(0, 8).map((event) => <div key={event.id}><span><i /></span><div><strong>{event.type}</strong><small>{displayTime(event.occurredAt, locale)} · {shortId(event.id)}</small></div></div>) : <p>{t.noEvents}</p>}</div>
            </> : <div className="empty-state"><Fingerprint size={30} /><p>{t.noSelection}</p></div>}
          </div>
        </div>
      </div>

      <div className="reconciliation-shell">
        <div className="reconciliation-header">
          <div><span><GitCompareArrows size={18} /></span><div><strong>{t.reconciliation}</strong><p>{t.reconSub}</p></div></div>
          <button type="button" className="run-recon" onClick={() => apply((current) => runReconciliation(current))}><RefreshCw size={14} />{t.runRecon}</button>
        </div>
        <div className="fault-toolbar">
          {([
            ["HEALTHY", t.healthy, CheckCircle2],
            ["MISSING", t.missing, FileWarning],
            ["AMOUNT_MISMATCH", t.mismatch, AlertTriangle],
            ["LOW_CONFIRMATIONS", t.confirmations, Clock3],
          ] as const).map(([fault, label, Icon]) => <button type="button" disabled={!selected || selected.status !== "COMPLETED"} onClick={() => injectAndReconcile(fault)} key={fault}><Icon size={14} />{label}</button>)}
        </div>
        <div className="reconciliation-grid">
          <article>
            <div className="card-heading"><Database size={16} /><strong>{t.ledger}</strong><span>{entries.length} entries</span></div>
            {entries.length ? <div className="ledger-table">
              <div className="ledger-row ledger-label"><span>ACCOUNT</span><span>SIDE</span><span>AMOUNT</span></div>
              {entries.map((entry) => <div className="ledger-row" key={entry.id}><span title={entry.account}>{entry.account}</span><span className={entry.side === "DEBIT" ? "debit" : "credit"}>{entry.side}</span><span>{formatAtomicUnits(BigInt(entry.amountAtomic))} {entry.asset}</span></div>)}
              <div className="ledger-invariant" data-testid="ledger-invariant"><CheckCircle2 size={14} /><span>Σ DEBIT = Σ CREDIT</span><strong>{isTransactionBalanced(lab, selected?.id ?? "") ? "PASS" : "—"}</strong></div>
            </div> : <div className="small-empty"><Database size={24} /><p>{t.noLedger}</p></div>}
          </article>
          <article>
            <div className="card-heading"><SearchCheck size={16} /><strong>{t.settlement}</strong><span>{settlement?.status ?? "NONE"}</span></div>
            {settlement ? <div className="settlement-proof">
              <div><span>STATUS</span><strong className={`tone-${settlement.status === "CONFIRMED" ? "good" : settlement.status === "MISSING" ? "bad" : "warn"}`}>{settlement.status}</strong></div>
              <div><span>AMOUNT ATOMIC</span><code>{settlement.amountAtomic}</code></div>
              <div><span>CONFIRMATIONS</span><strong>{settlement.confirmations} / 12</strong></div>
              <div><span>TRANSACTION</span><code>{shortId(settlement.transactionId)}</code></div>
            </div> : <div className="small-empty"><Clock3 size={24} /><p>{t.noLedger}</p></div>}
          </article>
          <article className="report-card">
            <div className="card-heading"><ClipboardCheck size={16} /><strong>{t.report}</strong><span>{lab.reconciliation?.runId ? shortId(lab.reconciliation.runId) : "NOT RUN"}</span></div>
            {lab.reconciliation ? <div className="report-body">
              <div className="report-score"><strong>{lab.reconciliation.matchedCount}/{lab.reconciliation.transactionCount}</strong><span>MATCHED</span></div>
              <div className="issue-list">{reportIssues.length ? reportIssues.map((issue) => <div data-testid="reconciliation-issue" key={`${issue.transactionId}-${issue.code}`}><AlertTriangle size={14} /><span><strong>{issue.code}</strong><small>{issue.detail}</small></span><em>{issue.severity}</em></div>) : <div className="all-clear"><CheckCircle2 size={17} />{t.allMatched}</div>}</div>
            </div> : <div className="small-empty"><GitCompareArrows size={24} /><p>{t.noReport}</p></div>}
          </article>
        </div>
      </div>

      <div className="investigation-shell">
        <div className="investigation-copy">
          <span className="ai-mark"><Sparkles size={20} /></span>
          <h3>{t.copilot}</h3>
          <p>{t.copilotSub}</p>
          <label><span>OPERATOR QUESTION</span><textarea value={question} placeholder={t.question} onChange={(event) => setQuestion(event.target.value)} /></label>
          <button type="button" onClick={runInvestigation} disabled={!selected}><Bot size={15} />{t.investigate}</button>
          <div className="audit-tools"><button type="button" onClick={exportEvidence}><Download size={14} />{t.export}</button><span><BookOpenCheck size={14} />{t.audit}: {lab.events.length}</span></div>
        </div>
        <div className="finding-panel">
          {visibleFinding ? <>
            <div className="finding-header"><div><Bot size={17} /><strong>FINCLOUD INVESTIGATOR</strong></div><span>{Math.round(visibleFinding.confidence * 100)}% {t.confidence}</span></div>
            <div className="finding-diagnosis" data-testid="copilot-finding"><span>DIAGNOSIS · {visibleFinding.issueCode}</span><p>{visibleFinding.diagnosis}</p></div>
            <div className="finding-evidence"><span>{t.evidence}</span>{visibleFinding.evidence.map((item) => <div key={`${item.source}-${item.excerpt}`}><BookOpenCheck size={14} /><span><code>{item.source}</code><small>{item.excerpt}</small></span></div>)}</div>
            <div className="finding-action"><span>{t.proposed}</span><strong>{visibleFinding.proposedAction}</strong>{visibleFinding.approvalRequired && selected && <button type="button" onClick={() => apply((current) => approveContainment(current, selected.id), t.contained)}><LockKeyhole size={13} />{t.approveContainment}</button>}</div>
          </> : <div className="finding-placeholder"><TestTube2 size={36} /><strong>{t.investigate}</strong><p>{t.noReport}</p></div>}
        </div>
      </div>
    </section>
  );
}
