const ARCH_STEPS = [
  {
    layer: "L1",
    tag: "FRONTEND",
    emoji: "🖥",
    title: "Next.js + Isolated Prover Web Worker",
    body: "The employer UI runs in Next.js App Router. The Stwo prover executes inside a dedicated Web Worker — fully isolated from the main thread. Proof generation never blocks the UI.",
    spec: "Worker isolation: SharedArrayBuffer off · COOP: same-origin",
  },
  {
    layer: "L2",
    tag: "ZK PROOF",
    emoji: "🔐",
    title: "Client-Side ZK-Proof Generation",
    body: "The Stwo ZK-STARK prover generates a validity proof for the entire payroll batch on the client. For 30 recipients, end-to-end proof time is under 4 seconds on modern hardware.",
    spec: "Prover: Stwo · Batch max: 30 txs · Avg: 3.7 s",
  },
  {
    layer: "L3",
    tag: "SDK",
    emoji: "📦",
    title: "STRK20 Privacy SDK + Starknet.js Middleware",
    body: "TypeScript and Next.js abstractions handle note creation, Merkle tree management, and encrypted note key derivation. Secret signing keys remain strictly client-side.",
    spec: "Frontend: TypeScript / Next.js",
  },
  {
    layer: "L4",
    tag: "RELAY",
    emoji: "⛽",
    title: "Wallet Transactions",
    body: "Transactions are executed through standard Starknet wallets. Employers and contributors pay network fees normally.",
    spec: "AA: Starknet native",
  },
  {
    layer: "L5",
    tag: "CONTRACTS",
    emoji: "📄",
    title: "PayrollAnonymizer.cairo + STRK20 Pool",
    body: "PayrollAnonymizer.cairo invokes privacy_invoke on the STRK20 pool via an InvokeExternal action.",
    spec: "Compiled via Scarb · Poseidon hash",
  },
];

const SECURITY_PROPS = [
  { label: "Proof System", value: "ZK-STARKs (Stwo Engine)" },
  { label: "Hash Function", value: "Poseidon" },
  { label: "Commitment", value: "Merkle Tree" },
  { label: "Key Scheme", value: "ECDH + Poseidon" },
  { label: "Formal Testing", value: "Pending" },
  { label: "Trusted Setup", value: "None" },
  { label: "Max Batch Size", value: "30 transactions" },
  { label: "Proof Latency", value: "< 4 s client-side" },
  { label: "Network", value: "Starknet Mainnet" },
];

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="w-full px-4 py-20">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="section-badge mb-5">🏛 Protocol Architecture</div>
          <h2
            className="font-display font-bold text-black leading-tight mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(2rem, 5vw, 3.25rem)", letterSpacing: "-0.02em" }}
          >
            Enterprise-grade<br />cryptographic stack
          </h2>
          <p className="font-sans text-base text-black/55 max-w-xl mx-auto leading-relaxed">
            Every component is designed with a zero-trust model. The client generates proofs,
            the relay sponsors gas, the contracts verify on-chain. No server ever sees plaintext
            payroll data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

          {/* Stack */}
          <div className="flex flex-col gap-3">
            {ARCH_STEPS.map((step) => (
              <div
                key={step.layer}
                className="rounded-xl overflow-hidden flex bg-white"
                style={{ border: "3px solid #000", boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
              >
                <div
                  className="flex flex-col items-center justify-center px-4 py-5 gap-1 flex-shrink-0"
                  style={{ background: "#0B0F19", borderRight: "3px solid #000", minWidth: "72px" }}
                >
                  <span className="text-xl">{step.emoji}</span>
                  <span className="font-mono text-[8px] uppercase tracking-widest text-white/30">{step.layer}</span>
                  <span className="font-mono text-[8px] uppercase tracking-widest font-bold" style={{ color: "#A78BFA" }}>{step.tag}</span>
                </div>
                <div className="flex-1 px-5 py-5">
                  <h3
                    className="font-display font-bold text-sm mb-1.5 leading-snug text-black"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="font-sans text-xs leading-relaxed mb-2 text-black/55">{step.body}</p>
                  <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "#7B5FF0" }}>
                    {step.spec}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Security panel */}
          <div
            className="rounded-xl overflow-hidden self-start bg-white"
            style={{ border: "3px solid #000", boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
          >
            <div
              className="px-5 py-4"
              style={{ background: "#7B5FF0", borderBottom: "3px solid #000" }}
            >
              <p className="font-display font-bold text-white text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Security Properties
              </p>
            </div>
            {SECURITY_PROPS.map((p, i) => (
              <div
                key={p.label}
                className="px-5 py-3.5 flex flex-col gap-0.5"
                style={{ borderBottom: i < SECURITY_PROPS.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none" }}
              >
                <span className="font-mono text-[9px] uppercase tracking-widest text-black/35">{p.label}</span>
                <span className="font-mono text-[11px] font-bold text-black">{p.value}</span>
              </div>
            ))}
            <div
              className="px-5 py-4 flex items-center gap-2"
              style={{ borderTop: "3px solid #000", background: "#F8F9FA" }}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#FBBF24" }} />
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold" style={{ color: "#D97706" }}>
                Snforge suite pending
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
