import { RpcProvider, Account, CallData, shortString, ETransactionVersion } from "starknet";
import * as dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });

async function main() {
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY || process.env.CLOAKROOM_PRIVATE_KEY;
  const accountAddress = process.env.DEPLOYER_ACCOUNT_ADDRESS || process.env.CLOAKROOM_ACCOUNT_ADDRESS;
  
  if (!privateKey || !accountAddress) {
    throw new Error("Missing private key or account address in .env");
  }

  const rpcUrl = process.env.CLOAKROOM_RPC_URL || "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/alch_pIF1eQLl4crvr0DfGYFVx";
  
  console.log(`Connecting to provider: ${rpcUrl}`);
  const provider = new RpcProvider({ nodeUrl: rpcUrl });
  
  console.log('Debug ADDR:', accountAddress);
  console.log('Debug PK:', privateKey ? 'REDACTED (exists)' : 'UNDEFINED');
  
  const account = new Account({
    nodeUrl: rpcUrl,
    address: accountAddress,
    signer: privateKey,
    cairoVersion: "1"
  });
  console.log(`Using account: ${account.address}`);

  const contractAddress = process.env.CLOAKROOM_ANONYMIZER_ADDRESS;
  if (!contractAddress) throw new Error("Missing CLOAKROOM_ANONYMIZER_ADDRESS in .env");
  
  const sessionKeyIdStr = "cloakroom-demo-1";
  const sessionKeyId = shortString.encodeShortString(sessionKeyIdStr);
  
  const budget = "1000000000000000000000"; // 1000 * 1e18, passed as a string for u128
  const expiresAt = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days from now

  console.log(`Registering session key:`);
  console.log(`- ID (str): ${sessionKeyIdStr}`);
  console.log(`- ID (hex): ${sessionKeyId}`);
  console.log(`- Budget: ${budget}`);
  console.log(`- Expires: ${expiresAt}`);

  try {
    const nonce = await account.getNonce();
    console.log(`Current nonce: ${nonce}`);

    const { transaction_hash } = await account.execute({
      contractAddress: contractAddress,
      entrypoint: "register_session_key",
      calldata: CallData.compile([
        sessionKeyId,
        budget,
        expiresAt
      ])
    }, { maxFee: "10000000000000000", nonce });

    console.log(`\nTransaction submitted! Hash: ${transaction_hash}`);
    console.log(`Waiting for confirmation...`);

    const receipt = await provider.waitForTransaction(transaction_hash);
    
    if (receipt.isSuccess()) {
      console.log(`\n✅ SUCCESS! Session key registered.`);
      console.log(`Transaction Hash: ${transaction_hash}`);
      console.log(`Session Key ID: ${sessionKeyId}`);
    } else {
      console.error(`\n❌ Transaction failed:`, receipt);
    }
  } catch (error) {
    console.error(`\n❌ Execution error:`, error);
  }
}

main().catch(console.error);
