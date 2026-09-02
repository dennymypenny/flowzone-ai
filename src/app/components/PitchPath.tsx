"use client";

import { useState } from "react";
import Link from "next/link";

/* The pitch, as a conversation. The visitor picks the sentence they have
   actually said out loud, and the section answers it the way we would in
   a DM: mirror the problem, name the build, give the price, open the
   ticket. Every path ends in the pipeline at /intake. */

const PATHS = [
  {
    k: "identity",
    c: "#2B57C4",
    said: "“People don’t get what we do.”",
    title: "That is a brand problem, not a you problem.",
    body: "Your work is fine. The mark, the colors and the words around it are not doing their job, so every first impression starts from zero. The Identity Build fixes the first impression once, and everything you post after it compounds.",
    build: "The Identity Build",
    from: "$500",
    href: "/intake?build=identity",
  },
  {
    k: "site",
    c: "#155E9C",
    said: "“Our website is embarrassing. Or missing.”",
    title: "People check the link before they trust you.",
    body: "If the link is outdated or a bio page, the decision is made before you ever hear about it. The Site Build is one page that answers the question and asks for the next step, instead of a profile and a DM.",
    build: "The Site Build",
    from: "$500",
    href: "/intake?build=site",
  },
  {
    k: "storefront",
    c: "#A03D14",
    said: "“People buy through our DMs.”",
    title: "You are the checkout. That is the bottleneck.",
    body: "Every sale waits for you to wake up, reply and invoice. The Storefront Build gives your buyers a cart, a checkout and a receipt while you sleep. We built one for CardsRG, our own shop, and it sells.",
    build: "The Storefront Build",
    from: "From $2,500",
    href: "/intake?build=storefront",
  },
  {
    k: "engine",
    c: "#0F6B4F",
    said: "“I do everything by hand.”",
    title: "The busywork is the growth cap.",
    body: "Follow-ups, booking, invoicing. Each one is small and together they eat the week. The Engine Build wires them to run on their own, so the hours go back to the work people actually pay you for.",
    build: "The Engine Build",
    from: "$500",
    href: "/intake?build=engine",
  },
  {
    k: "unsure",
    c: "#3D6FE8",
    said: "“None of these. I just have an idea.”",
    title: "Then you are the easy case.",
    body: "Open a ticket and tell us the idea, a few sentences is enough. We will tell you which build fits and what it costs before you pay anything. If a $49.99 small job covers it, that is what we will say.",
    build: "A ticket, four questions",
    from: "Costs nothing to ask",
    href: "/intake",
  },
];

export default function PitchPath() {
  const [k, setK] = useState(PATHS[0].k);
  const p = PATHS.find((x) => x.k === k) ?? PATHS[0];

  return (
    <section data-flow className="band-light px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-6 mb-8">
          <div className="md:col-span-7">
            <p className="label mb-4">Start the conversation</p>
            <h2 className="display text-4xl md:text-5xl text-[#0B1322]">
              Which one have you
              <br />
              said out loud?
            </h2>
          </div>
          <p className="md:col-span-5 text-[#49566E] font-light leading-relaxed self-end max-w-reading">
            Pick the sentence that sounds like you and we will take it from
            there, the same way we would if you messaged us.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Pick the sentence that sounds like you">
          {PATHS.map((x) => {
            const on = x.k === k;
            return (
              <button
                key={x.k}
                role="tab"
                aria-selected={on}
                onClick={() => setK(x.k)}
                className="text-sm font-light rounded-full px-4 py-2 border transition-colors"
                style={
                  on
                    ? { background: x.c, borderColor: x.c, color: "#FFFFFF" }
                    : { background: "#FFFFFF", borderColor: "#C9D6EA", color: "#49566E" }
                }
              >
                {x.said}
              </button>
            );
          })}
        </div>

        <div
          className="relative rounded-[18px] border bg-white p-7 md:p-10 overflow-hidden"
          style={{
            borderColor: `${p.c}2E`,
            backgroundImage: `linear-gradient(180deg, ${p.c}0F 0%, rgba(255,255,255,0) 46%)`,
            boxShadow: `0 24px 48px -30px ${p.c}66`,
          }}
        >
          <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: p.c }} aria-hidden />
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <p className="text-[11px] font-medium uppercase tracking-label mb-3" style={{ color: p.c }}>
                You said {p.said}
              </p>
              <h3 className="font-display text-[1.8rem] md:text-4xl leading-[1.08] text-[#0B1322] mb-4">
                {p.title}
              </h3>
              <p className="text-[#49566E] font-light leading-relaxed max-w-reading">
                {p.body}
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <p className="text-[11px] font-medium uppercase tracking-label text-[#647089] mb-1">
                The fix
              </p>
              <p className="font-display text-2xl text-[#0B1322]">{p.build}</p>
              <p className="text-sm font-medium mb-5" style={{ color: p.c }}>
                {p.from}
              </p>
              <Link href={p.href} className="btn-primary">
                Start a ticket <span className="arrow">→</span>
              </Link>
              <p className="text-[13px] text-[#647089] font-light mt-3 md:ml-auto max-w-xs">
                Four questions, no call, a real reply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
