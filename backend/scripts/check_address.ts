import * as dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });

async function check() {
  const rpcUrl = process.env.CLOAKROOM_RPC_URL || "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/alch_pIF1eQLl4crvr0DfGYFVx";
  const address = process.argv[2] || process.env.DEPLOYER_ACCOUNT_ADDRESS;
  
  if (!address) {
    throw new Error("Missing address argument or DEPLOYER_ACCOUNT_ADDRESS in .env");
  }
  
  console.log("Checking address:", address);
  
  const classHashRes = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0", id: 1, method: "starknet_getClassHashAt",
      params: { block_id: "latest", contract_address: address }
    })
  });
  console.log("Class hash at address:", await classHashRes.json());
  
  const nonceRes = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0", id: 2, method: "starknet_getNonce",
      params: { block_id: "latest", contract_address: address }
    })
  });
  console.log("Nonce at address:", await nonceRes.json());
}
check().catch(console.error);
