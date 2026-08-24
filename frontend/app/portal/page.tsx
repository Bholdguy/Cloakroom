'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { connect, disconnect } from '@starknet-io/get-starknet';
import { RpcProvider, Account, constants } from 'starknet';
import {
  createPrivateTransfers,
  createEmptyRegistry,
} from '@starknet-privacy-sdk/dist';

const POOL_ADDRESS = '0x0254a6b2997ef52e9f830ce1f543f6b29768295e8d17e2267d672c552cfe0d91';
const PAYROLL_ANONYMIZER_ADDRESS = '0x7d075ac3cc2c6a379d53641571cfc760870b732e8e3fece6f9f7bf7196dc6ac';
const STRK_TOKEN = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';
const SESSION_KEY_ID = '0x636c6f616b726f6f6d2d64656d6f2d31';
const LOCK_AMOUNT = BigInt("1000000000000000000");
const PROVER_URL = 'https://sepolia.prover.privacy.starknet.io';
const DISCOVERY_URL = 'https://sepolia.indexer.privacy.starknet.io';
const SEPOLIA_RPC_URL = 'https://free-rpc.nethermind.io/sepolia-juno/';

const truncate = (s: string) => `${s.slice(0, 6)}...${s.slice(-4)}`;

type TxStatus = 'idle' | 'proving' | 'submitting' | 'confirmed' | 'error';

export default function PortalPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [starknetObj, setStarknetObj] = useState<any>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [status, setStatus] = useState<TxStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      const sn = (await connect()) as any;
      if (!sn) { alert('Please install Argent X or Braavos.'); return; }
      await sn.enable();
      const address = sn.selectedAddress || sn.account?.address;
      if (address) { setWalletAddress(address); setStarknetObj(sn); }
    } catch (err) { console.error('Wallet connect failed:', err); }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setWalletAddress(null); setStarknetObj(null);
    setTxHash(null); setStatus('idle'); setErrorMsg(null);
  };

  const executePayroll = async () => {
    if (!starknetObj?.account) return;
    setStatus('proving'); setErrorMsg(null); setTxHash(null);

    try {
      const provider = new RpcProvider({ nodeUrl: SEPOLIA_RPC_URL });
      const account = new Account({
        provider,
        address: walletAddress!,
        signer: starknetObj.account.signer ?? starknetObj.account,
        cairoVersion: '1'
      });

      const latestBlock = await provider.getBlockNumber();
      const provingBlockId = Math.max(0, latestBlock - 10);

      const viewingKeyProvider = {
        getViewingKey: async (): Promise<bigint> => {
          const sig = await starknetObj.account.signMessage({
            types: {
              StarkNetDomain: [{ name: 'name', type: 'felt' }],
              Message: [{ name: 'key', type: 'felt' }],
            },
            primaryType: 'Message',
            domain: { name: 'CloakroomViewingKey' },
            message: { key: 'viewing-key-v1' },
          });
          const raw = Array.isArray(sig) ? sig[0] : (sig.r ?? sig[0]);
          return BigInt(raw);
        },
      };

      const transfers = createPrivateTransfers({
        account,
        viewingKeyProvider,
        provingProvider: {
          url: PROVER_URL,
          chainId: constants.StarknetChainId.SN_SEPOLIA,
          nodeUrl: SEPOLIA_RPC_URL,
        },
        discoveryProvider: { url: DISCOVERY_URL },
        poolContractAddress: POOL_ADDRESS,
      });

      const vestingId = `0x${Date.now().toString(16)}`;
      const cliffTs = Math.floor(Date.now() / 1000) + 30 * 86400;
      const endTs = Math.floor(Date.now() / 1000) + 365 * 86400;
      const registry = createEmptyRegistry();

      const result = await transfers
        .build({
          autoRegister: true,
          autoSetup: true,
          autoDiscover: { notes: 'refresh', channels: 'refresh' },
          autoSelectNotes: 'naive',
          registry,
          provingBlockId,
        })
        .with(STRK_TOKEN, (t) =>
          t.withdraw({ recipient: PAYROLL_ANONYMIZER_ADDRESS, amount: LOCK_AMOUNT })
        )
        .invoke(() => ({
          contractAddress: PAYROLL_ANONYMIZER_ADDRESS,
          entrypoint: 'register_lock',
          calldata: [
            '0x0',                      // operation: 0 = Lock
            vestingId,                   // vesting_id
            STRK_TOKEN,                  // token
            LOCK_AMOUNT.toString(),      // total_amount low (u128)
            '0x0',                      // total_amount high (u128)
            cliffTs.toString(),          // cliff_timestamp
            endTs.toString(),            // end_timestamp
            SESSION_KEY_ID,             // session_key_id
            '0x0',                      // note_id
          ],
        }))
        .execute({ provingBlockId });

      const { call, proof } = result.callAndProof;
      setStatus('submitting');

      const calls: any[] = [call];
      if (proof.proofFacts.length > 0) {
        calls.push({
          contractAddress: POOL_ADDRESS,
          entrypoint: 'submit_proof_facts',
          calldata: proof.proofFacts,
        });
      }

      const response = await starknetObj.account.execute(calls);
      setTxHash(response.transaction_hash);
      setStatus('confirmed');
    } catch (err: any) {
      console.error('Execution failed:', err);
      setErrorMsg(err?.message ?? 'Transaction failed. See console for details.');
      setStatus('error');
    }
  };

  const statusLabel: Record<TxStatus, string> = {
    idle: 'Execute Shielded Payroll Lock',
    proving: 'Generating Zero-Knowledge Proof…',
    submitting: 'Submitting to Starknet…',
    confirmed: 'Transaction Confirmed ✓',
    error: 'Retry Shielded Payroll Lock',
  };

  return (
    <div
      className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center font-sans text-center px-4"
      style={{ backgroundImage: 'radial-gradient(#D1D5DB 1px, transparent 1px)', backgroundSize: '32px 32px' }}
    >
      <div className="w-16 h-16 bg-[#7B5FF0] rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      <h1
        className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 border-[3px] border-black bg-white px-8 py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        style={{ fontFamily: '"Space Grotesk", sans-serif' }}
      >
        Cloakroom Portal
      </h1>

      <p className="text-gray-800 max-w-md mt-6 mb-6 font-medium leading-relaxed">
        Shielded payroll via the Starknet privacy pool. Connect your Argent X or Braavos wallet to execute a zero-knowledge Lock transaction.
      </p>
      <p className="text-xs text-gray-400 font-mono mb-10">
        Anonymizer: {truncate(PAYROLL_ANONYMIZER_ADDRESS)} · Pool: {truncate(POOL_ADDRESS)}
      </p>

      {walletAddress ? (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          <div className="bg-[#86EFAC] text-[#14532D] font-bold py-4 px-8 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm uppercase tracking-widest flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-green-500 border border-black animate-pulse" />
            {truncate(walletAddress)}
          </div>

          <button
            onClick={executePayroll}
            disabled={status === 'proving' || status === 'submitting'}
            className="w-full bg-[#FDBA74] text-black font-bold py-4 px-8 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm uppercase tracking-widest hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {statusLabel[status]}
          </button>

          {(status === 'proving' || status === 'submitting') && (
            <div className="bg-white p-4 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl w-full">
              <p className="text-xs font-bold uppercase text-gray-500 mb-2">
                {status === 'proving' ? 'Step 1/2 · Generating ZK proof (~30s)' : 'Step 2/2 · Broadcasting to Starknet'}
              </p>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7B5FF0] rounded-full transition-all duration-500"
                  style={{ width: status === 'proving' ? '50%' : '90%' }}
                />
              </div>
            </div>
          )}

          {txHash && (
            <div className="bg-white p-4 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl w-full">
              <p className="text-xs font-bold uppercase text-gray-500 mb-1">Transaction Submitted</p>
              <a
                href={`https://sepolia.voyager.online/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7B5FF0] font-mono text-xs hover:underline break-all"
              >
                {txHash} ↗
              </a>
            </div>
          )}

          {status === 'error' && errorMsg && (
            <div className="bg-red-50 p-4 border-[3px] border-red-400 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] rounded-xl w-full text-left">
              <p className="text-xs font-bold uppercase text-red-500 mb-1">Error</p>
              <p className="text-xs font-mono text-red-700 break-words">{errorMsg}</p>
            </div>
          )}

          <button
            onClick={handleDisconnect}
            className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-black transition-colors underline mt-4"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="bg-[#7B5FF0] text-white font-bold py-4 px-8 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm uppercase tracking-widest hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          Connect Wallet
        </button>
      )}

      <Link
        className="mt-16 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-black transition-colors"
        href="/"
      >
        &larr; Return to Landing Page
      </Link>
    </div>
  );
}
