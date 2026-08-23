import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { parseAddress, parseAmount, parseFelt } from "./felt.js";
import type { PayrollRow } from "./types.js";

type CsvRecord = Record<string, string | undefined>;

function cell(row: CsvRecord, ...names: string[]): string | undefined {
  for (const name of names) {
    const direct = row[name];
    if (direct && direct.trim() !== "") {
      return direct.trim();
    }
    const match = Object.entries(row).find(
      ([key, value]) => key.toLowerCase() === name.toLowerCase() && value && value.trim() !== "",
    );
    if (match?.[1]) {
      return match[1].trim();
    }
  }
  return undefined;
}

export function loadPayrollCsv(path: string): PayrollRow[] {
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
    const recipient = cell(row, "recipient", "address", "employee");
    const amount = cell(row, "amount");
    if (!recipient || !amount) {
      throw new Error(`${label}: need recipient and amount columns`);
    }

    const vestingId = cell(row, "vesting_id", "vestingId");
    const cliffTs = cell(row, "cliff_ts", "cliffTs", "cliff_timestamp");
    const endTs = cell(row, "end_ts", "endTs", "end_timestamp");
    const sessionKeyId = cell(row, "session_key_id", "sessionKeyId");

    return {
      recipient,
      amount: parseAmount(amount, `${label} amount`),
      vestingId: vestingId ? parseFelt(vestingId, `${label} vesting_id`) : undefined,
      cliffTs: cliffTs ? parseFelt(cliffTs, `${label} cliff_ts`) : undefined,
      endTs: endTs ? parseFelt(endTs, `${label} end_ts`) : undefined,
      sessionKeyId: sessionKeyId
        ? parseFelt(sessionKeyId, `${label} session_key_id`)
        : undefined,
    };
  });
}

export function parseAddressColumn(row: PayrollRow, label: string): bigint {
  return parseAddress(row.recipient, label);
}
