import { RpcProvider } from "starknet";

async function main() {
  const provider = new RpcProvider({ nodeUrl: "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/alch_pIF1eQLl4crvr0DfGYFVx" });
  const txHash = "0x6a8869a3efc16c14acf081951f8583ca666887ece20144e218d09c8507de473";

  console.log(`Waiting for tx: ${txHash}...`);
  const receipt = await provider.waitForTransaction(txHash);
  console.log("Transaction confirmed:", receipt.execution_status);
}

main().catch(console.error);
