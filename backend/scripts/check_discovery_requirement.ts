import { RpcProvider, Contract, type Abi } from "starknet";
import { PrivacyPoolABI } from "@starkware-libs/starknet-privacy-sdk/abi";
import {
  ContractDiscoveryProvider,
  type PoolContractInterface,
} from "@starkware-libs/starknet-privacy-sdk/testing";
import { SetupRequirement } from "@starkware-libs/starknet-privacy-sdk";
import { loadConfig } from "../src/config.js";
import { toHex } from "../src/felt.js";

async function main() {
  const cfg = loadConfig();
  const provider = new RpcProvider({ nodeUrl: cfg.rpcUrl });

  const accountAddress = toHex(cfg.accountAddress);
  const poolAddress = toHex(cfg.poolAddress);
  const tokenAddress = toHex(cfg.tokenAddress);
  const anonymizerAddress = toHex(cfg.anonymizerAddress!);
  const viewingKey = cfg.viewingKey;

  console.log("=== Checking Mainnet Discovery Requirement ===");
  console.log("Account:", accountAddress);
  console.log("Pool:", poolAddress);
  console.log("Token (STRK):", tokenAddress);
  console.log("Anonymizer:", anonymizerAddress);
  console.log("Viewing Key:", viewingKey.toString(16));

  const contract = new Contract({
    abi: PrivacyPoolABI as unknown as Abi,
    address: poolAddress,
    providerOrAccount: provider,
  }) as unknown as PoolContractInterface;

  const discoveryProvider = new ContractDiscoveryProvider(contract);

  const accountBigInt = BigInt(accountAddress);
  const tokenBigInt = BigInt(tokenAddress);
  const anonymizerBigInt = BigInt(anonymizerAddress);

  // 1. Discover requirement for transferring to anonymizer
  try {
    const reqToAnonymizer = await discoveryProvider.discoverRequirement(
      accountBigInt,
      viewingKey,
      anonymizerBigInt,
      tokenBigInt
    );
    console.log("\n1. discoverRequirement(account, anonymizer, STRK):", SetupRequirement[reqToAnonymizer], `(${reqToAnonymizer})`);
  } catch (err) {
    console.error("Error discovering requirement to anonymizer:", err);
  }

  // 2. Discover requirement for account self-channel
  try {
    const reqToSelf = await discoveryProvider.discoverRequirement(
      accountBigInt,
      viewingKey,
      accountBigInt,
      tokenBigInt
    );
    console.log("2. discoverRequirement(account, self, STRK):", SetupRequirement[reqToSelf], `(${reqToSelf})`);
  } catch (err) {
    console.error("Error discovering requirement to self:", err);
  }

  // 3. Discover existing notes
  try {
    const notesResult = await discoveryProvider.discoverNotes(accountBigInt, viewingKey, {
      tokens: [tokenBigInt],
    });
    console.log("\n3. discoverNotes result:");
    console.log("Timestamp/block:", notesResult.timestamp);
    const noteList = notesResult.notes.get(tokenBigInt) || [];
    console.log(`Discovered notes for STRK: ${noteList.length}`);
    for (const note of noteList) {
      console.log(` - Note id: ${note.id}, amount: ${note.amount}, open: ${note.open}, sender: ${note.sender}`);
    }
  } catch (err) {
    console.error("Error discovering notes:", err);
  }

  // 4. Discover existing channels
  try {
    const channelsResult = await discoveryProvider.discoverChannels(accountBigInt, viewingKey, [anonymizerBigInt, accountBigInt]);
    console.log("\n4. discoverChannels result:");
    console.log("Total channels:", channelsResult.total);
    if (channelsResult.channels) {
      for (const [recipient, channel] of channelsResult.channels) {
        console.log(` - Recipient: 0x${recipient.toString(16)} -> Channel:`, channel);
      }
    }
  } catch (err) {
    console.error("Error discovering channels:", err);
  }

  // 5. Check raw on-chain STRK ERC20 balance of the account
  try {
    const strkContract = new Contract({
      abi: [
        {
          name: "balanceOf",
          type: "function",
          inputs: [{ name: "account", type: "core::starknet::contract_address::ContractAddress" }],
          outputs: [{ name: "balance", type: "core::integer::u256" }],
          state_mutability: "view",
        },
      ],
      address: tokenAddress,
      providerOrAccount: provider,
    });
    const bal = await strkContract.balanceOf(accountAddress);
    console.log("\n5. Account Public STRK ERC20 Balance:", bal.toString(), "wei");
  } catch (err) {
    console.error("Error fetching STRK ERC20 balance:", err);
  }
}

main().catch(console.error);
