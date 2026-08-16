"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Talking the session instead of typing it.
 *
 * Two halves, both running in the browser with no key and no per-use cost:
 *   - the question can be read out loud
 *   - the answer can be spoken, and lands in the box as text
 *
 * The second half is the one that matters. The whole premise of this tool is
 * that people know what they want and cannot write it down yet, and almost
 * everyone can say a thing they cannot type. What they say becomes the
 * transcript, and the transcript becomes the brief.
 *
 * Browser support is uneven, so the controls only appear where they will work.
 */

type Rec = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
};

function getRecognition(): Rec | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
  if (!Ctor) return null;
  try {
    return new Ctor() as Rec;
  } catch {
    return null;
  }
}

export default function VoiceSession({
  question,
  hint,
  value,
  onTranscript,
  accent,
}: {
  question: string;
  hint: string;
  value: string;
  onTranscript: (next: string) => void;
  accent: string;
}) {
  const [canSpeak, setCanSpeak] = useState(false);
  const [canHear, setCanHear] = useState(false);
  const [listening, setListening] = useState(false);
  const [reading, setReading] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");
  const rec = useRef<Rec | null>(null);
  const base = useRef("");

  useEffect(() => {
    setCanSpeak(typeof window !== "undefined" && "speechSynthesis" in window);
    setCanHear(getRecognition() !== null);
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* ignore */
      }
      try {
        rec.current?.abort();
      } catch {
        /* ignore */
      }
    };
  }, []);

  // Never leave a voice running when the question changes underneath it.
  useEffect(() => {
    stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  const stopAll = () => {
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* ignore */
    }
    try {
      rec.current?.stop();
    } catch {
      /* ignore */
    }
    setReading(false);
    setListening(false);
    setInterim("");
  };

  const read = () => {
    if (!canSpeak) return;
    if (reading) {
      stopAll();
      return;
    }
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(`${question}. ${hint}`);
      u.rate = 0.98;
      u.pitch = 1;
      // Prefer a natural local English voice where the system has one.
      const voices = synth.getVoices();
      const nice =
        voices.find((v) => /en-(US|GB)/i.test(v.lang) && /natural|neural|samantha|daniel/i.test(v.name)) ||
        voices.find((v) => /en-(US|GB)/i.test(v.lang));
      if (nice) u.voice = nice;
      u.onend = () => setReading(false);
      u.onerror = () => setReading(false);
      setReading(true);
      synth.speak(u);
    } catch {
      setReading(false);
    }
  };

  const listen = () => {
    if (!canHear) return;
    if (listening) {
      stopAll();
      return;
    }
    const r = getRecognition();
    if (!r) return;
    rec.current = r;
    base.current = value ? value.trimEnd() : "";
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";

    r.onresult = (e: any) => {
      let finalText = "";
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const chunk = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += chunk;
        else live += chunk;
      }
      if (finalText) {
        const joined = [base.current, finalText.trim()].filter(Boolean).join(" ");
        base.current = joined;
        onTranscript(joined);
      }
      setInterim(live);
    };
    r.onerror = (e: any) => {
      setError(
        e?.error === "not-allowed"
          ? "Microphone blocked. Allow it in the address bar and try again."
          : "That did not catch. Typing works too."
      );
      setListening(false);
      setInterim("");
    };
    r.onend = () => {
      setListening(false);
      setInterim("");
    };

    try {
      setError("");
      r.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  if (!canSpeak && !canHear) return null;

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2">
        {canHear && (
          <button
            onClick={listen}
            aria-pressed={listening}
            className="inline-flex items-center gap-2 text-xs border px-3.5 py-2 transition-colors"
            style={{
              borderColor: listening ? accent : "#26355A",
              color: listening ? accent : "#9AA7BE",
              background: listening ? `${accent}14` : "transparent",
            }}
          >
            <span
              className="w-1.5 h-1.5 block"
              style={{ background: listening ? accent : "#647089" }}
            />
            {listening ? "Listening, say it out loud" : "Say it instead of typing"}
          </button>
        )}

        {canSpeak && (
          <button
            onClick={read}
            aria-pressed={reading}
            className="inline-flex items-center gap-2 text-xs border border-rule text-ink-mute px-3.5 py-2 hover:text-ink-soft transition-colors"
          >
            {reading ? "Stop" : "Read it to me"}
          </button>
        )}
      </div>

      {listening && (
        <p className="text-[12px] text-ink-mute font-light mt-2.5 leading-relaxed">
          {interim ? (
            <span className="text-ink-soft">{interim}</span>
          ) : (
            "Go ahead. It writes itself into the box, and you can clean it up after."
          )}
        </p>
      )}

      {error && <p className="text-[12px] text-[#FBBF24] mt-2.5">{error}</p>}
    </div>
  );
}
