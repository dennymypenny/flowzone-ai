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

function FlowZoneLogo() {
  return (
    <svg viewBox="0 0 90 35" xmlns="http://www.w3.org/2000/svg" className="w-7 h-[26px]">
      <line x1="14" y1="17.5" x2="76" y2="17.5" stroke="#93c5fd" strokeWidth="2" />
      <circle cx="14" cy="17.5" r="13" fill="#1e3a8a" />
      <circle cx="45" cy="17.5" r="11" fill="#5b8dd9" />
      <circle cx="76" cy="17.5" r="9" fill="#bfdbfe" />
    </svg>
  );
}

export default function ChatWidget() {
  const [display, setDisplay] = useState<DisplayMsg[]>([]);
  const [history, setHistory] = useState<ApiMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isEmpty = display.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
      const reply = data.text ?? "Sorry, something went wrong. Email us at flowzoneautomation@gmail.com.";
      setHistory((h) => [...h, { role: "assistant", content: reply }]);
      setDisplay((d) => [...d, { role: "bot", text: reply }]);
    } catch {
      setDisplay((d) => [...d, { role: "bot", text: "Connection error. Email us at flowzoneautomation@gmail.com." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden"
      style={{ minHeight: "420px" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white">
        <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
          <FlowZoneLogo />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">FlowZone AI</p>
          <p className="text-xs text-green-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {isEmpty && (
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                <FlowZoneLogo />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
                <p className="text-sm text-gray-800">
                  Hi! I&apos;m the FlowZone assistant. What can we automate for your business today?
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 ml-9">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => send(chip)}
                  className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {display.map((msg, i) => (
          <div key={i} className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "bot" && (
              <div className="w-7 h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                <FlowZoneLogo />
              </div>
            )}
            <div
              className={`px-4 py-3 rounded-2xl max-w-xs sm:max-w-sm text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-sm"
                  : "bg-gray-100 text-gray-800 rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
              <FlowZoneLogo />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask me anything about automation..."
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white disabled:opacity-40 hover:bg-indigo-700 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
