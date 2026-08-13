"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------
 * Decorative texture — neutral, monochrome noise blended into whatever sits
 * underneath. No brand colors baked in, so it stays theme-token safe.
 * ---------------------------------------------------------------------- */
const GRAIN_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix in='t' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const GRID_TEXTURE_STYLE: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(90deg, currentColor 0, currentColor 1px, transparent 1px, transparent clamp(32px,6vw,72px)), repeating-linear-gradient(0deg, currentColor 0, currentColor 1px, transparent 1px, transparent clamp(32px,6vw,72px))",
  opacity: 0.05,
};

/* -------------------------------------------------------------------------
 * MaskedHeading — splits a headline into per-line overflow-hidden masks so
 * each line can slide up into view independently instead of the whole block
 * appearing at once.
 * ---------------------------------------------------------------------- */
export interface MaskedHeadingProps {
  lines: string[];
  as?: "h1" | "h2";
  className?: string;
}

export const MaskedHeading: React.FC<MaskedHeadingProps> = ({ lines, as = "h2", className }) => {
  const Tag = as;
  return (
    <Tag data-flow-headline className={className}>
      {lines.map((line, idx) => (
        <span key={`${line}-${idx}`} className="block overflow-hidden py-[0.04em]">
          <span data-flow-line className="block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
};

export interface FlowSectionProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  "aria-label"?: string;
  /** Decorative panel index, e.g. "01" — rendered as a large faint watermark numeral. */
  index?: string;
}

export const FlowSection: React.FC<FlowSectionProps> = ({
  className,
  style = {},
  children,
  "aria-label": ariaLabel,
  index,
}) => (
  <section
    data-flow-section
    aria-label={ariaLabel}
    className={cx("relative min-h-screen w-full overflow-hidden", className)}
  >
    <div
      data-flow-inner
      className="flow-art-container relative min-h-screen w-full will-change-transform"
      style={{ transformOrigin: "bottom left", ...style }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={GRID_TEXTURE_STYLE}
      />
      {index && (
        <span
          aria-hidden
          data-flow-numeral
          className="pointer-events-none absolute -right-[1vw] top-[1vw] select-none font-mono font-bold leading-none opacity-[0.07] will-change-transform"
          style={{ fontSize: "clamp(9rem,30vw,26rem)" }}
        >
          {index}
        </span>
      )}
      <div
        data-flow-content
        className="relative flex min-h-screen w-full flex-col justify-between gap-6 px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]"
      >
        {children}
      </div>
    </div>
  </section>
);

export interface FlowArtProps {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

const childCount = (children: React.ReactNode) => React.Children.count(children);

const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  "aria-label": ariaLabel = "Story scroll",
}) => {
  const containerRef = useRef<HTMLElement>(null);
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
      if (!containerRef.current || reducedMotion) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>("[data-flow-section]"),
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];
      const introTimelines: gsap.core.Timeline[] = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>(".flow-art-container");
        if (!inner) return;

        const lines = section.querySelectorAll<HTMLElement>("[data-flow-line]");
        const eyebrow = section.querySelectorAll<HTMLElement>("[data-flow-eyebrow]");
        const copy = section.querySelectorAll<HTMLElement>("[data-flow-copy]");
        const dividers = section.querySelectorAll<HTMLElement>("[data-flow-divider]");
        const items = section.querySelectorAll<HTMLElement>("[data-flow-item]");
        const numeral = section.querySelector<HTMLElement>("[data-flow-numeral]");

        gsap.set(dividers, { transformOrigin: "left center" });

        if (i > 0) {
          // Panel settles into place: rotate + scale the whole panel while
          // its content choreographs in at slightly offset positions along
          // the same scrub range, so the reveal reads as one continuous
          // motion rather than a flat snap into position.
          gsap.set(inner, { rotation: 30, scale: 0.94, transformOrigin: "bottom left" });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 25%",
              scrub: true,
            },
          });

          tl.to(inner, { rotation: 0, scale: 1, ease: "none", duration: 1 }, 0);

          if (numeral) {
            gsap.set(numeral, { yPercent: 12, scale: 1.08 });
            tl.to(numeral, { yPercent: 0, scale: 1, ease: "none", duration: 1 }, 0);
          }
          if (eyebrow.length) {
            gsap.set(eyebrow, { opacity: 0, x: -18 });
            tl.to(eyebrow, { opacity: 1, x: 0, ease: "none", duration: 0.5 }, 0.02);
          }
          if (lines.length) {
            gsap.set(lines, { yPercent: 115 });
            tl.to(
              lines,
              { yPercent: 0, ease: "none", duration: 0.85, stagger: 0.09 },
              0.08,
            );
          }
          if (dividers.length) {
            gsap.set(dividers, { scaleX: 0 });
            tl.to(dividers, { scaleX: 1, ease: "none", duration: 0.4, stagger: 0.08 }, 0.12);
          }
          if (copy.length) {
            gsap.set(copy, { opacity: 0, y: 26 });
            tl.to(copy, { opacity: 1, y: 0, ease: "none", duration: 0.5, stagger: 0.06 }, 0.3);
          }
          if (items.length) {
            gsap.set(items, { opacity: 0, y: 22 });
            tl.to(
              items,
              { opacity: 1, y: 0, ease: "none", duration: 0.6, stagger: 0.045 },
              0.4,
            );
          }

          if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
        } else {
          // First panel is visible on load — no scroll-tied rotation to hang
          // a reveal off, so it gets a one-time entrance instead.
          const intro = gsap.timeline({ delay: 0.15, defaults: { ease: "power3.out" } });
          if (eyebrow.length) intro.from(eyebrow, { opacity: 0, x: -18, duration: 0.6 }, 0);
          if (lines.length)
            intro.from(lines, { yPercent: 115, duration: 0.9, stagger: 0.09 }, 0.1);
          if (dividers.length)
            intro.from(dividers, { scaleX: 0, duration: 0.5, stagger: 0.08 }, 0.2);
          if (copy.length)
            intro.from(copy, { opacity: 0, y: 26, duration: 0.6, stagger: 0.06 }, 0.35);
          if (items.length)
            intro.from(items, { opacity: 0, y: 22, duration: 0.6, stagger: 0.045 }, 0.4);
          introTimelines.push(intro);
        }

        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: "bottom bottom",
              end: "bottom top",
              pin: true,
              pinSpacing: false,
            }),
          );
        }
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
        introTimelines.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [childCount(children), reducedMotion] },
  );

  return (
    <main
      ref={containerRef}
      aria-label={ariaLabel}
      className={cx("relative w-full overflow-x-hidden", className)}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[999]"
        style={{
          backgroundImage: `url("${GRAIN_DATA_URI}")`,
          backgroundRepeat: "repeat",
          opacity: 0.045,
          mixBlendMode: "overlay",
        }}
      />
    </main>
  );
};

export default FlowArt;
