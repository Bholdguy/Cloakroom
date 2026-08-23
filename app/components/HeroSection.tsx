"use client";

import { useEffect, useState } from "react";

const STATS = [
  { label: "Total TVL", value: "$14.2M", icon: "💰" },
  { label: "Shielded Txs", value: "18,492", icon: "🛡" },
  { label: "Prover Time", value: "1.4s", icon: "⚡" },
  { label: "Gas Paid", value: "$0.00", icon: "⛽" },
];

export default function HeroSection() {
  const [pulse, setPulse] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setPulse((p) => !p), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="w-full min-h-[88vh] flex flex-col items-center justify-center px-4 py-24 text-center">

      {/* Enterprise badge */}
      <div className="section-badge mb-8">
        <span>🔒</span>
        Enterprise Privacy Engine
      </div>

      {/* Headline */}
      <h1
        className="font-display font-bold leading-none tracking-tight mb-5 text-black"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          fontSize: "clamp(4rem, 12vw, 9rem)",
          letterSpacing: "-0.03em",
        }}
      >
        CLOAKROOM
      </h1>

      {/* Tagline */}
      <p
        className="font-display font-semibold mb-4 text-black/80"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
          letterSpacing: "-0.01em",
        }}
      >
        Global payroll. Nothing broadcasted.
      </p>

      <p
        className="font-sans max-w-lg mb-10 leading-relaxed text-black/55"
        style={{ fontSize: "1rem" }}
      >
        Run on-chain payroll and token vesting on Starknet with zero-knowledge
        privacy. Salaries, recipients, and amounts stay invisible — on-chain, always.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-4 justify-center mb-16">
        <a
          href="/portal"
          id="hero-launch-btn"
          className="btn-violet px-8 py-3.5 rounded-xl"
        >
          Launch Portal →
        </a>
        <a
          href="#compliance"
          id="hero-how-btn"
          className="btn-ghost px-8 py-3.5 rounded-xl"
        >
          How it works ↓
        </a>
      </div>

      {/* Live Stats Card */}
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden bg-white"
        style={{ border: "3px solid #000", boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
      >
        {/* Card header */}
        <div
          className="flex items-center justify-between px-5 py-3.5 bg-black"
          style={{ borderBottom: "3px solid #000" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                background: "#34D399",
                opacity: pulse ? 1 : 0.3,
                transition: "opacity 0.4s ease",
              }}
            />
            <span
              className="font-mono text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{ background: "#7B5FF0", color: "#fff", fontSize: "0.65rem" }}
            >
              STRK20 MAINNET
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#A78BFA" }}>
            LIVE
          </span>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-2">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col gap-1 px-6 py-5"
              style={{
                borderRight: i % 2 === 0 ? "3px solid #000" : "none",
                borderBottom: i < 2 ? "3px solid #000" : "none",
              }}
            >
              <span
                className="font-mono text-[10px] uppercase tracking-widest text-black/40 flex items-center gap-1.5"
              >
                <span>{s.icon}</span>
                {s.label}
              </span>
              <span
                className="font-display font-bold text-2xl leading-none text-black"
                style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
