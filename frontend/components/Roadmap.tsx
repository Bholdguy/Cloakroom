'use client';
import React from 'react';

type RoadmapProps = {
  activeStage: 'Pacioli' | 'Chaum' | 'Nakamoto' | 'Mainnet';
};

const stages: RoadmapProps['activeStage'][] = ['Pacioli', 'Chaum', 'Nakamoto', 'Mainnet'];

export default function Roadmap({ activeStage }: RoadmapProps) {
  return (
    <section className="w-full bg-cream py-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center text-obsidian font-serif">
        {stages.map((stage) => (
          <div
            key={stage}
            className={`px-3 py-1 border-2 border-obsidian rounded-full ${stage === activeStage ? 'text-neon' : ''}`}
          >
            {stage}
          </div>
        ))}
      </div>
    </section>
  );
}
