"use client";
import { useEffect, useRef } from "react";

/**
 * The hero film.
 *
 * The mark is three dots. This is those three dots explained: loose points
 * drifting with nothing between them, then finding each other, then resolving
 * into the mark, then flowing on. That is the whole pitch of the studio played
 * out rather than written down, which is why it runs on a loop like a title
 * sequence instead of sitting still.
 *
 * Four acts, about a minute end to end:
 *   scatter   nothing is connected yet, which is where people arrive
 *   connect   links form between what is near enough to relate
 *   resolve   the network settles into the three dot mark
 *   flow      it moves, because the point was never the logo
 *
 * Canvas and arithmetic. No video file to load, no WebGL, no library, and it
 * costs nothing to serve however many people watch it. Reduced motion gets a
 * still, a hidden tab stops it, and the whole thing sits behind the text at low
 * contrast so it can never fight the words.
 */

type Node = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; c: string; r: number };

const MARK = ["#1E3A8A", "#5B9BF9", "#C6E4F8"];
const ACT_MS = 6800;

export default function NodeFilm() {
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(320, rect.width);
      h = Math.max(240, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(96, Math.round((w * h) / 12000));
      nodes = Array.from({ length: count }, (_, i) => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x,
          y,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          tx: x,
          ty: y,
          c: MARK[i % 3],
          r: 1.1 + Math.random() * 1.7,
        };
      });
    };
    build();

    /** Where the three dots of the mark sit, in canvas space. */
    const markPoints = () => {
      const cx = w * 0.5;
      const cy = h * 0.52;
      const gap = Math.min(w, h) * 0.17;
      return [
        { x: cx - gap, y: cy },
        { x: cx, y: cy },
        { x: cx + gap, y: cy },
      ];
    };

    const setTargets = (act: number) => {
      const pts = markPoints();
      nodes.forEach((n, i) => {
        if (act === 0) {
          // Scatter. Nothing near anything.
          n.tx = Math.random() * w;
          n.ty = Math.random() * h;
        } else if (act === 1) {
          // Drift toward loose clusters so links start forming.
          const p = pts[i % 3];
          const spread = Math.min(w, h) * 0.3;
          n.tx = p.x + (Math.random() - 0.5) * spread;
          n.ty = p.y + (Math.random() - 0.5) * spread;
        } else if (act === 2) {
          // Resolve. Tight rings around each dot of the mark.
          const p = pts[i % 3];
          const a = (i / nodes.length) * Math.PI * 2 * 3;
          const rad = Math.min(w, h) * (0.028 + (i % 5) * 0.006);
          n.tx = p.x + Math.cos(a) * rad;
          n.ty = p.y + Math.sin(a) * rad;
        } else {
          // Flow. A current moving left to right.
          n.tx = (i / nodes.length) * w * 1.15 - w * 0.05;
          n.ty = h * 0.5 + Math.sin(i * 0.42) * h * 0.22;
        }
      });
    };

    let act = 0;
    setTargets(act);
    let lastAct = performance.now();
    let raf = 0;
    let visible = true;

    const linkDist = Math.min(150, Math.max(90, Math.min(w, h) * 0.22));

    const frame = (now: number) => {
      if (!visible) {
        raf = requestAnimationFrame(frame);
        return;
      }

      if (now - lastAct > ACT_MS) {
        act = (act + 1) % 4;
        setTargets(act);
        lastAct = now;
      }

      c.clearRect(0, 0, w, h);

      // Ease toward the act's formation, with a little drift left in so it
      // never looks like a snapped grid.
      const pull = act === 2 ? 0.045 : 0.012;
      for (const n of nodes) {
        n.vx += (n.tx - n.x) * pull * 0.06;
        n.vy += (n.ty - n.y) * pull * 0.06;
        n.vx *= 0.94;
        n.vy *= 0.94;
        n.x += n.vx;
        n.y += n.vy;
      }

      // Links. Only between nodes close enough to have found each other.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > linkDist * linkDist) continue;
          const d = Math.sqrt(d2);
          const strength = 1 - d / linkDist;
          c.globalAlpha = strength * (act === 0 ? 0.1 : 0.3);
          c.strokeStyle = a.c;
          c.lineWidth = 0.7;
          c.beginPath();
          c.moveTo(a.x, a.y);
          c.lineTo(b.x, b.y);
          c.stroke();
        }
      }

      for (const n of nodes) {
        c.globalAlpha = 0.85;
        c.fillStyle = n.c;
        c.beginPath();
        c.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      // One settled still of the resolved mark. Same picture, no motion.
      act = 2;
      setTargets(act);
      for (let i = 0; i < 240; i++) {
        for (const n of nodes) {
          n.vx += (n.tx - n.x) * 0.0027;
          n.vy += (n.ty - n.y) * 0.0027;
          n.vx *= 0.94;
          n.vy *= 0.94;
          n.x += n.vx;
          n.y += n.vy;
        }
      }
      frame(performance.now());
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(frame);
    }

    const onVis = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "function") {
      io = new IntersectionObserver(
        (es) => {
          visible = es[0].isIntersecting && document.visibilityState === "visible";
        },
        { threshold: 0 }
      );
      io.observe(canvas);
    }

    const onResize = () => {
      build();
      setTargets(act);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      if (io) io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
}
