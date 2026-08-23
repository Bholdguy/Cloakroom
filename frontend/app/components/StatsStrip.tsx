import React from 'react';

// StatsStrip: shows key protocol statistics in a horizontal strip.
export default function StatsStrip() {
  return (
    <div className="my-8 w-full flex justify-around bg-cream p-3 border border-obsidian rounded-lg shadow-[2px_2px_0_0_#0F1115] text-obsidian">
      <div className="text-center">
        <div className="font-serif text-lg font-bold">Network</div>
        <div className="font-mono">Starknet Sepolia (Pending)</div>
      </div>
      <div className="text-center">
        <div className="font-serif text-lg font-bold">Status</div>
        <div className="font-mono">Development</div>
      </div>
      <div className="text-center">
        <div className="font-serif text-lg font-bold">Mainnet Txs</div>
        <div className="font-mono">0</div>
      </div>
    </div>
  );
}
