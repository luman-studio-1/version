"use client";

import React, { useEffect, useRef } from "react";

// Pipeline constants, evolved from the Ink Garden effect spec for this
// hero: renderMode "dither", larger cell/contrast/density for a much
// stronger presence, plus a cursor-reactive "ink responds to touch" layer
// and a left-to-right materialize sweep on load.
const CELL_SIZE = 11;
const CONTRAST = 185; // 100 = neutral
const DENSITY = 34; // controls max dot radius relative to cell
const ANIM_SPEED = 100; // 100 = neutral base speed
const ANIM_INTENSITY = 55; // 0-100, pulse amplitude
const MOUSE_RADIUS_CSS = 230; // px, radius of cursor influence
const MOUSE_BOOST = 2.05; // max radius multiplier at cursor center
const MOUSE_LIGHTEN = 0.55; // max color-lighten mix at cursor center
const SWEEP_DURATION = 1.15; // seconds, load-in materialize sweep
const SWEEP_SPREAD = 0.55; // seconds, extra stagger across the width

const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

interface SourceCell {
  r: number;
  g: number;
  b: number;
  luminance: number; // 0-1
  jitter: number; // 0-1, per-cell phase offset for the breathing animation
}

function buildProceduralSource(width: number, height: number): CanvasRenderingContext2D {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  const styles = getComputedStyle(document.documentElement);
  const primary = styles.getPropertyValue("--primary").trim() || "#fe8f52";
  const secondary = styles.getPropertyValue("--secondary").trim() || "#059494";
  const accent = styles.getPropertyValue("--accent").trim() || "#f2df7d";
  const foreground = styles.getPropertyValue("--foreground").trim() || "#111827";

  ctx.fillStyle = foreground;
  ctx.fillRect(0, 0, width, height);

  // Biased toward the right two-thirds of the canvas: the left column is
  // where the headline/copy sits, so it's kept calmer while the right side
  // carries most of the color energy.
  const blobs: Array<{ x: number; y: number; r: number; color: string }> = [
    { x: 0.78, y: 0.3, r: 0.42, color: secondary },
    { x: 0.62, y: 0.68, r: 0.36, color: accent },
    { x: 0.94, y: 0.78, r: 0.26, color: primary },
    { x: 0.9, y: 0.15, r: 0.2, color: primary },
    { x: 0.08, y: 0.85, r: 0.2, color: secondary },
    { x: 0.06, y: -0.02, r: 0.14, color: accent },
  ];

  for (const blob of blobs) {
    const cx = blob.x * width;
    const cy = blob.y * height;
    const radius = blob.r * Math.max(width, height);
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, blob.color);
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  return ctx;
}

function applyContrast(value: number, contrast: number): number {
  const factor = contrast / 100;
  return Math.min(255, Math.max(0, (value - 128) * factor + 128));
}

function sampleSourceGrid(
  sourceCtx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
): SourceCell[][] {
  const { width, height } = sourceCtx.canvas;
  const data = sourceCtx.getImageData(0, 0, width, height).data;
  const grid: SourceCell[][] = [];

  for (let row = 0; row < rows; row++) {
    const line: SourceCell[] = [];
    for (let col = 0; col < cols; col++) {
      const sx = Math.min(width - 1, Math.floor(((col + 0.5) / cols) * width));
      const sy = Math.min(height - 1, Math.floor(((row + 0.5) / rows) * height));
      const idx = (sy * width + sx) * 4;

      const r = applyContrast(data[idx], CONTRAST);
      const g = applyContrast(data[idx + 1], CONTRAST);
      const b = applyContrast(data[idx + 2], CONTRAST);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      const bayer = BAYER4[row % 4][col % 4] / 16;
      const jitter = (bayer + Math.sin(col * 12.9898 + row * 78.233) * 0.15) % 1;

      line.push({ r, g, b, luminance, jitter: Math.abs(jitter) });
    }
    grid.push(line);
  }

  return grid;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function AsciiHero({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let grid: SourceCell[][] = [];
    let cols = 0;
    let rows = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = 0;
    let startTime = performance.now();

    // Cursor target (in local/dpr-scaled canvas px) and its smoothed value.
    const pointer = { x: -9999, y: -9999, active: false };
    const smoothedPointer = { x: -9999, y: -9999, amount: 0 };

    const rebuild = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      cols = Math.max(1, Math.ceil(rect.width / CELL_SIZE));
      rows = Math.max(1, Math.ceil(rect.height / CELL_SIZE));

      const sourceCtx = buildProceduralSource(cols * 4, rows * 4);
      grid = sampleSourceGrid(sourceCtx, cols, rows);
    };

    const onPointerMove = (e: PointerEvent) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) * dpr;
      pointer.y = (e.clientY - rect.top) * dpr;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    const draw = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const speed = ANIM_SPEED / 100;
      const amplitude = ANIM_INTENSITY / 100;

      // Smooth the pointer position and its "presence" toward the target.
      smoothedPointer.x += (pointer.x - smoothedPointer.x) * 0.16;
      smoothedPointer.y += (pointer.y - smoothedPointer.y) * 0.16;
      smoothedPointer.amount +=
        ((pointer.active ? 1 : 0) - smoothedPointer.amount) * 0.08;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const localCellPx = CELL_SIZE * dpr;
      const localMaxRadius =
        localCellPx * 0.5 * Math.min(1.3, Math.max(0.3, DENSITY / 40));
      const mouseRadius = MOUSE_RADIUS_CSS * dpr;
      const mousePresence = smoothedPointer.amount;

      for (let row = 0; row < rows; row++) {
        const line = grid[row];
        if (!line) continue;
        for (let col = 0; col < cols; col++) {
          const cell = line[col];
          if (!cell) continue;

          const cx = col * localCellPx + localCellPx / 2;
          const cy = row * localCellPx + localCellPx / 2;

          // Load-in materialize sweep: cascades left-to-right.
          const colRatio = cols > 1 ? col / (cols - 1) : 0;
          const sweep = reducedMotion
            ? 1
            : smoothstep(
                colRatio * SWEEP_SPREAD,
                colRatio * SWEEP_SPREAD + SWEEP_DURATION * 0.55,
                elapsed,
              );
          if (sweep <= 0) continue;

          const pulse = reducedMotion
            ? 0
            : Math.sin(elapsed * speed * 1.6 + cell.jitter * Math.PI * 2) * amplitude;

          let influence = 0;
          if (mousePresence > 0.01) {
            const dist = Math.hypot(cx - smoothedPointer.x, cy - smoothedPointer.y);
            influence = (1 - smoothstep(0, mouseRadius, dist)) * mousePresence;
          }

          const boost = 1 + influence * (MOUSE_BOOST - 1);
          const radius = Math.max(
            0,
            localMaxRadius * cell.luminance * (1 + pulse * 0.5) * boost * sweep,
          );
          if (radius < 0.4) continue;

          let r = cell.r;
          let g = cell.g;
          let b = cell.b;
          if (influence > 0.02) {
            const lighten = influence * MOUSE_LIGHTEN;
            r += (255 - r) * lighten;
            g += (255 - g) * lighten;
            b += (255 - b) * lighten;
          }

          ctx.beginPath();
          ctx.fillStyle = `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafId = reducedMotion ? 0 : requestAnimationFrame(draw);
    };

    // Static final frame only: no sweep, no pulse, no cursor reactivity.
    // (Sweep/duration constants are in seconds; convert to ms and push well
    // past the end so every column resolves to fully revealed.)
    const drawStaticFrame = () => {
      draw(performance.now() + (SWEEP_SPREAD + SWEEP_DURATION + 1) * 1000);
    };

    rebuild();
    startTime = performance.now();
    if (reducedMotion) {
      drawStaticFrame();
    } else {
      rafId = requestAnimationFrame(draw);
    }

    const resizeObserver = new ResizeObserver(() => {
      rebuild();
      // The rAF loop self-heals a resize-triggered clear for the animated
      // path, but reduced motion has no running loop to repaint it.
      if (reducedMotion) drawStaticFrame();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
      canvas.parentElement.addEventListener("pointermove", onPointerMove);
      canvas.parentElement.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (canvas.parentElement) {
        canvas.parentElement.removeEventListener("pointermove", onPointerMove);
        canvas.parentElement.removeEventListener("pointerleave", onPointerLeave);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
