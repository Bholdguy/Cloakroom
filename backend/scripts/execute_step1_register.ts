import { Account, Contract, RpcProvider, constants, type Abi } from "starknet";
import { setGlobalDispatcher, Agent } from "undici";

// Configure Node undici fetch to allow up to 30 minutes for STWO proof generation
setGlobalDispatcher(
  new Agent({
    headersTimeout: 1_800_000,
    bodyTimeout: 1_800_000,
    connectTimeout: 1_800_000,
  })
);

import {
  createPrivateTransfers,
  ProvingServiceProofProvider,
} from "@starkware-libs/starknet-privacy-sdk";
import { PrivacyPoolABI } from "@starkware-libs/starknet-privacy-sdk/abi";
import {
  ContractDiscoveryProvider,
  type PoolContractInterface,
} from "@starkware-libs/starknet-privacy-sdk/testing";
import { toHex } from "../src/felt.js";
import { loadConfig } from "../src/config.js";

async function main() {
  const cfg = loadConfig();
  const provider = new RpcProvider({ nodeUrl: cfg.rpcUrl });
  const accountAddress = toHex(cfg.accountAddress);
  const privateKey = cfg.privateKey;
  const viewingKey = cfg.viewingKey;
  const poolAddress = toHex(cfg.poolAddress);
  const proverUrl = "http://127.0.0.1:8080";

  console.log("=== Mainnet Register (Publish Viewing Key) ===");
  console.log("Account:", accountAddress);
  console.log("Pool:", poolAddress);
  console.log("Viewing Key (bigint):", viewingKey.toString(16));
  console.log("Prover URL:", proverUrl);

  const account = new Account({
    provider,
    address: accountAddress,
    signer: privateKey,
    cairoVersion: "1",
  });

  const discoveryProvider = new ContractDiscoveryProvider(
    new Contract({
      abi: PrivacyPoolABI as unknown as Abi,
      address: poolAddress,
      providerOrAccount: provider,
    }) as unknown as PoolContractInterface,
  );

  const provingProvider = new ProvingServiceProofProvider(
    proverUrl,
    constants.StarknetChainId.SN_MAIN,
    {
      nodeUrl: cfg.rpcUrl,
      poolAddress: poolAddress,
      requestTimeoutMs: 1_800_000,
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

  console.log("\nBuilding Register transaction via transfers.build({autoRegister: true}).register().execute({provingBlockId})...");
  const result = await transfers
    .build({ autoRegister: true })
    .register()
    .execute({ provingBlockId });

  console.log("Proof and Call generated successfully!");
  const { call, proof } = result.callAndProof;
  console.log("Call Contract Address:", call.contractAddress);
  console.log("Call Entrypoint:", call.entrypoint);
  console.log("Call Calldata:", call.calldata);

  const extra: Record<string, unknown> = {
    tip: 0n,
    proof: proof.data,
    ...(proof.proofFacts.length > 0 ? { proofFacts: proof.proofFacts } : {}),
  };

  console.log("\nBroadcasting Register transaction to Starknet Mainnet...");
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
  console.error("RAW ERROR during Register execution:");
  console.error(err);
  process.exit(1);
});
