"use client";

import { Database, Fingerprint, LockKeyhole, Radio } from "lucide-react";
import { OperationsLab } from "./operations-lab";
import { useLocale } from "./locale-provider";

const copy = {
  en: {
    eyebrow: "FINANCIAL OPERATIONS / CONTROL PLANE",
    title: "Operate the full assurance loop.",
    subtitle: "A dedicated operator workspace for transaction risk, state transitions, settlement integrity, reconciliation, evidence investigation, and approved containment.",
    modes: [["Runtime", "Shared domain engine"], ["Data boundary", "Synthetic browser session"], ["Control boundary", "Human approval enforced"]],
    notice: "This public sandbox executes deterministic domain logic in your browser. Use the Docker profile for service APIs, telemetry, and dashboards.",
  },
  "zh-CN": {
    eyebrow: "金融运营 / 控制平台",
    title: "操作完整的交易保障闭环。",
    subtitle: "面向操作员的独立工作台，覆盖交易风控、状态流转、结算完整性、自动对账、证据调查与审批后风险隔离。",
    modes: [["运行模式", "共享领域引擎"], ["数据边界", "浏览器合成会话"], ["控制边界", "强制人工审批"]],
    notice: "公开沙箱会在浏览器中执行确定性领域逻辑；如需服务 API、遥测和仪表盘，请运行 Docker 完整环境。",
  },
} as const;

const icons = [Radio, Database, LockKeyhole];

export function ControlPlanePage() {
  const { locale } = useLocale();
  const t = copy[locale];

  return (
    <main className="control-plane-page" data-testid="control-plane-page">
      <section className="console-hero">
        <div className="console-hero-copy">
          <span className="page-eyebrow"><Fingerprint size={15} />{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="console-mode-grid">
          {t.modes.map(([label, value], index) => {
            const Icon = icons[index];
            return <div key={label}><Icon size={17} /><span>{label}</span><strong>{value}</strong></div>;
          })}
        </div>
        <div className="sandbox-notice"><span>PUBLIC SANDBOX</span><p>{t.notice}</p></div>
      </section>
      <OperationsLab locale={locale} standalone />
    </main>
  );
}
