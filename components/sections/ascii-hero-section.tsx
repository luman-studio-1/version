"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AsciiHero } from "@/components/ui/ascii-hero";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export default function AsciiHeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      if (reducedMotion) {
        gsap.set(
          "[data-reveal-eyebrow], [data-reveal-line], [data-reveal-subhead], [data-reveal-cta], [data-reveal-cue]",
          { opacity: 1, y: 0, yPercent: 0, clearProps: "transform" },
        );
        return;
      }

      gsap.set("[data-reveal-line]", { yPercent: 115 });
      gsap.set("[data-reveal-eyebrow], [data-reveal-subhead], [data-reveal-cue]", {
        opacity: 0,
        y: 16,
      });
      gsap.set("[data-reveal-cta]", { opacity: 0, y: 16 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to("[data-reveal-eyebrow]", { opacity: 1, y: 0, duration: 0.6 })
        .to(
          "[data-reveal-line]",
          { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.12 },
          "-=0.3",
        )
        .to("[data-reveal-subhead]", { opacity: 1, y: 0, duration: 0.7 }, "-=0.55")
        .to(
          "[data-reveal-cta]",
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          "-=0.4",
        )
        .to("[data-reveal-cue]", { opacity: 1, y: 0, duration: 0.6 }, "-=0.2");

      return () => {
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Luman Studio"
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-background"
    >
      <AsciiHero className="absolute inset-0 h-full w-full" />

      {/* Ambient legibility gradient — a light overall falloff toward the
          bottom of the section so the field never fights the copy block. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-45% to-background/70"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 pt-20 sm:px-12">
        <p
          data-reveal-eyebrow
          className="flex items-center gap-3 font-mono text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase sm:tracking-[0.35em]"
        >
          <span className="h-px w-8 shrink-0 bg-muted-foreground/50" aria-hidden />
          <span>
            Luman Studio
            <span className="hidden sm:inline">
              {" "}
              — Strategy · Design · Technology · Creative Production
            </span>
          </span>
        </p>

        <h1 className="max-w-6xl font-sans text-[clamp(2.5rem,7.4vw,6.25rem)] leading-[0.97] font-bold tracking-tight text-foreground">
          <span className="block overflow-hidden">
            <span data-reveal-line className="block">
              We understand your
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-reveal-line className="block">
              goals first, then build
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              data-reveal-line
              className="block font-serif text-secondary italic"
            >
              the right solution.
            </span>
          </span>
        </h1>

        {/* Backdrop is anchored to this block's own footprint (not a
            percentage of the section), so the copy stays legible against
            the ink field at every viewport height. */}
        <div className="relative flex max-w-xl flex-col gap-5 pb-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-5 -inset-y-4 -z-10 rounded-3xl bg-background/75 backdrop-blur-[3px] sm:-inset-x-8"
          />
          <p
            data-reveal-subhead
            className="text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            Strategy, design, technology, and creative production — combined as needed,
            never sold as a menu. Tell us the problem; we&apos;ll recommend the fix.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button data-reveal-cta size="lg">
              Start a conversation
            </Button>
            <Button data-reveal-cta size="lg" variant="outline">
              See what we do
            </Button>
          </div>
        </div>
      </div>

      <div
        data-reveal-cue
        className="pointer-events-none absolute bottom-8 left-6 z-10 flex flex-col items-center gap-3 sm:left-12"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
          Scroll
        </span>
        <span className="hero-scroll-line h-10 w-px bg-muted-foreground/60" />
      </div>
    </section>
  );
}
