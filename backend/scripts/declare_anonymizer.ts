import { RpcProvider, Account, json, CallData, Contract } from "starknet";
import fs from "fs";
import path from "path";

async function main() {
  const privateKey = "0x3a633b9fb1e50e4970b69e35421153b3300c006227f7bd3e70d854ab448415f";
  const accountAddress = "0x0026e8f22ab88c2020f7e14ba20fbdd26ef23017ff0e7c94c93d186e8716a9db";
  const providerUrl = "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/56yo9CNoEeVwYGxwwr1fbB4VjgGteczc";
  const provider = new RpcProvider({ nodeUrl: providerUrl });
  const account = new Account({
    nodeUrl: providerUrl,
    address: accountAddress,
    signer: privateKey,
    cairoVersion: "1"
  });

  const compiledContract = json.parse(fs.readFileSync(path.resolve(process.cwd(), "contracts/target/release/cloakroom_PayrollAnonymizer.contract_class.json")).toString("ascii"));
  const compiledCasm = json.parse(fs.readFileSync(path.resolve(process.cwd(), "contracts/target/release/cloakroom_PayrollAnonymizer.compiled_contract_class.json")).toString("ascii"));

  console.log("Declaring contract...");
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
