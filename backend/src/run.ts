import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Contract } from "starknet";
import { loadConfig, requireAnonymizer } from "./config.js";
import { registerEmployer } from "./payroll.js";
import { lockPayrollJobs } from "./builder.js";
import { loadPayrollJobsForLock } from "./payroll_engine.js";
import { registerSessionKey } from "./vesting.js";
import { createEmployerClient, proveAndSubmit, defaultExecuteOptions } from "./client.js";
import { toHex } from "./felt.js";

/** Helper: abort if not Mainnet (unless --devnet flag is used) */
async function assertMainnet(cfg: import("./config.js").CloakroomConfig, allowDevnet = false) {
  const isMainnet = cfg.rpcUrl && cfg.rpcUrl.includes("mainnet");
  if (!isMainnet && !allowDevnet) {
    console.error("❌ Detected non‑Mainnet RPC URL. Refusing to run against Sepolia or a local devnet.");
    console.error("   Use the `--devnet` flag if you intentionally want to run a devnet demo.");
    process.exit(1);
  }
}

async function main() {
  console.log("=== Cloakroom Backend – Mainnet Execution ===");

  // Load configuration from .env (which now points to Mainnet)
  const cfg = loadConfig();

  // Check RPC endpoint
  const args = process.argv.slice(2);
  const allowDevnet = args.includes("--devnet");
  await assertMainnet(cfg, allowDevnet);

  // --------------------------------------------------------------
  // EMPLOYER CLIENT
  // --------------------------------------------------------------
  const client = createEmployerClient(cfg);

  // --------------------------------------------------------------
  // REGISTER EMPLOYER (viewing key)
  // --------------------------------------------------------------
  console.log("🔑 Registering employer with the privacy pool...");
  const regHash = await registerEmployer(cfg, "execute");
  console.log(`✅ Employer registered – Tx: ${regHash}`);

  // --------------------------------------------------------------
  // DEPOSIT (must be approved via wallet UI beforehand)
  // --------------------------------------------------------------
  console.log("💰 Performing private deposit (ensure you have approved the pool via your wallet)...");
  const { hash: depHash } = await proveAndSubmit(client, () =>
    client.transfers
      .build(defaultExecuteOptions)
      .with(cfg.tokenAddress, (t) => {
        t.deposit({ amount: 100n * 10n ** 18n });
      })
      .surplusTo(cfg.accountAddress, false)
  );
  console.log(`✅ Deposit confirmed – Tx: ${depHash}`);

  // --------------------------------------------------------------
  // SESSION KEY
  // --------------------------------------------------------------
  console.log("🔐 Registering session key on the PayrollAnonymizer...");
  const sessionHash = await registerSessionKey(
    cfg,
    "0x777",
    (100n * 10n ** 18n).toString(),
    (Math.floor(Date.now() / 1000) + 3600).toString()
  );
  console.log(`✅ Session key registered – Tx: ${sessionHash}`);

  // --------------------------------------------------------------
  // CSV VESTING FILE (temporary)
  // --------------------------------------------------------------
  const csvPath = join(__dirname, "../examples/test_vesting.csv");
  const csvContent = `employee_address,token,amount,vesting_cliff_ts,vesting_end_ts\n${cfg.accountAddress},${cfg.tokenAddress},10000000000000000000,1000000000,2000000000\n`;
  writeFileSync(csvPath, csvContent);
  console.log(`📄 Generated vesting CSV at ${csvPath}`);

  // --------------------------------------------------------------
  // LOAD PAYROLL JOBS
  // --------------------------------------------------------------
  const jobs = loadPayrollJobsForLock(csvPath);

  // --------------------------------------------------------------
  // LOCK (private payroll transaction)
  // --------------------------------------------------------------
  console.log("🔒 Executing private lock transaction (will wait for proving window)...");
  const lockHashes = await lockPayrollJobs(cfg, jobs, "execute");
  console.log(`✅ Lock successful – Tx hashes: ${lockHashes.join(", ")}`);

  // --------------------------------------------------------------
  // ON‑CHAIN VERIFICATION
  // --------------------------------------------------------------
  console.log("🔎 Verifying vesting commitment on-chain...");
  const anonymizerClass = JSON.parse(
    readFileSync(
      join(__dirname, "../../contracts/target/dev/cloakroom_PayrollAnonymizer.contract_class.json"),
      "utf8"
    )
  );
  const anonymizerContract = new Contract({
    abi: anonymizerClass.abi,
    address: toHex(requireAnonymizer(cfg)),
    providerOrAccount: client.provider as any,
  });
  const vestingId = jobs[0].entries[0].vestingId;
  const commitment = await anonymizerContract.get_vesting(toHex(vestingId));
  console.log("🧾 Commitment state:");
  console.log(` - Token: ${toHex(commitment.token)}`);
  console.log(` - Total Amount: ${commitment.total_amount}`);
  console.log(` - Claimed Amount: ${commitment.claimed_amount}`);
  console.log(` - Cliff TS: ${commitment.cliff_timestamp}`);
  console.log(` - End TS: ${commitment.end_timestamp}`);
  console.log(` - Is Active: ${commitment.is_active}`);
  if (
    commitment.is_active === true &&
    commitment.total_amount === 10000000000000000000n
  ) {
    console.log("✅ SUCCESS: Vesting commitment verified on Mainnet!");
  } else {
    console.error("❌ FAILURE: Commitment verification mismatch.");
    process.exitCode = 1;
  }
}

// Execute main and handle unexpected errors
main().catch((e) => {
  console.error("❗ Unexpected error:", e);
  process.exit(1);
});
