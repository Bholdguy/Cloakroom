import React from 'react';

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-8">
      <div className="bg-white p-12 rounded-2xl border-4 border-obsidian shadow-[8px_8px_0_0_#0F1115] text-center max-w-2xl">
        <div className="text-6xl mb-6">🏗️</div>
        <h1 className="font-display font-bold text-4xl mb-4 text-obsidian">
          Portal Under Construction
        </h1>
        <p className="font-sans text-lg text-obsidian/70 mb-8">
          The Cloakroom employer dashboard and batch processing interface is currently being built. Check back soon for updates!
        </p>
        <a 
          href="/" 
          className="inline-block px-8 py-3 bg-violet text-white font-bold rounded-xl border-2 border-obsidian shadow-[4px_4px_0_0_#0F1115] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#0F1115] transition-all"
        >
          ← Return Home
        </a>
      </div>
    </div>
  );
}
