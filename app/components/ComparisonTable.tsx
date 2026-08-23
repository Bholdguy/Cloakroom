const FEATURES = [
  "Salary Privacy",
  "Vesting Protection",
  "Cryptographic Verification",
  "Gasless Onboarding",
  "Stealth Addresses",
  "Audit Compliance",
  "Self-Custodial Security",
  "Zero Gas Fees",
];

type CellValue = "full" | "partial" | "none";

const PROTOCOLS: {
  name: string;
  subtitle: string;
  highlight?: boolean;
  values: CellValue[];
}[] = [
  {
    name: "Cloakroom",
    subtitle: "Starknet STRK20",
    highlight: true,
    values: ["full", "full", "full", "full", "full", "full", "full", "full"],
  },
  {
    name: "Legacy Protocols",
    subtitle: "Sablier / Vesting.so",
    highlight: false,
    values: ["none", "none", "none", "none", "none", "partial", "full", "none"],
  },
  {
    name: "Centralised Web2",
    subtitle: "Deel / Gusto / Rippling",
    highlight: false,
    values: ["partial", "partial", "none", "partial", "none", "partial", "none", "none"],
  },
];

function Cell({ v, light }: { v: CellValue, light?: boolean }) {
  if (v === "full") return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={light ? "#fff" : "#7B5FF0"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
  if (v === "none") return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={light ? "rgba(255,255,255,0.7)" : "#EF4444"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={light ? "rgba(255,255,255,0.7)" : "#F59E0B"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 0 20v-20z" fill={light ? "rgba(255,255,255,0.7)" : "#F59E0B"} />
    </svg>
  );
}

export default function ComparisonTable() {
  return (
    <section id="comparison" className="w-full px-4 py-20">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="section-badge mb-5">Competitive Analysis</div>
          <h2
            className="font-display font-bold text-black leading-tight mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(2rem, 5vw, 3.25rem)", letterSpacing: "-0.02em" }}
          >
            Why Cloakroom wins outright
          </h2>
          <div className="flex flex-wrap justify-center gap-5 font-mono text-xs uppercase tracking-widest text-black/50">
            <span className="flex items-center gap-2"><Cell v="full" /> Full support</span>
            <span className="flex items-center gap-2"><Cell v="partial" /> Partial / caveats</span>
            <span className="flex items-center gap-2"><Cell v="none" /> Not supported</span>
          </div>
        </div>

        {/* Table */}
        <div
          className="overflow-x-auto rounded-2xl bg-white"
          style={{ border: "3px solid #000", boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
        >
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr style={{ borderBottom: "3px solid #000" }}>
                <th
                  className="text-left px-6 py-5 font-mono text-[10px] uppercase tracking-widest text-black/40"
                  style={{ width: "200px" }}
                >
                  Feature
                </th>
                {PROTOCOLS.map((p) => (
                  <th
                    key={p.name}
                    className="px-5 py-5 text-center"
                    style={{
                      background: p.highlight ? "#7B5FF0" : "transparent",
                      borderLeft: "3px solid #000",
                    }}
                  >
                    {p.highlight && (
                      <span
                        className="inline-block font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full mb-1.5"
                        style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
                      >
                        THIS PROTOCOL
                      </span>
                    )}
                    <p
                      className="font-display font-bold text-sm"
                      style={{ fontFamily: "var(--font-space-grotesk)", color: p.highlight ? "#fff" : "#000" }}
                    >
                      {p.name}
                    </p>
                    <p
                      className="font-mono text-[9px] uppercase tracking-widest mt-0.5"
                      style={{ color: p.highlight ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)" }}
                    >
                      {p.subtitle}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feat, fi) => (
                <tr
                  key={feat}
                  style={{
                    borderBottom: fi < FEATURES.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
                    background: fi % 2 === 1 ? "#F8F9FA" : "#fff",
                  }}
                >
                  <td className="px-6 py-3.5 font-sans text-sm font-medium text-black/75">{feat}</td>
                  {PROTOCOLS.map((p) => (
                    <td
                      key={p.name}
                      className="px-5 py-3.5 text-center"
                      style={{
                        background: p.highlight
                          ? fi % 2 === 1 ? "#6A50D8" : "#7B5FF0"
                          : "transparent",
                        borderLeft: "3px solid #000",
                      }}
                    >
                      <Cell v={p.values[fi]} light={p.highlight} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
