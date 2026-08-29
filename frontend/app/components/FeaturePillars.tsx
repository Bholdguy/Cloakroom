const PILLARS = [
  {
    id: "privacy-pool",
    bg: "#C4B5FD",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
    tagline: "PRIVACY INFRASTRUCTURE",
    badge: "STRK20 PRIVACY POOL",
    title: "Universal Anonymity",
    subtitle: "Canonical Privacy Pool",
    body: "Assets interact with the live STRK20 privacy pool, breaking the on-chain link between sender and recipient. Your payroll is indistinguishable from any other shielded transfer.",
    detail: "Pool depth: Public",
    tags: ["ZK-STARKs", "Poseidon Hash", "Merkle Tree"],
  },
  {
    id: "stealth",
    bg: "#FDBA74",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
    tagline: "ZERO COORDINATION",
    badge: "PRIVATE TRANSFERS",
    title: "Stealth Payouts",
    subtitle: "Non-Interactive Transfers",
    body: "Recipients never expose a reusable address. A one-time stealth address is generated per payment using the recipient's ephemeral key, derived on-device.",
    detail: "Derivation: ECDH + Poseidon",
    tags: ["ECDH", "One-Time Addresses"],
  },
  {
    id: "compliance",
    bg: "#86EFAC",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <polyline points="9 12 11 14 15 10"></polyline>
      </svg>
    ),
    tagline: "REGULATORY GRADE",
    badge: "CRYPTOGRAPHIC PRIVACY",
    title: "Zero-Knowledge Verification",
    subtitle: "Association Sets & Scoped Viewing Keys",
    body: "Cryptographically prove the correctness of the payroll batch using ZK-STARKs. Issue time-scoped viewing keys to auditors for compliance.",
    detail: "Standard Cryptographic Proofs",
    tags: ["ZK-Proofs", "Viewing Keys"],
  },
];

export default function FeaturePillars() {
  return (
    <section id="features" className="w-full px-4 py-20">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="section-badge mb-5">Core Pillars</div>
          <h2
            className="font-display font-bold text-black leading-tight mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(2rem, 5vw, 3.25rem)", letterSpacing: "-0.02em" }}
          >
            One pool. Three jobs.
          </h2>
          <p className="font-sans text-base text-black/55 max-w-xl mx-auto leading-relaxed">
            Every cryptographic primitive in Cloakroom serves a distinct purpose — privacy,
            delivery, and compliance — unified in one protocol.
          </p>
        </div>

        {/* 3 stacked brutalist cards */}
        <div className="flex flex-col gap-5">
          {PILLARS.map((p) => (
            <div
              key={p.id}
              id={`pillar-${p.id}`}
              className="rounded-2xl overflow-hidden"
              style={{ background: p.bg, border: "3px solid #000", boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)" }}
            >
              <div className="p-7 md:p-10">
                {/* Top row */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="flex items-center justify-center w-14 h-14 rounded-xl text-black"
                    style={{ background: "rgba(0,0,0,0.06)", border: "2px solid rgba(0,0,0,0.15)" }}
                  >
                    {p.icon}
                  </div>
                  <span
                    className="font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-white"
                    style={{ border: "2px solid #000", boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
                  >
                    {p.badge}
                  </span>
                </div>

                {/* Tagline */}
                <p className="font-mono text-[10px] font-bold tracking-widest uppercase mb-2 text-black/45">
                  {p.tagline}
                </p>

                {/* Title */}
                <h3
                  className="font-display font-bold text-2xl md:text-3xl mb-1 text-black"
                  style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
                >
                  {p.title}
                </h3>
                <p className="font-mono text-xs uppercase tracking-widest mb-5 text-black/50">
                  {p.subtitle}
                </p>

                {/* Body */}
                <p className="font-sans text-sm leading-relaxed mb-6 text-black/70" style={{ maxWidth: "580px" }}>
                  {p.body}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md"
                        style={{ background: "rgba(0,0,0,0.1)", border: "1.5px solid rgba(0,0,0,0.25)", color: "#000" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-black/40">{p.detail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
