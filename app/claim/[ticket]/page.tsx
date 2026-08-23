'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { Loader2 } from 'lucide-react';

export default function ClaimPage() {
  const { ticket } = useParams<{ ticket: string }>();
  const [walletConnected, setWalletConnected] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [proofReady, setProofReady] = useState(false);

  const handleConnect = () => {
    // Simulated wallet connection
    setWalletConnected(true);
  };

  const handleGenerate = () => {
    setGenerating(true);
    // Simulate async proof generation
    setTimeout(() => {
      setGenerating(false);
      setProofReady(true);
    }, 2000);
  };

  const handleWithdraw = () => {
    alert('Anonymous withdrawal submitted!');
  };

  return (
    <main className="flex flex-col items-center gap-8 p-8 min-h-screen bg-cream">
      <section className="text-center">
        <h1 className="text-4xl font-bold font-serif text-obsidian mb-2">Employee Claim Portal</h1>
        <p className="text-lg text-obsidian">Ticket ID: <span className="font-mono text-neon">{ticket}</span></p>
      </section>

      {!walletConnected ? (
        <button className="px-6 py-3 border-2 border-obsidian bg-cream text-obsidian font-serif hover:bg-neon hover:text-obsidian transition" onClick={handleConnect}>
          Connect Starknet Wallet
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {!proofReady && !generating && (
            <button className="px-6 py-3 border-2 border-obsidian bg-cream text-obsidian font-serif hover:bg-neon hover:text-obsidian transition" onClick={handleGenerate}>
              Discover Note & Generate Proof
            </button>
          )}
          {generating && (
            <div className="flex items-center gap-2 text-obsidian font-serif">
              <Loader2 className="animate-spin" />
              <span>Generating zero‑knowledge proof...</span>
            </div>
          )}
          {proofReady && (
            <button className="px-6 py-3 border-2 border-obsidian bg-cream text-obsidian font-serif hover:bg-neon hover:text-obsidian transition" onClick={handleWithdraw}>
              Withdraw Anonymously
            </button>
          )}
        </div>
      )}
    </main>
  );
}
