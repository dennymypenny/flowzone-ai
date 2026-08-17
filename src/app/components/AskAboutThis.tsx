"use client";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { SITE } from "@/lib/site";
import { loadRaw, saveRaw } from "@/lib/session";

/**
 * The ask, placed where somebody has just made something.
 *
 * The old way in was one button at the bottom of a funnel, long after the
 * interesting moment had passed. This is the opposite. It sits under a finished
 * thing, while they are still looking at it and still slightly unsure whether
 * it is any good, and it opens an email that already contains the thing.
 *
 * Three rules hold it up.
 *
 * It never interrupts. No overlay, no timer, no exit intent. It renders inline
 * under the work, in the same panel language as everything around it, and a
 * page with nothing made on it never shows one at all.
 *
 * It is specific. The body carries the actual name, the actual colours, the
 * actual scenes. "Here is the name I landed on, Crosstown, with these colours,
 * for a bakery" is a message a person sends. "Contact us" is not.
 *
 * It never nags. One dismiss silences every surface for good, and clicking
 * through counts as a dismiss too, because somebody who has written once does
 * not need asking again.
 */

/** One key for all of them. Dismiss anywhere, dismissed everywhere. */
const KEY = "flowzone.askaboutthis.v1";

/** Roughly what a mailto survives once the body is percent encoded. */
export const ASK_LIMIT = 1500;

const CUT_NOTE = "\n[Cut short so it fits in an email. Ask and I will send the rest.]\n";

export type AskSection = { label: string; text: string };

/**
 * Build the email body out of what somebody actually made.
 *
 * Sections are dropped in order until the budget runs out, so callers put the
 * substance first and the trimmings last. The opener and the closing question
 * are never sacrificed: without the question the reply is just a forwarded
 * document, and the question is the whole point.
 */
export function askBody(opts: {
  /** One line saying what this is. Written in their voice, not the studio's. */
  opener: string;
  /** The work itself. Falsy entries and empty text are skipped. */
  sections: Array<AskSection | null | false | undefined>;
  /** The prompt that makes them type. Ends the mail with a blank line. */
  unsure?: string;
}): string {
  const unsure = opts.unsure || "What I am not sure about:";
  const head = `Hi Denny,\n\n${opts.opener}\n`;
  const tail = `\n${unsure}\n\n\nThanks,\n`;

  let budget = ASK_LIMIT - head.length - tail.length - CUT_NOTE.length;
  const out: string[] = [];
  let cut = false;

  for (const s of opts.sections) {
    if (!s) continue;
    const text = s.text.trim();
    if (!text) continue;
    const block = `\n${s.label.toUpperCase()}\n${text}\n`;
    if (block.length <= budget) {
      out.push(block);
      budget -= block.length;
      continue;
    }
    // Half a section is still worth reading, but only if there is room for
    // enough of it to mean something. Cut on a word, never mid word.
    if (budget > 160) {
      const room = budget - s.label.length - 8;
      out.push(`\n${s.label.toUpperCase()}\n${text.slice(0, room).replace(/\s+\S*$/, "")}\n`);
      budget = 0;
    }
    cut = true;
  }

  return head + out.join("") + (cut ? CUT_NOTE : "") + tail;
}

export type AskAboutThisProps = {
  /**
   * Which surface this is, for the analytics of the future and to keep React
   * keys honest. Dismissal is shared, so this is not a storage key.
   */
  id: string;
  /** Subject line. Plain text in, encoded on the way out. */
  subject: string;
  /**
   * The message. A function stays lazy, so a caller can hand over something
   * expensive without paying for it on every keystroke.
   */
  body: string | (() => string);
  /** The one line headline. Name the thing they just made. */
  title: string;
  /** What they get back, said plainly. No promises the studio cannot keep. */
  note: string;
  /** Button words. Should describe the send, not the relationship. */
  cta?: string;
  /** Glyph from the icon set. Defaults to the chat bubble. */
  icon?: string;
  /** Tracks run their own accent. Falls back to the site accent. */
  accent?: string;
  /** Spacing, since every surface sits in a different stack. */
  className?: string;
};

export default function AskAboutThis({
  id,
  subject,
  body,
  title,
  note,
  cta = "Send it to Denny",
  icon = "chat",
  accent = "#5B8CFF",
  className = "",
}: AskAboutThisProps) {
  // Storage is read after mount, never during render, so the server and the
  // first client pass agree. Starting closed also means somebody who dismissed
  // this last week never sees it blink back on.
  const [state, setState] = useState<"hidden" | "open" | "sent">("hidden");
  const [href, setHref] = useState("");

  const build = () => {
    const text = typeof body === "function" ? body() : body;
    const url = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    setHref(url);
    return url;
  };

  useEffect(() => {
    if (loadRaw(KEY)) return;
    setState("open");
    build();
    // Built once on mount, refreshed on every hover, focus and click below, so
    // the mail always carries the version on screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    setState("hidden");
    saveRaw(KEY, "1");
  };

  if (state === "hidden") return null;

  if (state === "sent") {
    return (
      <div className={`surface p-4 ${className}`}>
        <p className="text-[13px] text-ink-soft font-light leading-relaxed">
          That opens in your email with the work already in it. Add the bit you are unsure
          about and send it. A person reads them.
        </p>
      </div>
    );
  }

  return (
    <div className={`surface p-5 ${className}`} data-ask={id}>
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 shrink-0">
          <Icon name={icon} size={20} color={accent} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="label mb-2.5">A second opinion</p>
          <p className="font-display text-base leading-snug mb-1.5">{title}</p>
          <p className="text-[13px] text-ink-soft font-light leading-relaxed mb-4">{note}</p>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={href}
              onPointerEnter={build}
              onFocus={build}
              onClick={(e) => {
                // Always rebuilt on the click itself. They may have changed a
                // colour since the last hover and the stale mail would be wrong.
                e.preventDefault();
                const url = build();
                setState("sent");
                saveRaw(KEY, "1");
                window.location.href = url;
              }}
              className="btn-primary shine !px-4 !py-2.5 text-xs"
            >
              {cta} <span className="arrow">→</span>
            </a>
            <button
              type="button"
              onClick={close}
              className="btn text-ink-mute hover:text-ink-soft !px-3 text-xs"
            >
              No thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
