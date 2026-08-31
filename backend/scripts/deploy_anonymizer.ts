import { RpcProvider, Account, Contract, CallData, cairo } from "starknet";
import "dotenv/config";

async function main() {
  const providerUrl = process.env.CLOAKROOM_RPC_URL || "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/alch_pIF1eQLl4crvr0DfGYFVx";
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  const accountAddress = process.env.DEPLOYER_ACCOUNT_ADDRESS;

  if (!privateKey || !accountAddress) {
    throw new Error("Missing DEPLOYER_PRIVATE_KEY or DEPLOYER_ACCOUNT_ADDRESS in .env");
  }

  const provider = new RpcProvider({ nodeUrl: providerUrl });
  const account = new Account({
    provider,
    address: accountAddress,
    signer: privateKey,
    cairoVersion: "1"
  });

  const classHash = "0x1152c1c005bbda74804a7612f9eab817e08cab33af604529e65c02678314868";
  const poolAddress = process.env.CLOAKROOM_POOL_ADDRESS || "0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a";
  const ownerAddress = accountAddress;

  console.log("Deploying contract...");
  console.log("Class Hash:", classHash);
  console.log("Pool Address:", poolAddress);
  console.log("Owner Address:", ownerAddress);

  // Monkey-patch estimateDeployAccountFee if needed, but deploy is usually cheap. 
  // Let's use the Universal Deployer Contract (UDC)
  const deployResponse = await account.deploy({
    classHash: classHash,
    constructorCalldata: [poolAddress, ownerAddress]
  });

  console.log("Deploy tx hash:", deployResponse.transaction_hash);
  console.log("Contract address:", deployResponse.contract_address[0]);

  console.log("Waiting for confirmation...");
  await provider.waitForTransaction(deployResponse.transaction_hash);
  console.log("Contract deployed successfully!");
}

main().catch(console.error);
