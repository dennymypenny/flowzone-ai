import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import NodeWeb from "@/app/components/NodeWeb";

export const metadata: Metadata = {
  title: "Try It",
  description:
    "Two things you can run right now, free, no call and no email required to start. Flow Mode and the Free Site Scan.",
  alternates: { canonical: "/try" },
  // Set in full because metadata merging is shallow. A page that declares
  // openGraph replaces the layout block outright, so anything omitted is gone.
  openGraph: {
    title: "Try It | FlowZone",
    description:
      "Two things you can run right now, free. Flow Mode and the Free Site Scan.",
    url: `${SITE.url}/try`,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

// The two hooks, one card each. If a third free tool ships, it gets a card
// here instead of a nav slot.
const TOOLS = [
  {
    num: "01",
    color: "#5B9BF9",
    name: "Flow Mode",
    href: "/start",
    line: "Bring the idea you keep meaning to start.",
    body: "A free idea studio that runs inside the page. Type the thing you have been circling and it starts shaping it with you: the brief, the name, the content, the plan. You leave with something concrete, not a quote.",
    meta: "No signup · in your browser",
    cta: "Enter the Flow",
  },
  {
    num: "02",
    color: "#C6E4F8",
    name: "Free Site Scan",
    href: "/scan",
    line: "Paste your link. See what it is costing you.",
    body: "We fetch your site the way a phone does and grade what we can measure: mobile, speed, structure and search. Every finding is a fact off your own page. It is blunt, because polite audits change nothing.",
    meta: "Ten seconds · real checks",
    cta: "Run the scan",
  },
];

export default function TryIt() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <NodeWeb className="opacity-90" />
        <div className="absolute inset-0 gridlight pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-12">
            <p className="label">Try It</p>
            <p className="label hidden sm:block">Free · no call required</p>
          </div>
          <h1 className="display text-5xl md:text-8xl max-w-4xl">
            Kick the tires
            <br />
            before you talk to anyone.
          </h1>
          <p className="lede max-w-reading mt-10">
            Most studios ask for a call before they show you anything. These two run
            right now, in this browser, free. If they are useful, you already know
            what working with us feels like.
          </p>
        </div>
      </section>

      {/* The tools */}
      <section data-flow className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {TOOLS.map((t) => (
            <Link
              key={t.name}
              href={t.href}
              className="panel p-8 md:p-10 flex flex-col group hover:border-accent transition-colors"
            >
              <div className="flex items-center justify-between mb-8">
                <p className="label" style={{ color: t.color }}>
                  {t.num}
                </p>
                <p className="label">{t.meta}</p>
              </div>
              <h2 className="font-display text-4xl leading-none mb-3">{t.name}</h2>
              <p className="text-ink font-light mb-4">{t.line}</p>
              <p className="text-sm text-ink-soft font-light leading-relaxed max-w-reading mb-10">
                {t.body}
              </p>
              <span className="btn-ghost mt-auto self-start group-hover:border-accent transition-colors">
                {t.cta} <span className="arrow">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* The next step, named once */}
      <section data-flow className="bg-paper-deep glow border-t border-rule px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-6">
            Liked what they told you?
          </h2>
          <p className="lede max-w-xl mx-auto mb-8">
            The next step is a build ticket. Four questions, no meeting, and a real
            answer from the person who does the work.
          </p>
          <Link href="/intake" className="btn-primary">
            Start a Ticket <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
