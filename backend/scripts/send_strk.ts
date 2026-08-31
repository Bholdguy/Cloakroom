import { RpcProvider, Account, Contract, uint256 } from "starknet";
import "dotenv/config";

async function main() {
  const provider = new RpcProvider({ nodeUrl: process.env.CLOAKROOM_RPC_URL! });
  const senderAddress = process.env.CLOAKROOM_ACCOUNT_ADDRESS!;
  const senderPrivateKey = process.env.CLOAKROOM_PRIVATE_KEY!;
  const receiverAddress = process.env.DEPLOYER_ACCOUNT_ADDRESS!;
  const strkAddress = process.env.CLOAKROOM_TOKEN_ADDRESS!;

  console.log("Sender:", senderAddress);
  console.log("Receiver:", receiverAddress);

  const account = new Account({
    provider,
    address: senderAddress,
    signer: senderPrivateKey,
    cairoVersion: "1"
  });

  // Transfer 15 STRK
  // 15 STRK = 15 * 10^18 wei
  const amountToTransfer = BigInt(15) * BigInt(10 ** 18);
  const uint256Amount = uint256.bnToUint256(amountToTransfer);

  console.log("Sending 15 STRK...");
  
  const { transaction_hash } = await account.execute({
    contractAddress: strkAddress,
    entrypoint: "transfer",
    calldata: [receiverAddress, uint256Amount.low, uint256Amount.high],
  });

  console.log("Transaction hash:", transaction_hash);
  console.log("Waiting for confirmation...");
  
  await provider.waitForTransaction(transaction_hash);
  console.log("Transfer successful!");
}

main().catch(console.error);
