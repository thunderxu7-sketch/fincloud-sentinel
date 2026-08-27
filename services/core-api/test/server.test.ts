import { FinCloudService } from "@fincloud/domain";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildServer } from "../src/server.js";

let app: FastifyInstance;

beforeEach(async () => {
  let sequence = 0;
  app = await buildServer({
    service: new FinCloudService({
      idFactory: () => `id-${++sequence}`,
      clock: () => "2026-08-27T02:00:00.000Z",
    }),
  });
});

afterEach(async () => {
  await app.close();
});

const validRequest = {
  idempotencyKey: "request-demo-0001",
  accountId: "customer-001",
  kind: "WITHDRAWAL",
  asset: "USDT",
  amount: "25",
  address: "T-TRUSTED-DEMO",
};

describe("core API", () => {
  it("creates and replays an idempotent transaction", async () => {
    const first = await app.inject({ method: "POST", url: "/api/v1/transactions", payload: validRequest });
    const replay = await app.inject({ method: "POST", url: "/api/v1/transactions", payload: validRequest });

    expect(first.statusCode).toBe(201);
    expect(replay.statusCode).toBe(200);
    expect(replay.json().replayed).toBe(true);
    expect(replay.json().transaction.id).toBe(first.json().transaction.id);
  });

  it("completes a transaction and exposes balanced ledger entries", async () => {
    const created = await app.inject({ method: "POST", url: "/api/v1/transactions", payload: validRequest });
    const transactionId = created.json().transaction.id as string;
    const completed = await app.inject({
      method: "POST",
      url: `/api/v1/transactions/${transactionId}/complete`,
    });
    const ledger = await app.inject({ method: "GET", url: "/api/v1/ledger" });

    expect(completed.statusCode).toBe(200);
    expect(completed.json().status).toBe("COMPLETED");
    expect(ledger.json().items).toHaveLength(2);
  });

  it("rejects malformed money input before entering the domain", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/transactions",
      payload: { ...validRequest, amount: "0.000000001" },
    });
    expect(response.statusCode).toBe(400);
    expect(response.json().error).toBe("VALIDATION_ERROR");
  });

  it("generates a structured incident for the copilot", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/incidents/simulate",
      payload: { scenario: "LEDGER_MISMATCH" },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().severity).toBe("SEV-1");
    expect(response.json().metrics.reconciliation_mismatch_total).toBe(1);
  });
});
