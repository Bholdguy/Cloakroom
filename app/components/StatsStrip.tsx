import React from 'react';

// StatsStrip: shows key protocol statistics in a horizontal strip.
export default function StatsStrip() {
  return (
    <div className="my-8 w-full flex justify-around bg-cream p-3 border border-obsidian rounded-lg shadow-[2px_2px_0_0_#0F1115] text-obsidian">
      <div className="text-center">
        <div className="font-serif text-lg font-bold">Pool Size</div>
        <div className="font-mono">≈ 12 k ETH</div>
      </div>
      <div className="text-center">
        <div className="font-serif text-lg font-bold">Active Users</div>
        <div className="font-mono">1 234</div>
      </div>
      <div className="text-center">
        <div className="font-serif text-lg font-bold">Last Block</div>
        <div className="font-mono"># 4 567 890</div>
      </div>
    </div>
  );
}
