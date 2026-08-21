"use client";
import { useState, useEffect } from "react";
import ChatWidget from "@/app/components/ChatWidget";

/**
 * The studio assistant used to sit in a section near the bottom of the
 * homepage, which meant almost nobody scrolled to it. It lives on the right
 * edge now, at eye level rather than in the bottom corner where every other
 * site on earth puts a chat bubble.
 */
export default function ChatDock() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* The tab. Vertical on a desktop so it reads as part of the edge,
          a normal pill on a phone where there is no room for that. */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open the studio assistant"
          className="fixed z-40 right-0 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2.5 bg-accent text-white pl-3 pr-2.5 py-5 rounded-l-xl shadow-[0_18px_40px_-16px_rgba(0,0,0,0.75)] hover:bg-accent-deep transition-colors"
          style={{ writingMode: "vertical-rl" }}
        >
          <svg className="w-4 h-4 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-5.5A8 8 0 0 1 11 4h2a8 8 0 0 1 8 8z" strokeLinejoin="round" />
          </svg>
          <span className="text-[11px] font-medium uppercase tracking-label">
            Ask the studio
          </span>
        </button>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open the studio assistant"
          className="fixed z-40 md:hidden right-4 bottom-5 flex items-center gap-2 bg-accent text-white px-4 py-3 rounded-full shadow-[0_18px_40px_-16px_rgba(0,0,0,0.75)]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-5.5A8 8 0 0 1 11 4h2a8 8 0 0 1 8 8z" strokeLinejoin="round" />
          </svg>
          <span className="text-[11px] font-medium uppercase tracking-label">Ask the studio</span>
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
            aria-label="Studio assistant"
            className="fixed z-50 right-0 md:right-5 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-full md:w-[420px] max-h-[88vh] md:max-h-[80vh] overflow-hidden"
          >
            <div className="relative">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close the studio assistant"
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
