"use client";
import Link from "next/link";
import { useState } from "react";
import Wordmark from "@/components/Wordmark";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "What We Build" },
  { href: "/how-we-work", label: "How We Work" },
  { href: "/pricing", label: "Pricing" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-paper/90 backdrop-blur-sm border-b border-rule z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" aria-label="FlowZone AI, home">
          <Wordmark />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink-soft hover:text-accent transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout((window as any)._blogTimer);
              setBlogOpen(true);
            }}
            onMouseLeave={() => {
              (window as any)._blogTimer = setTimeout(() => setBlogOpen(false), 150);
            }}
          >
            <button className="flex items-center gap-1 text-sm text-ink-soft hover:text-accent transition-colors">
              Journal
              <svg
                className={`w-3 h-3 transition-transform ${blogOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {blogOpen && (
              <div className="absolute top-full pt-2 left-0 mt-2 w-44 bg-paper border border-rule shadow-sm py-1 z-50">
                <Link href="/blog" className="block px-4 py-2.5 text-sm text-ink-soft hover:text-accent hover:bg-paper-deep transition-colors">
                  Writing
                </Link>
                <Link href="/ai-news" className="block px-4 py-2.5 text-sm text-ink-soft hover:text-accent hover:bg-paper-deep transition-colors">
                  AI News
                </Link>
              </div>
            )}
          </div>
          <Link href="/intake" className="btn-primary !px-5 !py-2.5">
            Start a project
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-rule bg-paper px-6 py-5 flex flex-col gap-4">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-ink-soft" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <button
            className="flex items-center justify-between text-sm text-ink-soft text-left w-full"
            onClick={() => setMobileBlogOpen(!mobileBlogOpen)}
          >
            Journal
            <svg
              className={`w-3 h-3 transition-transform ${mobileBlogOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileBlogOpen && (
            <div className="pl-4 flex flex-col gap-3 -mt-1">
              <Link href="/blog" className="text-sm text-ink-mute" onClick={() => setOpen(false)}>Writing</Link>
              <Link href="/ai-news" className="text-sm text-ink-mute" onClick={() => setOpen(false)}>AI News</Link>
            </div>
          )}
          <Link href="/intake" className="btn-primary w-full" onClick={() => setOpen(false)}>
            Start a project
          </Link>
        </div>
      )}
    </nav>
  );
}
