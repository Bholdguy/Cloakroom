import { json, hash } from "starknet";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Loading compiled contract...");
  const compiledSierra = json.parse(fs.readFileSync(path.join(process.cwd(), "../contracts/target/dev/cloakroom_PayrollAnonymizer.contract_class.json")).toString("ascii"));
  
  const computedClassHash = hash.computeSierraContractClassHash(compiledSierra);
  console.log("Computed Class Hash from current source:", computedClassHash);
  
  const expectedClassHash = "0x01a736d6ed154502257f02b1ccdf4d9d1089f80811cd6acad48e6b6a9d1f2003";
  console.log("Expected Class Hash:", expectedClassHash);
  
  if (computedClassHash === expectedClassHash) {
    console.log("MATCH! The class hash perfectly matches the current source code.");
  } else {
    console.log("MISMATCH! The class hash does NOT match the current source code!");
  }
}

main().catch(console.error);
