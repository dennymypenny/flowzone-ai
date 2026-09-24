"use client";
import { useState } from "react";
import Link from "next/link";
import { money } from "@/lib/catalog";

/**
 * The offer, in the same black-panel look as /intake: pick a plan on the
 * left (the picked one goes white), see what is included on the right, one
 * white button that carries the pick into the ticket.
 */

type Plan = "page" | "care";

const INCLUDED_PAGE = [
  "One page, designed and built by a person",
  "Looks right on every phone",
  "Your words tightened into a clear pitch",
  "One button that goes where you want: call, book, buy or email",
  "You own it at handover",
];
const INCLUDED_CARE = [
  "Text and photo updates when you need them",
  "Fixes when something breaks",
  "Kept fast and online, checked every month",
  "Month to month, cancel anytime",
];

function Check({ c = "#fff" }: { c?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}

export default function OfferPanel({
  pagePrice,
  careMonthly,
  careWithPage,
}: {
  pagePrice: number;
  careMonthly: number;
  careWithPage: number;
}) {
  const [plan, setPlan] = useState<Plan>("care");
  const save = money(careMonthly - careWithPage);

  const plans: { key: Plan; name: string; sub: string; price: string; unit: string; was?: string; badge?: string }[] = [
    { key: "page", name: "Just the page", sub: "Built once, yours to run", price: money(pagePrice), unit: "one time" },
    {
      key: "care",
      name: "Page + website care",
      sub: `Page now, then ${money(careWithPage)} a month`,
      price: money(pagePrice),
      unit: `+ ${money(careWithPage)}/mo`,
      was: `${money(careMonthly)}/mo`,
      badge: `Save ${save} a month`,
    },
  ];

  const href =
    plan === "care"
      ? `/intake?pick=${encodeURIComponent("Landing page,Website care (monthly)")}`
      : `/intake?pick=${encodeURIComponent("Landing page")}`;

  return (
    <section
      className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] rounded-[24px] border border-white/10 overflow-clip shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)]"
      style={{ background: "#07090F" }}
    >
      {/* Left: the pitch and the plans */}
      <div className="p-6 sm:p-9 flex flex-col">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8190A8]">Landing page · flat price</p>
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-tight leading-[1.02] mt-3">
          One page that gets people to act.{" "}
          <span className="text-[#A8C4FF]">{money(pagePrice)}.</span>
        </h1>
        <p className="text-[#C9D2E3] text-lg leading-relaxed mt-4 max-w-md">
          Say what you do, show why you and point to one next step. Designed and built by a person, not a template.
        </p>

        <div className="mt-8 space-y-3.5" role="radiogroup" aria-label="Pick a plan">
          {plans.map((p) => {
            const on = plan === p.key;
            return (
              <button
                key={p.key}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setPlan(p.key)}
                className="fz-key w-full text-left flex items-center gap-4 rounded-[14px] px-4 py-4"
              >
                <span
                  aria-hidden
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                  style={on ? { borderColor: "#04291B", background: "#FFFFFF" } : { borderColor: "#A9B4C7", background: "#FFFFFF" }}
                >
                  {on && <span className="h-2.5 w-2.5 rounded-full bg-[#0F6B4F]" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[15px]">{p.name}</span>
                    {p.badge && (
                      <span
                        className="text-[10px] font-semibold uppercase tracking-[0.08em] rounded-[6px] px-1.5 py-0.5"
                        style={on ? { background: "#04291B", color: "#fff" } : { background: "#0C1424", color: "#fff" }}
                      >
                        {p.badge}
                      </span>
                    )}
                  </span>
                  <span className={`block text-[13px] mt-0.5 ${on ? "text-[#0A4A33]" : "text-[#5B6880]"}`}>{p.sub}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-semibold text-[17px] tabular-nums">{p.price}</span>
                  <span className={`block text-[11px] tabular-nums ${on ? "text-[#0A4A33]" : "text-[#5B6880]"}`}>
                    {p.was && <span className="line-through mr-1 opacity-70">{p.was}</span>}
                    {p.unit}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-8">
          <p className="flex items-center justify-center gap-2 text-sm text-[#8190A8] mb-3">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6.2" /><path d="M8 4.8V8l2.2 1.4" strokeLinecap="round" /></svg>
            Reply <span className="font-medium text-[#FBBF24]">usually the same day</span>
          </p>
          <Link
            href={href}
            className="fz-go block text-center w-full rounded-[12px] font-semibold text-base py-4"
          >
            {plan === "care" ? `Get the page + care` : `Get my landing page, ${money(pagePrice)}`} <span aria-hidden>&rarr;</span>
          </Link>
          <p className="flex items-center justify-center gap-2 text-xs text-[#6B7890] mt-3">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" /></svg>
            No payment now · care is optional, cancel anytime
          </p>
        </div>
      </div>

      {/* Right: a page mock and what is included */}
      <div className="p-5 sm:p-7 lg:border-l border-t lg:border-t-0 border-white/10 space-y-4" style={{ background: "#0A0D14" }}>
        <div className="relative rounded-[16px] overflow-hidden border border-white/10 aspect-[16/10]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/intake-ocean.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-[9%] rounded-[10px] bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col" aria-hidden>
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#E7ECF4]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F0845F]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#FBBF24]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
              <span className="ml-2 h-2 flex-1 max-w-[45%] rounded-[4px] bg-[#EEF2F8]" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <span className="h-5 w-5 rounded-full bg-[#DDEEFB] mb-2" />
              <p className="font-display text-[13px] sm:text-base font-semibold text-[#0C1424] leading-tight">YOUR BUSINESS,<br />SAID CLEARLY.</p>
              <span className="mt-1.5 h-1.5 w-2/5 rounded-[3px] bg-[#E7ECF4]" />
              <span className="mt-1 h-1.5 w-1/3 rounded-[3px] bg-[#E7ECF4]" />
              <span className="mt-3 rounded-[6px] bg-[#0C1424] text-white text-[8px] sm:text-[10px] font-semibold px-3 py-1.5">Book a call &rarr;</span>
            </div>
          </div>
        </div>

        <div className="rounded-[16px] border border-white/[0.07] p-5" style={{ background: "#10141D" }}>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8190A8] mb-3">Included in the page</p>
          <ul className="space-y-2.5 text-[15px] text-white">
            {INCLUDED_PAGE.map((t) => (
              <li key={t} className="flex items-start gap-2.5"><span className="mt-1"><Check /></span>{t}</li>
            ))}
          </ul>
        </div>

        <div
          className="rounded-[16px] border p-5 transition-all duration-300"
          style={plan === "care" ? { background: "#10141D", borderColor: "#34D39966" } : { background: "#10141D", borderColor: "rgba(255,255,255,0.07)", opacity: 0.55 }}
        >
          <div className="flex items-baseline gap-2 mb-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8190A8]">Website care</p>
            <p className="ml-auto text-sm text-white tabular-nums">
              <span className="line-through text-[#6B7890] mr-1.5">{money(careMonthly)}</span>
              {money(careWithPage)}<span className="text-[#8190A8]">/mo</span>
            </p>
          </div>
          <ul className="space-y-2.5 text-[15px] text-white">
            {INCLUDED_CARE.map((t) => (
              <li key={t} className="flex items-start gap-2.5"><span className="mt-1"><Check c="#34D399" /></span>{t}</li>
            ))}
          </ul>
          {plan !== "care" && (
            <button type="button" onClick={() => setPlan("care")} className="mt-4 text-sm text-white underline underline-offset-4">
              Add care for {money(careWithPage)} a month
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
