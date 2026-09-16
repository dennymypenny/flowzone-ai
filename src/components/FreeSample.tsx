"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

/**
 * The free sample pop up.
 *
 * One free graphic, no card and no call, in exchange for an email address.
 * A second door in the same card takes just the address for the list, for the
 * visitor who is not ready to ask for anything yet.
 *
 * Manners: it waits 15 seconds or half a page of scrolling, shows once, never
 * on the ticket or legal pages, and after a close it tucks into a small tab in
 * the bottom left corner. It comes back on its own only after two weeks, and
 * never again once somebody has sent a request or joined.
 *
 * Anything can open it: link to /?sample=1 or #free-sample, or dispatch
 * window.dispatchEvent(new Event("fz:sample")).
 *
 * It is rendered only while open, so nothing sits in the page at opacity 0.
 */

const KEY = "flowzone.freesample.v1";
const QUIET_PAGES = ["/intake", "/thank-you", "/privacy", "/terms"];
const COOLDOWN = 14 * 24 * 60 * 60 * 1000;

const KINDS = [
  { id: "post", label: "Social post" },
  { id: "flyer", label: "Flyer" },
  { id: "logo", label: "Logo idea" },
  { id: "thumbnail", label: "Thumbnail or banner" },
  { id: "other", label: "Something else" },
];

type Saved = { state: "dismissed" | "done"; at: number } | null;

function read(): Saved {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}
function write(state: "dismissed" | "done") {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ state, at: Date.now() }));
  } catch {
    /* storage blocked, it simply asks again next visit */
  }
}

const field =
  "w-full bg-paper text-ink placeholder-ink-mute border border-rule rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-accent";

export default function FreeSample() {
  const pathname = usePathname() || "/";
  const quiet = QUIET_PAGES.some((p) => pathname.startsWith(p));

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(false);
  const [mode, setMode] = useState<"sample" | "list">("sample");
  const [sent, setSent] = useState<null | "sample" | "list">(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ kind: "post", idea: "", name: "", email: "", brand: "", list: true, website: "" });
  const firstField = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
  const opened = useRef(false);

  const show = useCallback(() => {
    opened.current = true;
    setTab(false);
    setOpen(true);
  }, []);

  // Deciding when to ask.
  useEffect(() => {
    const saved = read();
    const done = saved?.state === "done";
    const cooling = saved?.state === "dismissed" && Date.now() - saved.at < COOLDOWN;

    const onEvent = () => show();
    window.addEventListener("fz:sample", onEvent);

    const params = new URLSearchParams(window.location.search);
    if (params.get("sample") === "1" || window.location.hash === "#free-sample") {
      show();
      return () => window.removeEventListener("fz:sample", onEvent);
    }

    if (done || quiet) return () => window.removeEventListener("fz:sample", onEvent);
    if (cooling) {
      setTab(true);
      return () => window.removeEventListener("fz:sample", onEvent);
    }

    const timer = window.setTimeout(() => !opened.current && show(), 15000);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.5 && !opened.current) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("fz:sample", onEvent);
    };
  }, [quiet, show]);

  const close = useCallback(() => {
    setOpen(false);
    if (sent) {
      write("done");
      setTab(false);
    } else {
      write("dismissed");
      setTab(true);
    }
  }, [sent]);

  // Escape closes, the page behind holds still, the first field takes focus.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      if (window.matchMedia("(min-width: 768px)").matches) firstField.current?.focus();
    }, 260);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open, close, mode]);

  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError("");

    if (mode === "sample") {
      if (form.idea.trim().length < 10) return setError("Tell us a little more about the graphic, even one sentence.");
      if (!form.name.trim()) return setError("Add your name so we know who it is for.");
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) return setError("Check the email address.");

    setBusy(true);
    try {
      const res =
        mode === "sample"
          ? await fetch("/api/sample", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(form),
            })
          : await fetch("/api/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: form.email, source: `popup-list ${pathname}` }),
            });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error || `That did not send. Email ${SITE.email} and we will sort it out.`);
      } else {
        setSent(mode);
        write("done");
      }
    } catch {
      setError(`That did not send. Email ${SITE.email} and we will sort it out.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {tab && !open && !quiet && (
        <button
          onClick={show}
          className="fz-sample-tab fixed z-40 left-4 bottom-4 md:left-5 md:bottom-5 flex items-center gap-2.5 rounded-full bg-paper-deep/95 border border-rule pl-3 pr-4 py-2.5 text-[13px] font-semibold text-ink shadow-panel hover:border-accent transition-colors"
          aria-label="Get a free graphic"
        >
          <span className="relative flex w-2.5 h-2.5" aria-hidden>
            <span className="fz-sample-ping absolute inset-0 rounded-full bg-own" />
            <span className="relative w-2.5 h-2.5 rounded-full bg-own" />
          </span>
          Get a free graphic
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center md:p-6">
          <div className="fz-sample-veil absolute inset-0 bg-[rgba(4,8,20,0.72)] backdrop-blur-[6px]" onClick={close} aria-hidden />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="fz-sample-title"
            className="fz-sample-card relative w-full md:max-w-[900px] max-h-[94vh] overflow-y-auto rounded-t-[24px] md:rounded-[24px] bg-paper-deep border border-rule shadow-panel md:grid md:grid-cols-[1fr_1.08fr]"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute z-20 top-3.5 right-3.5 w-9 h-9 rounded-full bg-paper/80 border border-rule text-ink-soft hover:text-ink flex items-center justify-center"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>

            {/* The pitch side. */}
            <div className="relative overflow-hidden px-5 pt-6 pb-4 md:p-9 md:pb-8 bg-[radial-gradient(120%_90%_at_0%_0%,rgba(91,140,255,0.28),transparent_60%),radial-gradient(90%_70%_at_100%_100%,rgba(52,211,153,0.14),transparent_60%)] md:border-r border-rule">
              <p className="label">Free sample</p>
              <h2 id="fz-sample-title" className="font-display mt-4 text-[25px] md:text-[36px] leading-[1.06] text-ink">
                Try the studio.
                <br />
                <span className="text-accent-light">
                  Your first graphic <br className="hidden md:inline" />
                  is on us.
                </span>
              </h2>
              <p className="hidden md:block mt-4 text-[15px] leading-relaxed text-ink-soft max-w-[40ch]">
                Tell us what you need. A post, a flyer, a logo idea. We make it and send it back so you can see how we work before you spend a dollar.
              </p>

              {/* Three real pieces from the studio, fanned like prints on a desk. */}
              <div className="hidden md:block relative h-[196px] mt-8" aria-hidden>
                <img
                  src="/assets/sample-kalender.jpg"
                  alt=""
                  className="fz-sample-print absolute left-[4%] top-[18px] w-[46%] rounded-[12px] border border-white/10 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.9)] -rotate-[8deg]"
                  style={{ animationDelay: "120ms" }}
                />
                <img
                  src="/assets/sample-mahj.jpg"
                  alt=""
                  className="fz-sample-print absolute right-[6%] top-0 w-[34%] rounded-[12px] border border-white/10 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.9)] rotate-[7deg]"
                  style={{ animationDelay: "220ms" }}
                />
                <img
                  src="/assets/sample-crg.jpg"
                  alt=""
                  className="fz-sample-print absolute left-[16%] bottom-0 w-[66%] rounded-[12px] border border-white/15 shadow-[0_30px_60px_-18px_rgba(0,0,0,0.95)] rotate-[-1deg]"
                  style={{ animationDelay: "320ms" }}
                />
              </div>
              <p className="hidden md:block mt-3 text-[11px] text-ink-mute">Made in the studio: CardsRG, Mahj &amp; Coffee, Kalender.</p>

              <ul className="mt-3 md:mt-6 flex flex-wrap md:grid md:grid-cols-1 gap-x-4 gap-y-1.5 md:gap-2.5 text-[12px] md:text-[14px] text-ink-soft">
                {["No card, no call", "Yours to keep", "Back in about 2 days"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0 text-own" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                      <path d="M5 12.5l4.2 4.2L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* The form side. */}
            <div className="px-5 pb-6 pt-2 md:p-9">
              {sent ? (
                <div className="fz-sample-done flex flex-col items-start justify-center h-full min-h-[320px]">
                  <span className="w-14 h-14 rounded-full bg-own/15 border border-own/40 flex items-center justify-center">
                    <svg className="w-7 h-7 text-own" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                      <path d="M5 12.5l4.2 4.2L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h3 className="font-display mt-6 text-[28px] leading-tight text-ink">
                    {sent === "sample" ? "It is in the queue." : "You are on the list."}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft max-w-[38ch]">
                    {sent === "sample"
                      ? `A person reads every request. Your graphic comes back to ${form.email}, usually within two days. Check your inbox for the receipt.`
                      : "Short studio notes and free graphic drops. Nothing weekly for the sake of it."}
                  </p>
                  <button onClick={close} className="btn-ghost mt-8">
                    Back to the site
                  </button>
                </div>
              ) : (
                <>
                  <div className="md:mt-1 inline-flex p-1 rounded-full bg-paper border border-rule text-[13px] font-semibold" role="tablist">
                    {(
                      [
                        ["sample", "Free graphic"],
                        ["list", "Just the email list"],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        role="tab"
                        aria-selected={mode === id}
                        onClick={() => {
                          setMode(id);
                          setError("");
                        }}
                        className={`px-4 py-2 rounded-full transition-colors ${
                          mode === id ? "bg-accent-deep text-white shadow-glowbtn" : "text-ink-soft hover:text-ink"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={submit} className="mt-5 md:mt-6 space-y-3.5 md:space-y-4" noValidate>
                    {/* Humans never see this. */}
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) => set("website", e.target.value)}
                      className="!absolute !w-px !h-px !p-0 !border-0 overflow-hidden [clip:rect(0,0,0,0)]"
                      aria-hidden
                    />

                    {mode === "sample" ? (
                      <>
                        <div>
                          <p className="text-sm font-semibold text-ink-soft mb-2">What should we make?</p>
                          <div className="flex flex-wrap gap-2">
                            {KINDS.map((k) => (
                              <button
                                type="button"
                                key={k.id}
                                onClick={() => set("kind", k.id)}
                                aria-pressed={form.kind === k.id}
                                className={`px-3.5 py-2 rounded-full border text-[13px] font-medium transition-colors ${
                                  form.kind === k.id
                                    ? "border-accent bg-accent/15 text-ink"
                                    : "border-rule text-ink-soft hover:border-ink-mute hover:text-ink"
                                }`}
                              >
                                {k.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="fz-idea" className="block text-sm font-semibold text-ink-soft mb-1.5">
                            Describe it
                          </label>
                          <textarea
                            id="fz-idea"
                            ref={(el) => {
                              firstField.current = el;
                            }}
                            rows={3}
                            value={form.idea}
                            onChange={(e) => set("idea", e.target.value)}
                            className={`${field} resize-none`}
                            placeholder="A launch post for our new cold brew. Bold, summery, our colors are orange and cream."
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="fz-name" className="block text-sm font-semibold text-ink-soft mb-1.5">
                              Name
                            </label>
                            <input id="fz-name" type="text" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} className={field} placeholder="Jane Smith" />
                          </div>
                          <div>
                            <label htmlFor="fz-email" className="block text-sm font-semibold text-ink-soft mb-1.5">
                              Email
                            </label>
                            <input id="fz-email" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={field} placeholder="jane@company.com" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="fz-brand" className="block text-sm font-semibold text-ink-soft mb-1.5">
                            Brand, Instagram or website <span className="font-normal text-ink-mute">optional</span>
                          </label>
                          <input id="fz-brand" type="text" value={form.brand} onChange={(e) => set("brand", e.target.value)} className={field} placeholder="@yourbrand or yourbrand.com" />
                        </div>

                        <label className="flex items-start gap-3 text-[13px] text-ink-soft cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={form.list}
                            onChange={(e) => set("list", e.target.checked)}
                            className="mt-0.5 w-4 h-4 accent-[#5B8CFF]"
                          />
                          Also send me studio notes and free graphic drops. Unsubscribe any time.
                        </label>
                      </>
                    ) : (
                      <>
                        <h3 className="font-display text-[26px] leading-tight text-ink">Not ready yet? Stay in the loop.</h3>
                        <p className="text-[15px] leading-relaxed text-ink-soft">
                          Short studio notes, before and after builds and the next free graphic drop. Nothing weekly for the sake of it.
                        </p>
                        <div>
                          <label htmlFor="fz-list-email" className="block text-sm font-semibold text-ink-soft mb-1.5">
                            Email
                          </label>
                          <input
                            id="fz-list-email"
                            ref={(el) => {
                              firstField.current = el;
                            }}
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={(e) => set("email", e.target.value)}
                            className={field}
                            placeholder="jane@company.com"
                          />
                        </div>
                      </>
                    )}

                    {error && (
                      <p role="alert" className="text-[13px] text-price">
                        {error}
                      </p>
                    )}

                    <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-70">
                      {busy ? "Sending..." : mode === "sample" ? "Send my free graphic request" : "Join the list"}
                      {!busy && <span className="arrow ml-1">→</span>}
                    </button>
                    <p className="text-center text-[12px] text-ink-mute">
                      {mode === "sample" ? "One free graphic per business. A person reads every request." : "No spam. One click to leave."}
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
