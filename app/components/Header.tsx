'use client';

import React from 'react';

export default function Header() {
  // In a real app, these values would be fetched from a live API or context.
  const network = 'STARKNET_MAINNET';
  const pool = '0x0f11...7777';
  const prover = 'OPERATIONAL';

  return (
    <header className="w-full bg-obsidian text-cream text-xs font-mono py-1 px-4 flex justify-center items-center gap-2">
      <span>{network}</span>
      <span className="mx-2">//</span>
      <span>POOL_ACTIVE: {pool}</span>
      <span className="mx-2">//</span>
      <span>PROVER_STATUS: {prover}</span>
    </header>
  );
}
