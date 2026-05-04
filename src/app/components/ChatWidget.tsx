"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  role: "bot" | "user";
  text: string;
  ctaText?: string;
  ctaHref?: string;
};

const FLOWS: Record<string, { reply: string; cta: { text: string; href: string } }> = {
  consulting: {
    reply:
      "We work with businesses to map KPIs and build live dashboards — so you always know what's driving revenue. All communication is through email.",
    cta: { text: "Tell us about your business →", href: "/intake" },
  },
  automation: {
    reply:
      "We map your manual workflows and automate them end-to-end — lead follow-up, onboarding, reporting, and invoicing.",
    cta: { text: "Tell us what to automate →", href: "/intake" },
  },
  portfolio: {
    reply:
      "We build clean, fast portfolio and resume sites that make recruiters and clients take you seriously. Most go live within 7–8 days.",
    cta: { text: "Tell us about your background →", href: "/intake" },
  },
  website: {
    reply:
      "We build conversion-focused business sites — fast, mobile-first, optimized for Google. No bloated page builders.",
    cta: { text: "Tell us about your business →", href: "/intake" },
  },
  other: {
    reply:
      "No problem — just send us your project details and we will figure out exactly what you need. Everything moves through email, no calls required.",
    cta: { text: "Send us your project details →", href: "/intake" },
  },
};

const CHIPS = [
  { id: "consulting", label: "📊 KPI Dashboard" },
  { id: "automation", label: "⚡ Workflow Automation" },
  { id: "portfolio", label: "🎨 Portfolio Site" },
  { id: "website", label: "🌐 Business Website" },
  { id: "other", label: "🤔 Something else" },
];

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addFlow = (id: string, userLabel: string) => {
    const flow = FLOWS[id];
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userLabel },
      {
        role: "bot",
        text: flow.reply,
        ctaText: flow.cta.text,
        ctaHref: flow.cta.href,
      },
    ]);
    setDone(true);
  };

  const handleChip = (id: string) => {
    if (done) return;
    const chip = CHIPS.find((c) => c.id === id);
    addFlow(id, chip?.label ?? id);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || done) return;
    const lower = text.toLowerCase();
    let matched = "other";
    if (lower.includes("dashboard") || lower.includes("kpi") || lower.includes("consult"))
      matched = "consulting";
    else if (lower.includes("automat") || lower.includes("workflow"))
      matched = "automation";
    else if (lower.includes("portfolio") || lower.includes("resume"))
      matched = "portfolio";
    else if (lower.includes("website") || lower.includes("site") || lower.includes("web"))
      matched = "website";
    setInput("");
    addFlow(matched, text);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        {/* Messages */}
        {messages.length > 0 && (
          <div className="px-6 pt-6 pb-4 space-y-4 max-h-72 overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex gap-3 items-start"}
              >
                {m.role === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    F
                  </div>
                )}
                <div className="space-y-2 max-w-xs">
                  <div
                    className={
                      m.role === "user"
                        ? "bg-blue-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm"
                        : "bg-gray-100 text-gray-800 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm"
                    }
                  >
                    {m.text}
                  </div>
                  {m.role === "bot" && m.ctaText && m.ctaHref && (
                    <Link
                      href={m.ctaHref}
                      className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                      {m.ctaText}
                    </Link>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Chips */}
        {!done && (
          <div className="px-6 pt-6 pb-4">
            <p className="text-sm text-gray-400 mb-3 text-center">
              What are you looking to build?
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {CHIPS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleChip(c.id)}
                  className="text-sm px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition text-gray-700 bg-white"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 focus-within:border-blue-400 focus-within:bg-white transition">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask what we can build for you..."
              disabled={done}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || done}
              className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
