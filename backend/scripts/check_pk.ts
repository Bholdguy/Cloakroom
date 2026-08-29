import { ec, hash, CallData } from "starknet";

const pk = process.env.DEPLOYER_PRIVATE_KEY;
if (pk) {
  console.log("Public Key for DEPLOYER_PRIVATE_KEY:", ec.starkCurve.getStarkKey(pk));
}
