"use client";
import { useState } from "react";
import Link from "next/link";

type Message = { role: "bot" | "user"; text: string };

const FLOWS: Record<string, { reply: string; cta: { text: string; href: string } }> = {
  consulting: {
    reply:
      "We work with businesses to map KPIs and build live dashboards — so you always know what's driving revenue. Starting at $1,500. All communication is through email.",
    cta: { text: "Tell us about your business →", href: "/intake" },
  },
  automation: {
    reply:
      "We map your manual workflows and automate them end-to-end — lead follow-up, onboarding, reporting, invoicing. Starting at $900.",
    cta: { text: "Tell us what to automate →", href: "/intake" },
  },
  portfolio: {
    reply:
      "We build clean, fast portfolio and resume sites that make recruiters and clients take you seriously. Most go live within 7–8 days. Starting at $500.",
    cta: { text: "Tell us about your background →", href: "/intake" },
  },
  website: {
    reply:
      "We build conversion-focused business sites — fast, mobile-first, optimized for Google. No bloated page builders. Starting at $800.",
    cta: { text: "Tell us about your business →", href: "/intake" },
  },
  other: {
    reply:
      "No problem — just send us your project details and we will figure out exactly what you need. Everything moves through email, no calls required.",
    cta: { text: "Send us your project details →", href: "/intake" },
  },
};

const OPTIONS = [
  { id: "consulting", label: "📊 Consulting + KPI Dashboard" },
  { id: "automation", label: "⚡ Workflow Automation" },
  { id: "portfolio", label: "🎨 Portfolio or Resume Site" },
  { id: "website", label: "🌐 Business Website" },
  { id: "other", label: "🤔 Something else" },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi! What are you looking to build? Pick an option below and I will tell you exactly how we can help.",
    },
  ]);
  const [selected, setSelected] = useState<string | null>(null);

  const handleOption = (id: string) => {
    if (selected) return;
    setSelected(id);
    const opt = OPTIONS.find((o) => o.id === id);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: opt?.label ?? id },
      { role: "bot", text: FLOWS[id].reply },
    ]);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-semibold text-sm">FlowZone Assistant</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-blue-200 hover:text-white text-xl leading-none"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="px-4 py-4 space-y-3 max-h-64 overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "bot" ? "flex gap-2 items-start" : "flex justify-end"}
              >
                {m.role === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    F
                  </div>
                )}
                <div
                  className={
                    m.role === "bot"
                      ? "bg-gray-100 text-gray-800 text-sm px-3 py-2 rounded-xl rounded-tl-none max-w-xs"
                      : "bg-blue-600 text-white text-sm px-3 py-2 rounded-xl rounded-tr-none max-w-xs"
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}

            {selected && FLOWS[selected]?.cta && (
              <Link
                href={FLOWS[selected].cta.href}
                className="block bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl text-center hover:bg-blue-700 transition mt-1"
              >
                {FLOWS[selected].cta.text}
              </Link>
            )}
          </div>

          {/* Quick-reply options */}
          {!selected && (
            <div className="border-t border-gray-100 px-3 py-3 space-y-1.5">
              {OPTIONS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => handleOption(o.id)}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition text-gray-700"
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center hover:scale-105 active:scale-95"
        aria-label={open ? "Close chat" : "Open chat assistant"}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        )}
      </button>
    </>
  );
}
