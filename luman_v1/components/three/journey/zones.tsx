"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { ThemeColors } from "@/components/three/use-theme-colors";
import { JOURNEY_WAYPOINTS } from "@/components/three/journey/camera-path";

const ZONE1_CENTER = JOURNEY_WAYPOINTS[1].focus;
const ZONE1_COLOR_KEYS = ["primary", "secondary", "accent", "foreground"] as const;

/** Zone 1 — "the philosophy" / discovery questions: a ring of 6 small
 * matte blocks (one per question), echoing the grid in the DOM overlay. */
export function Zone1({
  colors,
  reducedMotion,
}: {
  colors: ThemeColors;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 6;
  const radius = 1.3;

  useFrame((_, delta) => {
    if (reducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y += Math.min(delta, 0.05) * 0.07;
  });

  return (
    <group ref={groupRef} position={ZONE1_CENTER}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const colorKey = ZONE1_COLOR_KEYS[i % ZONE1_COLOR_KEYS.length];
        return (
          <RoundedBox
            key={i}
            args={[0.42, 0.42, 0.42]}
            radius={0.06}
            smoothness={3}
            position={[x, 0, z]}
            castShadow
          >
            <meshStandardMaterial color={colors[colorKey]} metalness={0.08} roughness={0.65} />
          </RoundedBox>
        );
      })}
    </group>
  );
}

const ZONE2_CENTER = JOURNEY_WAYPOINTS[2].focus;

/** Zone 2 — "what we do" / four disciplines: four larger, materially
 * distinct primitives (metal, matte, lacquer, dark metal) in a lateral row —
 * the same material vocabulary as the reused hero Cluster, one piece per
 * discipline, spread out for a lateral camera pass instead of a cluster. */
export function Zone2({
  colors,
  reducedMotion,
}: {
  colors: ThemeColors;
  reducedMotion: boolean;
}) {
  const meshRefs = useRef<Array<THREE.Object3D | null>>([]);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    const d = Math.min(delta, 0.05);
    meshRefs.current.forEach((obj, i) => {
      if (!obj) return;
      obj.rotation.y += d * (0.14 + i * 0.03);
      obj.rotation.x += d * 0.06;
    });
  });

  return (
    <group position={ZONE2_CENTER}>
      <mesh
        ref={(el) => {
          meshRefs.current[0] = el;
        }}
        position={[-1.4, 0.25, 0]}
        castShadow
      >
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color={colors.primary} metalness={0.4} roughness={0.32} />
      </mesh>

      <mesh
        ref={(el) => {
          meshRefs.current[1] = el;
        }}
        position={[-0.45, -0.15, 0.35]}
        castShadow
      >
        <torusGeometry args={[0.42, 0.16, 24, 72]} />
        <meshStandardMaterial color={colors.secondary} metalness={0.05} roughness={0.7} />
      </mesh>

      <RoundedBox
        ref={(el) => {
          meshRefs.current[2] = el;
        }}
        args={[0.75, 0.75, 0.75]}
        radius={0.08}
        smoothness={4}
        position={[0.5, 0.1, -0.2]}
        castShadow
      >
        <meshPhysicalMaterial
          color={colors.accent}
          metalness={0.05}
          roughness={0.32}
          clearcoat={1}
          clearcoatRoughness={0.12}
        />
      </RoundedBox>

      <mesh
        ref={(el) => {
          meshRefs.current[3] = el;
        }}
        position={[1.4, 0.35, 0.1]}
        castShadow
      >
        <octahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color={colors.foreground} metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
}

const ZONE3_CENTER = JOURNEY_WAYPOINTS[3].focus;
const ZONE3_NODE_X = [-1.15, -0.4, 0.4, 1.15];
const ZONE3_COLOR_KEYS = ["primary", "secondary", "accent", "foreground"] as const;

/** Zone 3 — "how we work" / four-step process: four small nodes joined by
 * thin connectors, suggesting a pipeline the camera travels alongside. */
export function Zone3({
  colors,
  reducedMotion,
}: {
  colors: ThemeColors;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (reducedMotion || !groupRef.current) return;
    groupRef.current.rotation.x = Math.sin(performance.now() * 0.0002) * 0.05;
  });

  return (
    <group ref={groupRef} position={ZONE3_CENTER}>
      {ZONE3_NODE_X.map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} castShadow>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial
            color={colors[ZONE3_COLOR_KEYS[i]]}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      ))}
      {ZONE3_NODE_X.slice(0, -1).map((x, i) => {
        const nextX = ZONE3_NODE_X[i + 1];
        const midX = (x + nextX) / 2;
        const length = nextX - x;
        return (
          <mesh key={`link-${i}`} position={[midX, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, length, 12]} />
            <meshStandardMaterial color={colors.foreground} metalness={0.2} roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

const ZONE4_CENTER = JOURNEY_WAYPOINTS[4].focus;

/** Zone 4 — "start here" / CTA: the earlier vocabulary converges into one
 * resolved form (a single larger gem) with small orbiting accents, in
 * contrast to the scattered/spread compositions of the earlier zones. */
export function Zone4({
  colors,
  reducedMotion,
}: {
  colors: ThemeColors;
  reducedMotion: boolean;
}) {
  const coreRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    const d = Math.min(delta, 0.05);
    if (coreRef.current) coreRef.current.rotation.y += d * 0.12;
    if (orbitRef.current) orbitRef.current.rotation.y -= d * 0.2;
  });

  return (
    <group position={ZONE4_CENTER}>
      <mesh ref={coreRef} castShadow>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial color={colors.primary} metalness={0.4} roughness={0.24} />
      </mesh>

      <group ref={orbitRef}>
        <mesh position={[1.5, 0.3, 0]}>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial
            color={colors.accent}
            emissive={colors.accent}
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[-1.3, -0.4, 0.6]}>
          <sphereGeometry args={[0.11, 24, 24]} />
          <meshStandardMaterial
            color={colors.secondary}
            emissive={colors.secondary}
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}
