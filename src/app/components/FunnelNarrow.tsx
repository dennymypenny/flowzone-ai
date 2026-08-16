"use client";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

/**
 * The narrowing funnel.
 *
 * One question at a time, tap to answer, and every answer draws another,
 * narrower bar under the last: broad idea at the top, sharp brief at the
 * bottom, the same shape as any good hierarchy. At the point of the
 * funnel the answers become an action: the right track opens, or the
 * video maker, or the intake, already knowing what you told it.
 */

type Q = {
  id: string;
  ask: string;
  options: string[];
};

const QUESTIONS: Q[] = [
  {
    id: "who",
    ask: "Who is it for?",
    options: ["people nearby", "people online", "a niche who gets it", "everyone"],
  },
  {
    id: "have",
    ask: "What exists so far?",
    options: ["just the idea", "an audience", "a name", "paying customers"],
  },
  {
    id: "first",
    ask: "What should exist first?",
    options: ["the brief", "the design", "a reel", "a one-pager", "the site"],
  },
];

const COLORS = ["#1E3A8A", "#5B9BF9", "#C6E4F8", "#5B8CFF"];
const KEY = "flowzone.funnel.v1";

export default function FunnelNarrow({ topic }: { topic: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || {});
        setDone(Boolean(parsed.done));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const idx = QUESTIONS.findIndex((q) => !answers[q.id]);
  const current = idx === -1 ? null : QUESTIONS[idx];

  const answer = (q: Q, opt: string) => {
    const next = { ...answers, [q.id]: opt };
    setAnswers(next);
    const finished = QUESTIONS.every((qq) => next[qq.id]);
    if (finished) setDone(true);
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ answers: next, done: finished }));
    } catch {
      /* ignore */
    }
  };

  const reset = () => {
    setAnswers({});
    setDone(false);
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  };

  /** The point of the funnel: answers become the next move. */
  const act = () => {
    const first = answers.first;
    if (first === "a reel") {
      document.getElementById("make-video")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (first === "the site") {
      window.location.href = "/intake";
      return;
    }
    // the brief, the design, a one-pager -> open the matching track
    const track = first === "the brief" ? "brief" : first === "a one-pager" ? "writing" : "design";
    try {
      window.localStorage.setItem("flowzone.track.v2", track);
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  // levels answered so far, drawn as a narrowing stack
  const levels = QUESTIONS.filter((q) => answers[q.id]);

  return (
    <div className="mt-8 max-w-xl">
      {/* the funnel so far: each answer a narrower bar */}
      <div className="space-y-1.5 mb-6">
        <div
          className="mx-auto rounded-md px-3 py-1.5 text-center text-[12px] font-medium text-white"
          style={{ width: "100%", background: COLORS[0] }}
        >
          {topic}
        </div>
        {levels.map((q, i) => (
          <div
            key={q.id}
            className="mx-auto rounded-md px-3 py-1.5 text-center text-[12px] font-medium"
            style={{
              width: `${86 - i * 18}%`,
              background: COLORS[(i + 1) % COLORS.length],
              color: i >= 1 ? "#0B1322" : "#FFFFFF",
              animation: "ideain 0.5s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            {answers[q.id]}
          </div>
        ))}
      </div>

      {current && (
        <div key={current.id} style={{ animation: "ideain 0.5s cubic-bezier(0.22,1,0.36,1) both" }}>
          <p className="label mb-3">
            Narrow it · {idx + 1} of {QUESTIONS.length}
          </p>
          <p className="font-display text-xl mb-4">{current.ask}</p>
          <div className="flex flex-wrap gap-2">
            {current.options.map((opt) => (
              <button
                key={opt}
                onClick={() => answer(current, opt)}
                className="text-sm border border-rule text-ink-soft px-4 py-2.5 rounded-xl hover:text-ink hover:border-accent hover:scale-[1.03] active:scale-[0.97] transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {done && (
        <div
          className="panel p-6 mt-2"
          style={{ animation: "ideain 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          <p className="label mb-3">Narrowed to a point</p>
          <p className="text-ink font-light leading-relaxed mb-5">
            {topic}, for {answers.who}, starting from {answers.have}, and the first
            thing to exist is <span className="text-accent">{answers.first}</span>.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <button onClick={act} className="btn-primary shine !px-5 !py-2.5 text-sm">
              Make {answers.first} <span className="arrow">→</span>
            </button>
            <button onClick={reset} className="btn-ghost !px-4 !py-2.5 text-xs">
              Start the narrowing over
            </button>
          </div>

          {/* The sell, made of their own answers */}
          <div className="border-t border-rule pt-5">
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-4">
              Or skip the homework entirely. This exact thing, {answers.first} and
              the rest of it, built for you and live in days.{" "}
              <span className="text-ink">Flat, from $600.</span>
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={
                  SITE.phone
                    ? `sms:${SITE.phone}?&body=${encodeURIComponent(
                        `Hi FlowZone, I want to get ${topic} moving. It is for ${answers.who}, I have ${answers.have}, and the first thing I need is ${answers.first}.`
                      )}`
                    : `mailto:${SITE.email}?subject=${encodeURIComponent(
                        `Get ${topic} moving`
                      )}&body=${encodeURIComponent(
                        `Hi FlowZone, I want to get ${topic} moving. It is for ${answers.who}, I have ${answers.have}, and the first thing I need is ${answers.first}.`
                      )}`
                }
                className="btn-primary shine !px-5 !py-2.5 text-sm"
              >
                Have us build it <span className="arrow">→</span>
              </a>
              <a href="/pricing" className="text-xs text-ink-mute hover:text-ink transition-colors">
                See the three prices first
              </a>
            </div>
            <p className="text-[11px] text-ink-mute mt-3">
              Your answers ride along in the message, so the reply you get is already specific.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
