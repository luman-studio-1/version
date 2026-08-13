"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { journeyState } from "@/lib/journey-state";
import { buildJourneyCurves, JOURNEY_WAYPOINTS } from "@/components/three/journey/camera-path";

const ZONE_MAX = JOURNEY_WAYPOINTS.length - 1;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Frame-rate independent exponential-decay lerp (Vector3, in place). */
function damp3(current: THREE.Vector3, target: THREE.Vector3, lambda: number, dt: number) {
  current.lerp(target, 1 - Math.exp(-lambda * dt));
}

export function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree();
  const { positionCurve, focusCurve } = useMemo(() => buildJourneyCurves(), []);
  const lookAt = useRef(new THREE.Vector3(...JOURNEY_WAYPOINTS[0].focus));

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    // Deliberately linear, not eased: zoneLocalT (used below for the
    // arrival blend, and in journey-section.tsx for the DOM crossfade) is
    // itself linear in zoneFloat. An S-curve here would move position
    // faster/slower than those other two systems expect at the same
    // scroll position, throwing off "camera centered on X exactly when its
    // text is fully visible." The CatmullRom spline's own curvature still
    // gives the motion a non-linear, non-robotic feel in world space even
    // with linear input.
    const u = journeyState.zoneFloat / ZONE_MAX;

    // getPoint (not getPointAt): CatmullRomCurve3 divides its raw [0,1]
    // parameter into N-1 equal segments, one per pair of waypoints, so
    // u = zoneFloat/ZONE_MAX lands precisely at waypoint `zoneFloat`.
    // getPointAt instead reparameterizes by arc length — since the
    // waypoints aren't exactly evenly spaced, that silently shifts the
    // camera off from where zoneLocalT/the DOM crossfade assume it is.
    const targetPos = positionCurve.getPoint(u);

    // Look slightly ahead of the current position so the camera reads as
    // travelling forward, then blend toward the active zone's own focus
    // point as the camera arrives — settling by zoneLocalT ~0.35 rather
    // than ~1, so the camera is centered on this zone's content by the
    // time its DOM overlay text reaches full opacity (FADE_FULL in
    // journey-section.tsx), not lagging behind it.
    const lookAheadU = THREE.MathUtils.clamp(u + 0.05, 0, 1);
    const ahead = focusCurve.getPoint(lookAheadU);
    const zoneFocus = focusCurve.getPoint(u);
    const arriveBlend = smoothstep(0, 0.35, journeyState.zoneLocalT);
    const targetLookAt = ahead.clone().lerp(zoneFocus, arriveBlend);

    if (reducedMotion) {
      camera.position.copy(targetPos);
      lookAt.current.copy(targetLookAt);
    } else {
      damp3(camera.position, targetPos, 4, dt);
      damp3(lookAt.current, targetLookAt, 5, dt);
    }
    camera.lookAt(lookAt.current);
  });

  return null;
}
