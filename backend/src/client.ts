import {
  Account,
  Contract,
  RpcProvider,
  type Abi,
  type Call,
  type GetTransactionReceiptResponse,
} from "starknet";

/**
 * Resilient fetch wrapper: up to 3 attempts with exponential back-off (1 s,
 * 2 s) and a 15-second per-attempt timeout.
 *
 * Uses AbortSignal.timeout() instead of AbortController + setTimeout so that
 * Node's undici owns the timer lifecycle — this avoids the Windows libuv
 * UV_HANDLE_CLOSING assertion that fires when a manually created timer is
 * cleared after the fetch promise has already settled.
 */
async function resilientFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const MAX_ATTEMPTS = 3;
  const TIMEOUT_MS = 15_000;
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      // AbortSignal.timeout() is natively managed by undici — no dangling handle.
      const response = await fetch(input, {
        ...init,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      return response;
    } catch (err) {
      lastError = err;
      if (attempt < MAX_ATTEMPTS) {
        const delay = 1000 * 2 ** (attempt - 1); // 1 s, 2 s
        console.warn(
          `[rpc] fetch attempt ${attempt}/${MAX_ATTEMPTS} failed, retrying in ${delay}ms…`,
        );
        await new Promise<void>((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}
import {
  createPrivateTransfers,
  IndexerDiscoveryProvider,
  type ExecuteResult,
  type PrivateTransfersInterface,
} from "@starkware-libs/starknet-privacy-sdk";
import { PrivacyPoolABI } from "@starkware-libs/starknet-privacy-sdk/abi";
import {
  ContractDiscoveryProvider,
  ScreeningCallMockProofProvider,
  type PoolContractInterface,
} from "@starkware-libs/starknet-privacy-sdk/testing";
import type { CloakroomConfig } from "./config.js";
import { toHex } from "./felt.js";
import { recordAcceptedBlock, waitForProvingWindow } from "./sequencer.js";

export type EmployerClient = {
  cfg: CloakroomConfig;
  provider: RpcProvider;
  account: Account;
  transfers: PrivateTransfersInterface;
};

export function createEmployerClient(cfg: CloakroomConfig): EmployerClient {
  const provider = new RpcProvider({ nodeUrl: cfg.rpcUrl, fetch: resilientFetch });

  // Fix 4: cairoVersion: "1" — explicit, required for V3 tx signing in starknet.js v10.
  const account = new Account({
    provider,
    address: toHex(cfg.accountAddress),
    signer: cfg.privateKey,
    cairoVersion: "1",
  });

  // Fix 2: Use IndexerDiscoveryProvider for all production (Sepolia / mainnet) paths.
  // ContractDiscoveryProvider is a testing-only class that makes O(n) RPC calls
  // per channel/note and is unsuitable for production.
  //
  // The special sentinel value "mock" is accepted only when
  // CLOAKROOM_PROVING_SERVICE_URL=mock (local devnet), which wires up
  // ContractDiscoveryProvider against the in-process devnet pool contract.
  // On any real network (Sepolia, mainnet) CLOAKROOM_DISCOVERY_URL must be a
  // valid IndexerDiscoveryProvider base URL.
  let discoveryProvider;
  if (cfg.discoveryUrl && cfg.discoveryUrl !== "mock") {
    // Fix 2: Production path — IndexerDiscoveryProvider via the Starknet privacy indexer.
    discoveryProvider = new IndexerDiscoveryProvider(
      cfg.discoveryUrl,
      cfg.poolAddress,
    );
  } else if (cfg.provingServiceUrl === "mock") {
    // Devnet / local testing path only. ContractDiscoveryProvider is a
    // testing utility and MUST NOT be used against Sepolia or mainnet.
    discoveryProvider = new ContractDiscoveryProvider(
      new Contract({
        abi: PrivacyPoolABI as unknown as Abi,
        address: toHex(cfg.poolAddress),
        providerOrAccount: provider,
      }) as unknown as PoolContractInterface,
    );
  } else {
    throw new Error(
      "CLOAKROOM_DISCOVERY_URL is required for Sepolia/mainnet. " +
      "Set it to the Starknet privacy indexer base URL for your network. " +
      "ContractDiscoveryProvider (RPC-based fallback) is a testing utility " +
      "and cannot be used on live networks.",
    );
  }

  const provingProvider =
    cfg.provingServiceUrl === "mock"
      ? new ScreeningCallMockProofProvider(provider as any, cfg.chainId as any)
      : {
          url: cfg.provingServiceUrl,
          chainId: cfg.chainId,
          nodeUrl: cfg.rpcUrl,
        };

  // Fix 3: getViewingKey is explicitly typed to return bigint.
  // cfg.viewingKey is already parsed to bigint in config.ts (parseFelt).
  const transfers = createPrivateTransfers({
    account,
    viewingKeyProvider: {
      getViewingKey: async (): Promise<bigint> => cfg.viewingKey,
    },
    provingProvider,
    discoveryProvider,
    poolContractAddress: cfg.poolAddress,
    poolMode: cfg.provingServiceUrl === "mock" ? "screening" : undefined,
  });

  return { cfg, provider, account, transfers };
}

export const defaultExecuteOptions = {
  autoSetup: true,
  autoSelectNotes: "naive" as const,
  autoDiscover: { notes: "refresh" as const, channels: "refresh" as const },
};

export async function proveAndSubmit(
  client: EmployerClient,
  build: () => ReturnType<PrivateTransfersInterface["build"]>,
): Promise<{ hash: string; result: ExecuteResult }> {
  const provingBlock = await waitForProvingWindow(
    client.provider,
    client.cfg.provingDepth,
    client.cfg.blockTimeMs,
  );

  const result = await build().execute({
    ...defaultExecuteOptions,
    provingBlockId: provingBlock,
  });
  logWarnings(result);
  const hash = await submitCallAndProof(client, result);
  return { hash, result };
}

export async function submitCallAndProof(
  client: EmployerClient,
  result: ExecuteResult,
): Promise<string> {
  const { call, proof } = result.callAndProof;

  // Fix 5: tip: 0n must be explicit (some starknet.js versions default to
  // undefined which causes tx serialization failures on Sepolia).
  // proofFacts is only spread when non-empty — an empty span is semantically
  // different from an absent key in the pool's apply_actions entry-point
  // calldata parsing.
  const extra: Record<string, unknown> = {
    tip: 0n,
    proof: proof.data,
    ...(proof.proofFacts.length > 0 ? { proofFacts: proof.proofFacts } : {}),
  };

  const response = await executeWithProof(client.account, call, extra);
  const receipt = (await client.provider.waitForTransaction(
    response.transaction_hash,
  )) as GetTransactionReceiptResponse & { block_number?: number };
  recordAcceptedBlock(receipt.block_number);
  return response.transaction_hash;
}

async function executeWithProof(
  account: Account,
  call: Call,
  extra: Record<string, unknown>,
): Promise<{ transaction_hash: string }> {
  const execute = account.execute.bind(account) as (
    calls: Call | Call[],
    details?: Record<string, unknown>,
  ) => Promise<{ transaction_hash: string }>;
  return execute(call, extra);
}

function logWarnings(result: ExecuteResult): void {
  for (const warning of result.warnings) {
    console.warn(`[privacy warning ${warning.code}] ${warning.message}`);
  }
}
