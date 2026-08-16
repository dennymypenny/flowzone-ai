"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { mulberry32 } from "@/lib/generative";

/**
 * Music generated from the same seed as everything else.
 *
 * A brand has a sound as much as it has a colour, and hearing one is a faster
 * way to know whether "calm" or "loud" is what you actually meant than reading
 * the word. So the identity gets a piece of music too, built from its seed:
 * the mode comes from the era slider, the tempo and brightness from energy, the
 * root note from temperature.
 *
 * Web Audio only. No files to download, no licensing, nothing to pay for, and
 * it is different for every identity because the seed is.
 *
 * It never starts on its own. Audio that plays without being asked is the
 * rudest thing a website can do.
 */

type Ctx = AudioContext & { webkitAudioContext?: never };

const SCALES: Record<string, number[]> = {
  // Semitone steps from the root. Warm and open, then bright, then tense.
  calm: [0, 2, 5, 7, 9, 12, 14],
  bright: [0, 2, 4, 7, 9, 12, 16],
  moody: [0, 3, 5, 7, 10, 12, 15],
};

export function useAmbient(seed: number, energy: number, era: number, temp: number) {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const ctxRef = useRef<Ctx | null>(null);
  const timer = useRef<number | null>(null);
  const masterRef = useRef<GainNode | null>(null);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
        Boolean((window as any).AudioContext || (window as any).webkitAudioContext)
    );
  }, []);

  const stop = useCallback(() => {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    const m = masterRef.current;
    const c = ctxRef.current;
    if (m && c) {
      // Fade rather than cut, so stopping does not click.
      try {
        m.gain.cancelScheduledValues(c.currentTime);
        m.gain.setValueAtTime(m.gain.value, c.currentTime);
        m.gain.linearRampToValueAtTime(0.0001, c.currentTime + 0.35);
      } catch {
        /* ignore */
      }
    }
    window.setTimeout(() => {
      try {
        ctxRef.current?.close();
      } catch {
        /* ignore */
      }
      ctxRef.current = null;
      masterRef.current = null;
    }, 420);
    setPlaying(false);
  }, []);

  const start = useCallback(() => {
    const Ctor = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return;
    let ctx: Ctx;
    try {
      ctx = new Ctor();
    } catch {
      setSupported(false);
      return;
    }
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 1.2);
    master.connect(ctx.destination);
    masterRef.current = master;

    // A little room, so it does not sound like a test tone.
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900 + (energy / 100) * 2600;
    filter.Q.value = 0.6;
    filter.connect(master);

    const rand = mulberry32(seed);
    const scaleName = era > 66 ? "bright" : era > 33 ? "calm" : "moody";
    const scale = SCALES[scaleName];
    const root = 138 + (temp / 100) * 60 + rand() * 14; // roughly C#3 upward
    const beat = 60 / (52 + (energy / 100) * 46); // 52 to 98 bpm

    const voice = (freq: number, at: number, dur: number, gain: number, type: OscillatorType) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, at);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(gain, at + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      o.connect(g);
      g.connect(filter);
      o.start(at);
      o.stop(at + dur + 0.05);
    };

    // A held pad underneath everything.
    const padA = ctx.createOscillator();
    const padB = ctx.createOscillator();
    const padG = ctx.createGain();
    padA.type = "sine";
    padB.type = "sine";
    padA.frequency.value = root / 2;
    padB.frequency.value = (root / 2) * 1.005; // slight detune, gives it movement
    padG.gain.value = 0.1;
    padA.connect(padG);
    padB.connect(padG);
    padG.connect(filter);
    padA.start();
    padB.start();

    let step = 0;
    const tick = () => {
      const c = ctxRef.current;
      if (!c) return;
      const at = c.currentTime + 0.06;
      const deg = scale[Math.floor(rand() * scale.length)];
      const oct = rand() > 0.78 ? 2 : 1;
      const freq = root * oct * Math.pow(2, deg / 12);
      voice(freq, at, 0.9 + rand() * 1.4, 0.055 + (energy / 100) * 0.05, era > 66 ? "triangle" : "sine");

      // An occasional fifth above, which is what stops it sounding random.
      if (step % 4 === 0) {
        voice(freq * 1.5, at + beat * 0.5, 1.1, 0.03, "sine");
      }
      step++;
    };

    tick();
    timer.current = window.setInterval(tick, beat * 1000 * 2);
    setPlaying(true);
  }, [seed, energy, era, temp]);

  const toggle = useCallback(() => (playing ? stop() : start()), [playing, start, stop]);

  // Never leave audio running behind a closed tab or a changed page.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden" && ctxRef.current) stop();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      if (timer.current) window.clearInterval(timer.current);
      try {
        ctxRef.current?.close();
      } catch {
        /* ignore */
      }
    };
  }, [stop]);

  return { playing, toggle, supported };
}
