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
  const stepRef = useRef(0);

  /* The vibe used to be frozen at the moment the music started, so dragging a
     slider mid-track did nothing until you stopped and started again. Live
     values live in a ref and the scheduler reads them on every note. */
  const vibe = useRef({ seed, energy, era, temp });
  vibe.current = { seed, energy, era, temp };

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
        Boolean((window as any).AudioContext || (window as any).webkitAudioContext)
    );
  }, []);

  const stop = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    const m = masterRef.current;
    const c = ctxRef.current;
    /* The refs are released now rather than in the timeout. Stopping and
       starting again inside the fade used to let the old timeout null out the
       refs belonging to the new context, which killed the music silently. */
    ctxRef.current = null;
    masterRef.current = null;
    setPlaying(false);
    if (!c) return;
    if (m) {
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
        c.close();
      } catch {
        /* ignore */
      }
    }, 420);
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
    // Safari hands back a suspended context, and this call is inside the click.
    try {
      const woke = ctx.resume?.();
      if (woke && typeof woke.catch === "function") woke.catch(() => {});
    } catch {
      /* silence is better than a thrown toggle */
    }

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 1.2);
    master.connect(ctx.destination);
    masterRef.current = master;

    // A little room, so it does not sound like a test tone.
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900 + (vibe.current.energy / 100) * 2600;
    filter.Q.value = 0.6;
    filter.connect(master);

    const rand = mulberry32(vibe.current.seed);
    // Drawn once, exactly as before, so the same seed still sounds the same.
    const jitter = rand() * 14;
    // Read fresh every note, so a slider move is heard on the next one.
    const shape = () => {
      const v = vibe.current;
      const scaleName = v.era > 66 ? "bright" : v.era > 33 ? "calm" : "moody";
      return {
        scale: SCALES[scaleName],
        root: 138 + (v.temp / 100) * 60 + jitter, // roughly C#3 upward
        beat: 60 / (52 + (v.energy / 100) * 46), // 52 to 98 bpm
        era: v.era,
        energy: v.energy,
      };
    };
    const first = shape();
    const root = first.root;

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
      /* Safari keeps stopped nodes alive while they are still connected, so a
         long session used to grow a graph it never let go of. */
      o.onended = () => {
        try {
          o.disconnect();
          g.disconnect();
        } catch {
          /* ignore */
        }
      };
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

    stepRef.current = 0;

    /* Notes used to fire from a setTimeout that ran at the moment the note was
       meant to sound, so anything busy on the main thread pushed the beat late
       and you heard the page struggling. Now the timer only looks ahead and
       hands the audio clock absolute times, which it keeps on its own thread.
       LOOKAHEAD is how far ahead notes get booked, TICK is how often we check. */
    const LOOKAHEAD = 0.7;
    const TICK = 200;
    const MAX_PER_TICK = 4; // a stalled tab must not dump a minute of notes at once
    let nextAt = ctx.currentTime + 0.15;

    const plan = () => {
      const c = ctxRef.current;
      if (!c) return;
      let made = 0;
      while (nextAt < c.currentTime + LOOKAHEAD && made < MAX_PER_TICK) {
        const s = shape();
        // The pad and the filter follow the sliders too, not just the melody.
        padA.frequency.setTargetAtTime(s.root / 2, nextAt, 0.2);
        padB.frequency.setTargetAtTime((s.root / 2) * 1.005, nextAt, 0.2);
        filter.frequency.setTargetAtTime(900 + (s.energy / 100) * 2600, nextAt, 0.2);

        const deg = s.scale[Math.floor(rand() * s.scale.length)];
        const oct = rand() > 0.78 ? 2 : 1;
        const freq = s.root * oct * Math.pow(2, deg / 12);
        voice(freq, nextAt, 0.9 + rand() * 1.4, 0.055 + (s.energy / 100) * 0.05, s.era > 66 ? "triangle" : "sine");

        // An occasional fifth above, which is what stops it sounding random.
        if (stepRef.current % 4 === 0) {
          voice(freq * 1.5, nextAt + s.beat * 0.5, 1.1, 0.03, "sine");
        }
        stepRef.current++;
        // Tempo is read fresh each note, so a slider move lands within a bar.
        nextAt += s.beat * 2;
        made++;
      }
      // A dropped-out tab comes back to the present rather than catching up.
      if (nextAt < c.currentTime) nextAt = c.currentTime + 0.1;
      timer.current = window.setTimeout(plan, TICK);
    };

    plan();
    setPlaying(true);
  }, []);

  const toggle = useCallback(() => (playing ? stop() : start()), [playing, start, stop]);

  // Never leave audio running behind a closed tab or a changed page.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden" && ctxRef.current) stop();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      if (timer.current) window.clearTimeout(timer.current);
      try {
        ctxRef.current?.close();
      } catch {
        /* ignore */
      }
    };
  }, [stop]);

  return { playing, toggle, supported };
}
