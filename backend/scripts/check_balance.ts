import { RpcProvider, CallData, uint256 } from "starknet";

const STRK_ADDRESS = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

async function main() {
  const provider = new RpcProvider({ nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia" });
  const accountAddress = "0x0026e8f22ab88c2020f7e14ba20fbdd26ef23017ff0e7c94c93d186e8716a9db";

  try {
    const res = await provider.callContract({
      contractAddress: STRK_ADDRESS,
      entrypoint: "balanceOf",
      calldata: CallData.compile({ account: accountAddress })
    });
    console.log("Raw response:", res);
    const balance = uint256.uint256ToBN({ low: res.result[0], high: res.result[1] });
    console.log("STRK Balance:", balance.toString());
  } catch (err) {
    console.error("Error:", err);
  }
}

main().catch(console.error);
