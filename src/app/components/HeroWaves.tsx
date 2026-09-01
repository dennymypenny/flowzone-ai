"use client";

import { useEffect, useRef } from "react";

/**
 * HeroWaves — a live, video-like background of soft flowing waves for the
 * light hero. Drawn on canvas so it always matches the palette exactly and
 * costs zero download. Brand blues ghosting through the warm paper, slow
 * and calm; honors prefers-reduced-motion by holding a still frame.
 */
export default function HeroWaves() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Layered sine bands. Each layer is a filled ribbon between two drifting
    // sine edges, in a translucent brand blue over the warm paper.
    const layers = [
      { base: 0.30, amp: 34, len: 0.0042, speed: 0.00030, thick: 130, color: "76,123,232", alpha: 0.14 },
      { base: 0.44, amp: 46, len: 0.0031, speed: -0.00021, thick: 170, color: "91,155,249", alpha: 0.13 },
      { base: 0.60, amp: 40, len: 0.0052, speed: 0.00026, thick: 120, color: "76,123,232", alpha: 0.11 },
      { base: 0.76, amp: 52, len: 0.0026, speed: -0.00018, thick: 190, color: "138,177,255", alpha: 0.13 },
    ];

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const L of layers) {
        const yBase = L.base * h;
        ctx.beginPath();
        ctx.moveTo(-4, yBase);
        for (let x = -4; x <= w + 4; x += 6) {
          const y =
            yBase +
            Math.sin(x * L.len + t * L.speed) * L.amp +
            Math.sin(x * L.len * 0.53 - t * L.speed * 1.7 + 2.1) * L.amp * 0.5;
          ctx.lineTo(x, y);
        }
        for (let x = w + 4; x >= -4; x -= 6) {
          const y =
            yBase +
            L.thick +
            Math.sin(x * L.len * 0.8 + t * L.speed * 1.3 + 4.4) * L.amp * 0.8;
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, yBase - L.amp, 0, yBase + L.thick + L.amp);
        grad.addColorStop(0, `rgba(${L.color},0)`);
        grad.addColorStop(0.5, `rgba(${L.color},${L.alpha})`);
        grad.addColorStop(1, `rgba(${L.color},0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      draw(12000);
    } else {
      const loop = (now: number) => {
        draw(now);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{ filter: "blur(10px)" }}
      aria-hidden
    />
  );
}
