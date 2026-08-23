const STEPS = [
  {
    index: "01",
    tag: "[ INGEST ]",
    title: "CSV Upload & Validation",
    body: "Employer drops a payroll CSV. Cloakroom validates schema, deduplicates rows, and normalises amounts to fixed-point u256 before any cryptographic operation begins.",
    detail: "No plaintext ever leaves the browser before encryption.",
  },
  {
    index: "02",
    tag: "[ COMMIT ]",
    title: "Poseidon Hashing & Merkle Root",
    body: "Each (recipient, amount, salt) triple is hashed with the Poseidon permutation, which is native to the Starknet VM. Leaves are assembled into a Merkle tree; the root is the only value posted on-chain.",
    detail: "Hash: Poseidon(addr ‖ amt ‖ salt) → leaf",
  },
  {
    index: "03",
    tag: "[ PROVE ]",
    title: "STARK Proof Generation",
    body: "The prover generates a validity proof that every leaf in the committed Merkle tree was correctly hashed and authorised by the employer. The proof is ~40 KB and verifies in under 2 s on Mainnet.",
    detail: "Avg latency: 1.4 s  //  Proof size: ~40 KB",
  },
  {
    index: "04",
    tag: "[ CLAIM ]",
    title: "Private Redemption",
    body: "Each recipient receives a one-time ticket. They submit a Merkle inclusion proof to the Cloakroom contract, which verifies membership without revealing any other payee or amount.",
    detail: "Nullifier prevents double-spend.",
  },
];

export default function TechnicalMonograph() {
  return (
    <section className="w-full border-b-2 border-obsidian">
      {/* section header */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] border-b-2 border-obsidian">
        <div className="px-8 md:px-16 py-10 md:border-r-2 border-obsidian flex items-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-obsidian/40 whitespace-nowrap">
            [ TECHNICAL MONOGRAPH // HOW IT WORKS ]
          </p>
        </div>
        <div className="px-8 md:px-16 py-10">
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,3rem)] leading-tight text-obsidian">
            Four-step cryptographic pipeline
          </h2>
        </div>
      </div>

      {/* steps grid */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {STEPS.map((step, i) => (
          <div
            key={step.index}
            className={[
              "px-8 md:px-12 py-10 flex flex-col gap-4",
              "border-b-2 border-obsidian",
              i % 2 === 0 ? "md:border-r-2 border-obsidian" : "",
            ].join(" ")}
          >
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[10px] tracking-widest text-obsidian/30">
                {step.tag}
              </span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="font-serif text-5xl text-neon leading-none select-none">
                {step.index}
              </span>
              <h3 className="font-serif text-xl text-obsidian leading-snug">{step.title}</h3>
            </div>
            <p className="font-sans text-sm text-obsidian/70 leading-relaxed">{step.body}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-obsidian/40 mt-auto pt-4 border-t border-obsidian/10">
              {step.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
