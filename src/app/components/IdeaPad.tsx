"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";

/**
 * Somewhere to start writing the idea down without committing to anything.
 * It saves to the browser as you type, so a half-finished thought survives a
 * closed tab, and when it is ready one button turns it into a prefilled email.
 *
 * Deliberately has no backend. Nothing leaves the visitor's machine until they
 * choose to send it, which is also why it can be offered with no signup.
 */

const KEY = "flowzone.ideapad.v1";

const FIELDS = [
  {
    id: "what",
    color: "#5B9BF9",
    label: "What do you want to exist?",
    hint: "A shop, a brand, a site, a system. Plain words are fine.",
    rows: 4,
  },
  {
    id: "have",
    color: "#2DD4BF",
    label: "What do you already have?",
    hint: "A name, a logo, an Instagram, a spreadsheet, customers. Or nothing yet.",
    rows: 3,
  },
  {
    id: "matters",
    color: "#A78BFA",
    label: "What has to be true for this to be worth it?",
    hint: "The thing you would be annoyed about if we got it wrong.",
    rows: 3,
  },
] as const;

type Draft = Record<string, string>;

export default function IdeaPad() {
  const [draft, setDraft] = useState<Draft>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const timer = useRef<number | null>(null);

  // Pick up anything left from last time
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setDraft(parsed.draft || {});
        if (parsed.savedAt) setSavedAt(parsed.savedAt);
      }
    } catch {
      /* a blocked or full localStorage should never break the page */
    }
    setLoaded(true);
  }, []);

  // Save as you type, debounced
  useEffect(() => {
    if (!loaded) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const stamp = new Date().toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
      try {
        window.localStorage.setItem(KEY, JSON.stringify({ draft, savedAt: stamp }));
        setSavedAt(stamp);
      } catch {
        /* ignore */
      }
    }, 600);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [draft, loaded]);

  const filled = FIELDS.filter((f) => (draft[f.id] || "").trim().length > 0).length;
  const ready = filled > 0;

  const mailto = () => {
    const body = FIELDS.map((f) => `${f.label}\n${(draft[f.id] || "").trim() || "—"}`).join(
      "\n\n"
    );
    return `mailto:${SITE.email}?subject=${encodeURIComponent(
      "My idea, from the FlowZone idea pad"
    )}&body=${encodeURIComponent(`Hi FlowZone,\n\n${body}\n\nThanks,\n`)}`;
  };

  const clear = () => {
    setDraft({});
    setSavedAt(null);
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="panel p-7 md:p-9">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-xl leading-none">📝</span>
          <p className="label">Idea pad</p>
        </div>
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-6 h-[3px] block transition-colors duration-300"
              style={{ background: i < filled ? FIELDS[i].color : "#1D2942" }}
            />
          ))}
          <p className="text-[11px] font-medium uppercase tracking-label text-ink-mute ml-2">
            {filled} of 3
          </p>
        </div>
      </div>

      <h3 className="font-display text-2xl md:text-3xl mb-3">
        Start it now. Finish it whenever.
      </h3>
      <p className="text-sm text-ink-soft font-light leading-relaxed max-w-reading mb-8">
        Write as much or as little as you want. It saves in your browser as you type,
        so you can close this and come back to it. Nothing is sent anywhere until you
        press the button.
      </p>

      <div className="space-y-6">
        {FIELDS.map((f) => (
          <div key={f.id}>
            <label
              htmlFor={`idea-${f.id}`}
              className="block text-sm mb-1.5"
              style={{ color: f.color }}
            >
              {f.label}
            </label>
            <p className="text-[13px] text-ink-mute font-light mb-2.5">{f.hint}</p>
            <textarea
              id={`idea-${f.id}`}
              rows={f.rows}
              value={draft[f.id] || ""}
              onChange={(e) => setDraft({ ...draft, [f.id]: e.target.value })}
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light leading-relaxed outline-none focus:border-accent transition-colors resize-none"
              placeholder="Type here..."
            />
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-rule flex flex-wrap items-center justify-between gap-4">
        <p className="text-[13px] text-ink-mute font-light">
          {savedAt ? `Saved to this browser · ${savedAt}` : "Saves as you type"}
        </p>
        <div className="flex flex-wrap gap-3">
          {ready && (
            <button
              onClick={clear}
              className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4"
            >
              Clear
            </button>
          )}
          <a
            href={ready ? mailto() : undefined}
            aria-disabled={!ready}
            className={`btn-primary ${ready ? "" : "opacity-40 pointer-events-none"}`}
          >
            Send it and let us take it from here <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
