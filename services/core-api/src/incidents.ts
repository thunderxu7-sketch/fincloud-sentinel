export interface Incident {
  readonly id: string;
  readonly title: string;
  readonly severity: "SEV-1" | "SEV-2" | "SEV-3";
  readonly symptom: string;
  readonly metrics: Readonly<Record<string, number>>;
  readonly logExcerpt: readonly string[];
  readonly transactionId?: string;
}

export function buildIncident(
  scenario: "CHAIN_DELAY" | "DUPLICATE_EVENT" | "LEDGER_MISMATCH" | "MODEL_TIMEOUT",
  id: string,
  transactionId?: string,
): Incident {
  const common = transactionId ? { id, transactionId } : { id };
  switch (scenario) {
    case "CHAIN_DELAY":
      return {
        ...common,
        title: "External settlement confirmations are delayed",
        severity: "SEV-2",
        symptom: "Transactions remain in CONFIRMING beyond the 10-minute SLO",
        metrics: { confirming_age_p95_seconds: 842, rpc_error_rate: 0.18, queue_lag: 42 },
        logExcerpt: [
          "rpc timeout after 3000ms; retry=3",
          "confirmation watcher switched to secondary endpoint",
        ],
      };
    case "DUPLICATE_EVENT":
      return {
        ...common,
        title: "Duplicate settlement events detected",
        severity: "SEV-3",
        symptom: "The same event identifier was delivered more than once",
        metrics: { duplicate_event_total: 17, ledger_post_duplicate_total: 0, queue_lag: 3 },
        logExcerpt: ["duplicate event ignored by inbox key", "ledger invariant remains balanced"],
      };
    case "LEDGER_MISMATCH":
      return {
        ...common,
        title: "Ledger reconciliation mismatch",
        severity: "SEV-1",
        symptom: "External settlement amount differs from the internal double-entry ledger",
        metrics: { reconciliation_mismatch_total: 1, unmatched_value_usdt: 2500, queue_lag: 0 },
        logExcerpt: ["reconciliation invariant failed", "automatic settlement paused for asset=USDT"],
      };
    case "MODEL_TIMEOUT":
      return {
        ...common,
        title: "Risk model inference timed out",
        severity: "SEV-2",
        symptom: "PAI-EAS inference latency exceeded the policy budget",
        metrics: { model_latency_p95_ms: 4350, model_timeout_rate: 0.22, fallback_rule_total: 91 },
        logExcerpt: ["risk-model timeout; circuit breaker opened", "deterministic rules fallback activated"],
      };
  }
}
