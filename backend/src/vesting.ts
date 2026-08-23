import { Open, type InvokeCalldataBuilderArgs } from "@starkware-libs/starknet-privacy-sdk";
import type { CallDetails } from "starknet";
import {
  encodeClaimBatchCalldata,
  encodeLockCalldata,
} from "./builder.js";
import { requireAnonymizer, type CloakroomConfig } from "./config.js";
import { parseFelt, toHex } from "./felt.js";
import {
  createEmployerClient,
  defaultExecuteOptions,
  proveAndSubmit,
} from "./client.js";
import { parseAddressColumn } from "./csv.js";
import type { PayrollRow, RunMode } from "./types.js";

export {
  VestingOperation,
  encodeClaimBatchCalldata,
  encodeClaimCalldata,
  encodeLockCalldata,
} from "./builder.js";

function requireLockFields(row: PayrollRow, label: string) {
  if (row.vestingId === undefined) {
    throw new Error(`${label}: vesting_id is required for lock`);
  }
  if (row.cliffTs === undefined || row.endTs === undefined) {
    throw new Error(`${label}: cliff_ts and end_ts are required for lock`);
  }
  if (row.sessionKeyId === undefined) {
    throw new Error(`${label}: session_key_id is required for lock`);
  }
  if (row.endTs <= row.cliffTs) {
    throw new Error(`${label}: end_ts must be > cliff_ts`);
  }
  return {
    vestingId: row.vestingId,
    cliffTs: row.cliffTs,
    endTs: row.endTs,
    sessionKeyId: row.sessionKeyId,
  };
}

/**
 * One Lock per tx (pool allows a single InvokeExternal). Withdraws principal
 * to the anonymizer, then privacy_invoke(Lock) — empty open-note span.
 */
export async function lockVestingRows(
  cfg: CloakroomConfig,
  rows: PayrollRow[],
  mode: RunMode,
): Promise<string[]> {
  const anonymizer = requireAnonymizer(cfg);
  const client = createEmployerClient(cfg);
  const hashes: string[] = [];

  for (const [i, row] of rows.entries()) {
    const label = `lock row ${i + 1}`;
    const fields = requireLockFields(row, label);
    if (mode === "simulate") {
      console.log(`${label}: dry-run (no builder.simulate in PRIVACY-0.14.3-RC.0)`);
      continue;
    }
    const { hash } = await proveAndSubmit(client, () =>
      client.transfers
        .build(defaultExecuteOptions)
        .with(cfg.tokenAddress, (t) => {
          t.withdraw({ recipient: anonymizer, amount: row.amount });
        })
        .surplusTo(cfg.accountAddress, false)
        .invoke(() => ({
          contractAddress: toHex(anonymizer),
          calldata: encodeLockCalldata({
            vestingId: fields.vestingId,
            token: cfg.tokenAddress,
            amount: row.amount,
            cliffTs: fields.cliffTs,
            endTs: fields.endTs,
            sessionKeyId: fields.sessionKeyId,
          }),
        })),
    );
    if (hash) {
      hashes.push(hash);
      console.log(`${label}: ${hash}`);
    } else {
      console.log(`${label}: simulated`);
    }
  }
  return hashes;
}

/**
 * One ClaimBatch per tx: CreateOpenNote (amount Open) for each employee, then
 * privacy_invoke(ClaimBatch) with note ids assigned by the SDK.
 */
export async function claimVestingRows(
  cfg: CloakroomConfig,
  rows: PayrollRow[],
  mode: RunMode,
): Promise<string | undefined> {
  const anonymizer = requireAnonymizer(cfg);
  const client = createEmployerClient(cfg);

  for (const [i, row] of rows.entries()) {
    if (row.vestingId === undefined) {
      throw new Error(`claim row ${i + 1}: vesting_id is required`);
    }
  }

  if (mode === "simulate") {
    console.log("dry-run claim (no builder.simulate in PRIVACY-0.14.3-RC.0)");
    return undefined;
  }
  const { hash } = await proveAndSubmit(client, () =>
    client.transfers
      .build(defaultExecuteOptions)
      .with(cfg.tokenAddress, (t) => {
        for (const [i, row] of rows.entries()) {
          t.transfer({
            recipient: parseAddressColumn(row, `claim row ${i + 1}`),
            amount: Open,
          });
        }
      })
      .invoke((args: InvokeCalldataBuilderArgs): CallDetails => {
        if (args.openNotes.length !== rows.length) {
          throw new Error(
            `expected ${rows.length} open notes, SDK assigned ${args.openNotes.length}`,
          );
        }
        const pairs = rows.map((row, i) => {
          if (row.secret === undefined) {
            throw new Error(`claim row ${i + 1}: off-chain vesting secret is required`);
          }
          return {
            secret: row.secret,
            noteId: BigInt(args.openNotes[i].noteId),
          };
        });
        return {
          contractAddress: toHex(anonymizer),
          calldata: encodeClaimBatchCalldata(pairs),
        };
      }),
  );
  return hash;
}

export async function registerSessionKey(
  cfg: CloakroomConfig,
  sessionKeyId: string,
  budget: string,
  expiresAt: string,
): Promise<string> {
  const anonymizer = requireAnonymizer(cfg);
  const client = createEmployerClient(cfg);
  const { transaction_hash } = await client.account.execute({
    contractAddress: toHex(anonymizer),
    entrypoint: "register_session_key",
    calldata: [
      parseFelt(sessionKeyId, "session_key_id"),
      parseFelt(budget, "budget"),
      parseFelt(expiresAt, "expires_at"),
    ],
  });
  await client.provider.waitForTransaction(transaction_hash);
  return transaction_hash;
}
