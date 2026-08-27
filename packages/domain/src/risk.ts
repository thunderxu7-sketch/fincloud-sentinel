import { toAtomicUnits } from "./money.js";
import type { RiskDecision, RiskLevel, TransactionInput } from "./types.js";

export interface RiskPolicy {
  readonly blockedAddresses: ReadonlySet<string>;
  readonly reviewThreshold: string;
  readonly blockThreshold: string;
  readonly velocityThreshold: number;
  readonly homeCountry: string;
}

export const defaultRiskPolicy: RiskPolicy = {
  blockedAddresses: new Set(["T-BLOCKED-DEMO-ADDRESS", "0xblocked-demo-address"]),
  reviewThreshold: "10000",
  blockThreshold: "100000",
  velocityThreshold: 8,
  homeCountry: "CN",
};

function riskLevel(score: number): RiskLevel {
  if (score >= 90) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

export function evaluateRisk(
  input: TransactionInput,
  policy: RiskPolicy = defaultRiskPolicy,
): RiskDecision {
  let score = 0;
  const reasons: string[] = [];
  const amount = toAtomicUnits(input.amount);

  if (policy.blockedAddresses.has(input.address)) {
    score = 100;
    reasons.push("Address matches the deny list");
  }

  if (amount >= toAtomicUnits(policy.blockThreshold)) {
    score += 60;
    reasons.push("Amount exceeds the hard review threshold");
  } else if (amount >= toAtomicUnits(policy.reviewThreshold)) {
    score += 35;
    reasons.push("Amount exceeds the enhanced review threshold");
  }

  if ((input.recentTransactionCount ?? 0) >= policy.velocityThreshold) {
    score += 30;
    reasons.push("Transaction velocity is above policy");
  }

  if (input.newAddress) {
    score += 15;
    reasons.push("Destination address has not been used before");
  }

  if (input.country && input.country !== policy.homeCountry) {
    score += 10;
    reasons.push("Request originates outside the account home country");
  }

  score = Math.min(score, 100);
  const level = riskLevel(score);
  const action = level === "CRITICAL" ? "BLOCK" : level === "HIGH" || level === "MEDIUM" ? "REVIEW" : "ALLOW";

  return {
    level,
    action,
    score,
    reasons: reasons.length > 0 ? reasons : ["No elevated risk signal detected"],
  };
}
