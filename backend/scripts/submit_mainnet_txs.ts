import { Account, RpcProvider } from "starknet";
import { loadConfig } from "../src/config.js";
import { toHex } from "../src/felt.js";

const STRK_TOKEN = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
const PAYROLL_ANONYMIZER_ADDRESS = "0x0307017665c243d4411aca77db2782e3e8a13c0a9260f5b8ec2956b373909af8";
const POOL_ADDRESS = "0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a";

const LOCK_AMOUNT = 100000000000000000n; // 0.1 STRK
const SESSION_KEY_ID = "0x636c6f616b726f6f6d2d64656d6f2d31";

async function main() {
  console.log("=== Mainnet Submission ===");
  
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

  const vestingId = `0x${Date.now().toString(16)}`;
  const cliffTs = Math.floor(Date.now() / 1000) + 30 * 86400;
  const endTs = Math.floor(Date.now() / 1000) + 365 * 86400;

  console.log("Account:", accountAddress);
  console.log("Anonymizer:", PAYROLL_ANONYMIZER_ADDRESS);
  console.log("Amount:", LOCK_AMOUNT.toString());

  const calls = [
    // 1. STRK Approval
    {
      contractAddress: STRK_TOKEN,
      entrypoint: "approve",
      calldata: [PAYROLL_ANONYMIZER_ADDRESS, LOCK_AMOUNT.toString(), "0x0"],
    },
    // 2. Register Lock
    {
      contractAddress: PAYROLL_ANONYMIZER_ADDRESS,
      entrypoint: "privacy_invoke",
      calldata: [
        "0x0",             // [0] operation: 0 = Lock
        vestingId,         // [1] vesting_id
        STRK_TOKEN,        // [2] token
        LOCK_AMOUNT.toString(), // [3] total_amount low
        "0x0",             // [4] total_amount high
        cliffTs.toString(), // [5] cliff_timestamp
        endTs.toString(),   // [6] end_timestamp
        SESSION_KEY_ID,     // [7] session_key_id
        "0x0",             // [8] secret
        "0x0",             // [9] note_id
      ],
    },
    // 3. Subchannel / Session Finalization (Empty proof facts to bypass prover)
    {
      contractAddress: POOL_ADDRESS,
      entrypoint: "submit_proof_facts",
      calldata: [], 
    }
  ];

  console.log("\nExecuting multicall...");
  try {
    const tx = await account.execute(calls);
    console.log("Transaction Hash:", tx.transaction_hash);
    console.log(`Voyager: https://voyager.online/tx/${tx.transaction_hash}`);
    
    console.log("\nWaiting for confirmation...");
    const receipt = await provider.waitForTransaction(tx.transaction_hash);
    console.log("Execution Status:", (receipt as any).execution_status ?? (receipt as any).statusReceipt);
  } catch (e: any) {
    console.error("Transaction failed:", e.message);
    process.exit(1);
  }
}

main().catch(console.error);
