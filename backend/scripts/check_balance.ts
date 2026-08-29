import { RpcProvider, CallData, uint256 } from "starknet";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const STRK_ADDRESS = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
const ETH_ADDRESS = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

async function main() {
  const provider = new RpcProvider({ nodeUrl: process.env.CLOAKROOM_RPC_URL || "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/alch_pIF1eQLl4crvr0DfGYFVx" });
  const accountAddress = process.argv[2] || process.env.DEPLOYER_ACCOUNT_ADDRESS;
  console.log("Checking balance for:", accountAddress);

  try {
    const resStrk = await provider.callContract({
      contractAddress: STRK_ADDRESS,
      entrypoint: "balanceOf",
      calldata: CallData.compile({ account: accountAddress })
    });
    console.log("Raw STRK response:", resStrk);
    const balanceStrk = uint256.uint256ToBN({ low: resStrk[0] || "0x0", high: resStrk[1] || "0x0" });
    console.log("STRK Balance:", balanceStrk.toString());

    const resEth = await provider.callContract({
      contractAddress: ETH_ADDRESS,
      entrypoint: "balanceOf",
      calldata: CallData.compile({ account: accountAddress })
    });
    console.log("Raw ETH response:", resEth);
    const balanceEth = uint256.uint256ToBN({ low: resEth[0] || "0x0", high: resEth[1] || "0x0" });
    console.log("ETH Balance:", balanceEth.toString());
  } catch (err) {
    console.error("Error:", err);
  }
}

main().catch(console.error);
