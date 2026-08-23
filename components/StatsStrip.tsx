'use client';
import React from 'react';

export default function StatsStrip() {
  return (
    <section className="w-full bg-cream py-6">
      <div className="max-w-4xl mx-auto flex justify-between text-obsidian font-serif">
        <div className="text-center">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm">Shielded payrolls</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm">Cycles sealed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm">Employees paid privately</div>
        </div>
      </div>
      <p className="text-center text-xs text-obsidian mt-2">
        Sample figures for design preview – not live network data.
      </p>
    </section>
  );
}
