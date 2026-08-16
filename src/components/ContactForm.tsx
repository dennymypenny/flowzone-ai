"use client";
import { useState } from "react";
import { SITE } from "@/lib/site";

/**
 * Say what you want and press send. No mail app required.
 *
 * The reason dropdown leads with working together, because that is what most
 * people arriving here want and burying it under "general enquiry" makes them
 * work to say so. Budget is optional and deliberately vague: forcing a number
 * out of somebody before they trust you loses the ones who have not decided.
 */

const REASONS = [
  { id: "work", label: "I am interested in working with you" },
  { id: "quote", label: "I want a price and a date" },
  { id: "question", label: "I have a question first" },
  { id: "collab", label: "Collaboration or partnership" },
  { id: "other", label: "Something else" },
];

const BUDGETS = ["Not sure yet", "Around $600", "$600 to $2,500", "$2,500 plus", "Ongoing work"];

export default function ContactForm({ accent = "#5B9BF9" }: { accent?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("work");
  const [budget, setBudget] = useState("Not sure yet");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const send = async () => {
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, reason, budget, message }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "That did not send.");
      setState("done");
    } catch (e) {
      setState("error");
      setError(e instanceof Error ? e.message : "That did not send.");
    }
  };

  if (state === "done") {
    return (
      <div className="panel p-8">
        <span className="block text-3xl mb-4 leading-none">✓</span>
        <p className="font-display text-2xl mb-3">Sent. A person is reading it.</p>
        <p className="text-sm text-ink-soft font-light leading-relaxed max-w-reading">
          You will get a reply with which parts you actually need, what it costs and a
          date. Usually the same day. A copy is in your inbox already.
        </p>
      </div>
    );
  }

  return (
    <div className="panel p-8 relative overflow-hidden">
      <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: accent }} />
      <p className="label mb-2">Send it from here</p>
      <p className="text-sm text-ink-soft font-light leading-relaxed mb-6 max-w-reading">
        No mail app, no calendar link, no form that goes nowhere. This lands in a real
        inbox and a person answers it.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-label text-ink-mute mb-1.5">Why you are writing</p>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-paper-deep text-ink border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
          >
            {REASONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-label text-ink-mute mb-1.5">Budget, roughly</p>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-paper-deep text-ink border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
          >
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <textarea
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What are you getting moving? A few sentences is plenty."
        className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light leading-relaxed outline-none focus:border-accent transition-colors resize-none mb-4"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={send}
          disabled={state === "sending"}
          className="btn-primary disabled:opacity-50"
        >
          {state === "sending" ? "Sending..." : "Send it"} <span className="arrow">→</span>
        </button>
        <a href={SITE.mailto} className="text-[12px] text-ink-mute hover:text-ink-soft transition-colors">
          or use your own mail app
        </a>
      </div>

      {state === "error" && <p className="text-[12px] text-[#FBBF24] mt-3">{error}</p>}
    </div>
  );
}
