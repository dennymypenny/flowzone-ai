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
  from: "Quote before you pay",
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

const field =
  "w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule rounded-[11px] px-4 py-3 text-[15px] transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent";

/** Numbered step heading. */
function Step({ n, title, hint }: { n: number; title: string; hint?: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      <span className="font-display text-sm text-accent-light tabular-nums">0{n}</span>
      <h2 className="font-display text-xl text-ink tracking-tight">{title}</h2>
      {hint && <span className="text-xs text-ink-mute ml-auto hidden sm:inline">{hint}</span>}
    </div>
  );
}

/** A choice that pops when it is on: tinted fill, colored edge, a check. */
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
      className={`fz-choice group inline-flex items-center gap-2 rounded-[11px] border px-3.5 py-2.5 text-sm transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px active:scale-[0.97] ${
        on ? "text-ink" : "text-ink-soft border-rule bg-paper-deep hover:border-ink-mute hover:text-ink"
      }`}
      style={
        on
          ? {
              background: `${c}22`,
              borderColor: c,
              boxShadow: `0 0 0 1px ${c}, 0 10px 24px -14px ${c}`,
            }
          : undefined
      }
    >
      <span
        aria-hidden
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors"
        style={on ? { background: c, borderColor: c } : { borderColor: "#3A4A70" }}
      >
        {on && (
          <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="#0C1424" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 6.2l2.3 2.3 4.7-5" />
          </svg>
        )}
      </span>
      {children}
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
  const [showAll, setShowAll] = useState(false);

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
      <div className="min-h-screen bg-paper-deep flex items-center justify-center px-6 py-24">
        <div className="max-w-lg w-full panel rounded-[18px] p-10 text-center fz-settle">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "#5B8CFF22", boxShadow: "0 0 0 1px #5B8CFF" }}>
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#A8C4FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </div>
          <h1 className="font-display text-3xl text-ink tracking-tight mb-3">
            Thank you{first ? `, ${first}` : ""}.
          </h1>
          <p className="text-ink-soft leading-relaxed mb-2">
            We are really happy you reached out. Your ticket for {build && build.name !== NOT_SURE ? build.name : "your idea"} is in, and a person is reading it.
          </p>
          <p className="text-ink-mute leading-relaxed">
            Check your inbox for a note from Dennis. You will hear back with a plan, usually the same day.
          </p>
          <p className="text-xs text-ink-mute mt-8">
            Thought of something else? Write to{" "}
            <a href={`mailto:${SITE.email}`} className="text-accent hover:underline">{SITE.email}</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-deep pt-28 pb-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-10">
          <p className="label mb-3">Start a ticket</p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink tracking-tight leading-[1.05] mb-4">
            What are we building?
          </h1>
          <p className="text-ink-soft text-lg leading-relaxed">
            Tap everything that fits. We match the build as you go, and you get a scope, a price and a date back, usually the same day.
          </p>
        </div>

        <form id="fz-ticket" onSubmit={handleSubmit} className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
          <div className="space-y-6 min-w-0">
            {/* 01 · Picks */}
            <section id="fz-step-1" className="panel rounded-[18px] p-5 sm:p-7 scroll-mt-28">
              <Step n={1} title="What do you need?" hint="Pick as many as you like" />
              <div className="grid sm:grid-cols-2 gap-3">
                {GROUPS.map((g) => {
                  const count = g.picks.filter((p) => picked.includes(p.label)).length;
                  return (
                    <div
                      key={g.key}
                      className={`rounded-[14px] border p-4 transition-all duration-300 ${g.key === "video" ? "sm:col-span-2" : ""}`}
                      style={
                        count
                          ? { borderColor: `${g.c}88`, background: `linear-gradient(180deg, ${g.c}14, transparent 70%)` }
                          : { borderColor: "#26355A" }
                      }
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-[9px]" style={{ background: `${g.c}22` }}>
                          <Icon name={g.icon} size={17} color={g.c} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink leading-tight">{g.title}</p>
                          <p className="text-xs text-ink-mute leading-tight mt-0.5">{g.line}</p>
                        </div>
                        {count > 0 && (
                          <span key={count} className="fz-settle ml-auto text-[11px] font-semibold tabular-nums rounded-[6px] px-1.5 py-0.5" style={{ background: g.c, color: "#0C1424" }}>
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

              {/* Best fit, live */}
              <div className="mt-5 rounded-[14px] border border-rule bg-paper-deep p-4">
                {build ? (
                  <div key={build.name} className="fz-settle flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px]" style={{ background: `${build.c}22`, boxShadow: `0 0 0 1px ${build.c}66` }}>
                      <Icon name={build.icon} size={20} color={build.c} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-ink-mute font-medium">
                        {manual ? "You picked" : "Best fit"}
                      </p>
                      <p className="font-display text-lg text-ink leading-tight">{build.name}</p>
                    </div>
                    <p className="ml-auto text-sm font-semibold whitespace-nowrap" style={{ color: "#F0845F" }}>{build.from}</p>
                  </div>
                ) : (
                  <p className="text-sm text-ink-mute">Tap a few things above and the right build shows up here.</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <button type="button" onClick={() => setShowAll((s) => !s)} className="text-accent-light hover:text-ink transition-colors">
                    {showAll ? "Hide the builds" : "Choose the build yourself"}
                  </button>
                  {manual && suggested && manual !== suggested && (
                    <button type="button" onClick={() => setManual("")} className="text-ink-mute hover:text-ink transition-colors">
                      Use the suggestion ({suggested.replace(/^The /, "")})
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setManual(manual === NOT_SURE ? "" : NOT_SURE)}
                    className={`transition-colors ${manual === NOT_SURE ? "text-ink underline underline-offset-4" : "text-ink-mute hover:text-ink"}`}
                  >
                    Not sure, just help me
                  </button>
                </div>
                {showAll && (
                  <div className="fz-settle mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Pick a build">
                    {builds.map((b) => (
                      <Choice key={b.key} role="radio" on={service === b.name} c={b.c} onClick={() => setManual(b.name)}>
                        <span className="text-left leading-tight">
                          <span className="block">{b.name.replace(/^The /, "")}</span>
                          <span className="block text-[11px] text-ink-mute">{b.from}</span>
                        </span>
                      </Choice>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* 02 · When and where from */}
            <section className="panel rounded-[18px] p-5 sm:p-7">
              <Step n={2} title="When and where from?" hint="Optional" />
              <p className="text-xs text-ink-mute mb-2.5">When do you want it?</p>
              <div className="flex flex-wrap gap-2 mb-5" role="radiogroup" aria-label="Timeline">
                {TIMELINES.map((t) => (
                  <Choice key={t} role="radio" on={timeline === t} c="#FBBF24" onClick={() => setTimeline(timeline === t ? "" : t)}>
                    {t}
                  </Choice>
                ))}
              </div>
              <p className="text-xs text-ink-mute mb-2.5">Where are you starting?</p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Starting point">
                {STARTS.map((s) => (
                  <Choice key={s} role="radio" on={start === s} c="#2DD4BF" onClick={() => setStart(start === s ? "" : s)}>
                    {s}
                  </Choice>
                ))}
              </div>
            </section>

            {/* 03 · You */}
            <section className="panel rounded-[18px] p-5 sm:p-7">
              <Step n={3} title="Who is this for?" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fz-name" className="block text-sm text-ink-soft mb-1.5">Your name</label>
                  <input id="fz-name" name="name" type="text" autoComplete="name" required value={me.name}
                    onChange={(e) => setMe({ ...me, name: e.target.value })} className={field} placeholder="Jane Smith" />
                </div>
                <div>
                  <label htmlFor="fz-email" className="block text-sm text-ink-soft mb-1.5">Email</label>
                  <input id="fz-email" name="email" type="email" autoComplete="email" inputMode="email" required value={me.email}
                    onChange={(e) => setMe({ ...me, email: e.target.value })} className={field} placeholder="jane@company.com" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="fz-business" className="block text-sm text-ink-soft mb-1.5">
                    Business name <span className="text-ink-mute">or your own, if the brand is you</span>
                  </label>
                  <input id="fz-business" name="organization" type="text" autoComplete="organization" required value={me.business}
                    onChange={(e) => setMe({ ...me, business: e.target.value })} className={field} placeholder="Acme Co. or Jane Doe" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="fz-idea" className="block text-sm text-ink-soft mb-1.5">
                    Anything else? <span className="text-ink-mute">{picked.length ? "Optional" : "A sentence about the idea"}</span>
                  </label>
                  <textarea id="fz-idea" name="description" rows={3} value={notes}
                    onChange={(e) => setNotes(e.target.value)} className={`${field} resize-none`}
                    placeholder="Links, tools you already use, the thing you keep putting off..." />
                </div>
              </div>
              <label className="mt-4 flex items-center gap-2 text-xs text-ink-mute cursor-pointer select-none">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-[#5B8CFF]" />
                Remember my details on this device
              </label>
            </section>

            {/* Send, for phones. Desktop sends from the ticket on the right. */}
            <div className="lg:hidden space-y-4">
              <TicketPreview build={build} picked={picked} timeline={timeline} start={start} me={me} />
              <SendButton loading={loading} />
            </div>

            {state === "error" && (
              <div className="panel rounded-[18px] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="chat" size={20} color="#5B8CFF" />
                  <p className="label">{fixable ? "One more thing" : "Let’s get this to Denny"}</p>
                </div>
                <p className="text-sm text-ink-soft leading-relaxed">{error}</p>
                <p className="text-sm text-ink-mute leading-relaxed mt-2">
                  Everything you picked and typed is still here.
                  {fixable ? " Fix that one and send again." : " Send again, or open the email below. It is already filled in and goes straight to Denny."}
                </p>
                {!fixable && (
                  <a href={fallbackMailto} className="btn-primary shine mt-4 inline-flex">
                    Email it to us <span className="arrow">&rarr;</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* The ticket, filling itself in. */}
          <aside className="hidden lg:block sticky top-28 space-y-4">
            <TicketPreview build={build} picked={picked} timeline={timeline} start={start} me={me} />
            <SendButton loading={loading} />
            <p className="text-xs text-ink-mute text-center">Nothing is charged. You see the price first.</p>
          </aside>
        </form>
      </div>
    </div>
  );
}

function SendButton({ loading }: { loading: boolean }) {
  return (
    <button type="submit" form="fz-ticket" disabled={loading} className="btn-primary w-full !py-4 text-base disabled:opacity-50">
      {loading ? "Sending..." : <>Send my ticket <span className="arrow">&rarr;</span></>}
    </button>
  );
}

/** Live preview of the ticket that lands in the studio inbox. */
function TicketPreview({
  build,
  picked,
  timeline,
  start,
  me,
}: {
  build?: Build;
  picked: string[];
  timeline: string;
  start: string;
  me: { name: string; business: string };
}) {
  const c = build?.c ?? "#26355A";
  return (
    <div className="panel rounded-[18px] overflow-hidden">
      <div className="h-1 transition-colors duration-500" style={{ background: c }} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-ink-mute font-medium">Your ticket</p>
          <span className="flex items-center gap-1" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-full bg-[#1E3A8A]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#5B9BF9]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#C6E4F8]" />
          </span>
        </div>

        {build ? (
          <div key={build.name} className="fz-settle flex items-center gap-3 mb-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]" style={{ background: `${c}22` }}>
              <Icon name={build.icon} size={19} color={c} />
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg text-ink leading-tight">{build.name}</p>
              <p className="text-xs font-semibold" style={{ color: "#F0845F" }}>{build.from}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink-mute mb-4">Your build shows up here.</p>
        )}

        <div className="flex flex-wrap gap-1.5 min-h-[28px]">
          {picked.length ? (
            picked.map((p) => {
              const g = GROUPS.find((x) => x.key === pickIndex.get(p)?.group);
              return (
                <span key={p} className="fz-settle text-xs rounded-[7px] px-2 py-1 text-ink" style={{ background: `${g?.c ?? "#5B8CFF"}22` }}>
                  {p}
                </span>
              );
            })
          ) : (
            <span className="text-xs text-ink-mute">Nothing picked yet</span>
          )}
        </div>

        <dl className="mt-4 space-y-2 text-sm border-t border-rule pt-4">
          <Row k="When" v={timeline} />
          <Row k="From" v={start ? start.replace("I have something, make it better", "Improving what exists") : ""} />
          <Row k="Name" v={me.name} />
          <Row k="Business" v={me.business} />
        </dl>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-20 shrink-0 text-ink-mute text-xs pt-0.5">{k}</dt>
      <dd className={`min-w-0 truncate ${v ? "text-ink" : "text-ink-mute/60"}`}>{v || "Not yet"}</dd>
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
