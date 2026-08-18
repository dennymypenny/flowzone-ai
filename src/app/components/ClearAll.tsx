"use client";
import { useState } from "react";

/**
 * The way out of the flow.
 *
 * Every track saves itself as it goes, which is right until somebody wants a
 * genuinely blank page: a new idea, a demo shown to a friend, a shared
 * computer. Before this button the only way to start over was per-tool
 * clearing or knowing what localStorage is, and neither is a real answer.
 *
 * It wipes every flowzone.* key in local and session storage, then reloads so
 * all four tracks come back up empty through their normal boot path. Two
 * clicks on purpose: the first arms it, the second fires, and clicking
 * anything else disarms. No browser confirm dialog, no accidental wipe.
 */
export default function ClearAll() {
  const [armed, setArmed] = useState(false);

  const wipe = () => {
    try {
      for (const store of [window.localStorage, window.sessionStorage]) {
        const doomed: string[] = [];
        for (let i = 0; i < store.length; i++) {
          const k = store.key(i);
          if (k && k.startsWith("flowzone.")) doomed.push(k);
        }
        doomed.forEach((k) => store.removeItem(k));
      }
    } catch {
      /* blocked storage means there was nothing saved to clear */
    }
    window.location.reload();
  };

  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        className="text-sm text-ink-mute hover:text-ink font-light underline decoration-rule underline-offset-4 transition-colors"
      >
        Clear everything, start fresh
      </button>
    );
  }

  return (
    <span className="flex items-center gap-3 text-sm font-light">
      <span className="text-[#F0845F]">Wipes every track on this device.</span>
      <button
        type="button"
        onClick={wipe}
        className="text-[#F0845F] border border-[#F0845F66] px-3 py-1 hover:bg-[#F0845F1a] transition-colors"
      >
        Clear it all
      </button>
      <button
        type="button"
        onClick={() => setArmed(false)}
        className="text-ink-soft hover:text-ink transition-colors"
      >
        Keep my work
      </button>
    </span>
  );
}
