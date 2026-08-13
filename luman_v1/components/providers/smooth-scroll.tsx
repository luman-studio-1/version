"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global smooth-scroll provider. Wraps <body>'s children in layout.tsx.
 *
 * Standard Lenis + GSAP pairing: Lenis emits scroll -> ScrollTrigger.update(),
 * gsap.ticker drives lenis.raf() so every tween (including ScrollTrigger
 * instances created by other sections) stays perfectly in sync with the
 * smoothed scroll position.
 *
 * Respects prefers-reduced-motion by never instantiating Lenis at all, so
 * the page falls back to fully native scroll behavior.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
