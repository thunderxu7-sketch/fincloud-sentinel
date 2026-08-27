import type { Transaction, TransactionStatus } from "./types.js";

const allowedTransitions: Readonly<Record<TransactionStatus, readonly TransactionStatus[]>> = {
  RECEIVED: ["VALIDATING", "FAILED"],
  VALIDATING: ["RISK_REVIEW", "FAILED"],
  RISK_REVIEW: ["APPROVED", "REJECTED", "FAILED"],
  APPROVED: ["BROADCASTING", "FAILED"],
  BROADCASTING: ["CONFIRMING", "FAILED"],
  CONFIRMING: ["COMPLETED", "FAILED"],
  COMPLETED: [],
  REJECTED: [],
  FAILED: [],
};

export function canTransition(from: TransactionStatus, to: TransactionStatus): boolean {
  return allowedTransitions[from].includes(to);
}

export function transitionTransaction(
  transaction: Transaction,
  to: TransactionStatus,
  now = new Date().toISOString(),
): Transaction {
  if (!canTransition(transaction.status, to)) {
    throw new Error(`Invalid transition: ${transaction.status} -> ${to}`);
  }

  return {
    ...transaction,
    status: to,
    updatedAt: now,
    version: transaction.version + 1,
  };
}

export function getAllowedTransitions(status: TransactionStatus): readonly TransactionStatus[] {
  return allowedTransitions[status];
}
