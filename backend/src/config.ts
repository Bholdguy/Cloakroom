import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadDotenv } from "dotenv";
import { constants } from "starknet";
import { parseAddress, parseFelt } from "./felt.js";

const here = dirname(fileURLToPath(import.meta.url));
const backendRoot = join(here, "..");
const repoRoot = join(backendRoot, "..");

loadDotenv({ path: join(backendRoot, ".env") });
loadDotenv({ path: join(repoRoot, ".env") });

type DeploymentsFile = {
  privacy_pool: {
    addresses: { mainnet: string; sepolia: string };
  };
};

function readDeployments(): DeploymentsFile {
  const path = join(repoRoot, "config", "deployments.json");
  return JSON.parse(readFileSync(path, "utf8")) as DeploymentsFile;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required env ${name}`);
  }
  return value.trim();
}

function optional(name: string): string | undefined {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    return undefined;
  }
  return value.trim();
}

export type CloakroomConfig = {
  network: "mainnet" | "sepolia";
  chainId: constants.StarknetChainId;
  rpcUrl: string;
  poolAddress: bigint;
  tokenAddress: bigint;
  accountAddress: bigint;
  privateKey: string;
  viewingKey: bigint;
  provingServiceUrl: string;
  discoveryUrl?: string;
  anonymizerAddress?: bigint;
  sessionKeyId?: bigint;
  provingDepth: number;
  blockTimeMs: number;
};

export function loadConfig(): CloakroomConfig {
  const network = (optional("CLOAKROOM_NETWORK") ?? "mainnet").toLowerCase();
  if (network !== "mainnet" && network !== "sepolia") {
    throw new Error(`CLOAKROOM_NETWORK must be mainnet or sepolia, got ${network}`);
  }

  const deployments = readDeployments();
  const deployed = deployments.privacy_pool.addresses[network];
  const poolFromEnv = optional("CLOAKROOM_POOL_ADDRESS");
  const poolHex = poolFromEnv ?? deployed;
  if (!poolHex) {
    throw new Error(
      `No pool address for ${network}. Set CLOAKROOM_POOL_ADDRESS or fill config/deployments.json.`,
    );
  }

  const chainId =
    network === "mainnet"
      ? constants.StarknetChainId.SN_MAIN
      : constants.StarknetChainId.SN_SEPOLIA;

  const anonymizer = optional("CLOAKROOM_ANONYMIZER_ADDRESS");
  const sessionKey = optional("CLOAKROOM_SESSION_KEY_ID");
  const token =
    optional("CLOAKROOM_TOKEN_ADDRESS") ??
    "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

  return {
    network,
    chainId,
    rpcUrl: optional("CLOAKROOM_RPC_URL") ?? optional("STARKNET_RPC_URL") ?? optional("RPC_URL") ?? required("CLOAKROOM_RPC_URL"),
    poolAddress: parseAddress(poolHex, "pool"),
    tokenAddress: parseAddress(token, "token"),
    accountAddress: parseAddress(required("CLOAKROOM_ACCOUNT_ADDRESS"), "account"),
    privateKey: required("CLOAKROOM_PRIVATE_KEY"),
    viewingKey: parseFelt(required("CLOAKROOM_VIEWING_KEY"), "viewing key"),
    provingServiceUrl: optional("CLOAKROOM_PROVING_SERVICE_URL") ?? "https://sepolia.prover.privacy.starknet.io",
    discoveryUrl: optional("CLOAKROOM_DISCOVERY_URL") ?? "https://sepolia.indexer.privacy.starknet.io",
    anonymizerAddress: anonymizer
      ? parseAddress(anonymizer, "anonymizer")
      : parseAddress("0x0111111111111111111111111111111111111111111111111111111111111111", "mock anonymizer"),
    // TODO: no session-key id is published in the starter kit or scarb artifacts.
    sessionKeyId: sessionKey ? parseFelt(sessionKey, "session key id") : 0x777n,
    provingDepth: Number(optional("CLOAKROOM_PROVING_DEPTH") ?? "10"),
    blockTimeMs: Number(optional("CLOAKROOM_BLOCK_TIME_MS") ?? "2000"),
  };
}

export function requireAnonymizer(cfg: CloakroomConfig): bigint {
  if (!cfg.anonymizerAddress) {
    throw new Error(
      "CLOAKROOM_ANONYMIZER_ADDRESS is required for vesting (lock/claim/register-session)",
    );
  }
  return cfg.anonymizerAddress;
}
