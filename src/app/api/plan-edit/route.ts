import { NextRequest, NextResponse } from "next/server";

/**
 * Editing a reel plan by asking for it.
 *
 * The important part is that this returns structured edits, not prose. A chat
 * that replies "sure, I have shortened the hook" and changes nothing is worse
 * than no chat at all, so the model is required to answer with the beats
 * themselves and the client applies them directly.
 *
 * Runs on the Groq key already in the project, whose free tier costs nothing.
 * When there is no key, or the call fails, or the reply is not usable JSON, a
 * local rule based editor handles the common instructions instead. The feature
 * never becomes a bill and never becomes a dead button.
 */

type Beat = { secs: number; say: string; show: string; text: string };

const SYSTEM = `You edit short-form video plans. You always reply with JSON only, no prose, no code fences.

Reply shape:
{"beats":[{"secs":number,"say":string,"show":string,"text":string}],"caption":string,"note":string}

Rules:
- Return the COMPLETE list of beats after your edit, not just changed ones.
- "say" is spoken words. "show" is what is on camera. "text" is words burned on screen, six words maximum.
- Keep a reel under 60 seconds total unless told otherwise.
- "note" is one short sentence describing what you changed, for a human to read.
- Never invent facts about the business. Work only with what the plan already says.
- Never use em dashes. Never use exclamation marks. Do not gush.`;

/** Rule based editing, so the feature works with no key and no network. */
function localEdit(beats: Beat[], caption: string, instruction: string) {
  const m = instruction.toLowerCase();
  let note = "";
  let next = beats.map((b) => ({ ...b }));

  if (/short|tight|cut|trim|faster|less time/.test(m)) {
    next = next.map((b) => ({ ...b, secs: Math.max(2, Math.round(b.secs * 0.7)) }));
    note = "Trimmed every beat by about a third.";
  } else if (/long|slow|more time|expand/.test(m)) {
    next = next.map((b) => ({ ...b, secs: Math.round(b.secs * 1.35) }));
    note = "Gave every beat more room.";
  } else if (/add|another beat|one more/.test(m)) {
    next.push({ secs: 5, say: "", show: "", text: "" });
    note = "Added an empty beat at the end.";
  } else if (/remove last|delete last|drop last/.test(m)) {
    next = next.slice(0, -1);
    note = "Removed the last beat.";
  } else if (/reverse|flip|other order/.test(m)) {
    next = next.reverse();
    note = "Reversed the order of the beats.";
  } else if (/hook/.test(m) && next.length) {
    next[0] = { ...next[0], secs: Math.min(next[0].secs, 3) };
    note = "Tightened the opening beat so the hook lands faster.";
  } else {
    note = "The assistant is unavailable right now, so nothing was changed. Try: make it shorter, add a beat, or reverse the order.";
    return { beats, caption, note, applied: false };
  }
  return { beats: next, caption, note, applied: true };
}

function clean(v: unknown, max: number): string {
  return String(v ?? "").replace(/[—]/g, ",").slice(0, max);
}

export async function POST(req: NextRequest) {
  let body: { beats?: Beat[]; caption?: string; instruction?: string; topic?: string; format?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  const beats = Array.isArray(body.beats) ? body.beats.slice(0, 20) : [];
  const caption = typeof body.caption === "string" ? body.caption : "";
  const instruction = (body.instruction || "").trim().slice(0, 500);

  if (!instruction) {
    return NextResponse.json({ ok: false, error: "no instruction" }, { status: 400 });
  }

  if (process.env.GROQ_API_KEY) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          max_tokens: 1200,
          temperature: 0.4,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM },
            {
              role: "user",
              content: `Topic: ${body.topic || "not given"}
Format: ${body.format || "not given"}
Current caption: ${caption || "(empty)"}
Current beats:
${JSON.stringify(beats, null, 1)}

Instruction: ${instruction}`,
            },
          ],
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data.choices?.[0]?.message?.content;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.beats) && parsed.beats.length) {
            const out: Beat[] = parsed.beats.slice(0, 20).map((b: Record<string, unknown>) => ({
              secs: Math.max(1, Math.min(120, Math.round(Number(b.secs) || 5))),
              say: clean(b.say, 400),
              show: clean(b.show, 300),
              text: clean(b.text, 60),
            }));
            return NextResponse.json({
              ok: true,
              beats: out,
              caption: typeof parsed.caption === "string" ? clean(parsed.caption, 800) : caption,
              note: clean(parsed.note, 200) || "Updated the plan.",
              applied: true,
              by: "assistant",
            });
          }
        }
      }
    } catch (e) {
      console.error("[FlowZone] plan-edit fell back to local rules:", e);
    }
  }

  const fb = localEdit(beats, caption, instruction);
  return NextResponse.json({ ok: true, ...fb, by: "rules" });
}
