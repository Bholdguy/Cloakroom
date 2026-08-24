import { RpcProvider } from 'starknet';

async function check() {
    const provider = new RpcProvider({ nodeUrl: 'https://free-rpc.nethermind.io/sepolia-juno/' });
    try {
        const classHash = '0xe5e98c32fb0c0c1de14d16dc60af559d218aab48e07598d385a37b10995065';
        const contractClass = await provider.getClass(classHash);
        console.log('CLASS HASH IS DECLARED!');
    } catch (e) {
        console.error('CLASS HASH NOT DECLARED OR ERROR:', e.message);
    }
}
check();
