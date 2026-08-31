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

async function main() {
  const cfg = loadConfig();
  const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL || "https://free-rpc.nethermind.io/sepolia-juno/v0_7";
  const provider = new RpcProvider({ nodeUrl: sepoliaRpcUrl });
  const accountAddress = toHex(cfg.accountAddress);
  const privateKey = cfg.privateKey;
  const viewingKey = cfg.viewingKey;
  const poolAddress = "0x0254a6b2997ef52e9f830ce1f543f6b29768295e8d17e2267d672c552cfe0d91";
  const tokenAddress = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
  const anonymizerAddress = process.env.SEPOLIA_ANONYMIZER_ADDRESS || "0x2a63442d63285858b89d6ed592313c0f0c364923ea94c79813b574a3dc0eabf";
  const proverUrl = process.env.LOCAL_PROVER_URL || "http://127.0.0.1:3000";

  console.log("=== Sepolia Real Lock Transaction Execution ===");
  console.log("Account:", accountAddress);
  console.log("Pool:", poolAddress);
  console.log("Anonymizer:", anonymizerAddress);
  console.log("Token:", tokenAddress);
  console.log("Viewing Key (bigint):", viewingKey.toString(16));
  console.log("Prover URL:", proverUrl);
  console.log("Sepolia RPC:", sepoliaRpcUrl);

  const account = new Account({
    provider,
    address: accountAddress,
    signer: privateKey,
    cairoVersion: "1",
  });

  const discoveryProvider = new IndexerDiscoveryProvider(
    process.env.LOCAL_DISCOVERY_URL || "http://127.0.0.1:8080",
    poolAddress,
  );

  const provingProvider = new ProvingServiceProofProvider(
    proverUrl,
    constants.StarknetChainId.SN_SEPOLIA,
    {
      nodeUrl: sepoliaRpcUrl,
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
  console.log(`Using provingBlockId: ${provingBlockId} (latest: ${latestBlock})`);

  const secret = generateVestingSecret();
  const vestingId = computeVestingId(secret);
  const lockAmount = 100000000000000000n; // 0.1 STRK (1e17)
  const nowTs = Math.floor(Date.now() / 1000);
  const cliffTs = nowTs + 3600; // 1 hour cliff
  const endTs = nowTs + 30 * 86400; // 30 days
  const sessionKeyId = "0x636c6f616b726f6f6d2d64656d6f2d31";

  console.log("Generated Secret:", secret.toString(16));
  console.log("Computed Vesting ID (Poseidon):", toHex(vestingId));
  console.log("Lock Amount:", lockAmount.toString(), "wei (0.1 STRK)");

  const registry = createEmptyRegistry();

  console.log("\nBuilding Lock transaction via transfers.build()...");
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
        "0x0",                     // operation: 0 = Lock
        toHex(vestingId),          // vesting_id
        tokenAddress,              // token
        lockAmount.toString(),     // amount (u128)
        cliffTs.toString(),        // cliff_timestamp
        endTs.toString(),          // end_timestamp
        sessionKeyId,              // session_key_id
        "0x0",                     // secret
        "0x0",                     // note_id
        "0x0",                     // batch.len = 0
      ],
    }))
    .execute({ provingBlockId });

  console.log("Proof and Call generated successfully!");
  const { call, proof } = result.callAndProof;
  console.log("Call Contract Address:", call.contractAddress);
  console.log("Call Entrypoint:", call.entrypoint);
  console.log("Call Calldata:", call.calldata);
  console.log("Proof facts:", (proof as any).proofFacts || proof);

  const extra: Record<string, unknown> = {
    tip: 0n,
    proof: proof.data,
  };

  console.log("\nBroadcasting transaction to Starknet Sepolia...");
  const tx = await (account.execute as any)(call, extra);
  console.log("Submitted Tx Hash:", tx.transaction_hash);

  console.log("Waiting for on-chain confirmation via waitForTransaction...");
  const receipt = await provider.waitForTransaction(tx.transaction_hash);
  console.log("\n=== Transaction Receipt ===");
  console.log("Execution Status:", (receipt as any).execution_status || (receipt as any).statusReceipt);
  console.log("Finality Status:", (receipt as any).finality_status);
  console.log("Full Receipt:\n", JSON.stringify(receipt, null, 2));
}

main().catch((err) => {
  console.error("RAW ERROR during Sepolia Lock execution:");
  console.error(err);
  process.exit(1);
});
