/**
 * estimate_mainnet_lock.ts
 *
 * Step 1 (DRY_RUN=1 or default): Build + prove the Lock transaction using the
 * LOCAL self-hosted prover. Stop before broadcasting. Prints proof.proofFacts
 * length as the primary signal that the prover returned a real proof.
 *
 * Step 2 (DRY_RUN=0): Proceeds to broadcast.
 *
 * Usage:
 *   LOCAL_PROVER_URL=http://127.0.0.1:3000 DRY_RUN=1 npx tsx scripts/estimate_mainnet_lock.ts
 *   LOCAL_PROVER_URL=http://127.0.0.1:3000 DRY_RUN=0 npx tsx scripts/estimate_mainnet_lock.ts
 *
 * LOCAL_PROVER_URL is REQUIRED — there is no remote fallback.
 * mainnet.prover.privacy.starknet.io is ENOTFOUND (never a real endpoint).
 *
 * Env vars from backend/.env (loaded via loadConfig):
 *   CLOAKROOM_RPC_URL, CLOAKROOM_ACCOUNT_ADDRESS, CLOAKROOM_PRIVATE_KEY,
 *   CLOAKROOM_VIEWING_KEY, CLOAKROOM_ANONYMIZER_ADDRESS
 */

import { Account, RpcProvider, constants } from "starknet";
import {
  createPrivateTransfers,
  IndexerDiscoveryProvider,
  ProvingServiceProofProvider,
  createEmptyRegistry,
} from "@starkware-libs/starknet-privacy-sdk";
import { generateVestingSecret, computeVestingId } from "../src/payroll_engine.js";
import { toHex } from "../src/felt.js";
import { loadConfig } from "../src/config.js";

const DRY_RUN = process.env.DRY_RUN !== "0"; // default: dry-run ON

async function main() {
  const cfg = loadConfig();
  const provider = new RpcProvider({ nodeUrl: cfg.rpcUrl });
  const accountAddress = toHex(cfg.accountAddress);
  const privateKey = cfg.privateKey;
  const viewingKey = cfg.viewingKey;
  const poolAddress = toHex(cfg.poolAddress);
  const tokenAddress = toHex(cfg.tokenAddress);
  const anonymizerAddress = toHex(cfg.anonymizerAddress!);

  // LOCAL_PROVER_URL is REQUIRED. No fallback — the remote hostname is ENOTFOUND.
  const proverUrl = process.env.LOCAL_PROVER_URL;
  if (!proverUrl) {
    console.error("❌ FATAL: LOCAL_PROVER_URL is not set.");
    console.error("   Set it to the address of the running local prover binary, e.g.:");
    console.error("   LOCAL_PROVER_URL=http://127.0.0.1:3000 npx tsx scripts/estimate_mainnet_lock.ts");
    console.error("   mainnet.prover.privacy.starknet.io is ENOTFOUND — there is no remote fallback.");
    process.exit(1);
  }

  console.log("=== Mainnet Lock — Estimate Step ===");
  console.log("DRY_RUN:", DRY_RUN ? "YES (will NOT broadcast)" : "NO (WILL broadcast)");
  console.log("Account:", accountAddress);
  console.log("Pool:", poolAddress);
  console.log("Anonymizer:", anonymizerAddress);
  console.log("Token:", tokenAddress);
  console.log("Prover URL:", proverUrl);
  console.log("RPC:", cfg.rpcUrl);

  const account = new Account({
    provider,
    address: accountAddress,
    signer: privateKey,
    cairoVersion: "1",
  });

  const discoveryProvider = new IndexerDiscoveryProvider(
    "https://mainnet.indexer.privacy.starknet.io",
    poolAddress,
  );

  const provingProvider = new ProvingServiceProofProvider(
    proverUrl,
    constants.StarknetChainId.SN_MAIN,
    {
      nodeUrl: cfg.rpcUrl,
      poolAddress: poolAddress,
    },
  );

  const transfers = createPrivateTransfers({
    account,
    viewingKeyProvider: {
      getViewingKey: async (): Promise<bigint> => viewingKey,
    },
    provingProvider,
    discoveryProvider,
    poolContractAddress: poolAddress,
  });

  const latestBlock = await provider.getBlockNumber();
  const provingBlockId = Math.max(0, latestBlock - 10);
  console.log(`\nLatest block: ${latestBlock}, provingBlockId: ${provingBlockId}`);

  const secret = generateVestingSecret();
  const vestingId = computeVestingId(secret);
  const lockAmount = 100000000000000000n; // 0.1 STRK
  const nowTs = Math.floor(Date.now() / 1000);
  const cliffTs = nowTs + 3600;       // 1 hour cliff
  const endTs = nowTs + 30 * 86400;   // 30 days
  const sessionKeyId = "0x636c6f616b726f6f6d2d64656d6f2d31";

  console.log("\nSecret:", toHex(secret));
  console.log("Vesting ID (Poseidon):", toHex(vestingId));
  console.log("Lock Amount:", lockAmount.toString(), "wei (0.1 STRK)");

  const registry = createEmptyRegistry();

  console.log("\nCalling transfers.build().execute() — contacting prover now...");
  const result = await transfers
    .build({
      autoRegister: true,
      autoSetup: true,
      autoDiscover: { notes: "refresh", channels: "refresh" },
      autoSelectNotes: "naive",
      registry,
      provingBlockId,
    })
    .with(tokenAddress, (t) =>
      t.withdraw({
        recipient: anonymizerAddress,
        amount: lockAmount,
      })
    )
    .invoke(() => ({
      contractAddress: anonymizerAddress,
      entrypoint: "privacy_invoke",
      calldata: [
        "0x0",             // operation: 0 = Lock
        toHex(vestingId),  // vesting_id
        tokenAddress,      // token
        lockAmount.toString(),
        cliffTs.toString(),
        endTs.toString(),
        sessionKeyId,
        "0x0",             // secret (unused in Lock)
        "0x0",             // note_id (unused in Lock)
        "0x0",             // batch.len = 0
      ],
    }))
    .execute({ provingBlockId });

  const { call, proof } = result.callAndProof;
  const proofFactsLen = (proof as any).proofFacts?.length ?? 0;

  console.log("\n=== PROOF RESULT ===");
  console.log("proof.proofFacts.length:", proofFactsLen);
  console.log("proof.data length:", (proof as any).data?.length ?? "N/A");
  console.log("call.contractAddress:", call.contractAddress);
  console.log("call.entrypoint:", call.entrypoint);
  console.log("call.calldata:", JSON.stringify(call.calldata));

  if (proofFactsLen === 0) {
    console.error("\n❌ SIGNAL: proofFacts is EMPTY — prover returned no proof facts.");
    console.error("   This is the same EMPTY_PROOF_FACTS condition as the earlier attempt.");
    console.error("   Raw proof object:", JSON.stringify(proof, null, 2));
    process.exit(2);
  }

  console.log("\n✅ SIGNAL: proofFacts non-empty — prover returned a real proof.");
  console.log("   Proof facts preview:", JSON.stringify((proof as any).proofFacts?.slice(0, 3)));

  if (DRY_RUN) {
    console.log("\n--- DRY_RUN=1: stopping here. Re-run with DRY_RUN=0 to broadcast. ---");
    return;
  }

  // ── SUBMIT ──────────────────────────────────────────────────────────────
  const extra: Record<string, unknown> = {
    tip: 0n,
    proof: (proof as any).data,
    ...((proof as any).proofFacts?.length > 0
      ? { proofFacts: (proof as any).proofFacts }
      : {}),
  };

  console.log("\nBroadcasting to Starknet Mainnet...");
  const tx = await (account.execute as any)(call, extra);
  console.log("Submitted Tx Hash:", tx.transaction_hash);
  console.log(`Voyager: https://voyager.online/tx/${tx.transaction_hash}`);

  console.log("Waiting for on-chain confirmation...");
  const receipt = await provider.waitForTransaction(tx.transaction_hash);
  console.log("\n=== Transaction Receipt ===");
  console.log("Execution Status:", (receipt as any).execution_status ?? (receipt as any).statusReceipt);
  console.log("Finality Status:", (receipt as any).finality_status);
  console.log("Full Receipt:\n", JSON.stringify(receipt, null, 2));
}

main().catch((err) => {
  console.error("\nRAW ERROR:");
  console.error(err);
  process.exit(1);
});
