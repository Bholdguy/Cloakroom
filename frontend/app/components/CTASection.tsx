"use client";

import Image from "next/image";

const FOOTER_COLS = [
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Use", "Cookie Policy", "Responsible Disclosure", "Licenses"],
  },
  {
    heading: "Product",
    links: ["Launch Portal", "Protocol Docs", "SDK Reference", "Audit Reports", "Changelog"],
  },
  {
    heading: "Developers",
    links: ["Cairo Contracts", "STRK20 Privacy SDK", "snforge Test Suite", "API Reference", "GitHub"],
  },
  {
    heading: "Company",
    links: ["About", "Blog", "Careers", "Press Kit", "Contact"],
  },
];

const NETWORK_BADGES = [
  { label: "Starknet Mainnet", dot: "#34D399" },
  { label: "STRK20", dot: "#A78BFA" },
  { label: "Stwo Prover", dot: "#60A5FA" },
];

export default function CTASection() {
  return (
    <>
      {/* ── Enterprise pre-footer CTA ─────────────────── */}
      <section className="w-full px-4 pb-20">
        <div className="max-w-5xl mx-auto">

          {/* Purple CTA card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#7B5FF0",
              border: "3px solid #000",
              boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
            }}
          >
            <div className="px-8 md:px-14 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">

              {/* Copy */}
              <div className="max-w-lg">
                <span
                  className="inline-block font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-5"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Enterprise · Get Started
                </span>
                <h2
                  className="font-bold text-white leading-none mb-4"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: "clamp(2rem, 5vw, 3.25rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Take your treasury<br />
                  <span style={{ opacity: 0.72 }}>private.</span>
                </h2>
                <p className="font-sans text-white/70 leading-relaxed text-base">
                  Join the first cohort of institutional teams running fully private
                  payroll and vesting on Starknet. No custody risk. No metadata exposure.
                  Compliance-ready from day one.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 flex-shrink-0 w-full md:w-auto min-w-[200px]">
                <a
                  href="/portal"
                  id="cta-primary-btn"
                  className="btn-ghost px-8 py-3.5 rounded-xl text-center"
                  style={{ color: "#7B5FF0", fontWeight: 800 }}
                >
                  Get Started →
                </a>
                <a
                  href="/whitepaper.pdf"
                  id="cta-docs-btn"
                  className="px-8 py-3.5 rounded-xl font-bold text-sm text-center text-white/75 hover:text-white transition-colors"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Read the Whitepaper
                </a>
              </div>
            </div>

            {/* Trust stats strip */}
            <div style={{ borderTop: "3px solid rgba(0,0,0,0.25)" }}>
              <div className="grid grid-cols-3">
                {[
                  { label: "Network", value: "Mainnet" },
                  { label: "Status", value: "Development" },
                  { label: "Transactions", value: "0" },
                ].map(({ label, value }, i) => (
                  <div
                    key={label}
                    className="px-8 py-5"
                    style={{ borderRight: i < 2 ? "3px solid rgba(0,0,0,0.25)" : "none" }}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/45 mb-1">{label}</p>
                    <p
                      className="font-bold text-2xl text-white leading-none"
                      style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dark institutional footer ─────────────────── */}
      <footer style={{ background: "#0B0F19", borderTop: "3px solid #000" }}>
        <div className="max-w-5xl mx-auto px-4 pt-14 pb-10">

          {/* 5-column grid: logo col + 4 link cols */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

            {/* Column 1 — Logo + brand */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
              {/* Inverted logo (white bg circle for dark bg) */}
              <div
                className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                style={{
                  background: "#fff",
                  border: "2px solid rgba(255,255,255,0.15)",
                  filter: "invert(0)",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Cloakroom"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <p
                  className="font-bold text-white text-base leading-none mb-1"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  CLOAKROOM
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#A78BFA" }}>
                  Protocol v1.0
                </p>
              </div>
              <p className="font-sans text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
                Institutional privacy infrastructure for on-chain payroll and treasury.
              </p>
              {/* Network badges */}
              <div className="flex flex-col gap-2 pt-2">
                {NETWORK_BADGES.map((b) => (
                  <span
                    key={b.label}
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest w-fit px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: b.dot }} />
                    {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Columns 2–5 — link groups */}
            {FOOTER_COLS.map((col) => (
              <div key={col.heading}>
                <p
                  className="font-bold text-white text-sm mb-4"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="font-sans text-sm transition-colors"
                        style={{ color: "rgba(255,255,255,0.38)" }}
                        onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
                        onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)")}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
              © 2026 Cloakroom Protocol · No warranties implied · Built on Starknet
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {/* X / Twitter */}
              <a
                href="#"
                aria-label="X / Twitter"
                className="transition-colors"
                style={{ color: "rgba(255,255,255,0.28)" }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.28)")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* GitHub */}
              <a
                href="#"
                aria-label="GitHub"
                className="transition-colors"
                style={{ color: "rgba(255,255,255,0.28)" }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.28)")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              {/* Discord */}
              <a
                href="#"
                aria-label="Discord"
                className="transition-colors"
                style={{ color: "rgba(255,255,255,0.28)" }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.28)")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
