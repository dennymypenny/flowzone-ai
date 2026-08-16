"use client";
import { useEffect } from "react";

/**
 * Scroll motion, done so it can never hide anything.
 *
 * The stylesheet no longer contains a single rule that sets content to
 * opacity 0. Everything ships visible. This component hides sections only
 * after JS has confirmed it can also show them again, and it starts a timer
 * up front that restores everything no matter what happens next.
 *
 * An earlier version put the hidden state in CSS and the reveal in a class.
 * A build quirk dropped the reveal rule and every section below the hero
 * disappeared in production. Never again: default visible, hide from JS only.
 */
export default function Flow() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-flow]"));
    if (!nodes.length) return;

    const show = (n: HTMLElement) => {
      n.style.opacity = "1";
      n.style.transform = "none";
    };
    const showAll = () => nodes.forEach(show);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") return;

    // Hide only what is currently below the fold, so nothing visible flickers.
    const pending: HTMLElement[] = [];
    nodes.forEach((n) => {
      if (n.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      n.style.opacity = "0";
      n.style.transform = "translateY(18px)";
      n.style.transition =
        "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)";
      pending.push(n);
    });
    if (!pending.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    pending.forEach((n) => io.observe(n));

    // Hard backstop. If anything at all goes wrong, the page comes back.
    const failSafe = window.setTimeout(showAll, 4000);

    return () => {
      io.disconnect();
      window.clearTimeout(failSafe);
      showAll();
    };
  }, []);

  return null;
}
