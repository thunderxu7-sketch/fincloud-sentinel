export const transactionStatuses = [
  "RECEIVED",
  "VALIDATING",
  "RISK_REVIEW",
  "APPROVED",
  "BROADCASTING",
  "CONFIRMING",
  "COMPLETED",
  "REJECTED",
  "FAILED",
] as const;

export type TransactionStatus = (typeof transactionStatuses)[number];
export type TransactionKind = "DEPOSIT" | "WITHDRAWAL";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RiskAction = "ALLOW" | "REVIEW" | "BLOCK";

export interface TransactionInput {
  readonly idempotencyKey: string;
  readonly accountId: string;
  readonly kind: TransactionKind;
  readonly asset: string;
  readonly amount: string;
  readonly address: string;
  readonly country?: string;
  readonly newAddress?: boolean;
  readonly recentTransactionCount?: number;
}

export interface Transaction {
  readonly id: string;
  readonly idempotencyKey: string;
  readonly accountId: string;
  readonly kind: TransactionKind;
  readonly asset: string;
  readonly amount: string;
  readonly amountAtomic: string;
  readonly address: string;
  readonly status: TransactionStatus;
  readonly riskLevel: RiskLevel;
  readonly riskScore: number;
  readonly riskReasons: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly version: number;
}

export interface RiskDecision {
  readonly level: RiskLevel;
  readonly action: RiskAction;
  readonly score: number;
  readonly reasons: readonly string[];
}

export interface LedgerEntry {
  readonly id: string;
  readonly transactionId: string;
  readonly account: string;
  readonly side: "DEBIT" | "CREDIT";
  readonly asset: string;
  readonly amountAtomic: string;
  readonly recordedAt: string;
}

export interface DomainEvent {
  readonly id: string;
  readonly aggregateId: string;
  readonly type: string;
  readonly occurredAt: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface ChainSettlement {
  readonly transactionId: string;
  readonly status: "CONFIRMED" | "PENDING" | "MISSING";
  readonly amountAtomic: string;
  readonly confirmations: number;
}

export interface ReconciliationIssue {
  readonly transactionId: string;
  readonly code:
    | "UNBALANCED_LEDGER"
    | "MISSING_CHAIN_SETTLEMENT"
    | "CHAIN_AMOUNT_MISMATCH"
    | "INSUFFICIENT_CONFIRMATIONS";
  readonly severity: "WARNING" | "CRITICAL";
  readonly detail: string;
}

export interface ReconciliationReport {
  readonly runId: string;
  readonly checkedAt: string;
  readonly transactionCount: number;
  readonly matchedCount: number;
  readonly issues: readonly ReconciliationIssue[];
}

export interface CreateTransactionResult {
  readonly transaction: Transaction;
  readonly risk: RiskDecision;
  readonly replayed: boolean;
}
