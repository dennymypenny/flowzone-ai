"use client";
import Link from "next/link";
import { useState } from "react";
import Wordmark from "@/components/Wordmark";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/start", label: "Work Session" },
  { href: "/work", label: "Work" },
  { href: "/services", label: "What We Build" },
  { href: "/how-we-work", label: "How We Work" },
  { href: "/pricing", label: "Pricing" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-[3px] w-full bg-white border-b border-[#E8EEF7] z-50">
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
              className="text-sm text-[#3F4A5C] hover:text-accent transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <a href={SITE.mailto} className="btn-primary !px-5 !py-2.5">
            Start an email
          </a>
        </div>

        <button
          className="md:hidden p-2 text-[#0B1322]"
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
        <div className="md:hidden border-t border-[#E8EEF7] bg-white px-6 py-5 flex flex-col gap-4">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-[#3F4A5C]" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <a href={SITE.mailto} className="btn-primary w-full" onClick={() => setOpen(false)}>
            Start an email
          </a>
        </div>
      )}
    </nav>
  );
}
