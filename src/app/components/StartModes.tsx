"use client";
import { useEffect, useState } from "react";
import Playground from "@/app/components/Playground";
import WorkSession from "@/app/components/WorkSession";

/**
 * Two ways in, because people arrive in two different states.
 *
 * Some want to mess about until something clicks. Some already know and want to
 * write it down properly. Forcing the first group through a questionnaire loses
 * them on question one, and forcing the second group to play with sliders wastes
 * their time.
 *
 * Flow Mode leads, because it is the one that gives somebody an idea when they
 * did not arrive with one, and both save separately so neither run is ever lost
 * by switching.
 */

const KEY = "flowzone.mode.v1";

const MODES = [
  {
    id: "play",
    icon: "🌊",
    name: "Flow Mode",
    blurb: "Pick a flow and build. Leave holding real files.",
  },
  {
    id: "brief",
    icon: "🧭",
    name: "Brief Mode",
    blurb: "Six questions. Leave with a brief you can hand to anyone.",
  },
];

export default function StartModes() {
  const [mode, setMode] = useState("play");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "play" || saved === "brief") setMode(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const pick = (id: string) => {
    setMode(id);
    try {
      window.localStorage.setItem(KEY, id);
    } catch {
      /* ignore */
    }
  };

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {MODES.map((m) => {
          const on = m.id === mode;
          return (
            <button
              key={m.id}
              onClick={() => pick(m.id)}
              aria-pressed={on}
              className="text-left border p-5 transition-colors"
              style={{
                borderColor: on ? "#5B8CFF" : "#1D2942",
                background: on ? "#101A2C" : "transparent",
              }}
            >
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xl leading-none">{m.icon}</span>
                <span className="font-display text-lg">{m.name}</span>
                {on && (
                  <span className="ml-auto text-[10px] font-medium uppercase tracking-label text-accent">
                    Open
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-soft font-light leading-relaxed">{m.blurb}</p>
            </button>
          );
        })}
      </div>

      {mode === "play" ? <Playground /> : <WorkSession />}
    </div>
  );
}
