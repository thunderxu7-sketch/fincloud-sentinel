import cors from "@fastify/cors";
import { FinCloudService, type ChainSettlement, type TransactionInput } from "@fincloud/domain";
import Fastify, { type FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { Counter, Histogram, Registry, collectDefaultMetrics } from "@prometheus-io/client";
import { ZodError } from "zod";
import { buildIncident } from "./incidents.js";
import {
  incidentInputSchema,
  reconciliationInputSchema,
  transactionInputSchema,
} from "./schemas.js";

export interface ServerOptions {
  readonly service?: FinCloudService;
  readonly logger?: boolean;
}

export async function buildServer(options: ServerOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({ logger: options.logger ?? false, requestIdHeader: "x-request-id" });
  const service = options.service ?? new FinCloudService();
  const registry = new Registry();
  collectDefaultMetrics({ register: registry, prefix: "fincloud_" });

  const transactionCounter = new Counter({
    name: "fincloud_transactions_total",
    help: "Transactions accepted by result",
    labelNames: ["kind", "result"] as const,
    registers: [registry],
  });
  const requestDuration = new Histogram({
    name: "fincloud_http_request_duration_seconds",
    help: "HTTP request duration",
    labelNames: ["method", "route", "status"] as const,
    buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2],
    registers: [registry],
  });

  await app.register(cors, {
    origin: (origin, callback) => {
      const allowed = !origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      callback(allowed ? null : new Error("Origin is not allowed"), allowed);
    },
  });

  app.addHook("onResponse", async (request, reply) => {
    const route = request.routeOptions.url ?? "unknown";
    requestDuration.labels(request.method, route, String(reply.statusCode)).observe(reply.elapsedTime / 1000);
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        error: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: error.issues,
      });
    }
    const message = error instanceof Error ? error.message : "Unexpected service error";
    const status = message.includes("not found") ? 404 : 409;
    return reply.code(status).send({ error: "DOMAIN_ERROR", message });
  });

  app.get("/healthz", async () => ({ status: "ok", service: "fincloud-core-api" }));
  app.get("/readyz", async () => ({ status: "ready", dependencies: { domain: "up" } }));
  app.get("/metrics", async (_request, reply) => {
    reply.header("content-type", registry.contentType);
    return registry.metrics();
  });

  app.get("/api/v1/transactions", async () => ({ items: service.listTransactions() }));
  app.get<{ Params: { id: string } }>("/api/v1/transactions/:id", async (request, reply) => {
    const transaction = service.getTransaction(request.params.id);
    if (!transaction) return reply.code(404).send({ error: "NOT_FOUND" });
    return transaction;
  });
  app.post("/api/v1/transactions", async (request, reply) => {
    const parsed = transactionInputSchema.parse(request.body);
    const input: TransactionInput = {
      idempotencyKey: parsed.idempotencyKey,
      accountId: parsed.accountId,
      kind: parsed.kind,
      asset: parsed.asset,
      amount: parsed.amount,
      address: parsed.address,
      ...(parsed.country === undefined ? {} : { country: parsed.country }),
      ...(parsed.newAddress === undefined ? {} : { newAddress: parsed.newAddress }),
      ...(parsed.recentTransactionCount === undefined
        ? {}
        : { recentTransactionCount: parsed.recentTransactionCount }),
    };
    const result = service.createTransaction(input);
    transactionCounter.labels(input.kind, result.replayed ? "replayed" : result.risk.action.toLowerCase()).inc();
    return reply.code(result.replayed ? 200 : 201).send(result);
  });
  app.post<{ Params: { id: string } }>("/api/v1/transactions/:id/approve", async (request) =>
    service.approveRiskReview(request.params.id),
  );
  app.post<{ Params: { id: string } }>("/api/v1/transactions/:id/complete", async (request) =>
    service.completeTransaction(request.params.id),
  );
  app.post<{ Params: { id: string } }>("/api/v1/transactions/:id/fail", async (request) =>
    service.failTransaction(request.params.id),
  );
  app.get("/api/v1/ledger", async () => ({ items: service.listLedgerEntries() }));
  app.get("/api/v1/outbox", async () => ({ items: service.listEvents() }));
  app.post("/api/v1/reconciliation", async (request) => {
    const input = reconciliationInputSchema.parse(request.body);
    return service.reconcile(input.settlements as readonly ChainSettlement[]);
  });
  app.post("/api/v1/incidents/simulate", async (request) => {
    const input = incidentInputSchema.parse(request.body);
    return buildIncident(input.scenario, randomUUID(), input.transactionId);
  });

  return app;
}
