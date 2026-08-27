import { describe, expect, it } from "vitest";
import {
  FinCloudService,
  buildSettlementEntries,
  canTransition,
  evaluateRisk,
  formatAtomicUnits,
  isBalanced,
  reconcileSettlements,
  toAtomicUnits,
  transitionTransaction,
  type Transaction,
} from "../src/index.js";

const fixedNow = "2026-08-27T02:00:00.000Z";

function transaction(status: Transaction["status"]): Transaction {
  return {
    id: "tx-1",
    idempotencyKey: "idem-1",
    accountId: "customer-1",
    kind: "WITHDRAWAL",
    asset: "USDT",
    amount: "12.5",
    amountAtomic: "1250000000",
    address: "T-DEMO",
    status,
    riskLevel: "LOW",
    riskScore: 0,
    riskReasons: ["No elevated risk signal detected"],
    createdAt: fixedNow,
    updatedAt: fixedNow,
    version: 1,
  };
}

describe("money", () => {
  it("uses integer atomic units instead of floating point", () => {
    expect(toAtomicUnits("0.00000001")).toBe(1n);
    expect(toAtomicUnits("12.5")).toBe(1_250_000_000n);
    expect(formatAtomicUnits(1_250_000_000n)).toBe("12.5");
  });

  it("rejects precision beyond the asset policy", () => {
    expect(() => toAtomicUnits("1.000000001")).toThrow(/at most 8 places/);
  });
});

describe("transaction state machine", () => {
  it("accepts only explicit state transitions", () => {
    expect(canTransition("APPROVED", "BROADCASTING")).toBe(true);
    expect(canTransition("APPROVED", "COMPLETED")).toBe(false);
    expect(() => transitionTransaction(transaction("APPROVED"), "COMPLETED")).toThrow(
      "Invalid transition",
    );
  });
});

describe("risk policy", () => {
  it("blocks a deny-listed address", () => {
    const decision = evaluateRisk({
      idempotencyKey: "risk-1",
      accountId: "customer-1",
      kind: "WITHDRAWAL",
      asset: "USDT",
      amount: "1",
      address: "T-BLOCKED-DEMO-ADDRESS",
    });
    expect(decision.action).toBe("BLOCK");
    expect(decision.level).toBe("CRITICAL");
  });

  it("routes elevated but non-critical activity to review", () => {
    const decision = evaluateRisk({
      idempotencyKey: "risk-2",
      accountId: "customer-1",
      kind: "WITHDRAWAL",
      asset: "USDT",
      amount: "15000",
      address: "T-NEW",
      newAddress: true,
    });
    expect(decision.action).toBe("REVIEW");
    expect(decision.score).toBe(50);
  });
});

describe("ledger and reconciliation", () => {
  it("creates a balanced double-entry settlement", () => {
    let sequence = 0;
    const completed = transaction("COMPLETED");
    const entries = buildSettlementEntries(completed, () => `entry-${++sequence}`, fixedNow);
    expect(entries).toHaveLength(2);
    expect(isBalanced(entries)).toBe(true);
  });

  it("detects a missing chain settlement", () => {
    const completed = transaction("COMPLETED");
    const entries = buildSettlementEntries(completed, () => "entry", fixedNow);
    const report = reconcileSettlements([completed], entries, [], "run-1", fixedNow);
    expect(report.matchedCount).toBe(0);
    expect(report.issues[0]?.code).toBe("MISSING_CHAIN_SETTLEMENT");
  });
});

describe("FinCloudService", () => {
  it("replays duplicate idempotency keys without creating a second transaction", () => {
    let sequence = 0;
    const service = new FinCloudService({
      idFactory: () => `id-${++sequence}`,
      clock: () => fixedNow,
    });
    const input = {
      idempotencyKey: "request-1",
      accountId: "customer-1",
      kind: "DEPOSIT" as const,
      asset: "USDT",
      amount: "25",
      address: "T-CUSTODY",
    };

    const first = service.createTransaction(input);
    const replay = service.createTransaction(input);

    expect(first.replayed).toBe(false);
    expect(replay.replayed).toBe(true);
    expect(replay.transaction.id).toBe(first.transaction.id);
    expect(service.listTransactions()).toHaveLength(1);
  });

  it("completes an approved transaction and posts its ledger", () => {
    let sequence = 0;
    const service = new FinCloudService({
      idFactory: () => `id-${++sequence}`,
      clock: () => fixedNow,
    });
    const created = service.createTransaction({
      idempotencyKey: "request-2",
      accountId: "customer-2",
      kind: "WITHDRAWAL",
      asset: "USDT",
      amount: "25",
      address: "T-TRUSTED",
    });

    const completed = service.completeTransaction(created.transaction.id);
    expect(completed.status).toBe("COMPLETED");
    expect(service.listLedgerEntries()).toHaveLength(2);
    expect(isBalanced(service.listLedgerEntries())).toBe(true);
  });
});
