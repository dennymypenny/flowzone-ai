"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The footer's moving water. A slow 14 second cut of the hero ocean,
 * slowed down and cross-faded end to start so the loop has no seam.
 *
 * It only starts downloading when the footer gets close to the screen, so
 * pages that never get scrolled to the bottom never pay for it. With
 * reduced motion on, the still poster stays and nothing plays.
 *
 * The footer's own background colour sits under all of this, so the text
 * reads fine before the video loads, without it, and with JS off.
 */
export default function FooterVideo() {
  const wrap = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = wrap.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/footer-flow-poster.jpg"
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {load && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/footer-flow-poster.jpg"
        >
          <source src="/assets/footer-flow.webm" type="video/webm" />
          <source src="/assets/footer-flow.mp4" type="video/mp4" />
        </video>
      )}
      {/* The see-through navy. Heavier at the top so the page above hands
          off into it softly, lightest through the middle where the water
          shows, and never light enough to drop the small text under 4.5:1. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(16,26,46,0.95) 0%, rgba(16,26,46,0.87) 28%, rgba(16,26,46,0.87) 72%, rgba(16,26,46,0.93) 100%)",
        }}
      />
      {/* A little boat making way across the top of the footer, left to
          right like everything else on the site, pulling a V wake. Seen from
          above to match the drone water. Pure transform animation, visible
          by default, and parked still for reduced motion. */}
      <div className="fz-boat absolute left-0 top-5 md:top-7">
        <svg
          className="fz-boat-bob block"
          width="150"
          height="44"
          viewBox="0 0 150 44"
          fill="none"
        >
          <defs>
            <linearGradient id="fzWake" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="fzTrail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#C6E4F8" stopOpacity="0" />
              <stop offset="1" stopColor="#C6E4F8" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {/* the wake: two arms opening out behind the stern */}
          <path d="M112 19 L10 3" stroke="url(#fzWake)" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M112 25 L10 41" stroke="url(#fzWake)" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M112 22 L30 22" stroke="url(#fzTrail)" strokeWidth="5" strokeLinecap="round" />
          {/* the hull, bow to the right */}
          <path d="M108 16 H130 C137 16 143 19 147 22 C143 25 137 28 130 28 H108 C106 28 105 26.5 105 25 V19 C105 17.5 106 16 108 16 Z" fill="#F1F3F7" />
          {/* the cabin */}
          <rect x="114" y="18.5" width="11" height="7" rx="1.5" fill="#5B8CFF" />
          <path d="M134 22 H142" stroke="#C6E4F8" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
