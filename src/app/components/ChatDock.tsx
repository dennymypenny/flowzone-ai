"use client";
import { useState, useEffect } from "react";
import ChatWidget from "@/app/components/ChatWidget";
import Flowy from "@/app/components/Flowy";

/**
 * Flowy lives on the right edge of every page, at eye level, peeking in
 * with a speech bubble. Click Flowy or the bubble and the chat opens. The
 * studio assistant used to be a vertical tab here; the character replaces
 * it so the thing you click reads as someone rather than as a widget.
 */
export default function ChatDock() {
  const [open, setOpen] = useState(false);
  // The bubble says hello for a few seconds, then tucks away so it is not
  // sitting on top of the page. It comes back when the pointer reaches Flowy.
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setHint(false), 7000);
    const onScroll = () => window.scrollY > 240 && setHint(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Desktop: Flowy peeks in at mid height with the full line. */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Flowy, the FlowZone helper"
          className="fixed z-40 right-0 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-3 group"
        >
          <span
            className={`relative max-w-[250px] rounded-[16px] bg-white border border-[#D6DEEC] px-4 py-3 text-left text-[14px] leading-snug text-[#35425E] shadow-[0_18px_40px_-18px_rgba(11,19,34,0.55)] transition-all duration-300 ${
              hint ? "" : "opacity-0 translate-x-3 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100"
            }`}
          >
            Hey! I&apos;m <span className="font-semibold text-[#2B57C4]">Flowy</span>. FlowZone&apos;s
            little helper. Ask me what your project needs.
            <span
              className="absolute right-[-7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rotate-45 bg-white border-r border-t border-[#D6DEEC]"
              aria-hidden
            />
          </span>
          <Flowy size={132} />
        </button>
      )}

      {/* Phone: smaller Flowy low on the edge, short bubble. */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Flowy, the FlowZone helper"
          className="fixed z-40 md:hidden right-0 bottom-6 flex items-center gap-2"
        >
          <span className="relative rounded-[14px] bg-white border border-[#D6DEEC] px-3 py-2 text-[13px] leading-none text-[#35425E] shadow-[0_18px_40px_-18px_rgba(11,19,34,0.55)]">
            Ask <span className="font-semibold text-[#2B57C4]">Flowy</span>
            <span
              className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-white border-r border-t border-[#D6DEEC]"
              aria-hidden
            />
          </span>
          <Flowy size={72} />
        </button>
      )}

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-[rgba(6,12,28,0.55)] md:bg-transparent md:pointer-events-none"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-label="Flowy, the FlowZone helper"
            className="fixed z-50 right-0 md:right-5 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-full md:w-[420px] max-h-[88vh] md:max-h-[80vh] overflow-hidden"
          >
            <div className="relative">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close Flowy"
                className="absolute z-10 top-3.5 right-3.5 w-8 h-8 rounded-full bg-paper-deep border border-rule text-ink-soft hover:text-ink flex items-center justify-center"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
              <ChatWidget className="h-[78vh] md:h-[560px] !min-h-0 rounded-b-none md:rounded-b-[18px]" />
            </div>
          </div>
        </>
      )}
    </>
  );
}
