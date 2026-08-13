"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight, Move3D } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ImageItem {
  alt: string;
  label: string;
  kind: "dashboard" | "booking" | "commerce" | "assistant";
}

/* ------------------------------------------------------------------ */
/*  Synthetic screen content                                          */
/* ------------------------------------------------------------------ */

function PhoneScreen({
  item,
  isActive,
}: {
  item: ImageItem;
  isActive: boolean;
}) {
  const barsRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!isActive) return;

      if (item.kind === "dashboard" && barsRef.current) {
        const bars = barsRef.current.querySelectorAll("[data-bar]");
        gsap.fromTo(
          bars,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.06,
            transformOrigin: "bottom",
          },
        );
      }

      if (item.kind === "assistant" && dotsRef.current) {
        const dots = dotsRef.current.querySelectorAll("[data-typing-dot]");
        gsap.to(dots, {
          y: -3,
          duration: 0.45,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.15,
        });
      }
    },
    { dependencies: [isActive, item.kind] },
  );

  return (
    <div className="flex h-full w-full flex-col bg-card text-card-foreground">
      <div className="flex items-center justify-between px-4 pt-8 pb-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
            Luman
          </span>
          <span className="text-sm font-bold">{item.label}</span>
        </div>
        <div
          className="size-6 rounded-full"
          style={{ backgroundColor: "var(--primary)" }}
          aria-hidden
        />
      </div>

      {item.kind === "dashboard" && (
        <div className="flex flex-1 flex-col gap-2 px-4 pb-4" ref={barsRef}>
          <div className="grid grid-cols-2 gap-2">
            {["Revenue", "Orders", "Uptime", "Tickets"].map((label, i) => (
              <div
                key={label}
                className="rounded-xl border border-border p-2"
                style={{
                  backgroundColor:
                    i === 0 ? "var(--primary)" : "var(--muted)",
                  color:
                    i === 0 ? "var(--primary-foreground)" : "var(--foreground)",
                }}
              >
                <p className="text-[9px] uppercase opacity-70">{label}</p>
                <p className="text-sm font-bold">
                  {["$48.2k", "312", "99.9%", "4"][i]}
                </p>
              </div>
            ))}
          </div>
          <div className="flex-1 rounded-xl border border-border bg-muted p-2">
            <div className="flex h-full items-end gap-1">
              {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                <div
                  key={i}
                  data-bar
                  className="flex-1 rounded-sm"
                  style={{ height: `${h}%`, backgroundColor: "var(--secondary)" }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {item.kind === "booking" && (
        <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
          <div
            className="rounded-xl p-3"
            style={{ backgroundColor: "var(--secondary)", color: "var(--secondary-foreground)" }}
          >
            <p className="text-[9px] uppercase opacity-80">Next appointment</p>
            <p className="text-sm font-bold">Tue, 10:30 AM</p>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-square rounded-md border border-border text-[8px] flex items-center justify-center",
                  i === 5 ? "text-white" : "bg-muted text-muted-foreground",
                )}
                style={i === 5 ? { backgroundColor: "var(--primary)" } : undefined}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="flex-1 space-y-1.5">
            {["9:00 — Consult", "11:00 — Fitting", "2:30 — Follow-up"].map((s) => (
              <div
                key={s}
                className="rounded-lg border border-border bg-muted px-2 py-1.5 text-[10px]"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {item.kind === "commerce" && (
        <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-xl border border-border"
                style={{
                  backgroundColor:
                    i % 2 === 0 ? "var(--accent)" : "var(--muted)",
                }}
              />
            ))}
          </div>
          <div
            className="mt-auto flex items-center justify-between rounded-xl px-3 py-2.5"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            <span className="text-xs font-semibold">Checkout</span>
            <span className="text-xs font-bold">$128.00</span>
          </div>
        </div>
      )}

      {item.kind === "assistant" && (
        <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
          <div className="flex-1 space-y-2">
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-muted px-3 py-2 text-[11px]">
              What&apos;s our fastest-moving SKU this week?
            </div>
            <div
              className="max-w-[80%] rounded-2xl rounded-tl-sm px-3 py-2 text-[11px]"
              style={{ backgroundColor: "var(--secondary)", color: "var(--secondary-foreground)" }}
            >
              Restock alert: SKU 4471 is trending 3.2x above baseline.
            </div>
            <div
              ref={dotsRef}
              className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-sm px-3 py-2.5"
              style={{ backgroundColor: "var(--secondary)", opacity: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  data-typing-dot
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: "var(--secondary-foreground)" }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-full border border-border bg-muted px-3 py-2 text-[10px] text-muted-foreground">
            Ask anything…
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Phone frame                                                       */
/* ------------------------------------------------------------------ */

function PhoneFrame({
  item,
  position,
  dragProgress,
  isDragging,
  onPointerTilt,
  tiltRef,
}: {
  item: ImageItem;
  position: number;
  dragProgress: number;
  isDragging: boolean;
  onPointerTilt: (e: React.PointerEvent<HTMLDivElement> | null) => void;
  tiltRef?: React.Ref<HTMLDivElement>;
}) {
  const effective = position + dragProgress;
  const abs = Math.abs(effective);
  const translateX = effective * 62;
  const scale = Math.max(0.68, 1 - abs * 0.16);
  const rotateY = effective * -20;
  const translateZ = -abs * 160;
  const opacity = abs > 2.4 ? 0 : Math.max(0, 1 - abs * 0.4);
  const blur = Math.min(abs * 3, 6);
  const zIndex = 100 - Math.round(abs * 10);
  const isActive = position === 0;

  return (
    <div
      className={cn(
        "absolute top-1/2 left-1/2",
        !isDragging && "transition-[transform,opacity,filter] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]",
      )}
      style={{
        transform: `translate(-50%, -50%) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        filter: `blur(${blur}px)`,
        zIndex,
        pointerEvents: isActive && !isDragging ? "auto" : "none",
        transformStyle: "preserve-3d",
      }}
      aria-hidden={!isActive}
    >
      <div
        ref={tiltRef}
        className="phone-frame-tilt relative h-[26rem] w-[13rem] rounded-[2.25rem] border-[6px] p-1.5 shadow-2xl transition-transform duration-300 ease-out sm:h-[30rem] sm:w-[15rem]"
        style={{
          borderColor: "var(--foreground)",
          backgroundColor: "var(--foreground)",
          boxShadow: isActive
            ? "0 40px 80px -20px rgba(0,0,0,0.35), 0 15px 35px -15px rgba(0,0,0,0.3)"
            : "0 20px 40px -15px rgba(0,0,0,0.25)",
        }}
        onPointerMove={isActive ? onPointerTilt : undefined}
        onPointerLeave={isActive ? () => onPointerTilt(null) : undefined}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]">
          <PhoneScreen item={item} isActive={isActive} />
          <div
            className="absolute top-0 left-1/2 h-4 w-20 -translate-x-1/2 rounded-b-xl"
            style={{ backgroundColor: "var(--foreground)" }}
          />
        </div>
        {/* glass sheen */}
        <div
          className="pointer-events-none absolute inset-1.5 rounded-[1.6rem]"
          style={{
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 26%)",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Carousel                                                          */
/* ------------------------------------------------------------------ */

const SWIPE_DISTANCE_THRESHOLD = 56;
const SWIPE_VELOCITY_THRESHOLD = 0.45;

export function PhoneCarousel({ images }: { images: ImageItem[] }) {
  const [active, setActive] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const count = images.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    active: false,
    startX: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
  });
  const activeFrameRef = useRef<HTMLDivElement | null>(null);

  const goTo = useCallback(
    (index: number) => setActive(((index % count) + count) % count),
    [count],
  );

  const positions = useMemo(() => {
    return images.map((_, i) => {
      let diff = i - active;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;
      return diff;
    });
  }, [images, active, count]);

  /* ---------------- drag / swipe with velocity ---------------- */

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragState.current = {
      active: true,
      startX: e.clientX,
      lastX: e.clientX,
      lastT: performance.now(),
      velocity: 0,
    };
    setIsDragging(true);
    setHasInteracted(true);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const st = dragState.current;
      if (!st.active || !stageRef.current) return;
      const width = stageRef.current.offsetWidth || 1;
      const now = performance.now();
      const dt = Math.max(now - st.lastT, 1);
      const instV = (e.clientX - st.lastX) / dt;
      st.velocity = st.velocity * 0.7 + instV * 0.3;
      st.lastX = e.clientX;
      st.lastT = now;

      const deltaX = e.clientX - st.startX;
      // map pixel delta to "slot" fraction — dragging one full slot width moves one card
      const slotWidth = width * 0.42;
      setDragOffset(-deltaX / slotWidth);
    },
    [],
  );

  const endDrag = useCallback(() => {
    const st = dragState.current;
    if (!st.active) return;
    const deltaX = st.lastX - st.startX;
    const velocity = st.velocity;
    st.active = false;
    setIsDragging(false);

    const flick = Math.abs(velocity) > SWIPE_VELOCITY_THRESHOLD;
    const dragged = Math.abs(deltaX) > SWIPE_DISTANCE_THRESHOLD;

    if (flick || dragged) {
      const direction = deltaX < 0 || (flick && velocity < 0) ? 1 : -1;
      goTo(active + direction);
    }
    setDragOffset(0);
  }, [active, goTo]);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
      endDrag();
    },
    [endDrag],
  );

  /* ---------------- keyboard support ---------------- */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") goTo(active - 1);
      if (e.key === "ArrowRight") goTo(active + 1);
    },
    [active, goTo],
  );

  /* ---------------- cursor-parallax tilt on active phone ---------------- */

  const rafId = useRef<number | null>(null);

  const handlePointerTilt = useCallback(
    (e: React.PointerEvent<HTMLDivElement> | null) => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const el = activeFrameRef.current;
        if (!el) return;
        if (!e) {
          el.style.transform = "rotateX(0deg) rotateY(0deg)";
          return;
        }
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const maxTilt = 9;
        el.style.transform = `rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg)`;
      });
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div
        ref={stageRef}
        role="group"
        aria-label="Product screen carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative h-[30rem] w-full max-w-xl touch-pan-y cursor-grab select-none outline-none active:cursor-grabbing sm:h-[34rem]"
        style={{ perspective: "1600px" }}
      >
        {/* ambient stage glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-[3rem]"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 45%, color-mix(in oklch, var(--primary), transparent 88%) 0%, transparent 70%)",
          }}
        />

        {images.map((item, i) => {
          const isActive = positions[i] === 0;
          return (
            <PhoneFrame
              key={item.label}
              item={item}
              position={positions[i]}
              dragProgress={dragOffset}
              isDragging={isDragging}
              onPointerTilt={handlePointerTilt}
              tiltRef={isActive ? activeFrameRef : undefined}
            />
          );
        })}

        {/* first-visit drag affordance */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5 text-[11px] font-medium text-muted-foreground backdrop-blur-sm transition-opacity duration-500",
            hasInteracted ? "opacity-0" : "opacity-100",
          )}
        >
          <Move3D className="size-3.5" />
          Drag to explore
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous"
          onClick={() => {
            setHasInteracted(true);
            goTo(active - 1);
          }}
        >
          <ChevronLeft />
        </Button>

        <div className="flex items-center gap-2">
          {images.map((item, i) => (
            <button
              key={item.label}
              type="button"
              aria-label={`Go to ${item.label}`}
              onClick={() => {
                setHasInteracted(true);
                goTo(i);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === active ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          aria-label="Next"
          onClick={() => {
            setHasInteracted(true);
            goTo(active + 1);
          }}
        >
          <ChevronRight />
        </Button>
      </div>

      <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span className="font-mono text-xs tabular-nums text-foreground/70">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <span aria-hidden className="text-border">
          —
        </span>
        {images[active].alt}
      </p>
    </div>
  );
}
