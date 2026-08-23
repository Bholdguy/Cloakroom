import React from 'react';
import Link from 'next/link';

export default function PortalPage() {
  return (
    <div 
      className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center font-sans text-center px-4" 
      style={{ backgroundImage: 'radial-gradient(#D1D5DB 1px, transparent 1px)', backgroundSize: '32px 32px' }}
    >
      
      {/* Neo-brutalist Vault Icon */}
      <div className="w-16 h-16 bg-[#7B5FF0] rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black">
         <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
           <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
           <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
         </svg>
      </div>
      
      {/* Title */}
      <h1 
        className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 border-[3px] border-black bg-white px-8 py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
        style={{ fontFamily: '"Space Grotesk", sans-serif' }}
      >
        Cloakroom Portal
      </h1>
      
      {/* Subtitle */}
      <p className="text-gray-800 max-w-md mt-6 mb-10 font-medium leading-relaxed">
        The employer dashboard and Multi-Asset Shielded Pool interface live here. Connect your Starknet AA wallet to proceed.
      </p>
      
      {/* Connect Wallet Button */}
      <button className="bg-[#7B5FF0] text-white font-bold py-4 px-8 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm uppercase tracking-widest hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
        Connect Wallet
      </button>

      {/* Back to Home Link */}
      <Link className="mt-12 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-black transition-colors" href="/">
        &larr; Return to Landing Page
      </Link>
      
    </div>
  );
}
