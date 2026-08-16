"use client";
import { useState, useRef, useEffect } from "react";
import { SITE } from "@/lib/site";
import Wordmark from "@/components/Wordmark";

type Role = "user" | "assistant";
type ApiMsg = { role: Role; content: string };
type DisplayMsg = { role: "user" | "bot"; text: string };

const CHIPS = [
  "I need a brand and a site",
  "I'm launching a storefront",
  "My site looks like a template",
  "I have a site, I need the system behind it",
  "Something else",
];

export default function ChatWidget() {
  const [display, setDisplay] = useState<DisplayMsg[]>([]);
  const [history, setHistory] = useState<ApiMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isEmpty = display.length === 0;

  // Scroll the transcript itself, never the page. scrollIntoView here used to
  // drag the whole window down to the widget on first load.
  useEffect(() => {
    if (display.length === 0) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [display, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ApiMsg = { role: "user", content: text.trim() };
    const newHistory = [...history, userMsg];

    setDisplay((d) => [...d, { role: "user", text: text.trim() }]);
    setHistory(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      const reply = data.text ?? `Something went wrong on our end. Email us at ${SITE.email}.`;
      setHistory((h) => [...h, { role: "assistant", content: reply }]);
      setDisplay((d) => [...d, { role: "bot", text: reply }]);
    } catch {
      setDisplay((d) => [
        ...d,
        { role: "bot", text: `Connection error. Email us at ${SITE.email}.` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col panel overflow-hidden" style={{ minHeight: "440px" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-rule">
        <Wordmark tone="dark" size={16} />
        <p className="label">Studio assistant</p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {isEmpty && (
          <div className="flex flex-col items-start gap-5">
            <p className="text-ink-soft leading-relaxed max-w-md">
              Tell me what you are trying to get moving and I will tell you which of
              the three parts you actually need, roughly what it costs and how long it
              takes. Then send it over in an email and a person picks it up.
            </p>
            <div className="flex flex-wrap gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => send(chip)}
                  className="text-xs border border-rule text-ink-soft px-3.5 py-2 rounded-md hover:border-accent/50 hover:text-ink hover:bg-accent/10 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {display.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-3 rounded-lg max-w-xs sm:max-w-md text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent text-white"
                  : "bg-paper-deep text-ink-soft border border-rule"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-paper-deep border border-rule rounded-lg px-4 py-3.5 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-ink-mute animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Nudge to a real person */}
      <div className="border-t border-rule px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between bg-paper-deep">
        <p className="text-sm text-ink-soft font-light">
          Answers here are quick. Real scope and a date come by email.
        </p>
        <a href={SITE.mailto} className="btn-primary !px-4 !py-2.5 shrink-0">
          Send us the details <span className="arrow">→</span>
        </a>
      </div>

      {/* Input */}
      <div className="border-t border-rule">
        <div className="flex items-center gap-3 px-6 py-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Describe what you are building..."
            className="flex-1 bg-transparent text-sm text-ink placeholder-ink-mute outline-none py-2"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            aria-label="Send"
            className="w-9 h-9 rounded-md bg-accent text-white flex items-center justify-center disabled:opacity-30 hover:bg-accent-deep transition-colors shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
