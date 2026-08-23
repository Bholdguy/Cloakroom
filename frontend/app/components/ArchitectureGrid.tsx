const CONTRACTS = [
  {
    label: "Pool Contract",
    address: "0x0f11...7777",
    role: "Holds encrypted payroll commitments and manages deposit lifecycle.",
    tag: "POOL",
  },
  {
    label: "Token Adapter",
    address: "0x04a6...cc21",
    role: "Wraps STRK/ETH for standardised fixed-point payroll disbursements.",
    tag: "TOKEN",
  },
  {
    label: "Anonymiser",
    address: "0x07d9...b3f0",
    role: "Verifies Merkle inclusion proofs and nullifies spent tickets.",
    tag: "ANON",
  },
];

const PROPERTIES = [
  { label: "Proof system", value: "STARKs (Cairo VM)" },
  { label: "Hash function", value: "Poseidon" },
  { label: "Commitment scheme", value: "Merkle tree" },
  { label: "Network", value: "Starknet Mainnet" },
  { label: "Privacy model", value: "Unlinkable payees" },
  { label: "Trusted setup", value: "None" },
];

export default function ArchitectureGrid() {
  return (
    <section className="w-full border-b-2 border-obsidian">
      {/* header */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] border-b-2 border-obsidian">
        <div className="px-8 md:px-16 py-10 md:border-r-2 border-obsidian flex items-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-obsidian/40 whitespace-nowrap">
            [ ARCHITECTURE // ON-CHAIN COMPONENTS ]
          </p>
        </div>
        <div className="px-8 md:px-16 py-10">
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,3rem)] leading-tight text-obsidian">
            Three contracts. No custody.
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto]">
        {/* Contracts column */}
        <div className="border-b-2 lg:border-b-0 lg:border-r-2 border-obsidian">
          {CONTRACTS.map((c, i) => (
            <div
              key={c.tag}
              className={[
                "px-8 md:px-12 py-8 flex flex-col gap-2",
                i < CONTRACTS.length - 1 ? "border-b border-obsidian/20" : "",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] uppercase tracking-widest bg-obsidian text-neon px-2 py-0.5">
                  {c.tag}
                </span>
                <span className="font-serif text-lg text-obsidian">{c.label}</span>
              </div>
              <p className="font-mono text-[10px] text-obsidian/40">{c.address}</p>
              <p className="font-sans text-sm text-obsidian/70 leading-relaxed">{c.role}</p>
            </div>
          ))}
        </div>

        {/* Properties sidebar */}
        <div className="flex flex-col bg-obsidian min-w-[260px] max-w-sm">
          <div className="px-8 py-6 border-b border-[#1e2329]">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neon">
              Security Properties
            </p>
          </div>
          {PROPERTIES.map((p) => (
            <div key={p.label} className="px-8 py-4 border-b border-[#1e2329] flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#3a3f47]">
                {p.label}
              </span>
              <span className="font-mono text-xs text-[#c8cdd4]">{p.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
