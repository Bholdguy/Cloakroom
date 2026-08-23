// spawn-devnet.ts
//
// Windows workaround: the starknet-devnet binary doesn't run natively on
// Windows (confirmed -- not a PATH problem, it's genuinely unsupported
// without WSL2). This uses the separate JS wrapper package instead, which
// downloads and manages the right platform binary for you under the hood
// and spawns it from inside Node -- no manual install, no WSL2 needed.
//
// Install first (inside backend/):
//   npm install --save-dev starknet-devnet
//
// Run with:
//   npx ts-node spawn-devnet.ts
//
// Leave this running in its own terminal tab -- it IS the devnet process.
// Everything else (contract deploy, run.ts) talks to it over RPC while
// this stays open.

import { Devnet } from "starknet-devnet";

async function main() {
    // Pin to the same devnet version the SDK's own tests use, per
    // sdk/README.md: v0.8.0-rc.3 (Starknet v0.14.2, RPC v0.10.1).
    // If this version string errors on spawn, check
    // github.com/starknet-io/starknet-devnet/releases for the closest
    // available tag and swap it in -- don't silently fall back to "latest",
    // since that could drift from what your Cairo contract was compiled
    // against.
    const devnet = await Devnet.spawnVersion("v0.8.0-rc.3", {
        args: ["--seed", "0"],
    });

    const alive = await devnet.provider.isAlive();
    console.log("Devnet alive:", alive);
    console.log("Devnet RPC URL:", devnet.provider.url);

    // Predeployed accounts: address + private key, already funded on this
    // local chain. Copy one of these into your .env for the sncast --account
    // step and for the backend's employer account -- do not generate a new
    // account, it won't have any funds on this fresh instance.
    const accounts = await devnet.provider.getPredeployedAccounts();
    console.log("Predeployed accounts:", JSON.stringify(accounts, null, 2));

    console.log("\nDevnet is running. Leave this process open.");
    console.log("Ctrl+C here will stop the devnet and reset all state.");
}

main().catch((err) => {
    console.error("Failed to spawn devnet:", err);
    process.exit(1);
});