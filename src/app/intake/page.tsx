"use client";
import { useState, Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { readCart, clearCart, cartTotal, money } from "@/app/components/cart";
import { SITE } from "@/lib/site";
import { PICK_TO_PAYABLE } from "@/lib/payables";
import { PAY_ON } from "@/app/components/PayNow";
import { BUILDS as PRICED_BUILDS, CARE, GRAPHICS, MOTION, PACKAGES, QUICK_JOBS } from "@/lib/catalog";
import Icon from "@/components/Icon";
import SendReel from "@/components/SendReel";
import Tilt3D from "@/components/Tilt3D";
import PayNowLater from "@/app/intake/PayAfterTicket";

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
 * Oct 9 2026: the whole ticket fits one screen. On desktop the right column
 * is pinned and sized to the window; on phones the bottom bar shows the picks
 * and opens into the full ticket with the send button. Sending plays the
 * homepage intro reel (SendReel) while the request is in flight.
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
  { key: "small", icon: "scissors", c: "#FBBF24", name: "A Small Job", one: "Ads, reels and graphics. Or a page, a form, a fix.", from: "From $49.99" },
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

type GroupKey = "brand" | "site" | "sell" | "system" | "video" | "plans";
/** `cents` is the flat price for a small pick on its own; `monthly` means it renews. */
type Pick = { label: string; small?: boolean; cents?: number; monthly?: boolean };

const G = GRAPHICS[0].price; // every simple graphic is one price
const job = (id: string) => QUICK_JOBS.find((j) => j.id === id)!.price;

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
      { label: "Social graphics", small: true, cents: G },
      { label: "Flyers and print", small: true, cents: G },
    ],
  },
  {
    key: "video",
    title: "Ads and video",
    line: "Ads people stop scrolling for",
    icon: "clapper",
    c: "#FBBF24",
    picks: [
      { label: "Ad for social", small: true, cents: G },
      { label: "Story ad", small: true, cents: G },
      { label: "Video ad", small: true, cents: MOTION.videoAd },
      { label: "Promo reel", small: true, cents: job("reel") },
      { label: "Logo animation", small: true, cents: MOTION.logoAnimation },
    ],
  },
  {
    key: "plans",
    title: "Packages and plans",
    line: "A ready set of ads, or graphics every month",
    icon: "gem",
    c: "#2DD4BF",
    picks: [
      { label: `Ad package: ${PACKAGES.ads.what}`, small: true, cents: PACKAGES.ads.price },
      { label: `Monthly graphics: ${PACKAGES.graphics.what}`, small: true, cents: PACKAGES.graphics.monthly, monthly: true },
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
      { label: "Landing page", small: true, cents: job("page") },
      { label: "Fix or speed up", small: true, cents: job("fix") },
      { label: "Show up on Google" },
      { label: "Website care (monthly)", small: true, cents: CARE.monthly, monthly: true },
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
      { label: "Forms that send", small: true, cents: job("form") },
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
const pickByLabel = new Map<string, Pick>();
GROUPS.forEach((g) => g.picks.forEach((p) => pickByLabel.set(p.label, p)));

/**
 * The running estimate. A big build counts once at its price, then every
 * small pick adds its own flat price on top. Monthly picks add up separately.
 * `from` is true when a build price is a starting point.
 */
type Estimate = { once: number; monthly: number; from: boolean; count: number };
function estimate(picked: string[], build?: { name: string }): Estimate | null {
  const base = build ? PRICED_BUILDS.find((b) => b.name === build.name) : undefined;
  let once = base ? base.price : 0;
  let monthly = 0;
  let count = base ? 1 : 0;
  for (const label of picked) {
    const p = pickByLabel.get(label);
    if (!p?.small || !p.cents) continue;
    if (p.monthly) monthly += p.cents;
    else once += p.cents;
    count++;
  }
  if (!once && !monthly) return null;
  return { once, monthly, from: !!base?.from, count };
}

const estimateText = (e: Estimate) => {
  const parts: string[] = [];
  if (e.once) parts.push(`${e.from ? "From " : ""}${money(e.once)}`);
  if (e.monthly) parts.push(`${money(e.monthly)}/mo`);
  return parts.join(" + ");
};

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
      className="fz-key inline-flex items-center gap-2 rounded-[11px] px-3.5 py-2.5 text-sm font-medium"
    >
      <span
        aria-hidden
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors"
        style={on ? { background: "#2B57C4", borderColor: "#2B57C4" } : { borderColor: "#7A879E", background: "transparent" }}
      >
        {on && (
          <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
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
  className = "",
}: {
  b: Build;
  on: boolean;
  fit: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onClick}
      className={`fz-key w-full text-left items-center gap-4 rounded-[14px] px-4 py-3.5 ${className || "flex"}`}
    >
      <span
        aria-hidden
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
        style={on ? { borderColor: "#2B57C4", background: "#FFFFFF" } : { borderColor: "#7A879E", background: "transparent" }}
      >
        {on && <span className="h-2.5 w-2.5 rounded-full bg-[#2B57C4]" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-[15px]">{b.name.replace(/^The /, "")}</span>
          {fit && (
            <span
              className="fz-settle text-[10px] font-semibold uppercase tracking-[0.08em] rounded-[6px] px-1.5 py-0.5"
              style={on ? { background: "#2B57C4", color: "#fff" } : { background: "#FFFFFF", color: "#0C1424" }}
            >
              Best fit
            </span>
          )}
        </span>
        <span className={`block text-[13px] mt-0.5 sm:truncate leading-snug ${on ? "text-[#4A5873]" : "text-[#9AA7BD]"}`}>{b.one}</span>
      </span>
      <span className="shrink-0 text-right font-semibold text-[15px] tabular-nums">
        {b.from.replace("From ", "")}
        <span className={`block text-[10px] font-normal uppercase tracking-[0.1em] ${on ? "text-[#4A5873]" : "text-[#9AA7BD]"}`}>
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

  // ?pick=Landing%20page,Website%20care%20(monthly) arrives from offer pages.
  const fromPick = (searchParams.get("pick") || "")
    .split(",")
    .map((x) => x.trim())
    .filter((x) => pickIndex.has(x));
  const [picked, setPicked] = useState<string[]>(() =>
    fromPick.length ? fromPick : BUILD_STARTER[preselected] ?? []
  );
  // A build the visitor chose by hand wins over the suggestion until they clear it.
  const [manual, setManual] = useState<string>(preselected);
  const [timeline, setTimeline] = useState("");
  const [start, setStart] = useState("");
  const [me, setMe] = useState({ name: "", email: "", business: "" });
  const [notes, setNotes] = useState("");
  const [remember, setRemember] = useState(true);
  // Phone only: one area open at a time (tap again to close), and the build
  // list folded to the picked build until they ask to see the rest.
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [allBuilds, setAllBuilds] = useState(false);
  // Phone only: the bottom bar opened up into the full ticket.
  const [review, setReview] = useState(false);
  // The intro reel, mounted on send and removed once it has played out.
  const [reel, setReel] = useState(false);

  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  // When the page opened. A person takes longer than three seconds to fill this in.
  const [openedAt] = useState(() => Date.now());
  // A short ticket number people can quote back. It rides in the brief, so it is in the studio email too.
  const [ticketNo] = useState(() => `FZ-${Math.floor(1000 + Math.random() * 9000)}`);
  const [fixable, setFixable] = useState(false);
  const [error, setError] = useState("");
  const loading = state === "sending";

  const suggested = useMemo(() => bestFit(picked), [picked]);
  // "__none" = the visitor tapped the picked build again to clear it.
  const service = manual === "__none" ? "" : manual || suggested;
  const build = buildByName(service);
  const est = useMemo(() => estimate(picked, build), [picked, build]);

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
    if (est) out.push(`Estimate on the page: ${estimateText(est)}`);
    const top = out.join("\n");
    return [top, notes.trim()].filter(Boolean).join("\n\n");
  }, [picked, timeline, start, notes, est, ticketNo]);

  const fallbackMailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `New project for FlowZone: ${service || "not sure yet"}`
  )}&body=${encodeURIComponent(
    `Hi FlowZone,\n\nName: ${me.name}\nEmail: ${me.email}\nBusiness: ${me.business}\nBuild: ${service}\n\n${brief}\n\nThanks,\n${me.name}`
  )}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Hidden bot trap. People never see it, form-filling bots fill it.
    const trap = new FormData(e.currentTarget).get("website2");
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
    setReview(false);
    setReel(true);
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
        body: JSON.stringify({
          ...me,
          service,
          description: brief,
          ticket: ticketNo,
          website2: typeof trap === "string" ? trap : "",
          elapsedMs: Date.now() - openedAt,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setFixable(res.status === 400);
        throw new Error(data?.error || "Could not reach the studio.");
      }
      // The thank you renders under the reel, which fades away to reveal it.
      setState("done");
      if (cameFromCart) clearCart();
      window.scrollTo({ top: 0 });
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Could not reach the studio.");
      setTimeout(() => document.getElementById("fz-send-error")?.scrollIntoView({ behavior: "smooth", block: "center" }), 500);
    }
  };

  const first = me.name.trim().split(/\s+/)[0];

  // A ticket of only fixed-price small jobs can be paid on the thank you.
  const payIds = picked.map((p) => PICK_TO_PAYABLE[p]).filter(Boolean);
  const smallOnly = PAY_ON && build?.name === "A Small Job" && picked.length > 0 && payIds.length === picked.length;

  const reelEl = reel ? (
    <SendReel settled={state !== "sending"} failed={state === "error"} onDone={() => setReel(false)} />
  ) : null;

  if (state === "done") {
    return (
      <>
      {reelEl}
      <ThankYou
        first={first}
        ticketNo={ticketNo}
        build={build && build.name !== NOT_SURE ? build : undefined}
        est={est}
        picked={picked}
        timeline={timeline}
        payIds={smallOnly ? payIds : []}
        email={me.email}
      />
      </>
    );
  }

  const planList = [...builds, NOT_SURE_BUILD];

  return (
    <>
    {reelEl}
    <div className="min-h-screen bg-paper-deep pt-24 sm:pt-28 pb-32 lg:pb-24 px-3 sm:px-6">
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
                    <div key={g.key} className="border-b border-white/[0.07] md:border-0 pb-3 md:pb-0">
                      <button
                        type="button"
                        aria-expanded={openGroup === g.key}
                        onClick={() => setOpenGroup(openGroup === g.key ? null : g.key)}
                        className="w-full text-left flex items-center gap-2.5 py-1.5 md:py-0 mb-0 md:mb-2.5 md:pointer-events-none"
                      >
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
                        <svg aria-hidden viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="#8190A8" strokeWidth="1.8" strokeLinecap="round"
                          className={`md:hidden shrink-0 transition-transform duration-150 ${count > 0 ? "" : "ml-auto"} ${openGroup === g.key ? "rotate-180" : ""}`}>
                          <path d="M4 6l4 4 4-4" />
                        </svg>
                      </button>
                      <div className={`${openGroup === g.key ? "flex" : "hidden"} md:flex flex-wrap gap-x-2.5 gap-y-3.5 pt-3 md:pt-0`}>
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
              <Label right={manual && suggested && manual !== suggested && manual !== "__none" ? (
                <button type="button" onClick={() => setManual("")} className="text-white underline underline-offset-4">
                  Use best fit
                </button>
              ) : "Matched as you tap"}>
                02 · Your build
              </Label>
              <div className="space-y-3.5" role="radiogroup" aria-label="Pick a build">
                {planList.map((b) => (
                  <PlanRow
                    key={b.key}
                    b={b}
                    on={service === b.name}
                    fit={!!suggested && suggested === b.name}
                    onClick={() => setManual(service === b.name ? (manual && manual !== "__none" && suggested && suggested !== b.name ? "" : "__none") : b.name)}
                    className={allBuilds || service === b.name ? "flex" : "hidden md:flex"}
                  />
                ))}
                {!service && !allBuilds && (
                  <p className="md:hidden text-sm text-[#8190A8]">Tap what you need above and the right build shows up here.</p>
                )}
                <button type="button" onClick={() => setAllBuilds(!allBuilds)} className="md:hidden text-sm text-white underline underline-offset-4">
                  {allBuilds ? "Show just mine" : `See all ${planList.length} builds`}
                </button>
              </div>
            </section>

            <section>
              <Label right="Optional">03 · When and where from?</Label>
              <div className="flex flex-wrap gap-x-2.5 gap-y-3.5 mb-4" role="radiogroup" aria-label="Timeline">
                {TIMELINES.map((t) => (
                  <Choice key={t} role="radio" on={timeline === t} c="#FBBF24" onClick={() => setTimeline(timeline === t ? "" : t)}>
                    {t}
                  </Choice>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-2.5 gap-y-3.5" role="radiogroup" aria-label="Starting point">
                {STARTS.map((s) => (
                  <Choice key={s} role="radio" on={start === s} c="#2DD4BF" onClick={() => setStart(start === s ? "" : s)}>
                    {s}
                  </Choice>
                ))}
              </div>
            </section>

            <section>
              <Label>04 · Who is this for?</Label>
              {/* Bot trap: off screen, skipped by keyboard and screen readers. */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
                <label htmlFor="fz-website2">Leave this empty</label>
                <input id="fz-website2" name="website2" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
              </div>
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
              <div id="fz-send-error" className="rounded-[14px] border border-white/10 p-5" style={{ background: CARD }}>
                <p className="text-sm font-semibold text-white mb-1">{fixable ? "One more thing" : "Let’s get this to us"}</p>
                <p className="text-sm text-[#C9D2E3] leading-relaxed">{error}</p>
                <p className="text-sm text-[#8190A8] leading-relaxed mt-2">
                  Everything you picked and typed is still here.
                  {fixable ? " Fix that one and send again." : " Send again, or open the email below. It is already filled in and comes straight to us."}
                </p>
                {!fixable && (
                  <a href={fallbackMailto} className="mt-4 inline-flex rounded-[11px] bg-white text-[#0C1424] font-semibold px-5 py-3 text-sm">
                    Email it to us &rarr;
                  </a>
                )}
              </div>
            )}

            {/* Phones: no big preview card. A slim bar pinned to the bottom
                carries the build, the price and the one send button. */}
            <div className="fz-intake-dock lg:hidden fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))]" style={{ background: "rgba(7,9,15,0.97)", backdropFilter: "blur(10px)" }}>
              {review && (
                <div id="fz-dock-ticket" className="fz-settle max-h-[calc(100dvh-170px)] overflow-y-auto overscroll-contain pb-3">
                  <TicketCard est={est} build={build} picked={picked} timeline={timeline} start={start} me={me} withBuild />
                </div>
              )}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setReview(!review)}
                  aria-expanded={review}
                  aria-controls="fz-dock-ticket"
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="flex items-center gap-1.5">
                    <span key={build?.name || "none"} className="fz-settle text-[13px] font-semibold text-white truncate">
                      {build && build.name !== NOT_SURE ? build.name.replace(/^The /, "") : picked.length ? "We will pick the build" : "Nothing picked yet"}
                    </span>
                    {picked.length > 0 && (
                      <svg aria-hidden viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#C9D2E3" strokeWidth="1.8" strokeLinecap="round"
                        className={`shrink-0 transition-transform duration-150 ${review ? "" : "rotate-180"}`}>
                        <path d="M4 6l4 4 4-4" />
                      </svg>
                    )}
                  </span>
                  <span key={est ? estimateText(est) : "x"} className="fz-settle block text-[12px] text-[#F0845F] font-semibold truncate">
                    {est ? estimateText(est) : build ? build.from : "Tap what you need"}
                    {picked.length > 0 && (
                      <span className="text-[#C9D2E3] font-medium">{` · ${review ? "Hide ticket" : `See ticket (${picked.length})`}`}</span>
                    )}
                  </span>
                </button>
                <button type="submit" form="fz-ticket" disabled={loading} className="fz-go shrink-0 rounded-[12px] px-5 py-3 text-[15px] font-semibold">
                  {loading ? "Sending..." : "Send ticket \u2192"}
                </button>
              </div>
            </div>
          </div>

          {/* Right: the ticket, filling itself in */}
          <aside className="hidden lg:block border-l border-white/10" style={{ background: "#0A0D14" }}>
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain p-5">
              <TicketSide est={est} build={build} picked={picked} timeline={timeline} start={start} me={me} loading={loading} />
            </div>
          </aside>
        </form>
      </div>
    </div>
    </>
  );
}

type TicketProps = {
  est: Estimate | null;
  build?: Build;
  picked: string[];
  timeline: string;
  start: string;
  me: { name: string; business: string };
};

/**
 * The ticket itself: every pick grouped under its area, the build and price,
 * and the details. Shared by the desktop column and the phone bar so both
 * show the same thing. Compact on purpose, so six or seven picks still fit
 * one screen with the send button.
 */
function TicketCard({ est, build, picked, timeline, start, me, withBuild = false }: TicketProps & { withBuild?: boolean }) {
  const grouped = GROUPS.map((g) => ({ g, items: g.picks.filter((p) => picked.includes(p.label)) })).filter((x) => x.items.length);
  return (
    <div className="rounded-[16px] border border-white/[0.07] p-4" style={{ background: CARD }}>
      <Label right={picked.length ? `${picked.length} ${picked.length === 1 ? "item" : "items"}` : undefined}>Your ticket</Label>
      {withBuild && (
        <div className="flex items-baseline gap-3 mb-3 pb-3 border-b border-white/[0.07]">
          <p className="font-display text-lg text-white leading-tight">{build ? build.name : "Your build shows up here"}</p>
          {build && (
            <p className="ml-auto shrink-0 text-sm font-semibold" style={{ color: "#F0845F" }}>{est ? estimateText(est) : build.from}</p>
          )}
        </div>
      )}
      {grouped.length ? (
        <div className="space-y-2 mb-3">
          {grouped.map(({ g, items }) => (
            <div key={g.key} className="flex gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px]" style={{ background: `${g.c}26` }}>
                <Icon name={g.icon} size={11} color={g.c} />
              </span>
              <div className="min-w-0 flex flex-wrap gap-1">
                {items.map((p) => (
                  <span key={p.label} className="fz-settle inline-flex items-center gap-1 text-xs rounded-[7px] px-2 py-0.5 bg-white/[0.06] text-white">
                    {p.label}
                    {p.small && p.cents ? (
                      <span className="text-[#8190A8] tabular-nums">{money(p.cents)}{p.monthly ? "/mo" : ""}</span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#6B7890] mb-3">Nothing picked yet</p>
      )}
      <dl className="space-y-1 text-sm border-t border-white/[0.07] pt-3">
        {est && <Row k="Estimate" v={estimateText(est)} />}
        <Row k="When" v={timeline} />
        <Row k="From" v={start ? start.replace("I have something, make it better", "Improving what exists") : ""} />
        <Row k="Name" v={me.name} />
        <Row k="Business" v={me.business} />
      </dl>
    </div>
  );
}

/**
 * The thank you, Oct 9 2026. Denny: "that thank you black is not rewarding,
 * make it like green and we are glad". A green page, a white receipt, a check
 * that draws itself and a one-time burst of dots. Everything is visible with
 * no animation at all: the motion lives in @keyframes only (see globals.css,
 * .fz-ty-*), never in a resting opacity:0.
 */
function ThankYou({
  first,
  ticketNo,
  build,
  est,
  picked,
  timeline,
  payIds,
  email,
}: {
  payIds: string[];
  email: string;
  first?: string;
  ticketNo: string;
  build?: Build;
  est: Estimate | null;
  picked: string[];
  timeline: string;
}) {
  const steps = [
    { t: "Ticket sent", d: "Just now", done: true },
    { t: "We read it", d: "Usually today", done: false },
    { t: "Your plan lands", d: "Scope, price and a date", done: false },
  ];
  return (
    <div className="fz-ty-page min-h-screen px-4 pt-28 pb-20 flex items-start sm:items-center justify-center">
      <Tilt3D className="relative max-w-xl w-full">
        <div className="fz-ty-card relative rounded-[24px] bg-white text-[#0C1424] overflow-hidden">
          <div className="relative px-6 sm:px-10 pt-10 pb-8 text-center" style={{ background: "#ECFDF5" }}>
            <div className="relative mx-auto mb-6 h-20 w-20">
              <span aria-hidden className="fz-ty-burst">
                {Array.from({ length: 12 }).map((_, i) => (
                  <i key={i} style={{ ["--a" as string]: `${i * 30}deg`, ["--c" as string]: ["#10B981", "#2B57C4", "#34D399", "#5B9BF9", "#0F6B4F", "#C6E4F8"][i % 6] }} />
                ))}
              </span>
              <span className="fz-ty-ring relative flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "#10B981" }}>
                <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path className="fz-ty-check" d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
            </div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] mb-3" style={{ color: "#0F6B4F" }}>
              Ticket {ticketNo} is in
            </p>
            <h1 className="font-display text-[34px] sm:text-[42px] leading-[1.05] tracking-tight text-[#0C1424]">
              We are so glad you are here{first ? `, ${first}` : ""}.
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed text-[#334155] max-w-md mx-auto">
              <span className="font-semibold text-[#0F6B4F]">Thanks for believing in yourself and in us.</span>{" "}
              Your idea just got moving. We are reading your ticket now and you will hear back soon.
            </p>
          </div>

          <div aria-hidden className="relative h-0 border-t-2 border-dashed border-[#D1FAE5]">
            <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full fz-ty-notch" />
            <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full fz-ty-notch" />
          </div>

          <div className="px-6 sm:px-10 py-7">
            <div className="flex items-baseline gap-3 mb-4">
              <p className="font-display text-xl leading-tight">{build ? build.name : "Your idea"}</p>
              {(est || build) && (
                <p className="ml-auto shrink-0 font-semibold" style={{ color: "#B03A12" }}>{est ? estimateText(est) : build?.from}</p>
              )}
            </div>
            {picked.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {picked.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1.5 text-[13px] rounded-[8px] px-2.5 py-1 bg-[#F1F5F9] text-[#0C1424]">
                    <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.2l2.3 2.3 4.7-5" /></svg>
                    {p}
                  </span>
                ))}
              </div>
            )}
            {timeline && <p className="text-sm text-[#475569] mb-5">Timeline: <span className="text-[#0C1424] font-medium">{timeline}</span></p>}

            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B] mb-3">What happens next</p>
            <ol className="grid grid-cols-3 gap-2">
              {steps.map((st, i) => (
                <li key={st.t} className="relative">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-semibold mb-2"
                    style={st.done ? { background: "#10B981", color: "#fff" } : { background: "#F1F5F9", color: "#0F6B4F", boxShadow: "inset 0 0 0 1.5px #A7F3D0" }}
                  >
                    {st.done ? (
                      <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.2l2.3 2.3 4.7-5" /></svg>
                    ) : i + 1}
                  </span>
                  <p className="text-[14px] font-semibold leading-tight">{st.t}</p>
                  <p className="text-[12px] text-[#64748B] leading-snug mt-0.5">{st.d}</p>
                </li>
              ))}
            </ol>

            {payIds.length > 0 && est && (
              <PayNowLater ids={payIds} email={email} ticket={ticketNo} total={estimateText(est)} />
            )}

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a href="/work" className="flex-1 text-center rounded-[12px] px-5 py-3.5 font-semibold text-white" style={{ background: "#0F6B4F" }}>
                See what we have built &rarr;
              </a>
              <a href="/" className="flex-1 text-center rounded-[12px] px-5 py-3.5 font-semibold text-[#0C1424] bg-[#F1F5F9]">
                Back to home
              </a>
            </div>
            <p className="text-xs text-[#64748B] mt-5 text-center">
              Thought of something else? Write to{" "}
              <a href={`mailto:${SITE.email}`} className="text-[#0F6B4F] font-medium underline underline-offset-4">{SITE.email}</a> and mention {ticketNo}.
            </p>
          </div>
        </div>
      </Tilt3D>
    </div>
  );
}

/** The right-hand column: the build banner, the live ticket, the send button. */
function TicketSide({ loading, ...t }: TicketProps & { loading: boolean }) {
  const { build, est } = t;
  // "Send my Storefront Build ticket", or just "Send my ticket" with no build yet.
  const label = build && build.name !== NOT_SURE ? `Send my ${build.name.replace(/^The /, "")} ticket` : "Send my ticket";
  return (
    <div className="space-y-3">
      <div className="relative rounded-[16px] overflow-hidden border border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/intake-ocean.jpg" alt="" className="block w-full h-[92px] object-cover" />
        <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-[#07090F] via-[#07090F]/70 to-transparent">
          {build ? (
            <div key={build.name} className="fz-settle">
              <p className="font-display text-xl text-white leading-tight">{build.name}</p>
              <p className="text-sm font-semibold" style={{ color: "#F0845F" }}>{est ? estimateText(est) : build.from}</p>
            </div>
          ) : (
            <p className="font-display text-lg text-white/80">Your build shows up here</p>
          )}
        </div>
      </div>

      <TicketCard {...t} />

      <div className="pt-1">
        <button
          type="submit"
          form="fz-ticket"
          disabled={loading}
          className="fz-go w-full rounded-[12px] font-semibold text-base py-4"
        >
          {loading ? "Sending..." : <>{label} <span aria-hidden>&rarr;</span></>}
        </button>
        <p className="text-center text-xs text-[#8190A8] mt-3 leading-relaxed">
          No payment now · you see the price first
          <br />
          A person reads it and replies <span className="font-medium" style={{ color: "#FBBF24" }}>usually the same day</span>
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
