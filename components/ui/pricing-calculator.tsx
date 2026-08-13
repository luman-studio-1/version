"use client";

import React, { useRef, useState } from "react";
import { Check } from "lucide-react";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrambleTextPlugin, useGSAP);

interface Discipline {
  id: string;
  label: string;
  base: number;
}

// Indicative INR bands per discipline — deliberately rounded to lakhs, not a
// straight currency conversion. These seed a formula, never a line-item price.
const DISCIPLINES: Discipline[] = [
  { id: "digital", label: "Digital Experiences", base: 650000 },
  { id: "systems", label: "Business Systems", base: 1250000 },
  { id: "creative", label: "Creative Production", base: 500000 },
  { id: "strategy", label: "Strategy & Consultation", base: 350000 },
];

const SCOPES = [
  { id: "focused", label: "Focused", detail: "One clear deliverable", multiplier: 1 },
  { id: "multi", label: "Multi-phase", detail: "Several workstreams", multiplier: 1.6 },
  { id: "program", label: "Full program", detail: "Ongoing partnership", multiplier: 2.4 },
] as const;

const MIN_WEEKS = 4;
const MAX_WEEKS = 24;

function formatInr(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Renders a value as text, decoding it into place with a scramble/reveal
 * tween whenever it changes — a HUD-style readout rather than a plain
 * counter. Falls back to a plain text swap on mount so there's no
 * flash-of-scramble on first paint.
 */
function useScrambleReadout(text: string) {
  const ref = useRef<HTMLParagraphElement>(null);
  const mounted = useRef(false);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    if (!mounted.current) {
      mounted.current = true;
      el.textContent = text;
      return;
    }

    gsap.to(el, {
      duration: 0.65,
      ease: "power2.out",
      scrambleText: {
        text,
        chars: "0123456789",
        speed: 0.45,
        revealDelay: 0.05,
      },
    });
  }, [text]);

  return ref;
}

function CornerBrackets({ style }: { style?: React.CSSProperties }) {
  const base = "pointer-events-none absolute size-3 opacity-60";
  return (
    <>
      <span className={cn(base, "top-2 left-2 border-t border-l")} style={style} aria-hidden />
      <span className={cn(base, "top-2 right-2 border-t border-r")} style={style} aria-hidden />
      <span className={cn(base, "bottom-2 left-2 border-b border-l")} style={style} aria-hidden />
      <span className={cn(base, "bottom-2 right-2 border-b border-r")} style={style} aria-hidden />
    </>
  );
}

export function PricingCalculator() {
  const [selected, setSelected] = useState<string[]>(["digital"]);
  const [scope, setScope] = useState<(typeof SCOPES)[number]["id"]>("focused");
  const [weeks, setWeeks] = useState(10);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const activeScope = SCOPES.find((s) => s.id === scope)!;
  const base = DISCIPLINES.filter((d) => selected.includes(d.id)).reduce(
    (sum, d) => sum + d.base,
    0,
  );
  const timelineFactor = Math.min(1.3, Math.max(0.85, 1 + (12 - weeks) * 0.02));
  const rawLow = base * activeScope.multiplier * timelineFactor * 0.85;
  const rawHigh = base * activeScope.multiplier * timelineFactor * 1.35;

  const low = Math.round(rawLow / 5000) * 5000;
  const high = Math.round(rawHigh / 5000) * 5000;
  const hasSelection = selected.length > 0;

  const rangeText = hasSelection ? `${formatInr(low)} – ${formatInr(high)}` : "—";
  const rangeRef = useScrambleReadout(rangeText);

  const sliderPct = ((weeks - MIN_WEEKS) / (MAX_WEEKS - MIN_WEEKS)) * 100;

  return (
    <div
      className="relative overflow-hidden rounded-3xl border p-8 sm:p-12"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--foreground)",
        color: "var(--background)",
      }}
    >
      {/* Ambient HUD backdrop: drifting grid + soft light bloom */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          animation: "pcalc-grid-pan 24s linear infinite",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-1/2 -right-1/4 h-[140%] w-[70%] opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(closest-side, var(--primary), transparent 72%)",
          animation: "pcalc-blob-drift 18s ease-in-out infinite",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-1/2 -left-1/4 h-[130%] w-[60%] opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(closest-side, var(--secondary), transparent 72%)",
          animation: "pcalc-blob-drift 22s ease-in-out infinite reverse",
        }}
        aria-hidden
      />

      <style>{`
        @keyframes pcalc-grid-pan {
          from { background-position: 0px 0px, 0px 0px; }
          to { background-position: 36px 36px, 36px 36px; }
        }
        @keyframes pcalc-blob-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-6%, 8%) scale(1.12); }
        }
        .pcalc-thumb {
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 25%, transparent), 0 0 18px color-mix(in srgb, var(--primary) 70%, transparent);
        }
      `}</style>

      <div className="relative mb-8 flex items-center justify-between gap-4 border-b border-current/15 pb-4">
        <p className="font-mono text-xs tracking-[0.25em] uppercase opacity-70">
          Estimate engine
        </p>
        <div className="flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] uppercase opacity-60">
          <span className="relative flex size-1.5">
            <span
              className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
              style={{ backgroundColor: "var(--primary)" }}
            />
            <span
              className="relative inline-flex size-1.5 rounded-full"
              style={{ backgroundColor: "var(--primary)" }}
            />
          </span>
          Live recalculation
        </div>
      </div>

      <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-8">
          <div>
            <p className="mb-3 font-mono text-xs tracking-[0.2em] uppercase opacity-60">
              {"// 01 — Disciplines involved"}
            </p>
            <div className="flex flex-col gap-2">
              {DISCIPLINES.map((d, i) => {
                const active = selected.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggle(d.id)}
                    aria-pressed={active}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left font-mono text-sm transition-all duration-200",
                      active
                        ? "border-transparent"
                        : "border-current/20 opacity-70 hover:border-current/40 hover:opacity-100",
                    )}
                    style={
                      active
                        ? {
                            backgroundColor: "var(--primary)",
                            color: "var(--primary-foreground)",
                            boxShadow:
                              "0 0 0 1px var(--primary), 0 6px 24px -6px color-mix(in srgb, var(--primary) 60%, transparent)",
                          }
                        : { backgroundColor: "color-mix(in srgb, var(--background) 6%, transparent)" }
                    }
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border text-[0.6rem]",
                        active ? "border-current/40" : "border-current/25 opacity-70",
                      )}
                    >
                      {active ? <Check className="size-3" /> : `0${i + 1}`}
                    </span>
                    <span>{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 font-mono text-xs tracking-[0.2em] uppercase opacity-60">
              {"// 02 — Engagement scope"}
            </p>
            <div className="flex flex-col gap-2">
              {SCOPES.map((s) => {
                const active = scope === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setScope(s.id)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-all duration-200",
                      active
                        ? "border-transparent"
                        : "border-current/20 opacity-70 hover:border-current/40 hover:opacity-100",
                    )}
                    style={
                      active
                        ? {
                            backgroundColor: "var(--secondary)",
                            color: "var(--secondary-foreground)",
                            boxShadow:
                              "0 0 0 1px var(--secondary), 0 6px 24px -6px color-mix(in srgb, var(--secondary) 60%, transparent)",
                          }
                        : { backgroundColor: "color-mix(in srgb, var(--background) 6%, transparent)" }
                    }
                  >
                    <span>
                      <span className="flex items-center gap-1.5 font-mono text-sm font-semibold">
                        <span className="opacity-60">{active ? "▸" : "·"}</span>
                        {s.label}
                      </span>
                      <span className="block text-xs opacity-70">{s.detail}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs opacity-60">
                      x{s.multiplier}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-4 flex items-center justify-between font-mono text-xs tracking-[0.2em] uppercase opacity-60">
              <span>{"// 03 — Target timeline"}</span>
              <span
                className="rounded-md px-2 py-0.5"
                style={{ backgroundColor: "color-mix(in srgb, var(--background) 10%, transparent)" }}
              >
                {weeks} weeks
              </span>
            </p>
            <div className="relative flex h-8 items-center">
              <div
                className="pointer-events-none absolute inset-x-0 h-1.5 rounded-full"
                style={{ backgroundColor: "color-mix(in srgb, var(--background) 14%, transparent)" }}
              />
              <div
                className="pointer-events-none absolute left-0 h-1.5 rounded-full transition-[width] duration-150"
                style={{ width: `${sliderPct}%`, backgroundColor: "var(--primary)" }}
              />
              <div
                className="pcalc-thumb pointer-events-none absolute size-4 -translate-x-1/2 rounded-full transition-[left] duration-150"
                style={{ left: `${sliderPct}%`, backgroundColor: "var(--background)" }}
              />
              <input
                type="range"
                min={MIN_WEEKS}
                max={MAX_WEEKS}
                step={1}
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Target timeline in weeks"
              />
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[0.65rem] opacity-50">
              <span>{MIN_WEEKS} wks</span>
              <span>{MAX_WEEKS} wks</span>
            </div>
          </div>
        </div>

        <div
          className="relative flex flex-col justify-between gap-6 rounded-2xl border border-current/15 p-6 sm:p-8"
          style={{ backgroundColor: "color-mix(in srgb, var(--background) 4%, transparent)" }}
        >
          <CornerBrackets style={{ borderColor: "var(--primary)" }} />

          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase opacity-60">
              Estimated range
            </p>
            {hasSelection ? (
              <p
                ref={rangeRef}
                className="mt-2 font-mono text-3xl font-bold tracking-tight sm:text-4xl"
              >
                {rangeText}
              </p>
            ) : (
              <p className="mt-2 font-mono text-lg opacity-60">
                Awaiting input — select at least one discipline
              </p>
            )}
            <p className="mt-3 text-sm leading-relaxed opacity-60">
              Indicative only. Every engagement is scoped individually after we
              understand your goals, constraints, and budget — this range exists to
              start that conversation, not replace it.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-current/15 pt-4 font-mono text-[0.65rem] tracking-wide uppercase opacity-70">
            <div>
              <p className="opacity-60">Disciplines</p>
              <p className="mt-1 text-sm font-semibold opacity-100">{selected.length || "—"}</p>
            </div>
            <div>
              <p className="opacity-60">Scope</p>
              <p className="mt-1 text-sm font-semibold opacity-100">x{activeScope.multiplier}</p>
            </div>
            <div>
              <p className="opacity-60">Timeline</p>
              <p className="mt-1 text-sm font-semibold opacity-100">x{timelineFactor.toFixed(2)}</p>
            </div>
          </div>

          <Button size="lg" className="w-full" disabled={!hasSelection}>
            Discuss this range
          </Button>
        </div>
      </div>
    </div>
  );
}
