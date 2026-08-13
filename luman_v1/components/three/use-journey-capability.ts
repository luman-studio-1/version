"use client";

import { useEffect, useState } from "react";

/**
 * One-time capability check that decides whether the 3D journey mounts at
 * all, or the DOM fallback (StoryScrollSection) renders instead. Starts
 * `null` (unknown) so callers render a safe default until resolved — must
 * not diverge between server and client render output, so this stays a
 * normal useState+useEffect hook (matching the reduced-motion pattern used
 * elsewhere in this codebase: hero-scene.tsx, cursor.tsx, ascii-hero.tsx)
 * rather than a module-scope singleton read at import time.
 */
export function useJourneyCapability(): boolean | null {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isTouch = window.matchMedia("(any-pointer: coarse)").matches;
    const isNarrow = window.innerWidth < 1024;
    const isLowPower =
      isTouch || isNarrow || (navigator.hardwareConcurrency ?? 8) <= 4;
    setEnabled(!reducedMotion && !isLowPower);
  }, []);

  return enabled;
}
