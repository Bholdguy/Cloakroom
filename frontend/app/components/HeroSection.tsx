"use client";





export default function HeroSection() {

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


    </section>
  );
}
