import type { LedgerEntry, Transaction } from "./types.js";

export type EntryIdFactory = () => string;

export function buildSettlementEntries(
  transaction: Transaction,
  idFactory: EntryIdFactory,
  now = new Date().toISOString(),
): readonly LedgerEntry[] {
  if (transaction.status !== "COMPLETED") {
    throw new Error("Ledger settlement requires a completed transaction");
  }

  const customerAccount = `LIABILITY:CUSTOMER:${transaction.accountId}`;
  const custodyAccount = `ASSET:CUSTODY:${transaction.asset}`;
  const debitAccount = transaction.kind === "DEPOSIT" ? custodyAccount : customerAccount;
  const creditAccount = transaction.kind === "DEPOSIT" ? customerAccount : custodyAccount;

  return [
    {
      id: idFactory(),
      transactionId: transaction.id,
      account: debitAccount,
      side: "DEBIT",
      asset: transaction.asset,
      amountAtomic: transaction.amountAtomic,
      recordedAt: now,
    },
    {
      id: idFactory(),
      transactionId: transaction.id,
      account: creditAccount,
      side: "CREDIT",
      asset: transaction.asset,
      amountAtomic: transaction.amountAtomic,
      recordedAt: now,
    },
  ];
}

export function isBalanced(entries: readonly LedgerEntry[]): boolean {
  const totals = new Map<string, { debit: bigint; credit: bigint }>();

  for (const entry of entries) {
    const key = `${entry.transactionId}:${entry.asset}`;
    const total = totals.get(key) ?? { debit: 0n, credit: 0n };
    if (entry.side === "DEBIT") total.debit += BigInt(entry.amountAtomic);
    else total.credit += BigInt(entry.amountAtomic);
    totals.set(key, total);
  }

  return totals.size > 0 && [...totals.values()].every(({ debit, credit }) => debit === credit);
}
