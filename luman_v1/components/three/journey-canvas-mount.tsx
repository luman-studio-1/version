"use client";

import dynamic from "next/dynamic";

// Same ssr:false boundary discipline as hero-canvas-mount.tsx — R3F's Canvas
// touches window/document at module init and must never evaluate during SSR.
export const JourneyCanvasMount = dynamic(
  () => import("@/components/three/journey/journey-scene").then((m) => m.JourneyScene),
  { ssr: false },
);
