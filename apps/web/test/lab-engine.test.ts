import { describe, expect, it } from "vitest";
import {
  approveContainment,
  approveTransaction,
  completeTransaction,
  emptyLabState,
  injectSettlementFault,
  investigate,
  isTransactionBalanced,
  runReconciliation,
  submitTransaction,
  type LabRuntime,
} from "../lib/lab-engine";

function deterministicRuntime(): LabRuntime {
  let sequence = 0;
  return {
    now: () => "2026-08-27T04:00:00.000Z",
    id: (prefix) => `${prefix}-${++sequence}`,
  };
}

const normalInput = {
  idempotencyKey: "withdrawal-001",
  accountId: "customer-1",
  kind: "WITHDRAWAL" as const,
  asset: "USDT",
  amount: "250",
  address: "T-TRUSTED",
  country: "CN",
  newAddress: false,
  recentTransactionCount: 1,
};

describe("browser transaction laboratory", () => {
  it("executes risk, state-machine, settlement, ledger, and reconciliation rules", () => {
    const runtime = deterministicRuntime();
    const submitted = submitTransaction(emptyLabState(), normalInput, runtime);
    expect(submitted.transaction.status).toBe("APPROVED");

    const settled = completeTransaction(submitted.state, submitted.transaction.id, runtime);
    expect(settled.transactions[0]?.status).toBe("COMPLETED");
    expect(settled.ledger).toHaveLength(2);
    expect(isTransactionBalanced(settled, submitted.transaction.id)).toBe(true);

    const reconciled = runReconciliation(settled, runtime);
    expect(reconciled.reconciliation?.matchedCount).toBe(1);
    expect(reconciled.reconciliation?.issues).toHaveLength(0);
  });

  it("returns the original result when the idempotency key is replayed", () => {
    const runtime = deterministicRuntime();
    const first = submitTransaction(emptyLabState(), normalInput, runtime);
    const replay = submitTransaction(first.state, normalInput, runtime);

    expect(replay.replayed).toBe(true);
    expect(replay.state.transactions).toHaveLength(1);
    expect(replay.state.replays).toBe(1);
    expect(replay.state.events.at(-1)?.type).toBe("IdempotencyReplayDetected");
  });

  it("requires review, records explicit approval, and then permits settlement", () => {
    const runtime = deterministicRuntime();
    const submitted = submitTransaction(emptyLabState(), {
      ...normalInput,
      idempotencyKey: "withdrawal-review",
      amount: "18000",
      newAddress: true,
      recentTransactionCount: 4,
      country: "SG",
    }, runtime);
    expect(submitted.transaction.status).toBe("RISK_REVIEW");

    const approved = approveTransaction(submitted.state, submitted.transaction.id, runtime);
    const settled = completeTransaction(approved, submitted.transaction.id, runtime);
    expect(settled.transactions[0]?.status).toBe("COMPLETED");
    expect(settled.events.some((event) => event.type === "RiskReviewApproved")).toBe(true);
  });

  it("turns an injected mismatch into cited diagnosis and approved containment", () => {
    const runtime = deterministicRuntime();
    const submitted = submitTransaction(emptyLabState(), normalInput, runtime);
    const settled = completeTransaction(submitted.state, submitted.transaction.id, runtime);
    const faulted = injectSettlementFault(settled, submitted.transaction.id, "AMOUNT_MISMATCH", runtime);
    const reconciled = runReconciliation(faulted, runtime);
    const finding = investigate(reconciled, submitted.transaction.id, "What happened?");

    expect(reconciled.reconciliation?.issues[0]?.code).toBe("CHAIN_AMOUNT_MISMATCH");
    expect(finding.issueCode).toBe("CHAIN_AMOUNT_MISMATCH");
    expect(finding.evidence).toHaveLength(3);
    expect(finding.approvalRequired).toBe(true);

    const contained = approveContainment(reconciled, submitted.transaction.id, runtime);
    expect(contained.pausedAssets).toContain("USDT");
    expect(contained.events.at(-1)?.type).toBe("SettlementRoutePaused");
  });
});
