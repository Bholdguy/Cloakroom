import FAQSection from "./components/FAQSection";
import FullBleedGrid from "./components/FullBleedGrid";
import TelemetryBar from "./components/TelemetryBar";
import HeroSection from "./components/HeroSection";
import ProblemSection from "./components/ProblemSection";
import FeaturePillars from "./components/FeaturePillars";
import HowItWorks from "./components/HowItWorks";
import ComparisonTable from "./components/ComparisonTable";
import ArchitectureSection from "./components/ArchitectureSection";
import CTASection from "./components/CTASection";

export const metadata = {
  title: "Cloakroom — Institutional Privacy for On-Chain Payroll & Treasury",
  description:
    "Run global payroll, distribute confidential token vesting, and route corporate treasury on Starknet without exposing compensation, vendor rates, or operational runway on public block explorers.",
};

export default function HomePage() {
  return (
    <FullBleedGrid>
      {/* Live network telemetry sub-banner */}
      <TelemetryBar />

      {/* Hero: centered headline + live stats card */}
      <HeroSection />

      {/* The problem: four risks of transparent payroll */}
      <ProblemSection />

      {/* Three cryptographic core pillars */}
      <FeaturePillars />

      {/* Role-based how-it-works: Treasurer / Contributor / Auditor */}
      <HowItWorks />

      {/* Competitive comparison matrix */}
      <ComparisonTable />

      {/* Enterprise protocol architecture + security properties */}
      <ArchitectureSection />

      {/* FAQ accordion */}
      <FAQSection />

      {/* Final CTA + docs + footer */}
      <CTASection />
    </FullBleedGrid>
  );
}
