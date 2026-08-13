"use client";

import { useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { useThemeColors } from "@/components/three/use-theme-colors";
import { Cluster } from "@/components/three/hero-scene";
import { CameraRig } from "@/components/three/journey/camera-rig";
import { JOURNEY_WAYPOINTS } from "@/components/three/journey/camera-path";
import { Zone1, Zone2, Zone3, Zone4 } from "@/components/three/journey/zones";
import { ZoneVisibility } from "@/components/three/journey/zone-visibility";

/**
 * Shared light rig for the whole journey — deliberately declared once here,
 * not per-zone, so lighting cost doesn't scale with zone count. Same recipe
 * as the standalone hero (hero-scene.tsx): near-white key/fill so material
 * hues render true without an environment map, a low warm bounce light so
 * metal undersides never read pure black, and brand-colored rim lights kept
 * to the edges rather than tinting the base tone.
 */
function JourneyLights({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  return (
    <>
      <ambientLight intensity={0.95} />
      <directionalLight position={[3.5, 4, 3]} intensity={2.2} color="#fff7ec" />
      <directionalLight position={[-3, 1.5, -1]} intensity={1.3} color="#eaf2ff" />
      <directionalLight position={[0, -3, 2]} intensity={0.5} color="#fff0dd" />
      <pointLight position={[-1.5, -1, 2.2]} intensity={6} color={colors.secondary} />
      <pointLight position={[1.8, 2, -1.5]} intensity={4} color={colors.accent} />
    </>
  );
}

function JourneySceneContent({ reducedMotion }: { reducedMotion: boolean }) {
  const colors = useThemeColors();

  return (
    <>
      <JourneyLights colors={colors} />

      {/* Each zone hides itself once the camera is far enough away — the
          FOV cone can otherwise catch a neighboring zone's geometry, since
          nothing else occludes/fogs distant content. */}
      <ZoneVisibility zoneIndex={0}>
        <Cluster colors={colors} reducedMotion={reducedMotion} />
      </ZoneVisibility>
      <ZoneVisibility zoneIndex={1}>
        <Zone1 colors={colors} reducedMotion={reducedMotion} />
      </ZoneVisibility>
      <ZoneVisibility zoneIndex={2}>
        <Zone2 colors={colors} reducedMotion={reducedMotion} />
      </ZoneVisibility>
      <ZoneVisibility zoneIndex={3}>
        <Zone3 colors={colors} reducedMotion={reducedMotion} />
      </ZoneVisibility>
      <ZoneVisibility zoneIndex={4}>
        <Zone4 colors={colors} reducedMotion={reducedMotion} />
      </ZoneVisibility>

      <CameraRig reducedMotion={reducedMotion} />
    </>
  );
}

export function JourneyScene({
  className,
  reducedMotion,
}: {
  className?: string;
  reducedMotion: boolean;
}) {
  // Ceiling only — AdaptiveDpr steps actual rendered DPR down from here if
  // PerformanceMonitor detects the frame budget is being missed, and back
  // up if there's headroom. This is a larger, more geometry-heavy scene
  // than the standalone hero, so it gets this safety net; the hero doesn't
  // need it at its smaller, fixed cost.
  const [dpr, setDpr] = useState<[number, number]>([1, 1.75]);

  return (
    <Canvas
      className={className}
      dpr={dpr}
      camera={{ position: JOURNEY_WAYPOINTS[0].position, fov: 30 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      frameloop="always"
    >
      <PerformanceMonitor
        onDecline={() => setDpr([1, 1])}
        onIncline={() => setDpr([1, 1.75])}
      />
      <AdaptiveDpr pixelated />
      <JourneySceneContent reducedMotion={reducedMotion} />
    </Canvas>
  );
}
