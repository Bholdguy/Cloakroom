async function check() {
  const rpcUrl = "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/alch_pIF1eQLl4crvr0DfGYFVx";
  console.log("Directly checking against RPC URL:", rpcUrl);
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
    console.error("Error from RPC:", JSON.stringify(json.error, null, 2));
  } else {
    console.log("Success! Class is declared on this network.");
    console.log("Class contract_class_version:", json.result?.contract_class_version);
    console.log("Has sierra_program:", !!json.result?.sierra_program);
  }
}
check().catch(console.error);
