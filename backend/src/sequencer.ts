import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { RpcProvider } from "starknet";

const statePath = join(dirname(fileURLToPath(import.meta.url)), "..", ".cloakroom-run-state.json");

type RunState = { lastTxBlockNumber?: number };

function readState(): RunState {
  if (!existsSync(statePath)) {
    return {};
  }
  return JSON.parse(readFileSync(statePath, "utf8")) as RunState;
}

function writeState(state: RunState): void {
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * SDK sequencing rule: prove at least `depth` finalized blocks after the last
 * private (or pool-visible) write. See starknet-privacy sdk/README.md.
 */
export async function waitForProvingWindow(
  provider: RpcProvider,
  depth: number,
  blockTimeMs: number,
): Promise<number> {
  const last = readState().lastTxBlockNumber;
  let latest = await provider.getBlockNumber();
  if (last === undefined) {
    return Math.max(latest - depth, 0);
  }
  while (last >= latest - depth) {
    await sleep(blockTimeMs);
    latest = await provider.getBlockNumber();
  }
  return latest - depth;
}

export function recordAcceptedBlock(blockNumber: number | undefined): void {
  if (blockNumber === undefined) {
    return;
  }
  writeState({ lastTxBlockNumber: blockNumber });
}
