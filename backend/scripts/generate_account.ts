import { CallData, hash, ec, stark } from "starknet";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const privateKey = stark.randomAddress();
const publicKey = ec.starkCurve.getStarkKey(privateKey);

// OpenZeppelin Account class hash on Starknet (Standard)
const OZ_CLASS_HASH = "0x061dac032f228abef9b66240f47f0f608b6e3ab9a160cca5152277cb3cb24fbf";
const constructorCalldata = CallData.compile({ publicKey });

const address = hash.calculateContractAddressFromHash(
  publicKey,
  OZ_CLASS_HASH,
  constructorCalldata,
  0
);

const envPath = join(process.cwd(), ".env");
let envContent = readFileSync(envPath, "utf8");

envContent = envContent.replace(
  /CLOAKROOM_ACCOUNT_ADDRESS=0x[a-fA-F0-9]*/,
  `CLOAKROOM_ACCOUNT_ADDRESS=${address}`
);
envContent = envContent.replace(
  /CLOAKROOM_PRIVATE_KEY=0x[a-fA-F0-9]*/,
  `CLOAKROOM_PRIVATE_KEY=${privateKey}`
);

writeFileSync(envPath, envContent);

console.log(`Address: ${address}`);
console.log(`Private Key: ${privateKey}`);
