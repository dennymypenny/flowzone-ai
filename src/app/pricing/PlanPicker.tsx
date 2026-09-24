"use client";
import { useState } from "react";
import Link from "next/link";

/**
 * Pricing as one clear choice, the same black-panel look as /intake:
 * tap a plan (a real key, white when off, white + blue ring when picked),
 * read what it includes, press one blue button. One panel, one action,
 * short on a phone.
 */

export type Plan = {
  key: string;
  name: string;
  price: string;
  unit?: string;
  one: string;
  includes: string[];
  href: string;
  cta: string;
  badge?: string;
};

const EVERY = [
  "A person makes every call",
  "You own the code and accounts",
  "Docs on how it all works",
  "Support after launch",
  "Works with the tools you have",
  "Price agreed before you pay",
];

function Check({ c = "#A8C4FF" }: { c?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-[3px]">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}

export default function PlanPicker({ plans, start = "full" }: { plans: Plan[]; start?: string }) {
  // Tap to pick, tap the same one again to un-pick. Same rule as every
  // other choice on the site.
  const [pick, setPick] = useState(start);
  const p = plans.find((x) => x.key === pick);

  return (
    <div
      className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] rounded-[24px] border border-white/10 overflow-clip shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)]"
      style={{ background: "#07090F" }}
    >
      {/* Left: the plans */}
      <div className="p-5 sm:p-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8190A8] mb-4">Pick one</p>
        <div className="space-y-3.5" role="radiogroup" aria-label="Pick a plan">
          {plans.map((x) => {
            const on = x.key === pick;
            return (
              <button
                key={x.key}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setPick(on ? "" : x.key)}
                className="fz-key w-full text-left flex items-center gap-4 rounded-[14px] px-4 py-3.5"
              >
                <span
                  aria-hidden
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                  style={on ? { borderColor: "#2B57C4", background: "#FFFFFF" } : { borderColor: "#7A879E", background: "transparent" }}
                >
                  {on && <span className="h-2.5 w-2.5 rounded-full bg-[#2B57C4]" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[15px]">{x.name}</span>
                    {x.badge && (
                      <span
                        className="text-[10px] font-semibold uppercase tracking-[0.08em] rounded-[6px] px-1.5 py-0.5"
                        style={on ? { background: "#2B57C4", color: "#fff" } : { background: "#FFFFFF", color: "#0C1424" }}
                      >
                        {x.badge}
                      </span>
                    )}
                  </span>
                  <span className={`block text-[13px] mt-0.5 leading-snug ${on ? "text-[#4A5873]" : "text-[#9AA7BD]"}`}>{x.one}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-semibold text-[16px] tabular-nums">{x.price}</span>
                  {x.unit && <span className={`block text-[10px] uppercase tracking-[0.1em] ${on ? "text-[#4A5873]" : "text-[#9AA7BD]"}`}>{x.unit}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: what the picked plan includes, and the one button */}
      <div className="p-5 sm:p-8 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col" style={{ background: "#0A0D14" }}>
        {p ? (
          <div key={p.key} className="fz-settle">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8190A8]">What you get</p>
            <p className="font-display text-3xl sm:text-4xl text-white tracking-tight mt-2">
              {p.name} <span className="text-[#A8C4FF]">{p.price}</span>
            </p>
            <ul className="mt-5 space-y-2.5 text-[15px] text-white">
              {p.includes.map((t) => (
                <li key={t} className="flex items-start gap-2.5"><Check />{t}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="fz-settle">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8190A8]">Not sure yet?</p>
            <p className="font-display text-3xl sm:text-4xl text-white tracking-tight mt-2">Tell us the idea.</p>
            <p className="mt-4 text-[15px] text-[#C9D2E3] leading-relaxed">
              We come back with the right plan, a scope and a date, even when the right one is the cheap one.
            </p>
          </div>
        )}

        <div className="mt-6 rounded-[14px] border border-white/[0.07] p-4" style={{ background: "#10141D" }}>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8190A8] mb-2.5">In every plan</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[13px] text-[#C9D2E3]">
            {EVERY.map((t) => (
              <li key={t} className="flex items-start gap-2"><Check c="#6B7890" />{t}</li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-7">
          <Link href={p ? p.href : "/intake"} className="fz-go block text-center w-full rounded-[12px] font-semibold text-base py-4">
            {p ? p.cta : "Start a ticket"} <span aria-hidden>&rarr;</span>
          </Link>
          <p className="text-center text-xs text-[#6B7890] mt-3">No payment now · you see the price first · no retainer required</p>
        </div>
      </div>
    </div>
  );
}
