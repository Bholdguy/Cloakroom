import fs from "fs";

async function fetchClass() {
  const rpcUrl = "https://api.cartridge.gg/x/starknet/sepolia";
  const classHash = "0x05400e90f7e0ae78b0284c478a3c8751ce329184518ed2e6d62f928e4ec4e3b7";
  
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "starknet_getClass",
      params: {
        block_id: "latest",
        class_hash: classHash
      }
    })
  });
  
  const json = await response.json();
  if (json.error) {
    console.error("Error fetching class:", json.error);
    return;
  }
  
  fs.writeFileSync("oz_account_class.json", JSON.stringify(json.result, null, 2));
  console.log("Class fetched and saved to oz_account_class.json");
}

fetchClass().catch(console.error);
