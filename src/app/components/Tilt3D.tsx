"use client";
import { useRef, useState, type ReactNode } from "react";

/**
 * Real depth on the preview, rather than a drop shadow pretending to be depth.
 *
 * The card sits in a perspective scene and turns toward the pointer. Children
 * that want to sit forward of the surface use the .depth utility, so the mark
 * and the headline physically stand off the page as it turns.
 *
 * Touch devices and reduced motion get a flat card. Nothing here is required
 * for the content to be readable or usable.
 */
export default function Tilt3D({
  children,
  max = 7,
  className = "",
}: {
  children: ReactNode;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [t, setT] = useState({ x: 0, y: 0, on: false });

  const reduced = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const move = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || reduced()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({ x: -py * max * 2, y: px * max * 2, on: true });
  };

  const leave = () => setT({ x: 0, y: 0, on: false });

  return (
    <div style={{ perspective: 1100 }} className={className}>
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={leave}
        style={{
          transform: `rotateX(${t.x}deg) rotateY(${t.y}deg) translateZ(0)`,
          transformStyle: "preserve-3d",
          transition: t.on ? "transform 120ms ease-out" : "transform 700ms cubic-bezier(.2,.8,.2,1)",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
