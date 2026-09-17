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
  "w-full bg-white/[0.05] text-ink placeholder-ink-mute border border-white/[0.08] rounded-[18px] px-5 py-3.5 text-[15px] focus:outline-none focus:border-accent/70 transition-colors";

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

  const pill = { "--radius-control": "999px" } as React.CSSProperties;

  return (
    <>
      {tab && !open && !quiet && (
        <button
          onClick={show}
          className="fz-sample-tab fixed z-40 left-4 bottom-4 md:left-6 md:bottom-6 group"
          aria-label="Get a free graphic"
        >
          <span className="fz-bob flex items-center gap-2.5 rounded-full pl-2 pr-5 py-2 text-[14px] font-semibold text-white bg-[linear-gradient(135deg,#4C7BE8,#3D6FE8_45%,#2BB39A)] shadow-[0_14px_36px_-10px_rgba(76,123,232,0.75),inset_0_1px_0_rgba(255,255,255,0.35)] transition-transform duration-300 group-hover:scale-[1.06]">
            <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/20" aria-hidden>
              <span className="fz-sample-ping absolute inset-1 rounded-full bg-white/40" />
              <svg className="relative w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 12h16M12 4v16" strokeLinecap="round" />
              </svg>
            </span>
            Get a free graphic
          </span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center md:p-6">
          <div className="fz-sample-veil absolute inset-0 bg-[rgba(4,8,20,0.66)] backdrop-blur-[10px]" onClick={close} aria-hidden />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="fz-sample-title"
            className="fz-sample-card relative w-full md:max-w-[880px] max-h-[94vh] overflow-y-auto rounded-t-[32px] md:rounded-[34px] p-2.5 md:p-3 bg-[linear-gradient(160deg,rgba(26,40,72,0.97),rgba(12,20,38,0.98))] border border-white/[0.09] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9),0_0_80px_-30px_rgba(91,140,255,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] md:grid md:grid-cols-[1fr_1.05fr] md:gap-3"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute z-20 top-4 right-4 md:top-5 md:right-5 w-11 h-11 md:w-10 md:h-10 rounded-full bg-white text-[#0B1322] shadow-[0_6px_18px_-4px_rgba(0,0,0,0.6)] ring-1 ring-black/10 md:bg-white/[0.07] md:text-ink-soft md:shadow-none md:ring-0 md:hover:bg-white/[0.14] md:hover:text-ink flex items-center justify-center transition-all duration-300 hover:rotate-90"
            >
              <svg className="w-5 h-5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>

            {/* The pitch side: a soft inner bubble with light drifting through it. */}
            <div className="relative overflow-hidden rounded-[26px] md:rounded-[26px] px-6 pt-7 pb-5 md:p-9 bg-[linear-gradient(155deg,#1B3160,#12203F_55%,#0F2A33)]">
              <span className="fz-float-a pointer-events-none absolute -top-16 -left-10 w-56 h-56 rounded-full bg-[#5B8CFF]/35 blur-3xl" aria-hidden />
              <span className="fz-float-b pointer-events-none absolute -bottom-20 -right-10 w-64 h-64 rounded-full bg-[#34D399]/20 blur-3xl" aria-hidden />
              <span className="fz-float-c pointer-events-none absolute top-1/3 right-8 w-24 h-24 rounded-full bg-[#FBBF24]/10 blur-2xl" aria-hidden />
              {/* A few glassy bubbles. */}
              <span className="fz-bubble pointer-events-none absolute top-8 right-20 w-5 h-5 rounded-full border border-white/25 bg-white/[0.06]" aria-hidden />
              <span className="fz-bubble pointer-events-none absolute top-24 right-10 w-3 h-3 rounded-full border border-white/20 bg-white/[0.05]" style={{ animationDelay: "1.2s" }} aria-hidden />
              <span className="fz-bubble pointer-events-none absolute bottom-24 left-6 w-4 h-4 rounded-full border border-white/20 bg-white/[0.05] hidden md:block" style={{ animationDelay: "2.1s" }} aria-hidden />

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] border border-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-own" aria-hidden />
                  Free sample
                </span>
                <h2 id="fz-sample-title" className="font-display mt-4 md:mt-5 text-[24px] md:text-[38px] leading-[1.05] text-ink">
                  Try the studio.
                  <br />
                  <span className="bg-[linear-gradient(90deg,#A8C4FF,#C6E4F8_55%,#7EE8C6)] bg-clip-text text-transparent">
                    Your first graphic <br className="hidden md:inline" />
                    is on us.
                  </span>
                </h2>
                <p className="hidden md:block mt-4 text-[15px] leading-relaxed text-ink-soft max-w-[36ch]">
                  Tell us what you need. We make it and send it back, so you can see how we work before you spend a dollar.
                </p>

                {/* Real pieces from the studio, floating. */}
                <div className="hidden md:block relative h-[190px] mt-7" aria-hidden>
                  <span className="fz-print-wrap absolute left-[2%] top-[20px] w-[46%]" style={{ animationDelay: "0s" }}>
                    <img src="/assets/sample-kalender.jpg" alt="" className="fz-sample-print w-full rounded-[18px] ring-1 ring-white/15 shadow-[0_26px_50px_-18px_rgba(0,0,0,0.85)] -rotate-[8deg]" style={{ animationDelay: "120ms" }} />
                  </span>
                  <span className="fz-print-wrap absolute right-[4%] top-0 w-[34%]" style={{ animationDelay: "0.8s" }}>
                    <img src="/assets/sample-mahj.jpg" alt="" className="fz-sample-print w-full rounded-[22px] ring-1 ring-white/15 shadow-[0_26px_50px_-18px_rgba(0,0,0,0.85)] rotate-[7deg]" style={{ animationDelay: "220ms" }} />
                  </span>
                  <span className="fz-print-wrap absolute left-[15%] bottom-0 w-[66%]" style={{ animationDelay: "1.6s" }}>
                    <img src="/assets/sample-crg.jpg" alt="" className="fz-sample-print w-full rounded-[16px] ring-1 ring-white/20 shadow-[0_30px_60px_-16px_rgba(0,0,0,0.9)] -rotate-1" style={{ animationDelay: "320ms" }} />
                  </span>
                </div>

                <ul className="mt-4 md:mt-7 flex flex-wrap gap-2">
                  {["No card, no call", "Yours to keep", "Back in about 2 days"].map((t) => (
                    <li key={t} className="flex items-center gap-1.5 rounded-full bg-white/[0.07] border border-white/[0.08] pl-2 pr-3 py-1.5 text-[12px] md:text-[13px] font-medium text-ink-soft">
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-own/20">
                        <svg className="w-2.5 h-2.5 text-own" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" aria-hidden>
                          <path d="M5 12.5l4.2 4.2L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* The form side. */}
            <div className="px-4 pb-5 pt-5 md:px-6 md:pt-7 md:pb-6">
              {sent ? (
                <div className="flex flex-col items-center text-center justify-center h-full min-h-[340px] px-4">
                  <span className="fz-pop relative w-20 h-20 rounded-full bg-[linear-gradient(135deg,#34D399,#2DD4BF)] flex items-center justify-center shadow-[0_18px_50px_-12px_rgba(52,211,153,0.7),inset_0_2px_0_rgba(255,255,255,0.4)]">
                    <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" aria-hidden>
                      <path d="M5 12.5l4.2 4.2L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="fz-ring absolute inset-0 rounded-full border-2 border-own/60" aria-hidden />
                  </span>
                  <h3 className="fz-sample-done font-display mt-7 text-[30px] leading-tight text-ink">
                    {sent === "sample" ? "It is in the queue." : "You are on the list."}
                  </h3>
                  <p className="fz-sample-done mt-3 text-[15px] leading-relaxed text-ink-soft max-w-[34ch]">
                    {sent === "sample"
                      ? `Your graphic comes back to ${form.email}, usually within two days. A receipt is on its way now.`
                      : "Short studio notes and free graphic drops. Nothing weekly for the sake of it."}
                  </p>
                  <button onClick={close} style={pill} className="btn-ghost mt-8 px-7">
                    Back to the site
                  </button>
                </div>
              ) : (
                <>
                  {/* Sliding pill switch. */}
                  <div className="relative grid grid-cols-2 w-full max-w-[330px] p-1 rounded-full bg-white/[0.06] border border-white/[0.07] text-[13px] font-semibold" role="tablist">
                    <span
                      className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-[linear-gradient(135deg,#5B8CFF,#3D6FE8)] shadow-[0_8px_22px_-8px_rgba(91,140,255,0.9),inset_0_1px_0_rgba(255,255,255,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                      style={{ transform: mode === "list" ? "translateX(100%)" : "none" }}
                      aria-hidden
                    />
                    {(
                      [
                        ["sample", "Free graphic"],
                        ["list", "Email list"],
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
                        className={`relative z-10 py-2.5 rounded-full transition-colors duration-300 ${mode === id ? "text-white" : "text-ink-soft hover:text-ink"}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <form key={mode} onSubmit={submit} className="fz-sample-done mt-6 space-y-4" noValidate>
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
                          <p className="text-[13px] font-semibold text-ink-soft mb-2.5 pl-1">What should we make?</p>
                          <div className="flex flex-wrap gap-2">
                            {KINDS.map((k) => (
                              <button
                                type="button"
                                key={k.id}
                                onClick={() => set("kind", k.id)}
                                aria-pressed={form.kind === k.id}
                                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-95 ${
                                  form.kind === k.id
                                    ? "bg-white text-[#0C1424] shadow-[0_8px_24px_-8px_rgba(168,196,255,0.8)] scale-[1.04]"
                                    : "bg-white/[0.06] border border-white/[0.08] text-ink-soft hover:bg-white/[0.11] hover:text-ink"
                                }`}
                              >
                                {k.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <textarea
                          id="fz-idea"
                          aria-label="Describe the graphic"
                          ref={(el) => {
                            firstField.current = el;
                          }}
                          rows={3}
                          value={form.idea}
                          onChange={(e) => set("idea", e.target.value)}
                          className={`${field} !rounded-[22px] resize-none`}
                          placeholder="Describe it. A launch post for our new cold brew, bold and summery, orange and cream."
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <input id="fz-name" aria-label="Name" type="text" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} className={`${field} !rounded-full`} placeholder="Your name" />
                          <input id="fz-email" aria-label="Email" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={`${field} !rounded-full`} placeholder="Email" />
                        </div>

                        <input id="fz-brand" aria-label="Brand, Instagram or website (optional)" type="text" value={form.brand} onChange={(e) => set("brand", e.target.value)} className={`${field} !rounded-full`} placeholder="@yourbrand or website (optional)" />

                        <button
                          type="button"
                          role="switch"
                          aria-checked={form.list}
                          onClick={() => set("list", !form.list)}
                          className="flex items-center gap-3 text-left text-[13px] text-ink-soft pl-1"
                        >
                          <span className={`relative shrink-0 w-10 h-6 rounded-full transition-colors duration-300 ${form.list ? "bg-own" : "bg-white/15"}`}>
                            <span
                              className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                              style={{ transform: form.list ? "translateX(16px)" : "none" }}
                            />
                          </span>
                          Send me free graphic drops too
                        </button>
                      </>
                    ) : (
                      <div className="pt-2">
                        <h3 className="font-display text-[28px] leading-tight text-ink">Not ready yet?</h3>
                        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                          Get studio notes, before and after builds and the next free graphic drop. Nothing weekly for the sake of it.
                        </p>
                        <input
                          id="fz-list-email"
                          aria-label="Email"
                          ref={(el) => {
                            firstField.current = el;
                          }}
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          className={`${field} !rounded-full mt-6`}
                          placeholder="you@company.com"
                        />
                      </div>
                    )}

                    {error && (
                      <p role="alert" className="fz-sample-done rounded-full bg-price/10 px-4 py-2 text-[13px] text-price">
                        {error}
                      </p>
                    )}

                    <button type="submit" disabled={busy} style={pill} className="btn-primary w-full justify-center !py-4 !text-[15px] !font-semibold disabled:opacity-70">
                      {busy ? "Sending..." : mode === "sample" ? "Get my free graphic" : "Join the list"}
                      {!busy && <span className="arrow ml-1">→</span>}
                    </button>
                    <p className="text-center text-[12px] text-ink-mute">
                      {mode === "sample" ? "One per business. A real person reads every request." : "No spam. One click to leave."}
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
