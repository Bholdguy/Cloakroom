"use client";

import { useState } from "react";

const FAQS = [
  {
    id: "faq-privacy-pool",
    q: "What is the STRK20 Privacy Pool?",
    a: "The STRK20 Privacy Pool is a smart contract that manages confidential balances through per-token subchannels. When you deposit or transfer STRK, notes and nullifiers are committed into the pool's cryptographic state trees.",
  },
  {
    id: "faq-viewing-keys",
    q: "How do encrypted notes and viewing keys work for payroll?",
    a: "Instead of public wallet transfers, Cloakroom generates encrypted notes committed into the privacy pool. Recipients discover and decrypt payments using their private viewing keys without exposing compensation amounts or linkable addresses to the public.",
  },
  {
    id: "faq-compliance",
    q: "How does Cloakroom achieve compliance without breaking privacy?",
    a: "We use Scoped Viewing Keys that allow you to grant time-limited, counterparty-limited decryption to auditors without revealing anything beyond what you authorise. In addition, deposit-screening sidecars verify fund origins before shielding.",
  },
  {
    id: "faq-gas",
    q: "Do contributors need to hold STRK or ETH to claim?",
    a: "Yes. Since gas sponsorship is not yet implemented, contributors must hold a small amount of ETH or STRK to pay for network fees when claiming their shielded funds.",
  },
  {
    id: "faq-starknet",
    q: "Why build on Starknet specifically?",
    a: "Starknet provides native ZK-STARK proof verification at the execution layer, making on-chain proof verification cheap and fast. Dedicated proving services generate validity proofs efficiently for a responsive payroll workflow.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" className="w-full px-4 py-20">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="section-badge mb-5">❓ FAQ</div>
          <h2
            className="font-display font-bold text-black leading-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(2rem, 5vw, 3.25rem)", letterSpacing: "-0.02em" }}
          >
            Got questions?
          </h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {FAQS.map((f) => {
            const isOpen = open === f.id;
            return (
              <div
                key={f.id}
                className="rounded-xl overflow-hidden bg-white"
                style={{
                  border: "3px solid #000",
                  boxShadow: isOpen ? "5px 5px 0px 0px rgba(0,0,0,1)" : "4px 4px 0px 0px rgba(0,0,0,1)",
                  transition: "box-shadow 0.15s ease",
                }}
              >
                <button
                  id={f.id}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : f.id)}
                  aria-expanded={isOpen}
                >
                  <span
                    className="font-display font-bold text-base pr-4 text-black leading-snug"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {f.q}
                  </span>
                  <span
                    className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full font-bold text-xl"
                    style={{
                      background: isOpen ? "#7B5FF0" : "#F8F9FA",
                      border: "2px solid #000",
                      color: isOpen ? "#fff" : "#000",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease, background 0.15s ease",
                    }}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5" style={{ borderTop: "2px solid #000" }}>
                    <p className="font-sans text-sm leading-relaxed pt-4 text-black/60">
                      {f.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
