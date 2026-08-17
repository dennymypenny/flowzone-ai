"use client";
import { useEffect, useRef } from "react";

/**
 * A network instead of a wash.
 *
 * Every page used to open on the same soft radial gradient, which is the
 * default backdrop of every site built in a hurry and says nothing about what
 * this studio does. This says something: nodes finding each other and holding
 * a line while they are close enough, which is the whole pitch. Brand, site
 * and system are not three purchases, they are three things wired together,
 * and the mark itself is three dots on a line.
 *
 * Canvas 2D, no library, no WebGL. A phone gets fewer nodes, a shorter reach
 * and half the frames. Reduced motion gets one still frame that is still a
 * network. Offscreen and hidden tabs stop the loop entirely, because a
 * background animation nobody is looking at is just a warm battery.
 */

type N = { x: number; y: number; vx: number; vy: number; r: number; c: string };

/** The mark's three blues, plus white for the occasional bright node. */
const COLORS = ["#1E3A8A", "#5B9BF9", "#C6E4F8", "#5B8CFF", "#FFFFFF"];

export default function NodeWeb({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let c: CanvasRenderingContext2D | null = null;
    try {
      c = canvas.getContext("2d");
    } catch {
      return;
    }
    if (!c) return;
    const ctx = c;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: none), (max-width: 767px)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.35 : 2);
    const REACH = small ? 130 : 170;
    let w = 0;
    let h = 0;
    let nodes: N[] = [];
    let raf = 0;
    let running = true;
    let tick = 0;
    const pointer = { x: -9999, y: -9999 };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(320, rect.width);
      h = Math.max(220, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Density by area, so a wide desktop hero is not sparse and a phone is
      // not a soup. Capped at both ends.
      const target = Math.round((w * h) / (small ? 26000 : 15000));
      const n = Math.max(14, Math.min(small ? 34 : 78, target));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 1 + Math.random() * 2.1,
        c: COLORS[(Math.random() * COLORS.length) | 0],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Lines first, so the nodes sit on top of their own connections.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > REACH * REACH) continue;
          const t = 1 - Math.sqrt(d2) / REACH;
          ctx.strokeStyle = `rgba(139, 173, 255, ${(t * 0.32).toFixed(3)})`;
          ctx.lineWidth = t * 1.1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const p of nodes) {
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.c === "#FFFFFF" ? 0.75 : 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      if (!running) return;
      tick += 1;
      // Half the frames on a phone. The drift is slow enough that nobody can
      // tell, and the main thread gets its other half back for scrolling.
      if (!small || tick % 2 === 0) {
        for (const p of nodes) {
          p.x += p.vx;
          p.y += p.vy;
          // The pointer pushes the web apart gently, so it feels alive when
          // somebody moves across it rather than being wallpaper.
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 20000 && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = (1 - d / 141) * 0.5;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        }
        draw();
      }
      raf = window.requestAnimationFrame(step);
    };

    build();

    if (reduced) {
      // A still that is still a network, rather than a frozen half-frame.
      for (let i = 0; i < 40; i++) {
        for (const p of nodes) {
          p.x += p.vx * 6;
          p.y += p.vy * 6;
        }
      }
      draw();
      running = false;
    } else {
      raf = window.requestAnimationFrame(step);
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onResize = () => build();
    const setRunning = (next: boolean) => {
      if (reduced || next === running) return;
      running = next;
      window.cancelAnimationFrame(raf);
      if (running) raf = window.requestAnimationFrame(step);
    };
    const onVis = () => setRunning(document.visibilityState === "visible");

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    // Scrolled past means stopped. A hero animation running under the footer
    // is pure heat.
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "function") {
      io = new IntersectionObserver(
        (entries) => setRunning(entries[0].isIntersecting && document.visibilityState === "visible"),
        { threshold: 0 }
      );
      io.observe(canvas);
    }

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      if (io) io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
