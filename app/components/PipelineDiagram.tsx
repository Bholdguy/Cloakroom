import React from 'react';

export default function PipelineDiagram() {
  return (
    <div className="my-8 w-full flex justify-center">
      <svg viewBox="0 0 200 100" className="w-64 h-32 text-obsidian">
        <line x1="10" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="2" />
        <polygon points="60,45 70,50 60,55" fill="currentColor" />
        <line x1="70" y1="50" x2="130" y2="50" stroke="currentColor" strokeWidth="2" />
        <polygon points="130,45 140,50 130,55" fill="currentColor" />
        <line x1="140" y1="50" x2="190" y2="50" stroke="currentColor" strokeWidth="2" />
        <text x="20" y="40" className="text-sm fill-current">Upload CSV</text>
        <text x="80" y="40" className="text-sm fill-current">ZK‑VM</text>
        <text x="150" y="40" className="text-sm fill-current">Ticket</text>
      </svg>
    </div>
  );
}
