"use client";

import { useEffect } from "react";

/* Phones first. Every looping video on a page keeps a decoder busy even
   when it is scrolled out of view, and two or three of them at once is
   what makes a phone drop frames while someone scrolls. This watches every
   video on the page and pauses the ones that are not near the screen,
   then starts them again as they come back. Videos that are meant to
   autoplay carry the attribute already, so nothing else changes. */
export default function VideoGate() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) {
            delete v.dataset.fzOff;
            /* A lazy video keeps its sources in data-src until now. */
            const pending = v.querySelectorAll<HTMLSourceElement>("source[data-src]");
            if (pending.length) {
              pending.forEach((s) => {
                s.src = s.dataset.src as string;
                s.removeAttribute("data-src");
              });
              v.load();
            }
            if ((v.autoplay || v.dataset.fzAuto) && v.paused) v.play().catch(() => {});
          } else {
            v.dataset.fzOff = "1";
            if (!v.paused) v.pause();
          }
        }
      },
      { rootMargin: "160px 0px" },
    );
    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll("video").forEach((v) => {
        if (seen.has(v)) return;
        seen.add(v);
        io.observe(v);
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);
  return null;
}
