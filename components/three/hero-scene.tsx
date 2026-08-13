"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, RoundedBox, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useThemeColors, type ThemeColors } from "@/components/three/use-theme-colors";

/**
 * Abstract 3D "form study" — a small cluster of primitive solids in
 * distinct standard materials (metal, matte, lacquer, emissive), meant to
 * read as a demonstration of render/lighting craft rather than a literal
 * product shot. No hand-authored GLSL: every material here is a stock
 * three.js material (MeshStandardMaterial / MeshPhysicalMaterial) lit by
 * ordinary scene lights — no ShaderMaterial, no custom fragment/vertex code.
 *
 * `Cluster` is exported and reused verbatim as Zone 0 of the 3D
 * scroll-journey (components/three/journey/) — this file otherwise remains
 * a standalone, valid (if currently unmounted) hero.
 */

function Rig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (reducedMotion) return;
    target.current.x += (pointer.x * 0.45 - target.current.x) * 0.04;
    target.current.y += (pointer.y * 0.28 - target.current.y) * 0.04;
    camera.position.x += (target.current.x - camera.position.x) * 0.08;
    camera.position.y += (target.current.y * 0.4 + 0.25 - camera.position.y) * 0.08;
    camera.lookAt(0, 0.05, 0);
  });

  return null;
}

export function Cluster({
  colors,
  reducedMotion,
}: {
  colors: ThemeColors;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const icoRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const boxRef = useRef<THREE.Mesh>(null);
  const octaRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    const d = Math.min(delta, 0.05);
    if (groupRef.current) groupRef.current.rotation.y += d * 0.1;
    if (icoRef.current) {
      icoRef.current.rotation.x += d * 0.22;
      icoRef.current.rotation.y += d * 0.16;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x += d * 0.12;
      torusRef.current.rotation.z += d * 0.18;
    }
    if (boxRef.current) boxRef.current.rotation.y += d * 0.14;
    if (octaRef.current) {
      octaRef.current.rotation.x -= d * 0.1;
      octaRef.current.rotation.y += d * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={reducedMotion ? 0 : 1.3} floatIntensity={0.5} rotationIntensity={0.12}>
        <mesh ref={icoRef} position={[0, 0.55, 0]} castShadow>
          <icosahedronGeometry args={[0.72, 0]} />
          <meshStandardMaterial color={colors.primary} metalness={0.32} roughness={0.36} />
        </mesh>
      </Float>

      <Float speed={reducedMotion ? 0 : 1} floatIntensity={0.45} rotationIntensity={0.08}>
        <mesh ref={torusRef} position={[-1.15, -0.55, -0.3]} castShadow>
          <torusGeometry args={[0.56, 0.21, 32, 96]} />
          <meshStandardMaterial color={colors.secondary} metalness={0.05} roughness={0.7} />
        </mesh>
      </Float>

      <Float speed={reducedMotion ? 0 : 1.5} floatIntensity={0.6} rotationIntensity={0.1}>
        <RoundedBox
          ref={boxRef}
          args={[0.95, 0.95, 0.95]}
          radius={0.1}
          smoothness={4}
          position={[1.05, -0.7, 0.35]}
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
      </Float>

      <Float speed={reducedMotion ? 0 : 1.2} floatIntensity={0.7} rotationIntensity={0.18}>
        <mesh ref={octaRef} position={[0.55, 1.2, 0.55]} castShadow>
          <octahedronGeometry args={[0.36, 0]} />
          <meshStandardMaterial color={colors.foreground} metalness={0.3} roughness={0.42} />
        </mesh>
      </Float>

      <Float speed={reducedMotion ? 0 : 1.9} floatIntensity={0.35} rotationIntensity={0}>
        <mesh position={[1.2, 0.5, -0.1]}>
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshStandardMaterial
            color={colors.primary}
            emissive={colors.primary}
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
      </Float>
    </group>
  );
}

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  const colors = useThemeColors();

  return (
    <>
      <ambientLight intensity={0.95} />
      {/* Key: near-white so material hues render true, not tinted muddy. */}
      <directionalLight position={[3.5, 4, 3]} intensity={2.2} color="#fff7ec" />
      {/* Fill: cool and soft, lifts shadow side without fighting the key. */}
      <directionalLight position={[-3, 1.5, -1]} intensity={1.3} color="#eaf2ff" />
      {/* Bounce: low, warm, from below — keeps undersides of the metal forms
          from ever reading pure black without an environment map. */}
      <directionalLight position={[0, -3, 2]} intensity={0.5} color="#fff0dd" />
      {/* Rim: a touch of brand color on the edges only, not the base tone. */}
      <pointLight position={[-1.5, -1, 2.2]} intensity={6} color={colors.secondary} />
      <pointLight position={[1.8, 2, -1.5]} intensity={4} color={colors.accent} />

      <Cluster colors={colors} reducedMotion={reducedMotion} />
      <Rig reducedMotion={reducedMotion} />

      <ContactShadows
        position={[0, -1.25, 0]}
        opacity={0.32}
        scale={5.5}
        blur={2.4}
        far={2}
        color={colors.foreground}
      />
    </>
  );
}

export function HeroScene({ className }: { className?: string }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const dpr = useMemo<[number, number]>(() => [1, 2], []);

  return (
    <Canvas
      className={className}
      dpr={dpr}
      camera={{ position: [0, 0.15, 5.1], fov: 30 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <Scene reducedMotion={reducedMotion} />
    </Canvas>
  );
}
