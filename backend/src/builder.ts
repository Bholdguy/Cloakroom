import { Open, type InvokeCalldataBuilderArgs } from "@starkware-libs/starknet-privacy-sdk";
import type { CallDetails } from "starknet";
import { requireAnonymizer, type CloakroomConfig } from "./config.js";
import {
  createEmployerClient,
  defaultExecuteOptions,
  proveAndSubmit,
  type EmployerClient,
} from "./client.js";
import { toHex } from "./felt.js";
import type { TokenBatchJob } from "./payroll_engine.js";
import type { RunMode } from "./types.js";

export const VestingOperation = {
  Lock: 0n,
  Claim: 1n,
  ClaimBatch: 2n,
} as const;

function unused(): bigint {
  return 0n;
}

export function encodeLockCalldata(args: {
  vestingId: bigint;
  token: bigint;
  amount: bigint;
  cliffTs: bigint;
  endTs: bigint;
  sessionKeyId: bigint;
}): bigint[] {
  return [
    VestingOperation.Lock,
    args.vestingId,
    args.token,
    args.amount,
    args.cliffTs,
    args.endTs,
    args.sessionKeyId,
    unused(),
    unused(),
    0n,
  ];
}

export function encodeClaimCalldata(secret: bigint, noteId: bigint): bigint[] {
  return [
    VestingOperation.Claim,
    unused(),
    unused(),
    unused(),
    unused(),
    unused(),
    unused(),
    secret,
    noteId,
    0n,
  ];
}

export function encodeClaimBatchCalldata(
  pairs: Array<{ secret: bigint; noteId: bigint }>,
): bigint[] {
  const calldata: bigint[] = [
    VestingOperation.ClaimBatch,
    unused(),
    unused(),
    unused(),
    unused(),
    unused(),
    unused(),
    unused(),
    unused(),
    BigInt(pairs.length),
  ];
  for (const pair of pairs) {
    calldata.push(pair.secret, pair.noteId);
  }
  return calldata;
}

function requireSessionKeyId(cfg: CloakroomConfig): bigint {
  if (cfg.sessionKeyId === undefined) {
    throw new Error(
      "CLOAKROOM_SESSION_KEY_ID is required for Lock. TODO: no default session-key id is published in the starter kit or scarb build output.",
    );
  }
  return cfg.sessionKeyId;
}

/**
 * Lock one token-grouped job. Protocol allows a single InvokeExternal per tx,
 * so each employee schedule is its own Lock tx. proveAndSubmit waits the
 * documented 10-block proving window between them (needed after a fresh
 * deposit/topup and between consecutive Locks).
 */
export async function lockTokenJob(
  cfg: CloakroomConfig,
  job: TokenBatchJob,
  mode: RunMode,
  client: EmployerClient = createEmployerClient(cfg),
): Promise<string[]> {
  const anonymizer = requireAnonymizer(cfg);
  const sessionKeyId = requireSessionKeyId(cfg);
  const hashes: string[] = [];

  if (mode === "simulate") {
    console.log(
      `dry-run lock token=${toHex(job.token)} employees=${job.entries.length} (no builder.simulate in PRIVACY-0.14.3-RC.0)`,
    );
    return hashes;
  }

  for (const [i, entry] of job.entries.entries()) {
    const { hash } = await proveAndSubmit(client, () =>
      client.transfers
        .build(defaultExecuteOptions)
        .with(job.token, (t) => {
          t.withdraw({ recipient: anonymizer, amount: entry.amount });
        })
        .surplusTo(cfg.accountAddress, false)
        .invoke(() => ({
          contractAddress: toHex(anonymizer),
          calldata: encodeLockCalldata({
            vestingId: entry.vestingId,
            token: job.token,
            amount: entry.amount,
            cliffTs: entry.cliffTs,
            endTs: entry.endTs,
            sessionKeyId,
          }),
        })),
    );
    if (hash) {
      hashes.push(hash);
    }
    console.log(
      `lock token=${toHex(job.token)} employee=${i + 1}/${job.entries.length}: ${hash ?? "simulated"}`,
    );
  }
  return hashes;
}

/**
 * ClaimBatch for one token-grouped job: one tx, N open notes, one invoke.
 * proveAndSubmit waits the 10-block window after the preceding Lock.
 */
export async function claimTokenJob(
  cfg: CloakroomConfig,
  job: TokenBatchJob,
  mode: RunMode,
  client: EmployerClient = createEmployerClient(cfg),
): Promise<string | undefined> {
  const anonymizer = requireAnonymizer(cfg);
  if (mode === "simulate") {
    console.log(
      `dry-run claim token=${toHex(job.token)} n=${job.entries.length} (no builder.simulate in PRIVACY-0.14.3-RC.0)`,
    );
    return undefined;
  }
  const { hash } = await proveAndSubmit(client, () =>
    client.transfers
      .build(defaultExecuteOptions)
      .with(job.token, (t) => {
        for (const entry of job.entries) {
          t.transfer({ recipient: entry.employeeAddress, amount: Open });
        }
      })
      .invoke((args: InvokeCalldataBuilderArgs): CallDetails => {
        if (args.openNotes.length !== job.entries.length) {
          throw new Error(
            `ClaimBatch expected ${job.entries.length} open notes, SDK assigned ${args.openNotes.length}`,
          );
        }
        const pairs = job.entries.map((entry, i) => ({
          secret: entry.secret,
          noteId: BigInt(args.openNotes[i].noteId),
        }));
        return {
          contractAddress: toHex(anonymizer),
          calldata: encodeClaimBatchCalldata(pairs),
        };
      }),
  );
  console.log(`claim token=${toHex(job.token)} n=${job.entries.length}: ${hash ?? "simulated"}`);
  return hash;
}

export async function lockPayrollJobs(
  cfg: CloakroomConfig,
  jobs: TokenBatchJob[],
  mode: RunMode,
): Promise<string[]> {
  const client = createEmployerClient(cfg);
  const hashes: string[] = [];
  for (const job of jobs) {
    hashes.push(...(await lockTokenJob(cfg, job, mode, client)));
  }
  return hashes;
}

export async function claimPayrollJobs(
  cfg: CloakroomConfig,
  jobs: TokenBatchJob[],
  mode: RunMode,
): Promise<string[]> {
  const client = createEmployerClient(cfg);
  const hashes: string[] = [];
  for (const job of jobs) {
    const hash = await claimTokenJob(cfg, job, mode, client);
    if (hash) {
      hashes.push(hash);
    }
  }
  return hashes;
}
