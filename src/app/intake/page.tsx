"use client";
import { useState, Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { readCart, clearCart, cartTotal, money } from "@/app/components/cart";
import { SITE } from "@/lib/site";
import Icon from "@/components/Icon";

/**
 * The intake, rebuilt Sep 23 2026 as one screen with no popups.
 *
 * 1. Pick what you need from five grouped areas, as many as you like.
 * 2. The best-fit build is worked out on every click, in the browser, and the
 *    ticket preview fills itself in as you go. Nothing waits on the network.
 * 3. Name, email, business, optional notes, send.
 *
 * The API still gets the same five fields. The picks, timeline and starting
 * point are written into `description` as a short brief, so the studio email
 * reads like a ticket and nobody has to type a paragraph.
 *
 * Name, email and business are remembered in this browser (try/catch, never
 * required) so a second ticket fills itself in. Legacy ?build= and ?service=
 * links and the cart handoff still preselect.
 */

type Build = {
  key: string;
  icon: string;
  c: string;
  name: string;
  one: string;
  from: string;
};

const builds: Build[] = [
  { key: "identity", icon: "palette", c: "#4C7BE8", name: "The Identity Build", one: "Your logo, colors and words. A brand people remember.", from: "From $500" },
  { key: "site", icon: "compass", c: "#5B9BF9", name: "The Site Build", one: "A website that looks legit and turns visitors into customers.", from: "From $500" },
  { key: "full", icon: "rocket", c: "#5B8CFF", name: "The Full Build", one: "Brand, site and system, wired together.", from: "From $1,500" },
  { key: "storefront", icon: "box", c: "#F0845F", name: "The Storefront Build", one: "An online store. Cart, checkout, money in your account.", from: "From $2,500" },
  { key: "engine", icon: "bolt", c: "#34D399", name: "The Engine Build", one: "Follow-ups, booking and invoicing that run themselves.", from: "From $500" },
  { key: "small", icon: "scissors", c: "#FBBF24", name: "A Small Job", one: "A reel, a logo, a design, a page, a form, a fix.", from: "From $49.99" },
];

const NOT_SURE = "Not sure yet";
const NOT_SURE_BUILD: Build = {
  key: "unsure",
  icon: "chat",
  c: "#93A2BC",
  name: NOT_SURE,
  one: "Tell us the idea and we will name the build for you.",
  from: "Free quote",
};

type GroupKey = "brand" | "site" | "sell" | "system" | "video";
type Pick = { label: string; small?: boolean };

/** The five areas. Each pick is small (a quick job on its own) or not. */
const GROUPS: { key: GroupKey; title: string; line: string; icon: string; c: string; picks: Pick[] }[] = [
  {
    key: "brand",
    title: "Brand and look",
    line: "How people recognize you",
    icon: "palette",
    c: "#4C7BE8",
    picks: [
      { label: "Logo" },
      { label: "Colors and fonts" },
      { label: "Brand refresh" },
      { label: "Social graphics", small: true },
      { label: "Flyers and print", small: true },
    ],
  },
  {
    key: "site",
    title: "Website",
    line: "Where people decide",
    icon: "compass",
    c: "#5B9BF9",
    picks: [
      { label: "New website" },
      { label: "Redesign" },
      { label: "Landing page", small: true },
      { label: "Fix or speed up", small: true },
      { label: "Show up on Google" },
    ],
  },
  {
    key: "sell",
    title: "Selling online",
    line: "Getting paid without the back and forth",
    icon: "box",
    c: "#F0845F",
    picks: [
      { label: "Online store" },
      { label: "Checkout and payments" },
      { label: "Product drops" },
      { label: "Move sales off DMs" },
    ],
  },
  {
    key: "system",
    title: "Behind the scenes",
    line: "What keeps running after launch",
    icon: "bolt",
    c: "#34D399",
    picks: [
      { label: "Booking" },
      { label: "Follow-up emails" },
      { label: "Invoicing" },
      { label: "Email list" },
      { label: "Forms that send", small: true },
    ],
  },
  {
    key: "video",
    title: "Video and motion",
    line: "Something people stop scrolling for",
    icon: "clapper",
    c: "#FBBF24",
    picks: [
      { label: "Promo reel", small: true },
      { label: "Logo animation", small: true },
      { label: "Ad for social", small: true },
    ],
  },
];

const TIMELINES = ["As soon as possible", "This month", "Next few months", "Just exploring"];
const STARTS = ["Starting from scratch", "I have something, make it better"];

/** Picks that a ?build= link starts with, so the preview is never empty. */
const BUILD_STARTER: Record<string, string[]> = {
  "The Identity Build": ["Logo", "Colors and fonts"],
  "The Site Build": ["New website"],
  "The Storefront Build": ["Online store"],
  "The Engine Build": ["Booking", "Follow-up emails"],
  "The Full Build": ["Logo", "New website", "Booking"],
};

/** Legacy pricing-page links: /intake?service=Starter|Growth|Scale|Not sure. */
const legacyMap: Record<string, string> = {
  starter: "The Site Build",
  growth: "The Storefront Build",
  scale: NOT_SURE,
  "not sure": NOT_SURE,
};

const pickIndex = new Map<string, { group: GroupKey; small: boolean }>();
GROUPS.forEach((g) => g.picks.forEach((p) => pickIndex.set(p.label, { group: g.key, small: !!p.small })));

/** The whole recommendation, run on every click. Plain rules, no guessing. */
function bestFit(picked: string[]): string {
  if (picked.length === 0) return "";
  const info = picked.map((p) => pickIndex.get(p)).filter(Boolean) as { group: GroupKey; small: boolean }[];
  const groups = new Set(info.map((i) => i.group));
  if (info.every((i) => i.small)) return "A Small Job";
  if (groups.has("sell")) return "The Storefront Build";
  const core = ["brand", "site", "system"].filter((g) => info.some((i) => i.group === g && !i.small));
  if (core.length >= 2) return "The Full Build";
  if (core[0] === "brand") return "The Identity Build";
  if (core[0] === "site") return "The Site Build";
  if (core[0] === "system") return "The Engine Build";
  return "A Small Job";
}

const buildByName = (n: string) => builds.find((b) => b.name === n) ?? (n === NOT_SURE ? NOT_SURE_BUILD : undefined);

const REMEMBER = "fz-intake-me";

/* The look: a near-black panel, white for whatever is chosen, brand color only
   as a signal (group icons, the fit badge, the top bar). High contrast so the
   choice is the brightest thing on screen. */
const INK_PANEL = "#07090F";
const CARD = "#10141D";
const EDGE = "rgba(255,255,255,0.09)";

const field =
  "w-full bg-[#10141D] text-white placeholder-[#6B7890] border border-white/10 rounded-[11px] px-4 py-3 text-[15px] transition-colors focus:outline-none focus:border-white focus:ring-2 focus:ring-white/15";

/** Small uppercase section label, like a receipt heading. */
function Label({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 mb-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8190A8]">{children}</p>
      {right && <span className="ml-auto text-[11px] text-[#6B7890]">{right}</span>}
    </div>
  );
}

/** A choice. Off: dark card. On: solid white with dark text and a colored check. */
function Choice({
  on,
  c,
  onClick,
  children,
  role = "checkbox",
}: {
  on: boolean;
  c: string;
  onClick: () => void;
  children: React.ReactNode;
  role?: "checkbox" | "radio";
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={on}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-[11px] border px-3.5 py-2.5 text-sm transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px active:scale-[0.97] ${
        on
          ? "bg-white text-[#0C1424] border-white font-medium shadow-[0_10px_28px_-14px_rgba(255,255,255,0.55)]"
          : "bg-[#10141D] text-[#C9D2E3] border-white/10 hover:border-white/30 hover:text-white"
      }`}
    >
      <span
        aria-hidden
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors"
        style={on ? { background: c, borderColor: c } : { borderColor: "rgba(255,255,255,0.25)" }}
      >
        {on && (
          <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 6.2l2.3 2.3 4.7-5" />
          </svg>
        )}
      </span>
      {children}
    </button>
  );
}

/** One build as a plan row. Selected row goes white, like a picked plan. */
function PlanRow({
  b,
  on,
  fit,
  onClick,
}: {
  b: Build;
  on: boolean;
  fit: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onClick}
      className={`w-full text-left flex items-center gap-4 rounded-[14px] border px-4 py-3.5 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.99] ${
        on ? "bg-white border-white shadow-[0_14px_36px_-18px_rgba(255,255,255,0.6)]" : "bg-[#10141D] border-white/[0.07] hover:border-white/25"
      }`}
    >
      <span
        aria-hidden
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
        style={on ? { borderColor: "#0C1424" } : { borderColor: "rgba(255,255,255,0.18)", background: "#07090F" }}
      >
        {on && <span className="h-2.5 w-2.5 rounded-full bg-[#0C1424]" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 flex-wrap">
          <span className={`font-semibold text-[15px] ${on ? "text-[#0C1424]" : "text-white"}`}>{b.name.replace(/^The /, "")}</span>
          {fit && (
            <span
              className="fz-settle text-[10px] font-semibold uppercase tracking-[0.08em] rounded-[6px] px-1.5 py-0.5"
              style={on ? { background: "#0C1424", color: "#fff" } : { background: b.c, color: "#0C1424" }}
            >
              Best fit
            </span>
          )}
        </span>
        <span className={`block text-[13px] mt-0.5 sm:truncate leading-snug ${on ? "text-[#4A5873]" : "text-[#8190A8]"}`}>{b.one}</span>
      </span>
      <span className={`shrink-0 text-right font-semibold text-[15px] tabular-nums ${on ? "text-[#0C1424]" : "text-white"}`}>
        {b.from.replace("From ", "")}
        <span className={`block text-[10px] font-normal uppercase tracking-[0.1em] ${on ? "text-[#8190A8]" : "text-[#6B7890]"}`}>
          {b.from.startsWith("From") ? "from" : ""}
        </span>
      </span>
    </button>
  );
}

function IntakeForm() {
  const searchParams = useSearchParams();
  const rawBuild = (searchParams.get("build") || "").trim().toLowerCase();
  const rawService = (searchParams.get("service") || "").trim().toLowerCase();
  const cameFromCart = searchParams.get("cart") === "1";

  const fromBuild = builds.find((b) => b.key === rawBuild || b.name.toLowerCase() === rawBuild)?.name;
  const fromLegacy = rawService
    ? legacyMap[Object.keys(legacyMap).find((k) => rawService.startsWith(k)) ?? ""]
    : undefined;
  const preselected = fromBuild ?? fromLegacy ?? "";

  const [picked, setPicked] = useState<string[]>(() => BUILD_STARTER[preselected] ?? []);
  // A build the visitor chose by hand wins over the suggestion until they clear it.
  const [manual, setManual] = useState<string>(preselected);
  const [timeline, setTimeline] = useState("");
  const [start, setStart] = useState("");
  const [me, setMe] = useState({ name: "", email: "", business: "" });
  const [notes, setNotes] = useState("");
  const [remember, setRemember] = useState(true);

  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [fixable, setFixable] = useState(false);
  const [error, setError] = useState("");
  const loading = state === "sending";

  const suggested = useMemo(() => bestFit(picked), [picked]);
  const service = manual || suggested;
  const build = buildByName(service);

  // Fill name, email and business from last time, if this browser has them.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(REMEMBER) || "null");
      if (saved && typeof saved === "object") {
        setMe((m) => ({
          name: m.name || String(saved.name || ""),
          email: m.email || String(saved.email || ""),
          business: m.business || String(saved.business || ""),
        }));
      }
    } catch {
      /* private mode or blocked storage, the form works without it */
    }
  }, []);

  // Arriving from the cart: the cart items become the notes, once.
  useEffect(() => {
    if (!cameFromCart) return;
    const items = readCart();
    if (items.length === 0) return;
    const lines = items.map((i) => `- ${i.name}, ${i.from ? "from " : ""}${money(i.price)}`).join("\n");
    const approx = items.some((i) => i.from) ? "from " : "";
    const buildInCart = [...items]
      .sort((a, b) => b.price - a.price)
      .map((i) => builds.find((x) => x.key === i.id)?.name)
      .find(Boolean);
    setManual((m) => m || buildInCart || "A Small Job");
    setNotes((n) => n || `From my cart:\n${lines}\nTotal: ${approx}${money(cartTotal(items))}`);
  }, [cameFromCart]);

  const toggle = (label: string) =>
    setPicked((p) => (p.includes(label) ? p.filter((x) => x !== label) : [...p, label]));

  const brief = useMemo(() => {
    const out: string[] = [];
    if (picked.length) out.push(`What I need: ${picked.join(", ")}`);
    if (timeline) out.push(`Timeline: ${timeline}`);
    if (start) out.push(`Starting point: ${start}`);
    const top = out.join("\n");
    return [top, notes.trim()].filter(Boolean).join("\n\n");
  }, [picked, timeline, start, notes]);

  const fallbackMailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `New project for FlowZone: ${service || "not sure yet"}`
  )}&body=${encodeURIComponent(
    `Hi FlowZone,\n\nName: ${me.name}\nEmail: ${me.email}\nBusiness: ${me.business}\nBuild: ${service}\n\n${brief}\n\nThanks,\n${me.name}`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) {
      setState("error");
      setFixable(true);
      setError("Pick at least one thing up top, or choose not sure yet.");
      document.getElementById("fz-step-1")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (brief.length < 10) {
      setState("error");
      setFixable(true);
      setError("Tell us a little about the idea, even one sentence.");
      return;
    }
    setState("sending");
    setError("");
    try {
      if (remember) localStorage.setItem(REMEMBER, JSON.stringify(me));
      else localStorage.removeItem(REMEMBER);
    } catch {
      /* not important */
    }
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...me, service, description: brief }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setFixable(res.status === 400);
        throw new Error(data?.error || "Could not reach the studio.");
      }
      setState("done");
      if (cameFromCart) clearCart();
      window.scrollTo({ top: 0 });
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Could not reach the studio.");
    }
  };

  const first = me.name.trim().split(/\s+/)[0];

  if (state === "done") {
    return (
      <div className="min-h-screen bg-paper-deep flex items-center justify-center px-4 py-28">
        <div className="max-w-lg w-full rounded-[24px] border border-white/10 p-10 text-center fz-settle shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]" style={{ background: INK_PANEL }}>
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#0C1424" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </div>
          <h1 className="font-display text-3xl text-white tracking-tight mb-3">Thank you{first ? `, ${first}` : ""}.</h1>
          <p className="text-[#C9D2E3] leading-relaxed mb-2">
            We are really happy you reached out. Your ticket for {build && build.name !== NOT_SURE ? build.name : "your idea"} is in, and a person is reading it.
          </p>
          <p className="text-[#8190A8] leading-relaxed">Check your inbox for a note from Dennis. You will hear back with a plan, usually the same day.</p>
          <p className="text-xs text-[#6B7890] mt-8">
            Thought of something else? Write to{" "}
            <a href={`mailto:${SITE.email}`} className="text-white underline underline-offset-4">{SITE.email}</a>
          </p>
        </div>
      </div>
    );
  }

  const planList = [...builds, NOT_SURE_BUILD];

  return (
    <div className="min-h-screen bg-paper-deep pt-28 pb-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <form
          id="fz-ticket"
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-[minmax(0,1fr)_400px] rounded-[24px] border border-white/10 overflow-clip shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)]"
          style={{ background: INK_PANEL }}
        >
          {/* Left: the choices */}
          <div className="min-w-0 p-5 sm:p-8 space-y-9">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl text-white tracking-tight leading-[1.05]">Start a ticket</h1>
              <p className="text-[#C9D2E3] mt-2 leading-relaxed max-w-md">
                Tap what you need. We match the build as you go and you see the price before anything starts.
              </p>
            </div>

            <section id="fz-step-1" className="scroll-mt-28">
              <Label right="Pick as many as you like">01 · What do you need?</Label>
              <div className="space-y-5">
                {GROUPS.map((g) => {
                  const count = g.picks.filter((p) => picked.includes(p.label)).length;
                  return (
                    <div key={g.key}>
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-[8px]" style={{ background: `${g.c}26` }}>
                          <Icon name={g.icon} size={15} color={g.c} />
                        </span>
                        <p className="text-sm font-semibold text-white">{g.title}</p>
                        <p className="text-xs text-[#6B7890] hidden sm:block">{g.line}</p>
                        {count > 0 && (
                          <span key={count} className="fz-settle ml-auto text-[11px] font-semibold tabular-nums rounded-[6px] px-1.5 py-0.5 bg-white text-[#0C1424]">
                            {count}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {g.picks.map((p) => (
                          <Choice key={p.label} on={picked.includes(p.label)} c={g.c} onClick={() => toggle(p.label)}>
                            {p.label}
                          </Choice>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <Label right={manual && suggested && manual !== suggested ? (
                <button type="button" onClick={() => setManual("")} className="text-white underline underline-offset-4">
                  Use best fit
                </button>
              ) : "Matched as you tap"}>
                02 · Your build
              </Label>
              <div className="space-y-2" role="radiogroup" aria-label="Pick a build">
                {planList.map((b) => (
                  <PlanRow
                    key={b.key}
                    b={b}
                    on={service === b.name}
                    fit={!!suggested && suggested === b.name}
                    onClick={() => setManual(service === b.name && manual ? "" : b.name)}
                  />
                ))}
              </div>
            </section>

            <section>
              <Label right="Optional">03 · When and where from?</Label>
              <div className="flex flex-wrap gap-2 mb-3" role="radiogroup" aria-label="Timeline">
                {TIMELINES.map((t) => (
                  <Choice key={t} role="radio" on={timeline === t} c="#FBBF24" onClick={() => setTimeline(timeline === t ? "" : t)}>
                    {t}
                  </Choice>
                ))}
              </div>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Starting point">
                {STARTS.map((s) => (
                  <Choice key={s} role="radio" on={start === s} c="#2DD4BF" onClick={() => setStart(start === s ? "" : s)}>
                    {s}
                  </Choice>
                ))}
              </div>
            </section>

            <section>
              <Label>04 · Who is this for?</Label>
              <div className="grid sm:grid-cols-2 gap-3">
                <input id="fz-name" name="name" type="text" autoComplete="name" required aria-label="Your name" value={me.name}
                  onChange={(e) => setMe({ ...me, name: e.target.value })} className={field} placeholder="Your name" />
                <input id="fz-email" name="email" type="email" autoComplete="email" inputMode="email" required aria-label="Email" value={me.email}
                  onChange={(e) => setMe({ ...me, email: e.target.value })} className={field} placeholder="Email" />
                <input id="fz-business" name="organization" type="text" autoComplete="organization" required aria-label="Business name" value={me.business}
                  onChange={(e) => setMe({ ...me, business: e.target.value })} className={`${field} sm:col-span-2`} placeholder="Business name (or your name if the brand is you)" />
                <textarea id="fz-idea" name="description" rows={3} aria-label="Anything else" value={notes}
                  onChange={(e) => setNotes(e.target.value)} className={`${field} resize-none sm:col-span-2`}
                  placeholder={picked.length ? "Anything else? Links, tools you use, the thing you keep putting off (optional)" : "A sentence about the idea"} />
              </div>
              <label className="mt-3 flex items-center gap-2 text-xs text-[#8190A8] cursor-pointer select-none">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-white" />
                Remember my details on this device
              </label>
            </section>

            {state === "error" && (
              <div className="rounded-[14px] border border-white/10 p-5" style={{ background: CARD }}>
                <p className="text-sm font-semibold text-white mb-1">{fixable ? "One more thing" : "Let’s get this to Denny"}</p>
                <p className="text-sm text-[#C9D2E3] leading-relaxed">{error}</p>
                <p className="text-sm text-[#8190A8] leading-relaxed mt-2">
                  Everything you picked and typed is still here.
                  {fixable ? " Fix that one and send again." : " Send again, or open the email below. It is already filled in and goes straight to Denny."}
                </p>
                {!fixable && (
                  <a href={fallbackMailto} className="mt-4 inline-flex rounded-[11px] bg-white text-[#0C1424] font-semibold px-5 py-3 text-sm">
                    Email it to us &rarr;
                  </a>
                )}
              </div>
            )}

            {/* Phones: the ticket and the send button sit at the end. */}
            <div className="lg:hidden border-t border-white/10 pt-6">
              <TicketSide build={build} picked={picked} timeline={timeline} start={start} me={me} loading={loading} />
            </div>
          </div>

          {/* Right: the ticket, filling itself in */}
          <aside className="hidden lg:block border-l border-white/10" style={{ background: "#0A0D14" }}>
            <div className="sticky top-24 p-6">
              <TicketSide build={build} picked={picked} timeline={timeline} start={start} me={me} loading={loading} />
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

/** The right-hand column: a banner, the live ticket, what happens next, the send button. */
function TicketSide({
  build,
  picked,
  timeline,
  start,
  me,
  loading,
}: {
  build?: Build;
  picked: string[];
  timeline: string;
  start: string;
  me: { name: string; business: string };
  loading: boolean;
}) {
  const short = build ? (build.name === NOT_SURE ? "ticket" : build.name.replace(/^The /, "")) : "ticket";
  return (
    <div className="space-y-4">
      <div className="relative rounded-[16px] overflow-hidden border border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/intake-ocean.jpg" alt="" className="block w-full h-[120px] object-cover" />
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#07090F] via-[#07090F]/70 to-transparent">
          {build ? (
            <div key={build.name} className="fz-settle">
              <p className="font-display text-xl text-white leading-tight">{build.name}</p>
              <p className="text-sm font-semibold" style={{ color: "#F0845F" }}>{build.from}</p>
            </div>
          ) : (
            <p className="font-display text-lg text-white/80">Your build shows up here</p>
          )}
        </div>
      </div>

      <div className="rounded-[16px] border border-white/[0.07] p-4" style={{ background: CARD }}>
        <Label>Your ticket</Label>
        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[26px]">
          {picked.length ? (
            picked.map((p) => {
              const g = GROUPS.find((x) => x.key === pickIndex.get(p)?.group);
              return (
                <span key={p} className="fz-settle inline-flex items-center gap-1.5 text-xs rounded-[7px] px-2 py-1 bg-white/[0.06] text-white">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: g?.c ?? "#5B8CFF" }} />
                  {p}
                </span>
              );
            })
          ) : (
            <span className="text-xs text-[#6B7890]">Nothing picked yet</span>
          )}
        </div>
        <dl className="space-y-1.5 text-sm">
          <Row k="When" v={timeline} />
          <Row k="From" v={start ? start.replace("I have something, make it better", "Improving what exists") : ""} />
          <Row k="Name" v={me.name} />
          <Row k="Business" v={me.business} />
        </dl>
      </div>

      <div className="rounded-[16px] border border-white/[0.07] p-4" style={{ background: CARD }}>
        <Label>What happens next</Label>
        <ul className="space-y-2.5 text-[15px] text-white">
          {["A person reads every word", "You get scope, price and a date", "Usually the same day, no call needed"].map((t) => (
            <li key={t} className="flex items-center gap-2.5">
              <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3 3 7-7" /></svg>
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-1">
        <p className="flex items-center justify-center gap-2 text-sm text-[#8190A8] mb-3">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6.2" /><path d="M8 4.8V8l2.2 1.4" strokeLinecap="round" /></svg>
          Reply <span className="font-medium" style={{ color: "#FBBF24" }}>usually the same day</span>
        </p>
        <button
          type="submit"
          form="fz-ticket"
          disabled={loading}
          className="w-full rounded-[12px] bg-white text-[#0C1424] font-semibold text-base py-4 transition-all duration-200 hover:bg-[#EAF0FF] hover:-translate-y-px active:scale-[0.99] disabled:opacity-60 shadow-[0_14px_40px_-18px_rgba(255,255,255,0.7)]"
        >
          {loading ? "Sending..." : <>Send my {short} ticket <span aria-hidden>&rarr;</span></>}
        </button>
        <p className="flex items-center justify-center gap-2 text-xs text-[#6B7890] mt-3">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" /></svg>
          No payment now · you see the price first
        </p>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-20 shrink-0 text-[#6B7890] text-xs pt-0.5">{k}</dt>
      <dd className={`min-w-0 truncate ${v ? "text-white" : "text-[#4A5670]"}`}>{v || "Not yet"}</dd>
    </div>
  );
}

export default function IntakePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper-deep" />}>
      <IntakeForm />
    </Suspense>
  );
}
