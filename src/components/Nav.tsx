"use client";
import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
          FlowZone AI
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/services" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Services</Link>
          <Link href="/case-studies" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Case Studies</Link>
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
          <Link href="/intake" className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors">
            Get Free AI Audit →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
          <Link href="/services" className="text-sm text-gray-700" onClick={() => setOpen(false)}>Services</Link>
          <Link href="/case-studies" className="text-sm text-gray-700" onClick={() => setOpen(false)}>Case Studies</Link>
          <Link href="/pricing" className="text-sm text-gray-700" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/blog" className="text-sm text-gray-700" onClick={() => setOpen(false)}>Blog</Link>
          <Link href="/intake" className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg text-center" onClick={() => setOpen(false)}>
            Get Free AI Audit →
          </Link>
        </div>
      )}
    </nav>
  );
}
