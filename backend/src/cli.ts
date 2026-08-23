import { loadPayrollCsv } from "./csv.js";
import { loadPayrollJobsForClaim, loadPayrollJobsForLock } from "./payroll_engine.js";
import { claimPayrollJobs, lockPayrollJobs } from "./builder.js";
import { loadConfig } from "./config.js";
import { printPrivateBalance, registerEmployer, runPayrollBatch } from "./payroll.js";
import { registerSessionKey } from "./vesting.js";
import type { RunMode } from "./types.js";

function usage(): never {
  console.error(`Cloakroom employer backend (raw Privacy SDK)

Usage:
  npm run payroll -- --csv <file> [--simulate]
  npm run lock -- --csv <file> [--simulate]
  npm run claim -- --csv <file> [--simulate]
  npm run register -- [--simulate]
  npm run session -- --id <felt> --budget <u128> --expires <unix>
  npm run balance

Immediate payroll CSV: recipient, amount
Lock/claim CSV: employee_address, token, amount, vesting_cliff_ts, vesting_end_ts
Amounts are integer token base units (u128). Recipients are registered Starknet addresses.

This is the employer key-holding path. Employee UX goes through the
wallet-delegated starter kit, not this process.
`);
  process.exit(2);
}

function flag(argv: string[], name: string): string | undefined {
  const index = argv.indexOf(name);
  if (index === -1 || index === argv.length - 1) {
    return undefined;
  }
  return argv[index + 1];
}

function has(argv: string[], name: string): boolean {
  return argv.includes(name);
}

function mode(argv: string[]): RunMode {
  return has(argv, "--simulate") || has(argv, "--dry-run") ? "simulate" : "execute";
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const command = argv[0];
  if (!command || command === "--help" || command === "-h") {
    usage();
  }

  const cfg = loadConfig();
  const runMode = mode(argv);

  switch (command) {
    case "payroll": {
      const csv = flag(argv, "--csv");
      if (!csv) usage();
      const hash = await runPayrollBatch(cfg, loadPayrollCsv(csv), runMode);
      console.log(hash ? `submitted ${hash}` : "simulated");
      break;
    }
    case "lock": {
      const csv = flag(argv, "--csv");
      if (!csv) usage();
      await lockPayrollJobs(cfg, loadPayrollJobsForLock(csv), runMode);
      break;
    }
    case "claim": {
      const csv = flag(argv, "--csv");
      if (!csv) usage();
      const hashes = await claimPayrollJobs(cfg, loadPayrollJobsForClaim(csv), runMode);
      console.log(hashes.length ? `submitted ${hashes.join(" ")}` : "simulated");
      break;
    }
    case "register": {
      const hash = await registerEmployer(cfg, runMode);
      console.log(hash ? `submitted ${hash}` : "simulated");
      break;
    }
    case "session": {
      const id = flag(argv, "--id");
      const budget = flag(argv, "--budget");
      const expires = flag(argv, "--expires");
      if (!id || !budget || !expires) usage();
      const hash = await registerSessionKey(cfg, id, budget, expires);
      console.log(`submitted ${hash}`);
      break;
    }
    case "balance": {
      await printPrivateBalance(cfg);
      break;
    }
    default:
      usage();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
