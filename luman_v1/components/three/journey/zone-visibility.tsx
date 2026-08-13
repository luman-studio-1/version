"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { journeyState } from "@/lib/journey-state";

// Wider than the DOM overlay's crossfade band on purpose: the camera's FOV
// cone can otherwise catch a neighboring zone's geometry (nothing else
// occludes/fogs distant content), so 3D visibility needs a hard, generous
// cutoff — a visible "pop" at this distance is far less noticeable than
// permanent bleed-through from an adjacent zone.
const VISIBILITY_THRESHOLD = 0.7;

/** Hides an entire zone's geometry once the camera is far enough from it —
 * a plain per-frame `visible` toggle, no React state, matching the rest of
 * the journey's scroll-state bridge. */
export function ZoneVisibility({
  zoneIndex,
  children,
}: {
  zoneIndex: number;
  children: ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.visible = Math.abs(journeyState.zoneFloat - zoneIndex) < VISIBILITY_THRESHOLD;
  });

  return <group ref={groupRef}>{children}</group>;
}
