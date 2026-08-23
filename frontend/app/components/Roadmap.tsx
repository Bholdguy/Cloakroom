import React from 'react';

type RoadmapProps = {
  activeStage?: string;
};

// Roadmap: displays three stages with the active one highlighted.
export default function Roadmap({ activeStage = 'Mainnet' }: RoadmapProps) {
  const stages = ['Sepolia', 'Mainnet', 'Future'];
  return (
    <div className="my-8 flex justify-center gap-4">
      {stages.map((stage) => (
        <div
          key={stage}
          className={`px-4 py-2 border-2 rounded font-serif text-obsidian ${stage === activeStage ? 'bg-neon text-obsidian border-neon' : 'bg-cream'} `}
        >
          {stage}
        </div>
      ))}
    </div>
  );
}
