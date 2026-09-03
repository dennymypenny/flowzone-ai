"use client";
import { useEffect, useState } from "react";

/**
 * The three parts as one segmented pill under the headline. Each segment
 * scrolls to that part's card further down the page, and the dark segment
 * follows whichever card is on screen, so the control reads as a place in
 * the page rather than a row of tags.
 */
const PARTS = [
  { id: "brand", label: "Brand" },
  { id: "site", label: "Site" },
  { id: "system", label: "System" },
];

export default function PartsSwitch() {
  const [active, setActive] = useState("brand");

  useEffect(() => {
    const cards = PARTS.map((p) => document.getElementById(p.id)).filter(Boolean) as HTMLElement[];
    if (!cards.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (seen) setActive(seen.target.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0.2, 0.5, 0.8] }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    setActive(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      aria-label="The three parts of a build"
      className="inline-flex items-center rounded-full p-1"
      style={{ background: "rgba(228,232,240,0.92)" }}
    >
      {PARTS.map((p) => {
        const on = active === p.id;
        return (
          <a
            key={p.id}
            href={`#${p.id}`}
            onClick={(e) => go(e, p.id)}
            aria-current={on ? "true" : undefined}
            className={`rounded-full px-4 sm:px-5 py-2 text-[13px] sm:text-sm font-medium transition-colors duration-200 ${
              on ? "bg-[#0B1322] text-white shadow-sm" : "text-[#1C2942] hover:bg-white/70"
            }`}
          >
            {p.label}
          </a>
        );
      })}
    </nav>
  );
}
