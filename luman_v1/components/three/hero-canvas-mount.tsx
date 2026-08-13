"use client";

import dynamic from "next/dynamic";

// R3F's Canvas touches window/document at module init; it must never be
// evaluated during SSR. This is the only ssr:false boundary in the app.
export const HeroCanvasMount = dynamic(
  () => import("@/components/three/hero-scene").then((m) => m.HeroScene),
  { ssr: false },
);
