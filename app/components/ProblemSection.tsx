const PROBLEMS = [
  {
    bg: "#FEF08A",   // yellow
    badge: "RISK-01",
    title: "Salary Doxxing",
    body: "Every on-chain payroll transfer is permanently public. Employees can trivially discover colleagues' salaries, creating internal equity conflicts and competitive intelligence for rival recruiters.",
    impact: "AVG. 23% Employee churn attributed to salary transparency incidents",
    extra: "Public block explorers expose full amount, sender, and recipient on every transaction. Anyone with Starkscan or Voyager can reconstruct your entire compensation structure in minutes.",
  },
  {
    bg: "#FECDD3",   // pink/rose
    badge: "RISK-02",
    title: "Vesting Front-Running",
    body: "Token vesting schedules broadcast cliff dates, recipient addresses, and exact unlock amounts to the mempool. Arbitrageurs front-run unlock events, suppressing token price at the moment contributors most need liquidity.",
    impact: "Average 4-9% price impact on large vesting unlocks",
    extra: "Unlock events are public 30+ days in advance. MEV bots position short orders before cliff dates, systematically extracting value from your contributors at their most critical liquidity window.",
  },
  {
    bg: "#FDE047",   // darker yellow
    badge: "RISK-03",
    title: "Social Engineering & Phishing",
    body: "Public wallet links on block explorers like Voyager or Starkscan provide a rich target list for attackers. Executives and employees become exposed to highly targeted, contextual phishing campaigns.",
    impact: "$4.3B lost to crypto social engineering in 2024",
    extra: "Attackers use on-chain graphs to map organizational hierarchies, targeting individuals with high-value vesting contracts or multisig signing authority.",
  },
  {
    bg: "#FFEDD5",   // orange/peach
    badge: "RISK-04",
    title: "Premature Corporate Leaks",
    body: "Treasury movements and partnership funding rounds are broadcast globally before official PR announcements. Competitors and analysts can track your operational spend and strategic initiatives in real-time.",
    impact: "82% of Web3 companies report treasury surveillance by competitors",
    extra: "On-chain sleuths systematically monitor protocol wallets. Strategic acquisitions, runway burn rates, and marketing budgets become public knowledge instantaneously.",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="w-full px-4 py-20 text-left">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="section-badge mb-5">The Problem</div>
          <h2
            className="font-bold text-black mb-4 leading-tight"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              letterSpacing: "-0.02em",
            }}
          >
            The Fatal Flaw of<br />Transparent Web3
          </h2>
          <p className="font-sans text-base text-black/55 max-w-xl mx-auto leading-relaxed">
            Public blockchains were designed for transparency. But when you run payroll on a
            transparent ledger, you hand your entire compensation structure to anyone with a
            block explorer and thirty seconds.
          </p>
        </div>

        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {PROBLEMS.map((p) => (
            <div
              key={p.badge}
              className="rounded-2xl flex flex-col"
              style={{
                background: p.bg,
                border: "3px solid #000",
                boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
              }}
            >
              {/* Card top */}
              <div className="px-7 pt-7 pb-5">
                {/* Badge row */}
                <div className="flex items-start justify-between mb-5">
                  <span
                    className="font-mono text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white"
                    style={{ border: "2px solid #000", boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
                  >
                    {p.badge}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="font-bold text-2xl text-black mb-3 leading-tight"
                  style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
                >
                  {p.title}
                </h3>

                {/* Body */}
                <p className="font-sans text-sm text-black/70 leading-relaxed mb-4">
                  {p.body}
                </p>

                {/* Extra detail */}
                <p className="font-sans text-xs text-black/50 leading-relaxed">
                  {p.extra}
                </p>
              </div>

              {/* Impact strip */}
              <div
                className="mt-auto px-7 py-4"
                style={{ borderTop: "3px solid rgba(0,0,0,0.15)" }}
              >
                <p className="font-mono text-[10px] uppercase tracking-wider font-bold text-red-700">
                  {p.impact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
