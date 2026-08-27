import { buildSettlementEntries } from "./ledger.js";
import { requirePositiveAmount } from "./money.js";
import { reconcileSettlements } from "./reconciliation.js";
import { defaultRiskPolicy, evaluateRisk, type RiskPolicy } from "./risk.js";
import { transitionTransaction } from "./state-machine.js";
import type {
  ChainSettlement,
  CreateTransactionResult,
  DomainEvent,
  LedgerEntry,
  ReconciliationReport,
  RiskDecision,
  Transaction,
  TransactionInput,
  TransactionStatus,
} from "./types.js";

export interface ServiceOptions {
  readonly idFactory?: () => string;
  readonly clock?: () => string;
  readonly riskPolicy?: RiskPolicy;
}

const defaultIdFactory = (): string => {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export class FinCloudService {
  readonly #transactions = new Map<string, Transaction>();
  readonly #idempotency = new Map<string, string>();
  readonly #risks = new Map<string, RiskDecision>();
  readonly #ledger: LedgerEntry[] = [];
  readonly #events: DomainEvent[] = [];
  readonly #idFactory: () => string;
  readonly #clock: () => string;
  readonly #riskPolicy: RiskPolicy;

  constructor(options: ServiceOptions = {}) {
    this.#idFactory = options.idFactory ?? defaultIdFactory;
    this.#clock = options.clock ?? (() => new Date().toISOString());
    this.#riskPolicy = options.riskPolicy ?? defaultRiskPolicy;
  }

  createTransaction(input: TransactionInput): CreateTransactionResult {
    const existingId = this.#idempotency.get(input.idempotencyKey);
    if (existingId) {
      const transaction = this.requireTransaction(existingId);
      const risk = this.#risks.get(existingId);
      if (!risk) throw new Error("Risk decision missing for replayed transaction");
      return { transaction, risk, replayed: true };
    }

    if (!input.idempotencyKey.trim() || !input.accountId.trim() || !input.address.trim()) {
      throw new Error("Idempotency key, account and address are required");
    }

    const amountAtomic = requirePositiveAmount(input.amount);
    const now = this.#clock();
    const risk = evaluateRisk(input, this.#riskPolicy);
    let transaction: Transaction = {
      id: this.#idFactory(),
      idempotencyKey: input.idempotencyKey,
      accountId: input.accountId,
      kind: input.kind,
      asset: input.asset.toUpperCase(),
      amount: input.amount,
      amountAtomic: amountAtomic.toString(),
      address: input.address,
      status: "RECEIVED",
      riskLevel: risk.level,
      riskScore: risk.score,
      riskReasons: risk.reasons,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.#transactions.set(transaction.id, transaction);
    this.#idempotency.set(input.idempotencyKey, transaction.id);
    this.#risks.set(transaction.id, risk);
    this.recordEvent(transaction, "TransactionReceived");
    transaction = this.move(transaction, "VALIDATING");
    transaction = this.move(transaction, "RISK_REVIEW");

    if (risk.action === "ALLOW") transaction = this.move(transaction, "APPROVED");
    if (risk.action === "BLOCK") transaction = this.move(transaction, "REJECTED");

    return { transaction, risk, replayed: false };
  }

  approveRiskReview(transactionId: string): Transaction {
    return this.move(this.requireTransaction(transactionId), "APPROVED");
  }

  completeTransaction(transactionId: string): Transaction {
    let transaction = this.requireTransaction(transactionId);
    transaction = this.move(transaction, "BROADCASTING");
    transaction = this.move(transaction, "CONFIRMING");
    transaction = this.move(transaction, "COMPLETED");
    this.#ledger.push(...buildSettlementEntries(transaction, this.#idFactory, this.#clock()));
    this.recordEvent(transaction, "LedgerSettled");
    return transaction;
  }

  failTransaction(transactionId: string): Transaction {
    return this.move(this.requireTransaction(transactionId), "FAILED");
  }

  getTransaction(transactionId: string): Transaction | undefined {
    return this.#transactions.get(transactionId);
  }

  listTransactions(): readonly Transaction[] {
    return [...this.#transactions.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  listLedgerEntries(): readonly LedgerEntry[] {
    return [...this.#ledger];
  }

  listEvents(): readonly DomainEvent[] {
    return [...this.#events];
  }

  reconcile(settlements: readonly ChainSettlement[]): ReconciliationReport {
    return reconcileSettlements(
      this.listTransactions(),
      this.listLedgerEntries(),
      settlements,
      this.#idFactory(),
      this.#clock(),
    );
  }

  private requireTransaction(transactionId: string): Transaction {
    const transaction = this.#transactions.get(transactionId);
    if (!transaction) throw new Error(`Transaction not found: ${transactionId}`);
    return transaction;
  }

  private move(transaction: Transaction, status: TransactionStatus): Transaction {
    const updated = transitionTransaction(transaction, status, this.#clock());
    this.#transactions.set(updated.id, updated);
    this.recordEvent(updated, `Transaction${status.replace(/(^|_)([A-Z])/g, (_, __, letter: string) => letter)}`);
    return updated;
  }

  private recordEvent(transaction: Transaction, type: string): void {
    this.#events.push({
      id: this.#idFactory(),
      aggregateId: transaction.id,
      type,
      occurredAt: this.#clock(),
      payload: {
        transactionId: transaction.id,
        status: transaction.status,
        version: transaction.version,
      },
    });
  }
}
