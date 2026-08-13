import * as THREE from "three";

/**
 * Hand-placed waypoints for the camera fly-through, one per zone. `position`
 * is where the camera sits; `focus` is that zone's content centerpiece.
 * Zone 0's position matches the original static hero's camera exactly
 * ([0, 0.15, 5.1] in hero-scene.tsx) so the journey's opening frame is a
 * seamless continuation of the reused Cluster, not a jump cut.
 */
export interface JourneyWaypoint {
  position: [number, number, number];
  focus: [number, number, number];
}

export const JOURNEY_WAYPOINTS: JourneyWaypoint[] = [
  { position: [0, 0.15, 5.1], focus: [0, 0.3, 0] }, // 0 — Who we are (reused Cluster)
  { position: [3.4, 0.5, 3.2], focus: [3.6, 0.2, -0.6] }, // 1 — Philosophy + discovery questions
  { position: [7, 0.8, 4], focus: [7.4, 0.3, -0.4] }, // 2 — Four disciplines
  { position: [10.6, 0.6, 3.6], focus: [11, 0.2, -0.4] }, // 3 — How we work
  { position: [14.2, 0.4, 5], focus: [14.6, 0.3, 0] }, // 4 — Start here / CTA
];

export function buildJourneyCurves() {
  const positionPoints = JOURNEY_WAYPOINTS.map((w) => new THREE.Vector3(...w.position));
  const focusPoints = JOURNEY_WAYPOINTS.map((w) => new THREE.Vector3(...w.focus));
  return {
    positionCurve: new THREE.CatmullRomCurve3(positionPoints, false, "catmullrom", 0.5),
    focusCurve: new THREE.CatmullRomCurve3(focusPoints, false, "catmullrom", 0.5),
  };
}
