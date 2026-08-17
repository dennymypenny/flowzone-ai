"use client";
import { useEffect, useRef } from "react";

/**
 * The generative hero.
 *
 * A few hundred particles ride a flowing vector field, left to right, the
 * direction everything on this site moves. The field is generated, never the
 * same twice, and the pointer bends it: ideas flow around the person. Trails
 * come from painting a translucent canvas over itself, so the motion draws
 * ribbons rather than dots.
 *
 * Canvas 2D, no library, no WebGL. Reduced motion gets a still frame.
 * Hidden tabs stop the loop. It runs behind the headline but bright enough
 * to be the thing you remember.
 */

const COLORS = ["#1E3A8A", "#5B9BF9", "#C6E4F8", "#FFFFFF", "#5B8CFF"];

type P = { x: number; y: number; px: number; py: number; c: string; s: number; life: number };

export default function FlowField() {
  const ref = useRef<HTMLCanvasElement | null>(null);

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
    const c = ctx;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // A phone has more device pixels and less to push them with, so it gets
    // a lower buffer and a thinner crowd. Same weather, less work.
    const small =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: none), (max-width: 767px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.35 : 2);
    let w = 0;
    let h = 0;
    let ps: P[] = [];
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999 };

    // Field seeds, so every visit gets its own weather.
    const s1 = 0.8 + Math.random() * 1.6;
    const s2 = 0.8 + Math.random() * 1.6;
    const s3 = Math.random() * Math.PI * 2;

    const angle = (x: number, y: number, t: number) => {
      // A flowing field that always leans right, waves layered on top.
      const nx = x / w;
      const ny = y / h;
      return (
        Math.sin(ny * 4.2 * s1 + t * 0.00022 + s3) * 0.7 +
        Math.cos(nx * 3.1 * s2 - t * 0.00017) * 0.55 +
        Math.sin((nx + ny) * 2.4 + t * 0.0001) * 0.35
      ) * 0.9;
    };

    const spawn = (p?: P): P => {
      const q: P = p || ({} as P);
      q.x = Math.random() < 0.7 ? -20 : Math.random() * w;
      q.y = Math.random() * h;
      q.px = q.x;
      q.py = q.y;
      q.c = COLORS[(Math.random() * COLORS.length) | 0];
      q.s = 0.6 + Math.random() * 1.7;
      q.life = 240 + Math.random() * 420;
      return q;
    };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(320, rect.width);
      h = Math.max(240, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.fillStyle = "rgba(12, 20, 36, 1)";
      c.fillRect(0, 0, w, h);
      const n = small
        ? Math.min(120, Math.round((w * h) / 9000))
        : Math.min(340, Math.round((w * h) / 4200));
      ps = Array.from({ length: n }, () => spawn());
    };

    const step = (t: number) => {
      if (!running) return;
      // The fade that turns motion into ribbons.
      c.fillStyle = "rgba(12, 20, 36, 0.075)";
      c.fillRect(0, 0, w, h);
      c.lineCap = "round";

      for (const p of ps) {
        const a = angle(p.x, p.y, t);
        let vx = Math.cos(a) * 1.35 + 0.85; // constant push to the right
        let vy = Math.sin(a) * 1.15;

        // The pointer bends the river around itself.
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 26000) {
          const d = Math.max(40, Math.sqrt(d2));
          const f = (26000 - d2) / 26000;
          vx += (dx / d) * f * 3.4;
          vy += (dy / d) * f * 3.4;
        }

        p.px = p.x;
        p.py = p.y;
        p.x += vx * p.s;
        p.y += vy * p.s;
        p.life -= 1;

        c.strokeStyle = p.c;
        c.globalAlpha = p.c === "#FFFFFF" ? 0.5 : 0.62;
        c.lineWidth = p.s * (p.c === "#1E3A8A" ? 1.7 : 1.1);
        c.beginPath();
        c.moveTo(p.px, p.py);
        c.lineTo(p.x, p.y);
        c.stroke();

        if (p.x > w + 24 || p.y < -24 || p.y > h + 24 || p.life <= 0) spawn(p);
      }
      c.globalAlpha = 1;
      raf = window.requestAnimationFrame(step);
    };

    build();

    if (reduced) {
      // A still: run the field forward silently, then show one painted frame.
      for (let i = 0; i < 160; i++) step(i * 16);
      running = false;
      window.cancelAnimationFrame(raf);
    } else {
      raf = window.requestAnimationFrame(step);
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVis = () => {
      if (reduced) return;
      running = !document.hidden;
      window.cancelAnimationFrame(raf);
      if (running) raf = window.requestAnimationFrame(step);
    };
    const onResize = () => build();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none opacity-70 fade-b"
    />
  );
}
