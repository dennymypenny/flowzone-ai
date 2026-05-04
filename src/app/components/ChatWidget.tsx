"use client";
import { useState, useRef, useEffect } from "react";

type Role = "user" | "assistant";
type ApiMsg = { role: Role; content: string };
type DisplayMsg = { role: "user" | "bot"; text: string };

const CHIPS = [
  "I need a KPI dashboard",
  "Automate my workflows",
  "Build my portfolio site",
  "I need a business website",
  "Something else",
];

export default function ChatWidget() {
  const [display, setDisplay] = useState<DisplayMsg[]>([]);
  const [history, setHistory] = useState<ApiMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [display, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");

    const newHistory: ApiMsg[] = [...history, { role: "user", content: trimmed }];
    setHistory(newHistory);
    setDisplay((prev) => [...prev, { role: "user", text: trimmed }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      const reply: string =
        data.text || "Something went wrong — visit /intake to get started.";
      setHistory((prev) => [...prev, { role: "assistant", content: reply }]);
      setDisplay((prev) => [...prev, { role: "bot", text: reply }]);
    } catch {
      setDisplay((prev) => [
        ...prev,
        { role: "bot", text: "Connection error — please visit /intake to get started." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = display.length === 0 && !loading;

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden" style={{ minHeight: "420px" }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 pt-8 pb-2 space-y-4">
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full" style={{ minHeight: "260px" }}>
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-black mb-4">
              F
            </div>
            <p className="text-gray-800 font-semibold mb-1">FlowZone Assistant</p>
            <p className="text-gray-400 text-sm">What can we build for you?</p>
          </div>
        )}
        {display.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "flex justify-end" : "flex gap-3 items-start"}
          >
            {m.role === "bot" && (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                F
              </div>
            )}
            <div
              className={
                m.role === "user"
                  ? "bg-blue-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-lg"
                  : "bg-gray-100 text-gray-800 text-sm px-4 py-3 rounded-2xl rounded-tl-sm max-w-lg leading-relaxed"
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              F
            </div>
            <div className="bg-gray-100 px-5 py-4 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "160ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "320ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Chips — only on first load */}
      {isEmpty && (
        <div className="px-8 pb-4 pt-2">
          <div className="flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => send(c)}
                className="text-sm px-4 py-2 rounded-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition text-gray-600 bg-white"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-5 py-3.5 border border-gray-200 focus-within:border-blue-400 focus-within:bg-white transition">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Describe what you need..."
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
