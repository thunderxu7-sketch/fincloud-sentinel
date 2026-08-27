const amountPattern = /^(?:0|[1-9]\d*)(?:\.\d{1,8})?$/;

export function toAtomicUnits(amount: string, decimals = 8): bigint {
  if (!amountPattern.test(amount)) {
    throw new Error("Amount must be a non-negative decimal with at most 8 places");
  }

  const [whole = "0", fraction = ""] = amount.split(".");
  const normalizedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(normalizedFraction || "0");
}

export function requirePositiveAmount(amount: string): bigint {
  const atomic = toAtomicUnits(amount);
  if (atomic <= 0n) {
    throw new Error("Amount must be greater than zero");
  }
  return atomic;
}

export function formatAtomicUnits(value: bigint, decimals = 8): string {
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  const base = 10n ** BigInt(decimals);
  const whole = absolute / base;
  const fraction = (absolute % base).toString().padStart(decimals, "0").replace(/0+$/, "");
  const formatted = fraction ? `${whole}.${fraction}` : whole.toString();
  return negative ? `-${formatted}` : formatted;
}
