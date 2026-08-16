"use client";
import { useEffect, useState } from "react";

/**
 * Coming out of the warp.
 *
 * When the visitor arrives by riding (the ride leaves a note), the page
 * does not just appear: the light you were flying into is still on the
 * glass, and it recedes as you decelerate into the studio. One second,
 * once, and only for riders. Direct visitors get the page as normal.
 */

export default function Arrival() {
  const [arriving, setArriving] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem("flowzone.ride.arrived")) {
        window.sessionStorage.removeItem("flowzone.ride.arrived");
        const reduced =
          typeof window.matchMedia === "function" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduced) {
          setArriving(true);
          window.setTimeout(() => setArriving(false), 1400);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  if (!arriving) return null;
  return (
    <div
      className="fixed inset-0 z-[80] pointer-events-none"
      aria-hidden
      style={{
        background:
          "radial-gradient(90rem 60rem at 50% 40%, rgba(198,228,248,0.9), rgba(91,155,249,0.5) 35%, rgba(12,20,36,0) 70%)",
        animation: "arrive-fade 1.4s cubic-bezier(0.22, 1, 0.36, 1) both",
      }}
    />
  );
}
