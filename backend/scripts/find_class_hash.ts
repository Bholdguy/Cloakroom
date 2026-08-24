import { RpcProvider } from "starknet";

async function main() {
  const mainnetProvider = new RpcProvider({ nodeUrl: "https://free-rpc.nethermind.io/mainnet-juno/" });
  const sepoliaProvider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.drpc.org" });

  const mainnetAccount = "0x5964b76d698f302e3b2b20761705d44dd7524c3729b529520171314c2e19c5";
  
  try {
    console.log("Fetching class hash from Mainnet...");
    const classHash = await mainnetProvider.getClassHashAt(mainnetAccount);
    console.log("Mainnet Class Hash:", classHash);

    console.log("Checking if this class hash exists on Sepolia...");
    const classInfo = await sepoliaProvider.getClassByHash(classHash);
    console.log("Class exists on Sepolia! Hash:", classHash);
  } catch (err) {
    console.error("Error:", err);
  }
}

main().catch(console.error);
