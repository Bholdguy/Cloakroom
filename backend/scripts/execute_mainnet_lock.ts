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
  const provider = new RpcProvider({ nodeUrl: cfg.rpcUrl });
  const accountAddress = toHex(cfg.accountAddress);
  const privateKey = cfg.privateKey;
  const viewingKey = cfg.viewingKey;
  const poolAddress = toHex(cfg.poolAddress);
  const tokenAddress = toHex(cfg.tokenAddress);
  const anonymizerAddress = toHex(cfg.anonymizerAddress!);
  const proverUrl = "https://mainnet.prover.privacy.starknet.io";

  console.log("=== Mainnet Real Lock Transaction Execution ===");
  console.log("Account:", accountAddress);
  console.log("Pool:", poolAddress);
  console.log("Anonymizer:", anonymizerAddress);
  console.log("Token:", tokenAddress);
  console.log("Viewing Key (bigint):", viewingKey.toString(16));
  console.log("Prover URL:", proverUrl);

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

  const extra: Record<string, unknown> = {
    tip: 0n,
    proof: proof.data,
  };

  console.log("\nBroadcasting transaction to Starknet Mainnet...");
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
  console.error("RAW ERROR during Lock execution:");
  console.error(err);
  process.exit(1);
});
