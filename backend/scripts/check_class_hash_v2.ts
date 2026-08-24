import { RpcProvider } from "starknet";

async function main() {
  const mainnetProvider = new RpcProvider({ nodeUrl: "https://starknet-mainnet.drpc.org" });
  const sepoliaProvider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.drpc.org" });

  const mainnetAccount = "0x5964b76d698f302e3b2b20761705d44dd7524c3729b529520171314c2e19c5";
  
  try {
    console.log("Fetching class hash of the mainnet account...");
    const classHash = await mainnetProvider.getClassHashAt(mainnetAccount);
    console.log("Mainnet Class Hash:", classHash);

    console.log("Checking if this OZ class hash exists on Sepolia...");
    await sepoliaProvider.getClassByHash(classHash);
    console.log("✅ SUCCESS: The exact same class hash is declared on Sepolia!");
    console.log("Class Hash to use:", classHash);
  } catch (err) {
    console.error("Error:", err);
  }
}

main().catch(console.error);
