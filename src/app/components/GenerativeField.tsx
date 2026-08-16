"use client";
import { useEffect, useRef } from "react";
import {
  hashSeed,
  mulberry32,
  seedParticles,
  stepField,
  type FieldColors,
  type Particle,
} from "@/lib/generative";

/**
 * The moving artwork inside the preview. Seeded by the visitor's own answers,
 * coloured by the direction they picked, and it reorganises as they progress.
 *
 * Rules it holds to, because this sits on a page that must never break:
 *   - no canvas support, or a thrown error, leaves a plain coloured block
 *   - reduced motion preference gets a still frame, not a frozen animation
 *   - off screen or background tab stops the loop entirely
 */
export default function GenerativeField({
  seed,
  colors,
  warp,
  height = 132,
  className = "",
}: {
  seed: string;
  colors: FieldColors;
  warp: number;
  height?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);
  const parts = useRef<Particle[]>([]);
  const visible = useRef(true);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      return;
    }
    if (!ctx) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = canvas.clientWidth || 400;
    let h = height;

    const size = () => {
      w = canvas.clientWidth || 400;
      h = height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.fillStyle = colors.bg;
      ctx!.fillRect(0, 0, w, h);
    };
    size();

    const rand = mulberry32(hashSeed(seed));
    parts.current = seedParticles(Math.round((w * h) / 2200), w, h, rand, colors);

    let t = 0;
    const draw = () => {
      if (!ctx) return;
      // A translucent wash instead of a clear, which is what leaves the trails.
      ctx.globalAlpha = 0.085;
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      stepField(ctx, parts.current, w, h, t, warp, rand, { alpha: 0.42, width: 1 });
      t += 0.0032;
    };

    if (reduced) {
      // One settled still. Same artwork, no motion.
      for (let i = 0; i < 150; i++) draw();
      return;
    }

    const loop = () => {
      if (visible.current) draw();
      raf.current = window.requestAnimationFrame(loop);
    };
    raf.current = window.requestAnimationFrame(loop);

    const onVis = () => {
      visible.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "function") {
      io = new IntersectionObserver(
        (entries) => {
          visible.current = entries[0].isIntersecting && document.visibilityState === "visible";
        },
        { threshold: 0 }
      );
      io.observe(canvas);
    }

    const onResize = () => {
      size();
      parts.current = seedParticles(
        Math.round((w * h) / 2200),
        w,
        h,
        mulberry32(hashSeed(seed)),
        colors
      );
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (raf.current) window.cancelAnimationFrame(raf.current);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      if (io) io.disconnect();
    };
    // Re-seeding on any of these is the point: the artwork answers the answers.
  }, [seed, colors.a, colors.b, colors.bg, colors.ink, warp, height, colors]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ display: "block", width: "100%", height, background: colors.bg }}
    />
  );
}
