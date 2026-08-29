import { hash, json } from "starknet";
import fs from "fs";
import path from "path";

const releasePath = path.resolve(process.cwd(), "../contracts/target/release/cloakroom_PayrollAnonymizer.contract_class.json");
const compiledContract = json.parse(fs.readFileSync(releasePath).toString("ascii"));

const classHash = hash.computeSierraContractClassHash(compiledContract);
console.log("Computed class hash from release artifact:");
console.log(classHash);

const recorded = "0x25e900f1da71a61677e2f4d18610edb120e1a3bde7743fbf1927aeba420103f";
console.log("\nRecorded in deployments.json + deploy script:");
console.log(recorded);

const normalised = BigInt(classHash).toString(16);
const normRecorded = BigInt(recorded).toString(16);
console.log("\nMatch:", normalised === normRecorded);
