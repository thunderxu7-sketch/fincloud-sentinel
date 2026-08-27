import { isBalanced } from "./ledger.js";
import type {
  ChainSettlement,
  LedgerEntry,
  ReconciliationIssue,
  ReconciliationReport,
  Transaction,
} from "./types.js";

export function reconcileSettlements(
  transactions: readonly Transaction[],
  entries: readonly LedgerEntry[],
  settlements: readonly ChainSettlement[],
  runId: string,
  now = new Date().toISOString(),
): ReconciliationReport {
  const issues: ReconciliationIssue[] = [];
  const completed = transactions.filter((transaction) => transaction.status === "COMPLETED");

  for (const transaction of completed) {
    const transactionEntries = entries.filter((entry) => entry.transactionId === transaction.id);
    if (!isBalanced(transactionEntries)) {
      issues.push({
        transactionId: transaction.id,
        code: "UNBALANCED_LEDGER",
        severity: "CRITICAL",
        detail: "Debit and credit totals do not match",
      });
    }

    const settlement = settlements.find((item) => item.transactionId === transaction.id);
    if (!settlement || settlement.status === "MISSING") {
      issues.push({
        transactionId: transaction.id,
        code: "MISSING_CHAIN_SETTLEMENT",
        severity: "CRITICAL",
        detail: "No confirmed external settlement was found",
      });
      continue;
    }

    if (settlement.amountAtomic !== transaction.amountAtomic) {
      issues.push({
        transactionId: transaction.id,
        code: "CHAIN_AMOUNT_MISMATCH",
        severity: "CRITICAL",
        detail: `Expected ${transaction.amountAtomic}, received ${settlement.amountAtomic}`,
      });
    }

    if (settlement.status !== "CONFIRMED" || settlement.confirmations < 12) {
      issues.push({
        transactionId: transaction.id,
        code: "INSUFFICIENT_CONFIRMATIONS",
        severity: "WARNING",
        detail: `Only ${settlement.confirmations} confirmations are available`,
      });
    }
  }

  const affected = new Set(issues.map((issue) => issue.transactionId));
  return {
    runId,
    checkedAt: now,
    transactionCount: completed.length,
    matchedCount: completed.length - affected.size,
    issues,
  };
}
