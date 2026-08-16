"use client";
import { useEffect } from "react";

/**
 * Gives the page its forward motion. Anything marked data-flow starts slightly
 * low and dim, then settles as it comes into view, so scrolling feels like the
 * page is getting underway rather than sitting still.
 *
 * Fail-safe by design: content that starts at opacity 0 must never be able to
 * stay there. If the observer never fires, or the browser does not support it,
 * or something resizes the viewport out from under it, a timer reveals
 * everything anyway. An invisible page is a far worse failure than a missed
 * animation.
 */
export default function Flow() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-flow]"));

    // Inline styles beat every stylesheet, so a CSS build quirk can never
    // leave a section stuck invisible.
    const reveal = (n: HTMLElement) => {
      n.classList.add("flowed");
      n.style.opacity = "1";
      n.style.transform = "none";
    };
    const revealAll = () => nodes.forEach(reveal);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      revealAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 }
    );

    nodes.forEach((n) => io.observe(n));

    // Backstop. Nothing stays hidden past this point, whatever went wrong.
    const failSafe = window.setTimeout(revealAll, 1500);

    return () => {
      io.disconnect();
      window.clearTimeout(failSafe);
    };
  }, []);

  return null;
}
