import {
  buildSettlementEntries,
  evaluateRisk,
  isBalanced,
  reconcileSettlements,
  requirePositiveAmount,
  transitionTransaction,
  type ChainSettlement,
  type DomainEvent,
  type LedgerEntry,
  type ReconciliationIssue,
  type ReconciliationReport,
  type RiskAction,
  type RiskDecision,
  type Transaction,
  type TransactionInput,
  type TransactionStatus,
} from "@fincloud/domain";

export type SettlementFault = "HEALTHY" | "MISSING" | "AMOUNT_MISMATCH" | "LOW_CONFIRMATIONS";

export interface LabState {
  readonly version: 1;
  readonly transactions: readonly Transaction[];
  readonly inputs: Readonly<Record<string, TransactionInput>>;
  readonly ledger: readonly LedgerEntry[];
  readonly events: readonly DomainEvent[];
  readonly settlements: readonly ChainSettlement[];
  readonly attempts: number;
  readonly replays: number;
  readonly reconciliation: ReconciliationReport | null;
  readonly pausedAssets: readonly string[];
}

export interface SubmitResult {
  readonly state: LabState;
  readonly transaction: Transaction;
  readonly risk: RiskDecision;
  readonly replayed: boolean;
}

export interface CopilotEvidence {
  readonly source: string;
  readonly excerpt: string;
}

export interface CopilotFinding {
  readonly diagnosis: string;
  readonly confidence: number;
  readonly evidence: readonly CopilotEvidence[];
  readonly proposedAction: string;
  readonly approvalRequired: boolean;
  readonly issueCode: ReconciliationIssue["code"] | "RISK_REVIEW" | "NO_ACTIVE_ISSUE";
}

export interface LabRuntime {
  readonly now?: () => string;
  readonly id?: (prefix: string) => string;
}

const defaultNow = () => new Date().toISOString();
const defaultId = (prefix: string) => {
  const suffix = typeof globalThis.crypto?.randomUUID === "function"
    ? globalThis.crypto.randomUUID().slice(0, 8)
    : `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  return `${prefix}-${suffix}`;
};

function runtime(runtime: LabRuntime = {}) {
  return { now: runtime.now ?? defaultNow, id: runtime.id ?? defaultId };
}

export function emptyLabState(): LabState {
  return {
    version: 1,
    transactions: [],
    inputs: {},
    ledger: [],
    events: [],
    settlements: [],
    attempts: 0,
    replays: 0,
    reconciliation: null,
    pausedAssets: [],
  };
}

function eventFor(
  transaction: Transaction,
  type: string,
  now: string,
  id: (prefix: string) => string,
  payload: Readonly<Record<string, unknown>> = {},
): DomainEvent {
  return {
    id: id("evt"),
    aggregateId: transaction.id,
    type,
    occurredAt: now,
    payload: {
      transactionId: transaction.id,
      status: transaction.status,
      version: transaction.version,
      ...payload,
    },
  };
}

function statusEvent(status: TransactionStatus): string {
  return `Transaction${status.replace(/(^|_)([A-Z])/g, (_, __, letter: string) => letter)}`;
}

function moveWithEvent(
  transaction: Transaction,
  status: TransactionStatus,
  events: DomainEvent[],
  now: string,
  id: (prefix: string) => string,
): Transaction {
  const moved = transitionTransaction(transaction, status, now);
  events.push(eventFor(moved, statusEvent(status), now, id));
  return moved;
}

function riskAction(transaction: Transaction): RiskAction {
  if (transaction.riskLevel === "CRITICAL") return "BLOCK";
  if (transaction.riskLevel === "HIGH" || transaction.riskLevel === "MEDIUM") return "REVIEW";
  return "ALLOW";
}

export function submitTransaction(
  state: LabState,
  input: TransactionInput,
  runtimeOptions: LabRuntime = {},
): SubmitResult {
  const { now, id } = runtime(runtimeOptions);
  const timestamp = now();
  const existing = state.transactions.find((item) => item.idempotencyKey === input.idempotencyKey);

  if (existing) {
    const replayEvent = eventFor(existing, "IdempotencyReplayDetected", timestamp, id, {
      idempotencyKey: input.idempotencyKey,
      outcome: "RETURNED_EXISTING_RESULT",
    });
    return {
      state: {
        ...state,
        attempts: state.attempts + 1,
        replays: state.replays + 1,
        events: [...state.events, replayEvent],
      },
      transaction: existing,
      risk: {
        level: existing.riskLevel,
        action: riskAction(existing),
        score: existing.riskScore,
        reasons: existing.riskReasons,
      },
      replayed: true,
    };
  }

  if (!input.idempotencyKey.trim() || !input.accountId.trim() || !input.address.trim()) {
    throw new Error("Idempotency key, account and address are required");
  }

  const amountAtomic = requirePositiveAmount(input.amount).toString();
  const risk = evaluateRisk(input);
  const events: DomainEvent[] = [];
  let transaction: Transaction = {
    id: id("txn"),
    idempotencyKey: input.idempotencyKey,
    accountId: input.accountId,
    kind: input.kind,
    asset: input.asset.toUpperCase(),
    amount: input.amount,
    amountAtomic,
    address: input.address,
    status: "RECEIVED",
    riskLevel: risk.level,
    riskScore: risk.score,
    riskReasons: risk.reasons,
    createdAt: timestamp,
    updatedAt: timestamp,
    version: 1,
  };

  events.push(eventFor(transaction, "TransactionReceived", timestamp, id, { amountAtomic }));
  transaction = moveWithEvent(transaction, "VALIDATING", events, timestamp, id);
  transaction = moveWithEvent(transaction, "RISK_REVIEW", events, timestamp, id);
  if (risk.action === "ALLOW") transaction = moveWithEvent(transaction, "APPROVED", events, timestamp, id);
  if (risk.action === "BLOCK") transaction = moveWithEvent(transaction, "REJECTED", events, timestamp, id);

  return {
    state: {
      ...state,
      transactions: [transaction, ...state.transactions],
      inputs: { ...state.inputs, [transaction.id]: input },
      events: [...state.events, ...events],
      attempts: state.attempts + 1,
      reconciliation: null,
    },
    transaction,
    risk,
    replayed: false,
  };
}

function replaceTransaction(state: LabState, transaction: Transaction, events: readonly DomainEvent[]): LabState {
  return {
    ...state,
    transactions: state.transactions.map((item) => item.id === transaction.id ? transaction : item),
    events: [...state.events, ...events],
    reconciliation: null,
  };
}

export function approveTransaction(
  state: LabState,
  transactionId: string,
  runtimeOptions: LabRuntime = {},
): LabState {
  const { now, id } = runtime(runtimeOptions);
  const transaction = requireTransaction(state, transactionId);
  const timestamp = now();
  const events: DomainEvent[] = [];
  const approved = moveWithEvent(transaction, "APPROVED", events, timestamp, id);
  events.push(eventFor(approved, "RiskReviewApproved", timestamp, id, { control: "FOUR_EYES" }));
  return replaceTransaction(state, approved, events);
}

export function completeTransaction(
  state: LabState,
  transactionId: string,
  runtimeOptions: LabRuntime = {},
): LabState {
  const { now, id } = runtime(runtimeOptions);
  const timestamp = now();
  const events: DomainEvent[] = [];
  let transaction = requireTransaction(state, transactionId);
  transaction = moveWithEvent(transaction, "BROADCASTING", events, timestamp, id);
  transaction = moveWithEvent(transaction, "CONFIRMING", events, timestamp, id);
  transaction = moveWithEvent(transaction, "COMPLETED", events, timestamp, id);
  const entries = buildSettlementEntries(transaction, () => id("led"), timestamp);
  events.push(eventFor(transaction, "LedgerSettled", timestamp, id, {
    debitTotal: transaction.amountAtomic,
    creditTotal: transaction.amountAtomic,
  }));
  events.push(eventFor(transaction, "ChainSettlementConfirmed", timestamp, id, { confirmations: 12 }));

  const updated = replaceTransaction(state, transaction, events);
  return {
    ...updated,
    ledger: [...updated.ledger, ...entries],
    settlements: [
      ...updated.settlements.filter((item) => item.transactionId !== transaction.id),
      {
        transactionId: transaction.id,
        status: "CONFIRMED",
        amountAtomic: transaction.amountAtomic,
        confirmations: 12,
      },
    ],
  };
}

export function failTransaction(
  state: LabState,
  transactionId: string,
  runtimeOptions: LabRuntime = {},
): LabState {
  const { now, id } = runtime(runtimeOptions);
  const transaction = requireTransaction(state, transactionId);
  const timestamp = now();
  const events: DomainEvent[] = [];
  const failed = moveWithEvent(transaction, "FAILED", events, timestamp, id);
  return replaceTransaction(state, failed, events);
}

export function injectSettlementFault(
  state: LabState,
  transactionId: string,
  fault: SettlementFault,
  runtimeOptions: LabRuntime = {},
): LabState {
  const { now, id } = runtime(runtimeOptions);
  const transaction = requireTransaction(state, transactionId);
  if (transaction.status !== "COMPLETED") throw new Error("Only completed transactions can be reconciled");

  const settlement: ChainSettlement = fault === "MISSING"
    ? { transactionId, status: "MISSING", amountAtomic: transaction.amountAtomic, confirmations: 0 }
    : fault === "AMOUNT_MISMATCH"
      ? {
          transactionId,
          status: "CONFIRMED",
          amountAtomic: (BigInt(transaction.amountAtomic) + BigInt(25_000_000)).toString(),
          confirmations: 12,
        }
      : fault === "LOW_CONFIRMATIONS"
        ? { transactionId, status: "PENDING", amountAtomic: transaction.amountAtomic, confirmations: 3 }
        : { transactionId, status: "CONFIRMED", amountAtomic: transaction.amountAtomic, confirmations: 12 };

  const timestamp = now();
  return {
    ...state,
    settlements: [...state.settlements.filter((item) => item.transactionId !== transactionId), settlement],
    events: [
      ...state.events,
      eventFor(transaction, fault === "HEALTHY" ? "SettlementEvidenceRestored" : "FaultInjected", timestamp, id, {
        fault,
        synthetic: true,
      }),
    ],
    reconciliation: null,
  };
}

export function runReconciliation(state: LabState, runtimeOptions: LabRuntime = {}): LabState {
  const { now, id } = runtime(runtimeOptions);
  const timestamp = now();
  const report = reconcileSettlements(
    state.transactions,
    state.ledger,
    state.settlements,
    id("recon"),
    timestamp,
  );
  const event: DomainEvent = {
    id: id("evt"),
    aggregateId: report.runId,
    type: "ReconciliationCompleted",
    occurredAt: timestamp,
    payload: {
      checkedTransactions: report.transactionCount,
      matchedTransactions: report.matchedCount,
      issueCount: report.issues.length,
    },
  };
  return { ...state, reconciliation: report, events: [...state.events, event] };
}

export function approveContainment(
  state: LabState,
  transactionId: string,
  runtimeOptions: LabRuntime = {},
): LabState {
  const { now, id } = runtime(runtimeOptions);
  const transaction = requireTransaction(state, transactionId);
  const timestamp = now();
  return {
    ...state,
    pausedAssets: [...new Set([...state.pausedAssets, transaction.asset])],
    events: [
      ...state.events,
      eventFor(transaction, "SettlementRoutePaused", timestamp, id, {
        asset: transaction.asset,
        approvedBy: "DEMO_OPERATOR",
        approvalMode: "HUMAN_IN_THE_LOOP",
      }),
    ],
  };
}

export function investigate(
  state: LabState,
  transactionId: string,
  question: string,
): CopilotFinding {
  const transaction = requireTransaction(state, transactionId);
  const issue = state.reconciliation?.issues.find((item) => item.transactionId === transactionId);
  const transactionEvents = state.events.filter((event) => event.aggregateId === transactionId);
  const latestEvent = transactionEvents.at(-1);
  const safeQuestion = question.replace(/[\r\n]+/g, " ").slice(0, 240);

  if (issue) {
    const diagnoses: Record<ReconciliationIssue["code"], string> = {
      UNBALANCED_LEDGER: "The debit and credit totals violate the double-entry invariant. Stop settlement and inspect posting boundaries before compensation.",
      MISSING_CHAIN_SETTLEMENT: "The internal transaction completed without confirmed external settlement evidence. Contain the asset route and reconcile by immutable transaction ID.",
      CHAIN_AMOUNT_MISMATCH: "The confirmed external amount differs from the internal ledger amount. Preserve evidence and block automated replay until a two-person review completes.",
      INSUFFICIENT_CONFIRMATIONS: "The settlement has not reached the 12-confirmation finality policy. Keep the transaction pending and continue confirmation monitoring.",
    };
    const sources: Record<ReconciliationIssue["code"], string> = {
      UNBALANCED_LEDGER: "docs/runbooks/ledger-reconciliation.md#ledger-invariant",
      MISSING_CHAIN_SETTLEMENT: "docs/runbooks/ledger-reconciliation.md#missing-settlement",
      CHAIN_AMOUNT_MISMATCH: "docs/runbooks/incident-response.md#containment",
      INSUFFICIENT_CONFIRMATIONS: "services/ai-copilot/knowledge/chain-confirmation-delay.md",
    };
    return {
      diagnosis: diagnoses[issue.code],
      confidence: issue.severity === "CRITICAL" ? 0.94 : 0.87,
      issueCode: issue.code,
      evidence: [
        { source: `reconciliation/${state.reconciliation?.runId ?? "not-run"}`, excerpt: issue.detail },
        { source: sources[issue.code], excerpt: "Operational control selected from the versioned repository runbook." },
        {
          source: `event/${latestEvent?.id ?? "none"}`,
          excerpt: `${latestEvent?.type ?? "No event"}; operator question: ${safeQuestion || "Investigate active issue"}`,
        },
      ],
      proposedAction: issue.code === "INSUFFICIENT_CONFIRMATIONS"
        ? "Continue read-only confirmation monitoring; do not replay settlement."
        : `Pause ${transaction.asset} settlement, preserve evidence, and open two-person review.`,
      approvalRequired: issue.code !== "INSUFFICIENT_CONFIRMATIONS",
    };
  }

  if (transaction.status === "RISK_REVIEW") {
    return {
      diagnosis: `The request is held by policy with score ${transaction.riskScore}: ${transaction.riskReasons.join("; ")}. No ledger posting or external settlement has occurred.`,
      confidence: 0.91,
      issueCode: "RISK_REVIEW",
      evidence: [
        { source: `transaction/${transaction.id}`, excerpt: `status=${transaction.status}; version=${transaction.version}` },
        { source: "packages/domain/src/risk.ts", excerpt: transaction.riskReasons.join("; ") },
      ],
      proposedAction: "Require an authorized reviewer to approve or reject the request.",
      approvalRequired: true,
    };
  }

  return {
    diagnosis: "No active financial-integrity issue is present in the available transaction, ledger, settlement, and event evidence.",
    confidence: state.reconciliation ? 0.9 : 0.67,
    issueCode: "NO_ACTIVE_ISSUE",
    evidence: [
      { source: `transaction/${transaction.id}`, excerpt: `status=${transaction.status}; risk=${transaction.riskLevel}` },
      { source: "ledger/double-entry", excerpt: `balanced=${isBalanced(state.ledger.filter((item) => item.transactionId === transaction.id))}` },
    ],
    proposedAction: state.reconciliation ? "Continue observation." : "Run reconciliation before closing the investigation.",
    approvalRequired: false,
  };
}

export function getTransaction(state: LabState, transactionId: string): Transaction | undefined {
  return state.transactions.find((item) => item.id === transactionId);
}

export function getTransactionEntries(state: LabState, transactionId: string): readonly LedgerEntry[] {
  return state.ledger.filter((entry) => entry.transactionId === transactionId);
}

export function getTransactionEvents(state: LabState, transactionId: string): readonly DomainEvent[] {
  return state.events.filter((event) => event.aggregateId === transactionId);
}

export function isTransactionBalanced(state: LabState, transactionId: string): boolean | null {
  const entries = getTransactionEntries(state, transactionId);
  return entries.length === 0 ? null : isBalanced(entries);
}

function requireTransaction(state: LabState, transactionId: string): Transaction {
  const transaction = getTransaction(state, transactionId);
  if (!transaction) throw new Error(`Transaction not found: ${transactionId}`);
  return transaction;
}

export function createSeededLabState(): LabState {
  let counter = 0;
  const runtimeOptions: LabRuntime = {
    now: () => "2026-08-27T04:00:00.000Z",
    id: (prefix) => `${prefix}-seed-${++counter}`,
  };
  let state = emptyLabState();
  const healthy = submitTransaction(state, {
    idempotencyKey: "wd-seed-healthy",
    accountId: "cust-1001",
    kind: "WITHDRAWAL",
    asset: "USDT",
    amount: "480",
    address: "TQ9DEMOHEALTHYADDRESS",
    country: "CN",
    newAddress: false,
    recentTransactionCount: 1,
  }, runtimeOptions);
  state = completeTransaction(healthy.state, healthy.transaction.id, runtimeOptions);
  state = submitTransaction(state, {
    idempotencyKey: "wd-seed-review",
    accountId: "cust-2048",
    kind: "WITHDRAWAL",
    asset: "USDT",
    amount: "15000",
    address: "TN3NEWDESTINATIONDEMO",
    country: "SG",
    newAddress: true,
    recentTransactionCount: 4,
  }, runtimeOptions).state;
  state = submitTransaction(state, {
    idempotencyKey: "wd-seed-blocked",
    accountId: "cust-4096",
    kind: "WITHDRAWAL",
    asset: "USDT",
    amount: "120",
    address: "T-BLOCKED-DEMO-ADDRESS",
    country: "CN",
  }, runtimeOptions).state;
  return runReconciliation(state, runtimeOptions);
}
