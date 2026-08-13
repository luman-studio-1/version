import JourneySection from "@/components/sections/journey-section";
import PhoneMockupSection from "@/components/sections/phone-mockup-section";
import PricingCalculatorSection from "@/components/sections/pricing-calculator-section";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <JourneySection />
      <PhoneMockupSection />
      <PricingCalculatorSection />
    </div>
  );
}
