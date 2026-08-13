import { PricingCalculator } from "@/components/ui/pricing-calculator";

export default function PricingCalculatorSection() {
  return (
    <section
      aria-label="Estimate your project"
      className="w-full bg-background px-6 py-24 text-foreground sm:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 flex flex-col gap-4 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Rough numbers, real starting point
          </p>
          <h2 className="text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl">
            What might this cost?
          </h2>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground">
            We don&apos;t sell fixed packages, so there&apos;s no price list to hand
            you. This gives you a starting range based on scope — the real number
            comes from a conversation.
          </p>
        </div>

        <PricingCalculator />
      </div>
    </section>
  );
}
