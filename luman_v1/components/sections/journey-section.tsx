"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { JourneyCanvasMount } from "@/components/three/journey-canvas-mount";
import { setJourneyProgress, journeyState, ZONE_COUNT } from "@/lib/journey-state";
import { useJourneyCapability } from "@/components/three/use-journey-capability";
import { JourneyOverlay } from "@/components/sections/journey/journey-overlay";
import StoryScrollSection from "@/components/sections/story-scroll-section";

gsap.registerPlugin(ScrollTrigger);

const TRACK_VH = 600;

// Crossfade window: a zone's DOM text is fully opaque within `FULL` of its
// own index and fades to 0 by `EDGE` away. Unlike the 3D geometry (which can
// overlap in depth without reading as broken), two DOM text blocks
// overlapping in the same screen position is illegible — so this window is
// deliberately narrow (EDGE < 0.5) rather than wide: adjacent zones both
// hit 0 opacity for a brief beat around the midpoint instead of visibly
// overlapping. That brief text-free moment reads as an intentional
// transition beat, not a bug.
const FADE_FULL = 0.32;
const FADE_EDGE = 0.46;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function zoneOpacity(zoneIndex: number, zoneFloat: number): number {
  const dist = Math.abs(zoneFloat - zoneIndex);
  return 1 - smoothstep(FADE_FULL, FADE_EDGE, dist);
}

function Journey3D() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Array<HTMLDivElement | null>>(Array(ZONE_COUNT).fill(null));

  useGSAP(
    () => {
      if (!wrapperRef.current) return;

      const trigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: `+=${TRACK_VH}%`,
        pin: true,
        pinSpacing: true,
        scrub: 0.4,
        onUpdate: (self) => {
          setJourneyProgress(self.progress);
          const { zoneFloat } = journeyState;
          blockRefs.current.forEach((el, i) => {
            if (el) el.style.opacity = zoneOpacity(i, zoneFloat).toFixed(3);
          });
        },
      });

      ScrollTrigger.refresh();

      return () => {
        trigger.kill();
      };
    },
    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef} className="relative h-screen w-full overflow-hidden bg-background">
      <JourneyCanvasMount className="absolute inset-0 h-full w-full" reducedMotion={false} />
      <JourneyOverlay
        setBlockRef={(zoneIndex, el) => {
          blockRefs.current[zoneIndex] = el;
        }}
      />
    </div>
  );
}

export default function JourneySection() {
  const enabled = useJourneyCapability();

  if (enabled === null) return null;
  if (!enabled) return <StoryScrollSection />;
  return <Journey3D />;
}
