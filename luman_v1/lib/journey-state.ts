/**
 * Scroll-state bridge for the 3D journey: a plain mutable singleton, not
 * React state. GSAP's ScrollTrigger writes to it up to ~120x/second via
 * onUpdate; React Three Fiber's useFrame reads it every frame. Routing this
 * through useState would re-render the scene graph on every scroll tick and
 * destroy the framerate — GSAP writes, useFrame reads, React never
 * re-renders during scroll.
 *
 * Pure logic only, no React — see components/three/use-journey-capability.ts
 * for the (React-hook) one-time capability check that decides whether the
 * journey mounts at all.
 */

export const ZONE_COUNT = 5;

export interface JourneyState {
  progress: number; // 0..1 across the whole pinned track — source of truth
  zoneFloat: number; // 0..(ZONE_COUNT-1) continuous — camera spline parameter
  activeZone: number; // Math.floor(zoneFloat), clamped
  zoneLocalT: number; // 0..1 fractional position within activeZone
}

export const journeyState: JourneyState = {
  progress: 0,
  zoneFloat: 0,
  activeZone: 0,
  zoneLocalT: 0,
};

export function setJourneyProgress(p: number): void {
  const progress = Math.min(1, Math.max(0, p));
  const zoneFloat = progress * (ZONE_COUNT - 1);
  const activeZone = Math.min(ZONE_COUNT - 1, Math.floor(zoneFloat));

  journeyState.progress = progress;
  journeyState.zoneFloat = zoneFloat;
  journeyState.activeZone = activeZone;
  journeyState.zoneLocalT = zoneFloat - activeZone;
}
