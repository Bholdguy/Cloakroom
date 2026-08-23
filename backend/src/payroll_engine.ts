import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { hash, shortString } from "starknet";
import { parseAddress, parseAmount, parseFelt, toHex } from "./felt.js";

type CsvRecord = Record<string, string | undefined>;

/**
 * PRD planning number, not a protocol limit. ClaimBatch is one InvokeExternal
 * (phase 7, at most once per tx). Whether 30 open notes + invoke fits a
 * proving/step budget has not been measured on the live pool or a matching
 * devnet. Split token groups into chunks of this size until that is confirmed.
 */
export const MAX_BATCH_SIZE = 30;

/** Must match contracts/src/payroll_anonymizer.cairo `VESTING_COMMITMENT_TAG`. */
export const VESTING_COMMITMENT_TAG = BigInt(
  shortString.encodeShortString("VESTING_COMMITMENT_TAG:V1"),
);

export type ParsedPayrollRow = {
  employeeAddress: bigint;
  token: bigint;
  amount: bigint;
  cliffTs: bigint;
  endTs: bigint;
};

export type PayrollEmployee = ParsedPayrollRow & {
  /** Off-chain only. Never put this in Lock calldata. */
  secret: bigint;
  /** `poseidon(VESTING_COMMITMENT_TAG, secret)` — on-chain map key. */
  vestingId: bigint;
};

export type TokenBatchJob = {
  token: bigint;
  entries: PayrollEmployee[];
};

type SecretSidecarRow = {
  employee_address: string;
  token: string;
  amount: string;
  vesting_cliff_ts: string;
  vesting_end_ts: string;
  secret: string;
  vesting_id: string;
};

function cell(row: CsvRecord, name: string): string | undefined {
  const direct = row[name];
  if (direct && direct.trim() !== "") {
    return direct.trim();
  }
  const match = Object.entries(row).find(
    ([key, value]) => key.toLowerCase() === name.toLowerCase() && value && value.trim() !== "",
  );
  return match?.[1]?.trim();
}

function requireCell(row: CsvRecord, name: string, label: string): string {
  const value = cell(row, name);
  if (!value) {
    throw new Error(`${label}: missing column ${name}`);
  }
  return value;
}

export function parsePayrollCsv(path: string): ParsedPayrollRow[] {
  const text = readFileSync(path, "utf8");
  const records = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as CsvRecord[];

  if (records.length === 0) {
    throw new Error(`${path}: no payroll rows`);
  }

  return records.map((row, index) => {
    const label = `${path} row ${index + 2}`;
    const employeeAddress = parseAddress(
      requireCell(row, "employee_address", label),
      `${label} employee_address`,
    );
    const token = parseAddress(requireCell(row, "token", label), `${label} token`);
    const amount = parseAmount(requireCell(row, "amount", label), `${label} amount`);
    const cliffTs = parseFelt(
      requireCell(row, "vesting_cliff_ts", label),
      `${label} vesting_cliff_ts`,
    );
    const endTs = parseFelt(requireCell(row, "vesting_end_ts", label), `${label} vesting_end_ts`);
    if (endTs <= cliffTs) {
      throw new Error(`${label}: vesting_end_ts must be > vesting_cliff_ts`);
    }
    return { employeeAddress, token, amount, cliffTs, endTs };
  });
}

export function generateVestingSecret(): bigint {
  let secret = 0n;
  while (secret === 0n) {
    secret = BigInt(`0x${randomBytes(31).toString("hex")}`);
  }
  return secret;
}

export function computeVestingId(secret: bigint): bigint {
  return BigInt(
    hash.computePoseidonHashOnElements([VESTING_COMMITMENT_TAG, secret]),
  );
}

export function assignVestingSecrets(rows: ParsedPayrollRow[]): PayrollEmployee[] {
  return rows.map((row) => {
    const secret = generateVestingSecret();
    return { ...row, secret, vestingId: computeVestingId(secret) };
  });
}

export function sidecarPath(csvPath: string): string {
  return `${csvPath}.vesting-secrets.json`;
}

export function persistVestingSecrets(path: string, employees: PayrollEmployee[]): void {
  const payload: SecretSidecarRow[] = employees.map((row) => ({
    employee_address: toHex(row.employeeAddress),
    token: toHex(row.token),
    amount: row.amount.toString(),
    vesting_cliff_ts: row.cliffTs.toString(),
    vesting_end_ts: row.endTs.toString(),
    secret: toHex(row.secret),
    vesting_id: toHex(row.vestingId),
  }));
  writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`);
}

export function loadVestingSecrets(path: string): PayrollEmployee[] {
  const payload = JSON.parse(readFileSync(path, "utf8")) as SecretSidecarRow[];
  return payload.map((row, index) => {
    const label = `${path}[${index}]`;
    return {
      employeeAddress: parseAddress(row.employee_address, `${label} employee_address`),
      token: parseAddress(row.token, `${label} token`),
      amount: parseAmount(row.amount, `${label} amount`),
      cliffTs: parseFelt(row.vesting_cliff_ts, `${label} cliff`),
      endTs: parseFelt(row.vesting_end_ts, `${label} end`),
      secret: parseFelt(row.secret, `${label} secret`),
      vestingId: parseFelt(row.vesting_id, `${label} vesting_id`),
    };
  });
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export function groupByToken(employees: PayrollEmployee[]): TokenBatchJob[] {
  const grouped = new Map<bigint, PayrollEmployee[]>();
  for (const employee of employees) {
    const list = grouped.get(employee.token) ?? [];
    list.push(employee);
    grouped.set(employee.token, list);
  }

  const jobs: TokenBatchJob[] = [];
  for (const [token, entries] of grouped) {
    for (const part of chunk(entries, MAX_BATCH_SIZE)) {
      jobs.push({ token, entries: part });
    }
  }
  return jobs;
}

/**
 * Lock: mint a fresh secret per row and persist an issuer-side sidecar.
 * That file is at-rest storage for the employer process, not employee delivery.
 */
export function loadPayrollJobsForLock(csvPath: string): TokenBatchJob[] {
  const assigned = assignVestingSecrets(parsePayrollCsv(csvPath));
  const sidecar = sidecarPath(csvPath);
  persistVestingSecrets(sidecar, assigned);
  console.log(`Wrote issuer-side vesting secrets to ${sidecar} (not employee delivery)`);
  return groupByToken(assigned);
}

/** Claim: reuse secrets from the lock sidecar. Do not regenerate. */
export function loadPayrollJobsForClaim(csvPath: string): TokenBatchJob[] {
  const sidecar = sidecarPath(csvPath);
  if (!existsSync(sidecar)) {
    throw new Error(
      `Missing ${sidecar}. Run lock first and deliver each secret to the employee off-chain.`,
    );
  }
  return groupByToken(loadVestingSecrets(sidecar));
}
