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
      "We work with businesses to map KPIs and build live dashboards — so you always know what's driving revenue. Whether your data lives in Shopify, QuickBooks, a CRM, or a spreadsheet, we connect it all and surface what matters.",
    cta: { text: "Tell us about your business →", href: "/intake" },
  },
  automation: {
    reply:
      "We map your manual workflows and automate them end-to-end — lead follow-up, client onboarding, invoicing, reporting. Common stacks: Zapier, Make, n8n, Notion, Slack, Airtable. You stop doing it manually, permanently.",
    cta: { text: "Tell us what to automate →", href: "/intake" },
  },
  portfolio: {
    reply:
      "We build clean, fast portfolio and resume sites that make recruiters and clients take you seriously. UX designers, engineers, creatives, consultants — we have built them all. Most go live within 7–8 days.",
    cta: { text: "Tell us about your background →", href: "/intake" },
  },
  website: {
    reply:
      "We build conversion-focused business sites — fast, mobile-first, optimized for Google. No bloated page builders. Whether you are a local service business, an agency, or launching something new, we build it right.",
    cta: { text: "Tell us about your business →", href: "/intake" },
  },
  other: {
    reply:
      "Sounds like something we can figure out. We do a lot more than what is listed — send us the details and we will come back with exactly how we would approach it. Everything through email, no calls.",
    cta: { text: "Send us your project details →", href: "/intake" },
  },
};

const KEYWORD_MAP: Record<string, Array<{ kw: string; w: number }>> = {
  consulting: [
    { kw: "kpi", w: 3 }, { kw: "dashboard", w: 3 }, { kw: "business intelligence", w: 3 },
    { kw: "analytics", w: 2 }, { kw: "metric", w: 2 }, { kw: "revenue", w: 2 },
    { kw: "consult", w: 2 }, { kw: "report", w: 2 }, { kw: "insight", w: 2 },
    { kw: "track", w: 1 }, { kw: "monitor", w: 1 }, { kw: "visibility", w: 1 },
    { kw: "shopify", w: 2 }, { kw: "quickbooks", w: 2 }, { kw: "crm", w: 2 },
    { kw: "margin", w: 2 }, { kw: "profit", w: 2 }, { kw: "performance", w: 1 },
    { kw: "spreadsheet", w: 1 }, { kw: "excel", w: 1 }, { kw: "measure", w: 1 },
    { kw: "numbers", w: 1 }, { kw: "data", w: 1 }, { kw: "forecast", w: 2 },
  ],
  automation: [
    { kw: "automat", w: 3 }, { kw: "workflow", w: 3 }, { kw: "zapier", w: 3 },
    { kw: "n8n", w: 3 }, { kw: "make.com", w: 3 }, { kw: "integrat", w: 2 },
    { kw: "trigger", w: 2 }, { kw: "onboard", w: 2 }, { kw: "follow-up", w: 2 },
    { kw: "follow up", w: 2 }, { kw: "lead nurt", w: 2 }, { kw: "email sequence", w: 3 },
    { kw: "drip", w: 2 }, { kw: "invoice", w: 2 }, { kw: "manual", w: 1 },
    { kw: "repetitive", w: 2 }, { kw: "save time", w: 2 }, { kw: "pipeline", w: 1 },
    { kw: "notion", w: 1 }, { kw: "airtable", w: 1 }, { kw: "slack", w: 1 },
    { kw: "docusign", w: 2 }, { kw: "lead", w: 1 }, { kw: "reminder", w: 2 },
  ],
  portfolio: [
    { kw: "portfolio", w: 3 }, { kw: "resume", w: 3 }, { kw: "personal site", w: 3 },
    { kw: "personal website", w: 3 }, { kw: "cv", w: 3 }, { kw: "job search", w: 3 },
    { kw: "hir", w: 2 }, { kw: "recruit", w: 2 }, { kw: "career", w: 2 },
    { kw: "showcase", w: 2 }, { kw: "freelanc", w: 2 }, { kw: "work sample", w: 2 },
    { kw: "designer", w: 1 }, { kw: "ux", w: 1 }, { kw: "creative", w: 1 },
    { kw: "engineer", w: 1 }, { kw: "graphic", w: 1 }, { kw: "my work", w: 2 },
    { kw: "myself", w: 1 }, { kw: "get hired", w: 3 }, { kw: "job", w: 1 },
  ],
  website: [
    { kw: "website", w: 3 }, { kw: "web site", w: 3 }, { kw: "landing page", w: 3 },
    { kw: "business site", w: 3 }, { kw: "online presence", w: 2 }, { kw: "seo", w: 2 },
    { kw: "google", w: 1 }, { kw: "mobile", w: 1 }, { kw: "conversion", w: 2 },
    { kw: "booking", w: 2 }, { kw: "ecommerce", w: 2 }, { kw: "e-commerce", w: 2 },
    { kw: "shop", w: 1 }, { kw: "store", w: 1 }, { kw: "rebrand", w: 2 },
    { kw: "local business", w: 2 }, { kw: "hvac", w: 2 }, { kw: "plumb", w: 2 },
    { kw: "gym", w: 2 }, { kw: "restaurant", w: 2 }, { kw: "agency", w: 1 },
    { kw: "dental", w: 2 }, { kw: "service business", w: 2 }, { kw: "leads", w: 2 },
    { kw: "client", w: 1 }, { kw: "brand", w: 1 },
  ],
};

function matchService(input: string): string {
  const lower = input.toLowerCase();
  const scores: Record<string, number> = { consulting: 0, automation: 0, portfolio: 0, website: 0 };
  for (const [service, entries] of Object.entries(KEYWORD_MAP)) {
    for (const { kw, w } of entries) {
      if (lower.includes(kw)) scores[service] += w;
    }
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return best[0][1] > 0 ? best[0][0] : "other";
}

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
      { role: "bot", text: flow.reply, ctaText: flow.cta.text, ctaHref: flow.cta.href },
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
    setInput("");
    addFlow(matchService(text), text);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-2 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-black mx-auto mb-4">
                F
              </div>
              <p className="text-gray-700 font-semibold mb-1">FlowZone Assistant</p>
              <p className="text-gray-400 text-sm">
                Pick an option or describe what you need.
              </p>
            </div>
          </div>
        )}
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
            <div className="space-y-2 max-w-sm">
              <div
                className={
                  m.role === "user"
                    ? "bg-blue-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm"
                    : "bg-gray-100 text-gray-800 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm leading-relaxed"
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

      {!done && (
        <div className="px-6 pt-2 pb-3">
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

      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 focus-within:border-blue-400 focus-within:bg-white transition">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={done ? "We will follow up by email within 24 hrs." : "Describe what you need..."}
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
  );
}
