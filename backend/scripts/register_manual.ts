import { Account, RpcProvider } from "starknet";
import { loadConfig } from "../src/config.js";
import { toHex } from "../src/felt.js";

async function main() {
  const cfg = loadConfig();
  const provider = new RpcProvider({ nodeUrl: cfg.rpcUrl });
  const account = new Account({
    provider,
    address: toHex(cfg.accountAddress),
    signer: cfg.privateKey,
    cairoVersion: "1",
  });

  console.log("Registering viewing key for", toHex(cfg.accountAddress));
  
  const tx = await account.execute({
    contractAddress: toHex(cfg.poolAddress),
    entrypoint: "set_viewing_key",
    calldata: [toHex(cfg.viewingKey)]
  });
  
  console.log("Register Tx Hash:", tx.transaction_hash);
  await provider.waitForTransaction(tx.transaction_hash);
  console.log("Register Confirmed!");
}

main().catch(console.error);
