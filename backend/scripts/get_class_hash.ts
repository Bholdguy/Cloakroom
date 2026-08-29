import { hash, json } from "starknet";
import fs from "fs";
import path from "path";

const releasePath = path.resolve(process.cwd(), "../contracts/target/release/cloakroom_PayrollAnonymizer.contract_class.json");
const compiledContract = json.parse(fs.readFileSync(releasePath).toString("ascii"));

const classHash = hash.computeSierraContractClassHash(compiledContract);
console.log("Computed class hash:");
console.log(classHash);
