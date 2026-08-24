import { RpcProvider } from "starknet";

async function main() {
  const provider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.drpc.org" });

  const hashes = [
    "0x04c6d6cf894f8bc96bb9c525e6853e5483177841f7388f74a46cf46f06654761", // OZ 0.8.1
    "0x01a736d6ed154502257f02b1ccdf4d9d1089f80811cd6acad48e6b6a9d1f2003", // Argent X
    "0x03131fa018d520a037686ce3efdde73f8395c150cbf5cb6cdae2f0411854bc06", // Argent X alt
    "0x05400e90f7e0ae78b0284c478a3c8751ce329184518ed2e6d62f928e4ec4e3b7"  // OZ 0.8.0 (known fail)
  ];

  for (const hash of hashes) {
    try {
      console.log(`Checking ${hash}...`);
      await provider.getClassByHash(hash);
      console.log(`✅ SUCCESS: ${hash} is declared on Sepolia!`);
    } catch (err) {
      console.log(`❌ FAILED: ${hash} is not declared.`);
    }
  }
}

main().catch(console.error);
