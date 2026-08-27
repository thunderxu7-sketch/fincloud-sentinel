import { z } from "zod";

export const transactionInputSchema = z.object({
  idempotencyKey: z.string().min(8).max(128),
  accountId: z.string().min(3).max(64),
  kind: z.enum(["DEPOSIT", "WITHDRAWAL"]),
  asset: z.string().min(2).max(12),
  amount: z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,8})?$/),
  address: z.string().min(3).max(256),
  country: z.string().length(2).optional(),
  newAddress: z.boolean().optional(),
  recentTransactionCount: z.number().int().nonnegative().optional(),
});

export const chainSettlementSchema = z.object({
  transactionId: z.string().min(1),
  status: z.enum(["CONFIRMED", "PENDING", "MISSING"]),
  amountAtomic: z.string().regex(/^\d+$/),
  confirmations: z.number().int().nonnegative(),
});

export const reconciliationInputSchema = z.object({
  settlements: z.array(chainSettlementSchema),
});

export const incidentInputSchema = z.object({
  scenario: z.enum(["CHAIN_DELAY", "DUPLICATE_EVENT", "LEDGER_MISMATCH", "MODEL_TIMEOUT"]),
  transactionId: z.string().optional(),
});
