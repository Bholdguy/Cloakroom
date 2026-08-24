import { RpcProvider } from "starknet";

async function main() {
  const provider = new RpcProvider({ nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia" });
  const txHash = "0x6a8869a3efc16c14acf081951f8583ca666887ece20144e218d09c8507de473";

  console.log(`Waiting for tx: ${txHash}...`);
  const receipt = await provider.waitForTransaction(txHash);
  console.log("Transaction confirmed:", receipt.execution_status);
}

main().catch(console.error);
