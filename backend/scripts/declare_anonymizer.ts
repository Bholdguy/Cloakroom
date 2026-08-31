import { RpcProvider, Account, json, CallData, Contract } from "starknet";
import fs from "fs";
import path from "path";

import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function main() {
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  const accountAddress = process.env.DEPLOYER_ACCOUNT_ADDRESS;
  const providerUrl = process.env.CLOAKROOM_RPC_URL || "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/alch_pIF1eQLl4crvr0DfGYFVx";
  
  if (!privateKey || !accountAddress) {
    throw new Error("Missing DEPLOYER_PRIVATE_KEY or DEPLOYER_ACCOUNT_ADDRESS in .env");
  }
  
  console.log("Resolved Deployer Address:", accountAddress);
  
  const provider = new RpcProvider({ nodeUrl: providerUrl });
  const account = new Account({
    provider,
    address: accountAddress,
    signer: privateKey,
    cairoVersion: "1"
  });

  const compiledContract = json.parse(fs.readFileSync(path.resolve(process.cwd(), "../contracts/target/release/cloakroom_PayrollAnonymizer.contract_class.json")).toString("ascii"));
  const compiledCasm = json.parse(fs.readFileSync(path.resolve(process.cwd(), "../contracts/target/release/cloakroom_PayrollAnonymizer.compiled_contract_class.json")).toString("ascii"));

  console.log("Declaring contract...");

  account.estimateDeclareFee = async () => {
    return {
      suggestedMaxFee: BigInt(0),
      resourceBounds: {
        l2_gas: { max_amount: BigInt(350000000), max_price_per_unit: BigInt(55000000000) },
        l1_gas: { max_amount: BigInt(1000), max_price_per_unit: BigInt(200000000000000) },
        l1_data_gas: { max_amount: BigInt(1000), max_price_per_unit: BigInt(300000000000) }
      }
    };
  };

  const declareResponse = await account.declare({
    contract: compiledContract,
    casm: compiledCasm,
  });

  console.log("Declare tx hash:", declareResponse.transaction_hash);
  console.log("Class Hash:", declareResponse.class_hash);
  console.log("Waiting for confirmation...");
  await provider.waitForTransaction(declareResponse.transaction_hash);
  console.log("Declare tx confirmed!");
}

main().catch(console.error);
