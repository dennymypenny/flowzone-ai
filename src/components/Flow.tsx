"use client";
import { useEffect } from "react";

/**
 * Gives the page its forward motion. Anything marked data-flow starts slightly
 * low and dim, then settles as it comes into view, so scrolling feels like the
 * page is getting underway rather than sitting still.
 */
export default function Flow() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-flow]"));

    if (reduce) {
      nodes.forEach((n) => n.classList.add("flowed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("flowed");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return null;
}
