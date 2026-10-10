"use client";
import { useEffect, useRef } from "react";

/**
 * Makes a card feel like a real ticket in your hand. Oct 9 2026.
 *
 * Tilts toward the pointer (up to ~12 degrees), a glossy sheen follows it,
 * and the shadow falls away from the light. On phones it tilts with the
 * device when the browser allows motion, and otherwise just floats.
 * Everything is a transform on a wrapper: the card inside is always visible
 * and readable, and reduced motion turns all of it off.
 */
export default function Tilt3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    } catch {
      /* play it */
    }
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let gx = 50, gy = 30, cgx = 50, cgy = 30;
    const set = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      cgx += (gx - cgx) * 0.12;
      cgy += (gy - cgy) * 0.12;
      el.style.setProperty("--rx", `${cy.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${cx.toFixed(2)}deg`);
      el.style.setProperty("--gx", `${cgx.toFixed(1)}%`);
      el.style.setProperty("--gy", `${cgy.toFixed(1)}%`);
      // The shadow falls away from where the card tips up.
      el.style.setProperty("--sx", `${(-cx * 2.2).toFixed(1)}px`);
      el.style.setProperty("--sy", `${(30 + cy * 2.2).toFixed(1)}px`);
      raf = requestAnimationFrame(set);
    };
    raf = requestAnimationFrame(set);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      tx = (px - 0.5) * 16;
      ty = (0.5 - py) * 12;
      gx = px * 100;
      gy = py * 100;
      el.classList.add("fz-3d-live");
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      gx = 50;
      gy = 30;
      el.classList.remove("fz-3d-live");
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      tx = Math.max(-10, Math.min(10, e.gamma / 3));
      ty = Math.max(-8, Math.min(8, (45 - e.beta) / 4));
      gx = 50 + tx * 4;
      gy = 30 - ty * 4;
      el.classList.add("fz-3d-live");
    };
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("deviceorientation", onTilt);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  return (
    <div className={`fz-3d-stage ${className}`}>
      <div ref={wrap} className="fz-3d">
        {children}
        <span aria-hidden className="fz-3d-sheen" />
      </div>
    </div>
  );
}
