import { stark, ec, hash, CallData } from 'starknet';

async function main() {
  const privateKey = stark.randomAddress();
  const publicKey = ec.starkCurve.getStarkKey(privateKey);
  
  // Standard OpenZeppelin Account class hash on Sepolia
  const OZ_ACCOUNT_CLASS_HASH = '0x05400e90f7e0ae78b0284c478a3c8751ce329184518ed2e6d62f928e4ec4e3b7';
  
  const constructorCallData = CallData.compile({ publicKey: publicKey });
  const accountAddress = hash.calculateContractAddressFromHash(
    publicKey,
    OZ_ACCOUNT_CLASS_HASH,
    constructorCallData,
    0
  );
  
  console.log('DEPLOYER_PRIVATE_KEY=' + privateKey);
  console.log('DEPLOYER_ACCOUNT_ADDRESS=' + accountAddress);
}

main().catch(console.error);
