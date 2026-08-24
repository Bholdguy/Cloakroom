import { RpcProvider, Account, ec, hash, CallData } from "starknet";
import * as dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });

async function main() {
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  const accountAddress = process.env.DEPLOYER_ACCOUNT_ADDRESS;
  
  if (!privateKey || !accountAddress) {
    throw new Error("Missing DEPLOYER_PRIVATE_KEY or DEPLOYER_ACCOUNT_ADDRESS in .env");
  }

  const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://starknet-sepolia.drpc.org";
  const provider = new RpcProvider({ nodeUrl: rpcUrl });
  
  const OZ_ACCOUNT_CLASS_HASH = "0x05400e90f7e0ae78b0284c478a3c8751ce329184518ed2e6d62f928e4ec4e3b7";
  const publicKey = ec.starkCurve.getStarkKey(privateKey);
  const constructorCallData = CallData.compile({ publicKey: publicKey });

  console.log(`Deploying account ${accountAddress}...`);
  
  const account = new Account({
    provider,
    address: accountAddress,
    signer: privateKey,
    cairoVersion: "1"
  });

  try {
    const deployResponse = await account.deployAccount({
      classHash: OZ_ACCOUNT_CLASS_HASH,
      constructorCalldata: constructorCallData,
      addressSalt: publicKey
    }, { nonce: "0", maxFee: "10000000000000000" });

    console.log("Deploy transaction submitted! Hash:", deployResponse.transaction_hash);
    console.log("Waiting for confirmation...");
    await provider.waitForTransaction(deployResponse.transaction_hash);
    console.log("Account successfully deployed!");
  } catch (err) {
    console.error("Deployment failed. Did you fund the address first?", err);
  }
}

main().catch(console.error);
