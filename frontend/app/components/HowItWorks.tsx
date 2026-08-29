"use client";

import { useState } from "react";

const ROLES = [
  {
    id: "treasurer",
    label: "Corporate Treasurer",
    emoji: "🏦",
    steps: [
      {
        n: "01",
        title: "Authenticate with Session Keys",
        body: "Connect your Starknet AA wallet. Issue a scoped session key for the payroll batch — no full private key exposure required during the upload flow.",
        code: "session_key.scope({ action: 'payroll_batch', expires: '+24h' })",
      },
      {
        n: "02",
        title: "Upload & Validate CSV",
        body: "Drag-and-drop your payroll CSV. Client-side validation checks schema, deduplicates rows, and normalises amounts to u256 fixed-point. Nothing touches a server.",
        code: "validateCSV(file) → { rows: 142, total: 284_000 STRK, errors: 0 }",
      },
      {
        n: "03",
        title: "Client-Side ZK-Proof Generation",
        body: "The Stwo prover runs inside an isolated Web Worker. For a 30-recipient batch, proof generation completes in under 4 seconds. The browser tab stays responsive.",
        code: "worker.postMessage({ type: 'prove', batch }) → proof (3.7 s)",
      },
      {
        n: "04",
        title: "Commit Batched Notes On-Chain",
        body: "The Merkle root of all shielded notes is committed to PayrollBatcher.cairo. Max 30 txs per batch. The AA relay handles gas.",
        code: "PayrollBatcher.commit_batch(merkle_root, proof) → tx 0x7f3e…",
      },
    ],
  },
  {
    id: "contributor",
    label: "Contributor",
    emoji: "👤",
    steps: [
      {
        n: "01",
        title: "Discover Encrypted Note",
        body: "The employer creates an encrypted note committed to the privacy pool. The contributor discovers and decrypts their note using their viewing key.",
        code: "ticket = { note_hash: '0x7f3e…', proof_path: [...], key: 'enc' }",
      },
      {
        n: "02",
        title: "Submit Claim Transaction",
        body: "Submit the Merkle inclusion proof to the Anonymiser contract. A standard Starknet gas fee is required to claim.",
        code: "Anonymiser.claim(proof, nullifier)",
      },
      {
        n: "03",
        title: "Income Attestation Proof (Optional)",
        body: "Generate a ZK proof attesting to income amount or employer identity for tax or visa purposes, without revealing the full payroll record.",
        code: "attest({ field: 'annual_income', gte: 80000 }) → proof.json",
      },
    ],
  },
  {
    id: "auditor",
    label: "Auditor / Regulator",
    emoji: "⚖️",
    steps: [
      {
        n: "01",
        title: "Receive Scoped Viewing Key",
        body: "The employer issues a time- and scope-limited viewing key. The auditor can decrypt only the payment splits within the authorised date range.",
        code: "viewing_key.scope({ from: '2026-01', to: '2026-06', party: 'all' })",
      },
      {
        n: "02",
        title: "Audit Payment Splits",
        body: "Decrypt and verify each payment's amount, timestamp, and recipient class. Export a signed audit report. Wallet addresses remain shielded.",
        code: "audit.export({ format: 'PDF', signed: true }) → report_2026Q2.pdf",
      },

    ],
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState("treasurer");
  const role = ROLES.find((r) => r.id === active)!;

  return (
    <section id="compliance" className="w-full px-4 py-20">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="section-badge mb-5">⚙️ How it works</div>
          <h2
            className="font-display font-bold text-black leading-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(2rem, 5vw, 3.25rem)", letterSpacing: "-0.02em" }}
          >
            Built for every stakeholder
          </h2>
        </div>

        {/* Role tabs */}
        <div
          className="flex rounded-xl overflow-hidden mb-8"
          style={{ border: "3px solid #000", boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
        >
          {ROLES.map((r, i) => (
            <button
              key={r.id}
              id={`role-tab-${r.id}`}
              onClick={() => setActive(r.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 font-display font-bold text-sm transition-colors"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                background: r.id === active ? "#7B5FF0" : "#fff",
                color: r.id === active ? "#fff" : "rgba(0,0,0,0.4)",
                borderRight: i < ROLES.length - 1 ? "3px solid #000" : "none",
              }}
            >
              <span className="text-base">{r.emoji}</span>
              <span className="hidden sm:inline">{r.label}</span>
            </button>
          ))}
        </div>

        {/* Step cards */}
        <div className="flex flex-col gap-4">
          {role.steps.map((step) => (
            <div
              key={step.n}
              className="rounded-xl overflow-hidden bg-white flex"
              style={{ border: "3px solid #000", boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
            >
              {/* Step number */}
              <div
                className="flex items-center justify-center px-6 py-5 flex-shrink-0"
                style={{ background: "#7B5FF0", borderRight: "3px solid #000", minWidth: "72px" }}
              >
                <span
                  className="font-display font-bold text-2xl text-white leading-none"
                  style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
                >
                  {step.n}
                </span>
              </div>
              {/* Content */}
              <div className="flex-1 px-6 py-5 flex flex-col gap-3">
                <h3
                  className="font-display font-bold text-base text-black leading-snug"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {step.title}
                </h3>
                <p className="font-sans text-sm text-black/55 leading-relaxed">{step.body}</p>
                <pre
                  className="rounded-lg px-4 py-3 font-mono text-[11px] overflow-x-auto leading-relaxed"
                  style={{ background: "#0B0F19", color: "#A78BFA" }}
                >
                  {step.code}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
