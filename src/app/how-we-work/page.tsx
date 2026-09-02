import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { days, faqs } from "@/lib/process";
import NodeWeb from "@/app/components/NodeWeb";
import MessageUs, { TicketNote } from "@/components/MessageUs";

export const metadata: Metadata = {
  title: "How We Work",
  description:
    "What actually happens between your idea and a finished brand, site or storefront. Four steps, one person on it the whole way, and a date agreed before you pay.",
  alternates: { canonical: "/how-we-work" },
  // Set in full because metadata merging is shallow. A page that declares
  // openGraph replaces the layout block outright, so anything omitted is gone.
  openGraph: {
    title: "How We Work | FlowZone",
    description:
      "What happens between your idea and a finished brand, site or storefront. Four steps, one person on it the whole way, and a date agreed before you pay.",
    url: `${SITE.url}/how-we-work`,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

const principles = [
  {
    title: "A person makes every call",
    body:
      "A build takes a week instead of two months because the studio is small and the process is tight, not because anything is left on autopilot. Every layout, headline and color decision gets looked at by a person before it ships.",
  },
  {
    title: "Flat price, agreed up front",
    body:
      "You know the number before we start. No hourly billing, no scope creep invoice at the end, no retainer you forget to cancel. If the scope genuinely changes we talk about it before doing the work.",
  },
  {
    title: "You own everything",
    body:
      "The code, the domain, the accounts, the content. We hand over the keys at the end. Plenty of studios keep clients locked in on purpose and it is a bad way to run a business.",
  },
  {
    title: "You talk to the person building it",
    body:
      "No account manager relaying messages to a contractor. The person who replies to your email is the person writing the code.",
  },
];

export default function HowWeWork() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <NodeWeb className="opacity-90" />
        <div className="absolute inset-0 gridlight pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-12">
            <p className="label">How We Work</p>
            <p className="label hidden sm:block">Four steps · One studio</p>
          </div>
          <h1 className="display text-5xl md:text-8xl max-w-4xl">
            From an idea
            <br />
            to a live thing.
          </h1>
          <p className="lede max-w-reading mt-10">
            No agency theatre. Here is exactly what happens, what we need from you and
            when, so you can decide before you spend anything. Your date is agreed with
            your scope, before any money moves.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section data-flow className="band-light px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {days.map((d) => (
            <div key={d.tag} className="border-t border-rule py-12 grid md:grid-cols-12 gap-8">
              <div className="md:col-span-3">
                <p className="label mb-3">{d.tag}</p>
                <p className="font-display text-3xl leading-none">{d.title}</p>
              </div>
              <div className="md:col-span-6">
                <p className="text-ink-soft leading-relaxed">{d.body}</p>
              </div>
              <div className="md:col-span-3 md:text-right">
                <p className="label mb-2">Your time</p>
                <p className="text-sm text-ink-soft">{d.you}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section data-flow className="bg-paper-deep px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="border-b border-rule pb-4 mb-14">
            <p className="label">How We Operate</p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-14 gap-y-12">
            {principles.map((p) => (
              <div key={p.title}>
                <h2 className="font-display text-3xl leading-tight mb-3">{p.title}</h2>
                <p className="text-ink-soft leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section data-flow className="band-light px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="border-b border-rule pb-4 mb-14 flex items-baseline justify-between">
            <p className="label">Straight Answers</p>
            <p className="label hidden sm:block">Including the awkward ones</p>
          </div>
          {faqs.map((f) => (
            <div key={f.q} className="border-t border-rule py-10 grid md:grid-cols-12 gap-8">
              <h3 className="md:col-span-5 font-display text-2xl md:text-3xl leading-tight">
                {f.q}
              </h3>
              <p className="md:col-span-7 text-ink-soft leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section data-flow className="bg-paper-deep glow border-t border-rule px-6 py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] mb-8">
            Still reading?
            <br />
            Send us the idea.
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <MessageUs />
          </div>
          <TicketNote className="text-center" />
        </div>
      </section>
    </>
  );
}
