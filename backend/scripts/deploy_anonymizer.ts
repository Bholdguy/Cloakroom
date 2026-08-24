import { RpcProvider, Account, json, CallData, Contract } from "starknet";
import fs from "fs";
import path from "path";

async function main() {
  const privateKey = "0x3a633b9fb1e50e4970b69e35421153b3300c006227f7bd3e70d854ab448415f";
  const accountAddress = "0x0026e8f22ab88c2020f7e14ba20fbdd26ef23017ff0e7c94c93d186e8716a9db";
  const providerUrl = "https://free-rpc.nethermind.io/sepolia-juno/";
  const provider = new RpcProvider({ nodeUrl: providerUrl });
  const account = new Account({
    nodeUrl: providerUrl,
    address: accountAddress,
    signer: privateKey,
    cairoVersion: "1"
  });

  const classHash = "0xe5e98c32fb0c0c1de14d16dc60af559d218aab48e07598d385a37b10995065";
  console.log("Class is declared. Deploying contract...");
  const poolAddress = "0x0254a6b2997ef52e9f830ce1f543f6b29768295e8d17e2267d672c552cfe0d91";
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
