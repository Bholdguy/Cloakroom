'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { connect, disconnect } from '@starknet-io/get-starknet';
import { RpcProvider, Account, constants } from 'starknet';
import {
  createPrivateTransfers,
  createEmptyRegistry,
} from '@starknet-privacy-sdk/dist';

const POOL_ADDRESS = '0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a';
const PAYROLL_ANONYMIZER_ADDRESS = '0x65e54e30f5b88401a3475f205373c682bc90a8a26bbda1bfbf65c413f29d69c';
const STRK_TOKEN = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';
const SESSION_KEY_ID = '0x636c6f616b726f6f6d2d64656d6f2d31';
const LOCK_AMOUNT = BigInt("1000000000000000000");
const PROVER_URL = '/api/privacy/prover';
const DISCOVERY_URL = '/api/privacy/indexer';
const RPC_URL = '/api/rpc';

const truncate = (s: string) => `${s.slice(0, 6)}...${s.slice(-4)}`;

type TxStatus = 'idle' | 'proving' | 'submitting' | 'confirmed' | 'error';

export default function PortalPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [starknetObj, setStarknetObj] = useState<any>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [status, setStatus] = useState<TxStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchBalance = async (addr: string) => {
    try {
      const provider = new RpcProvider({ nodeUrl: RPC_URL });
      const res = await provider.callContract({
        contractAddress: STRK_TOKEN,
        entrypoint: 'balanceOf',
        calldata: [addr],
      });
      if (res && res.length >= 2) {
        const low = BigInt(res[0]);
        const high = BigInt(res[1]);
        const total = (high << 128n) + low;
        const formatted = (Number(total) / 1e18).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        });
        setBalance(formatted);
      } else if (res && res.length === 1) {
        const total = BigInt(res[0]);
        const formatted = (Number(total) / 1e18).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        });
        setBalance(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch STRK balance:', err);
    }
  };

  const handleConnect = async () => {
    try {
      const sn = (await connect()) as any;
      if (!sn) { alert('Please install Argent X or Braavos.'); return; }
      await sn.enable();
      const address = sn.selectedAddress || sn.account?.address;
      if (address) {
        setWalletAddress(address);
        setStarknetObj(sn);
        fetchBalance(address);
      }
    } catch (err) { console.error('Wallet connect failed:', err); }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setWalletAddress(null); setStarknetObj(null);
    setBalance(null);
    setTxHash(null); setStatus('idle'); setErrorMsg(null);
  };

  const executePayroll = async () => {
    if (!starknetObj?.account) return;
    if (!PAYROLL_ANONYMIZER_ADDRESS.startsWith('0x')) {
      setErrorMsg('Payroll anonymizer contract not yet deployed on this network.');
      setStatus('error');
      return;
    }
    setStatus('submitting'); setErrorMsg(null); setTxHash(null);

    try {
      const vestingId = `0x${Date.now().toString(16)}`;
      const cliffTs = Math.floor(Date.now() / 1000) + 30 * 86400;
      const endTs = Math.floor(Date.now() / 1000) + 365 * 86400;

      const call = {
        contractAddress: PAYROLL_ANONYMIZER_ADDRESS,
        entrypoint: 'privacy_invoke',
        calldata: [
          '0x0',                      // [0] operation: 0 = Lock
          vestingId,                   // [1] vesting_id
          STRK_TOKEN,                  // [2] token
          LOCK_AMOUNT.toString(),      // [3] total_amount low
          '0x0',                      // [4] total_amount high
          cliffTs.toString(),          // [5] cliff_timestamp
          endTs.toString(),            // [6] end_timestamp
          SESSION_KEY_ID,             // [7] session_key_id
          '0x0',                      // [8] secret
          '0x0',                      // [9] note_id
        ],
      };

      const response = await starknetObj.account.execute([call]);
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
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <div className="bg-[#86EFAC] text-[#14532D] font-bold py-3 px-6 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-black animate-pulse" />
              {truncate(walletAddress)}
            </div>
            {balance !== null && (
              <div className="bg-white text-black font-mono font-bold py-3 px-6 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs tracking-wider flex items-center gap-1.5">
                <span className="text-gray-500 font-sans uppercase font-bold text-[10px]">STRK:</span>
                <span className="text-[#7B5FF0] font-black">{balance}</span>
              </div>
            )}
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
                href={`https://voyager.online/tx/${txHash}`}
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
