import React from 'react';

// BracketStrip: displays inline annotation brackets for protocol steps
export default function BracketStrip() {
  return (
    <div className="w-full text-obsidian text-sm italic mb-6">
      <span className="bg-cream px-2 py-1 rounded shadow-[2px_2px_0_0_#0F1115]">
        [⟨Employer uploads payroll CSV⟩]
      </span>
      <span className="ml-4 bg-cream px-2 py-1 rounded shadow-[2px_2px_0_0_#0F1115]">
        [⟨ZK proof generation⟩]
      </span>
      <span className="ml-4 bg-cream px-2 py-1 rounded shadow-[2px_2px_0_0_#0F1115]">
        [⟨Claim ticket ready⟩]
      </span>
    </div>
  );
}
