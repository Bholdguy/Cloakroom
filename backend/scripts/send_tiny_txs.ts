import { Account, RpcProvider } from "starknet";
import { loadConfig } from "../src/config.js";
import { toHex } from "../src/felt.js";

const STRK_TOKEN = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
const TARGET_ADDRESS = "0x035ee7540a103c165c4f28f81e05851377d254161445fe7924e9b796c65093e1";

async function main() {
  console.log("=== Sending Tiny STRK Transactions ===");
  
  const cfg = loadConfig();
  const provider = new RpcProvider({ nodeUrl: cfg.rpcUrl });
  const accountAddress = toHex(cfg.accountAddress);
  const privateKey = cfg.privateKey;

  const account = new Account({
    provider,
    address: accountAddress,
    signer: privateKey,
    cairoVersion: "1",
  });

  console.log("Sender:", accountAddress);
  console.log("Recipient:", TARGET_ADDRESS);

  // We construct a multicall array to execute all three transfers sequentially in one batch
  const calls = [
    {
      contractAddress: STRK_TOKEN,
      entrypoint: "transfer",
      calldata: [TARGET_ADDRESS, "1", "0"],
    },
    {
      contractAddress: STRK_TOKEN,
      entrypoint: "transfer",
      calldata: [TARGET_ADDRESS, "2", "0"],
    },
    {
      contractAddress: STRK_TOKEN,
      entrypoint: "transfer",
      calldata: [TARGET_ADDRESS, "3", "0"],
    }
  ];

  console.log("Executing transfers of 1 wei, 2 wei, and 3 wei...");
  
  try {
    const tx = await account.execute(calls);
    console.log("Transaction Hash:", tx.transaction_hash);
    console.log(`Voyager: https://voyager.online/tx/${tx.transaction_hash}`);
    
    console.log("Waiting for confirmation (this may take a few seconds)...");
    const receipt = await provider.waitForTransaction(tx.transaction_hash);
    console.log("Execution Status:", (receipt as any).execution_status ?? (receipt as any).statusReceipt);
    console.log("✅ Success! The 3 tiny STRK transactions have been confirmed.");
  } catch (e: any) {
    console.error("Transaction failed:", e.message);
    process.exit(1);
  }
}

main().catch(console.error);
