"use client";

import { forwardRef } from "react";
import { MaskedHeading } from "@/components/ui/story-scroll";
import { journeyZones } from "@/lib/journey-copy";

const headlineClass =
  "text-[clamp(2.5rem,5.5vw,5rem)] font-bold leading-[0.98] tracking-tight text-foreground";
const eyebrowClass =
  "font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground";
const bodyClass = "font-serif text-[clamp(1rem,1.6vw,1.3rem)] leading-relaxed text-muted-foreground";

const ZoneOverlayBlock = forwardRef<HTMLDivElement, { zoneIndex: number }>(
  function ZoneOverlayBlock({ zoneIndex }, ref) {
    const zone = journeyZones[zoneIndex];

    return (
      <div
        ref={ref}
        className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20"
        style={{ opacity: zoneIndex === 0 ? 1 : 0 }}
        aria-hidden={zoneIndex !== 0}
      >
        <div className="relative flex max-w-xl flex-col gap-4">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -inset-y-5 -z-10 rounded-3xl bg-background/92 backdrop-blur-lg sm:-inset-x-10"
          />
          <p className={eyebrowClass}>{zone.eyebrow}</p>
          <MaskedHeading
            as={zoneIndex === 0 ? "h1" : "h2"}
            className={headlineClass}
            lines={zone.headline}
          />
          <p className={bodyClass}>{zone.body}</p>
          {zone.grid && (
            <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {zone.grid.map((item) => (
                <div key={item.label} className="border-t border-foreground/15 pt-2.5">
                  <p className="mb-1 text-[0.7rem] font-bold tracking-wide text-foreground uppercase">
                    {item.label}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);

/**
 * Fixed stack of all 5 zone blocks in the same visual position, each opacity
 * driven imperatively (see journey-section.tsx's ScrollTrigger onUpdate) —
 * never through React state, matching the camera's own hot-path bridge.
 */
export function JourneyOverlay({
  setBlockRef,
}: {
  setBlockRef: (zoneIndex: number, el: HTMLDivElement | null) => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {journeyZones.map((_, i) => (
        <ZoneOverlayBlock key={i} zoneIndex={i} ref={(el) => setBlockRef(i, el)} />
      ))}
    </div>
  );
}
