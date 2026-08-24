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

  const classHash = "0x25e900f1da71a61677e2f4d18610edb120e1a3bde7743fbf1927aeba420103f";
  console.log("Class is declared. Deploying contract...");
  const poolAddress = "0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a";
  const constructorArgs = CallData.compile({
    pool_address: poolAddress,
    owner: accountAddress
  });

  const deployResponse = await account.deployContract({
    classHash: classHash,
    constructorCalldata: constructorArgs
  }, { maxFee: "10000000000000000" });

  console.log("Deployed Contract Address:", deployResponse.contract_address);
  console.log("Waiting for deploy tx confirmation:", deployResponse.transaction_hash);
  await provider.waitForTransaction(deployResponse.transaction_hash);
  console.log("Deploy tx confirmed!");
}

main().catch(console.error);
