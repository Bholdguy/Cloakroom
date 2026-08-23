import type { CloakroomConfig } from "./config.js";
import {
  createEmployerClient,
  defaultExecuteOptions,
  proveAndSubmit,
} from "./client.js";
import { parseAddressColumn } from "./csv.js";
import type { PayrollRow, RunMode } from "./types.js";

/**
 * Stage 1 batch disbursement: one pool tx, chained SDK .transfer() calls.
 * No PayrollAnonymizer involvement — vesting is lock/claim instead.
 */
export async function runPayrollBatch(
  cfg: CloakroomConfig,
  rows: PayrollRow[],
  mode: RunMode,
): Promise<string | undefined> {
  const client = createEmployerClient(cfg);
  const total = rows.reduce((sum, row) => sum + row.amount, 0n);
  console.log(`Payroll batch: ${rows.length} recipients, total ${total}`);

  if (mode === "simulate") {
    console.log("dry-run: Privacy SDK PRIVACY-0.14.3-RC.0 has no builder.simulate()");
    return undefined;
  }
  const { hash } = await proveAndSubmit(client, () =>
    client.transfers
      .build(defaultExecuteOptions)
      .with(cfg.tokenAddress, (t) => {
        for (const [i, row] of rows.entries()) {
          t.transfer({
            recipient: parseAddressColumn(row, `payroll row ${i + 1}`),
            amount: row.amount,
          });
        }
      })
      .surplusTo(cfg.accountAddress, false),
  );
  return hash;
}

export async function registerEmployer(cfg: CloakroomConfig, mode: RunMode): Promise<string | undefined> {
  const client = createEmployerClient(cfg);
  if (mode === "simulate") {
    console.log("dry-run: Privacy SDK PRIVACY-0.14.3-RC.0 has no builder.simulate()");
    return undefined;
  }
  const { hash } = await proveAndSubmit(client, () =>
    client.transfers.build(defaultExecuteOptions).register(),
  );
  return hash;
}

export async function printPrivateBalance(cfg: CloakroomConfig): Promise<void> {
  const client = createEmployerClient(cfg);
  const { notes } = await client.transfers.discoverNotes({
    tokens: [cfg.tokenAddress],
    blockIdentifier: "pre_confirmed",
  });
  const tokenNotes = notes.get(cfg.tokenAddress) ?? [];
  const balance = tokenNotes.reduce((sum, note) => sum + note.amount, 0n);
  console.log(`Unspent notes: ${tokenNotes.length}`);
  console.log(`Private balance (token ${cfg.tokenAddress.toString(16)}): ${balance}`);
}
