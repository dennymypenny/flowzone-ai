"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

/**
 * A small slide-in that offers to email someone their work session so it is not
 * trapped in one browser. That is the exchange: they get a real thing back, the
 * studio gets an address.
 *
 * Deliberately not a full screen takeover and deliberately not instant. It waits
 * until someone has been around a few seconds or has scrolled, dismisses for
 * good on a no, and never reappears once they have given an address.
 */

const KEY = "flowzone.saveprompt.v1";
const SESSION_KEY = "flowzone.session.v2";

export default function SavePrompt() {
  // Flow Mode is a working surface. Nothing pops over it.
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = Boolean(window.localStorage.getItem(KEY));
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const answered = Object.values(parsed.answers || {}).filter(
          (v) => typeof v === "string" && v.trim()
        ).length;
        setHasSession(answered > 0);
      }
    } catch {
      /* storage blocked, treat as first visit */
    }
    if (dismissed) return;

    let fired = false;
    const open = () => {
      if (fired) return;
      fired = true;
      setShow(true);
    };
    const timer = window.setTimeout(open, 7000);
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) open();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const close = (remember = true) => {
    setShow(false);
    if (remember) {
      try {
        window.localStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
    }
  };

  const submit = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("sending");

    // If they have worked a session, send it with them so the save is real.
    let brief = "";
    let name = "";
    let path = "";
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        const a = p.answers || {};
        name = a.name || "";
        path = p.path || "";
        brief = Object.entries(a)
          .filter(([k, v]) => k !== "palette" && typeof v === "string" && (v as string).trim())
          .map(([k, v]) => `${k.toUpperCase()}\n${v}`)
          .join("\n\n");
      }
    } catch {
      /* ignore */
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, brief, name, path, source: "save prompt" }),
      });
      if (!res.ok) throw new Error("failed");
      setState("done");
      try {
        window.localStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
      window.setTimeout(() => setShow(false), 2600);
    } catch {
      setState("error");
    }
  };

  if (pathname === "/start" || !show) return null;

  return (
    <div className="fixed bottom-5 left-5 right-5 sm:right-auto sm:w-[380px] z-[70]">
      <div className="panel shadow-panel p-6 relative">
        <button
          onClick={() => close()}
          aria-label="Close"
          className="absolute top-4 right-4 text-ink-mute hover:text-ink transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        {state === "done" ? (
          <div>
            <span className="block text-2xl mb-3 leading-none">✅</span>
            <p className="font-display text-xl mb-2">Sent. Check your inbox.</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed">
              {hasSession
                ? "Your brief is in there. Reply to it any time and a person picks it up."
                : "Nothing much will land in there. When something is worth reading, you will get it."}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-1.5 h-1.5 bg-accent block" />
              <p className="text-[11px] font-medium uppercase tracking-label text-ink-mute">
                {hasSession ? "Do not lose your session" : "A small offer"}
              </p>
            </div>

            <p className="font-display text-xl leading-snug mb-2.5">
              {hasSession
                ? "Want your brief emailed to you?"
                : "Want a real brief for your idea?"}
            </p>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-5">
              {hasSession
                ? "Right now it only lives in this browser. Clear your history and it is gone. Drop an email and we will send you a copy you actually own."
                : "Six questions turn a vague idea into a brief you can hand to anyone. Leave an email and your copy lands in your inbox when you finish it, yours to keep."}
            </p>

            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="you@example.com"
                className="flex-1 min-w-0 bg-paper-deep text-ink placeholder-ink-mute border border-rule px-3.5 py-2.5 text-sm font-light outline-none focus:border-accent transition-colors"
              />
              <button
                onClick={submit}
                disabled={state === "sending"}
                className="btn-primary !px-4 !py-2.5 shrink-0 disabled:opacity-50"
              >
                {state === "sending" ? "..." : "Send it"}
              </button>
            </div>

            {state === "error" && (
              <p className="text-[12px] text-[#FBBF24] mt-2.5">
                That did not go through. Check the address, or{" "}
                <a href={SITE.mailto} className="underline hover:text-ink">
                  email us directly
                </a>{" "}
                and it reaches the same person.
              </p>
            )}

            <button
              onClick={() => close()}
              className="text-[12px] text-ink-mute hover:text-ink-soft transition-colors mt-3.5"
            >
              No thanks, I am just looking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
