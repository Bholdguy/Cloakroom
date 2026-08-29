import { Account, RpcProvider, Contract, uint256 } from "starknet";
import { loadConfig } from "../src/config.js";
import { createEmployerClient, proveAndSubmit, defaultExecuteOptions } from "../src/client.js";

const STRK_ABI = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "core::starknet::contract_address::ContractAddress" },
      { name: "amount", type: "core::integer::u256" }
    ],
    outputs: [{ type: "core::bool" }],
    state_mutability: "external"
  }
];

import { toHex } from "../src/felt.js";

async function main() {
  const cfg = loadConfig();
  console.log("Account Address:", toHex(cfg.accountAddress));
  console.log("Private Key:", cfg.privateKey);
  const provider = new RpcProvider({ nodeUrl: cfg.rpcUrl });
  const account = new Account({
    provider,
    address: toHex(cfg.accountAddress),
    signer: cfg.privateKey,
    cairoVersion: "1",
  });

  const amount = 10n * 10n ** 18n;

  console.log("Approving Privacy Pool to spend 10 STRK...");
  const approveTx = await account.execute({
    contractAddress: toHex(cfg.tokenAddress),
    entrypoint: "approve",
    calldata: [toHex(cfg.poolAddress), amount.toString(), "0"]
  });
  console.log("Approve Tx Hash:", approveTx.transaction_hash);
  await provider.waitForTransaction(approveTx.transaction_hash);
  console.log("Approve Confirmed!");

  console.log("Depositing 10 STRK into Privacy Pool...");
  const client = createEmployerClient(cfg);
  const { hash: depHash } = await proveAndSubmit(client, () =>
    client.transfers
      .build(defaultExecuteOptions)
      .with(cfg.tokenAddress, (t) => {
        t.deposit({ amount: amount });
      })
      .surplusTo(cfg.accountAddress, false)
  );
  console.log("Deposit Tx Hash:", depHash);
  await provider.waitForTransaction(depHash);
  console.log("Deposit Confirmed!");
}

main().catch(console.error);
