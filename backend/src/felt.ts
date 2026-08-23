const MAX_U128 = (1n << 128n) - 1n;

export function parseFelt(value: string | number | bigint, label: string): bigint {
  if (typeof value === "bigint") {
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`${label}: expected a non-negative integer`);
    }
    return BigInt(value);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed === "0x") {
    return 0n;
  }
  try {
    return BigInt(trimmed);
  } catch {
    throw new Error(`${label}: not a valid integer or 0x-hex felt (${trimmed})`);
  }
}

export function parseAddress(value: string, label: string): bigint {
  const felt = parseFelt(value, label);
  if (felt === 0n) {
    throw new Error(`${label}: zero address`);
  }
  return felt;
}

export function parseAmount(value: string, label: string): bigint {
  const amount = parseFelt(value, label);
  if (amount === 0n) {
    throw new Error(`${label}: amount must be > 0`);
  }
  if (amount > MAX_U128) {
    throw new Error(`${label}: amount exceeds u128 (pool note width)`);
  }
  return amount;
}

export function toHex(value: bigint): string {
  return `0x${value.toString(16)}`;
}
