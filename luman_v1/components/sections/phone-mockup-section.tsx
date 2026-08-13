import PhoneMockupBasic from "@/components/ui/phone-mockups-1";

export default function PhoneMockupSection() {
  return (
    <section
      aria-label="What we build"
      className="relative w-full overflow-hidden bg-background px-6 py-24 text-foreground sm:px-12 lg:py-32"
    >
      {/* faint structural backdrop — reinforces "engineered system," not decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklch, var(--foreground), transparent 95%) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, var(--foreground), transparent 95%) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(65% 65% at 50% 40%, black 0%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-14 lg:gap-20">
        <div className="flex flex-col gap-6 text-center lg:mx-auto lg:max-w-2xl">
          <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Business systems
          </p>
          <h2 className="text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl">
            Software your team actually opens.
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Dashboards, booking platforms, storefronts, and AI assistants — built around
            your workflow instead of a template. Whatever the interface, it starts with
            understanding what your team is trying to get done.
          </p>
        </div>

        <div className="flex justify-center">
          <PhoneMockupBasic />
        </div>

        <p className="mx-auto max-w-md text-center text-xs text-muted-foreground/80">
          Illustrative interfaces — representative of the systems we design, not screenshots
          of a specific client build.
        </p>
      </div>
    </section>
  );
}
