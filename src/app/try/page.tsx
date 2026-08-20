import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import NodeWeb from "@/app/components/NodeWeb";
import IdeaLens from "@/app/components/IdeaLens";
import ScanTool from "@/app/components/ScanTool";

export const metadata: Metadata = {
  title: "Try It",
  description:
    "Two tools that run right now, free, on this page. A simple idea playground and the Free Site Scan.",
  alternates: { canonical: "/try" },
  // Set in full because metadata merging is shallow. A page that declares
  // openGraph replaces the layout block outright, so anything omitted is gone.
  openGraph: {
    title: "Try It | FlowZone",
    description:
      "Two tools that run right now, free, on this page. A simple idea playground and the Free Site Scan.",
    url: `${SITE.url}/try`,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

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
            right here, free. If they are useful, you already know what working with
            us feels like.
          </p>
        </div>
      </section>

      {/* 01 · The playground: the Idea Lens, nothing else. The full Flow Mode
          experience stays at /start for whoever wants the ride. */}
      <section data-flow className="border-t border-rule px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 mb-4">
            <p className="label">01 · The playground</p>
            <p className="label">No signup · in your browser</p>
          </div>
          <h2 className="display text-4xl md:text-5xl mb-3 max-w-2xl">
            Type the thing you keep meaning to start.
          </h2>
          <p className="text-ink-soft font-light leading-relaxed max-w-reading mb-8">
            One box. Describe the idea, or drop in a photo, and it starts shaping it
            with you. You leave with something concrete, not a quote.
          </p>
          <IdeaLens />
          <p className="text-sm text-ink-soft font-light mt-6">
            Want the full experience, with the ride and all four tracks?{" "}
            <Link href="/start" className="text-accent hover:underline">
              Enter the Flow →
            </Link>
          </p>
        </div>
      </section>

      {/* 02 · The scan, live on this page. /scan redirects here. */}
      <section id="scan" data-flow className="border-t border-rule px-6 py-20 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 mb-4">
            <p className="label">02 · The Free Site Scan</p>
            <p className="label">Ten seconds · real checks</p>
          </div>
          <h2 className="display text-4xl md:text-5xl mb-3 max-w-2xl">
            Paste your link. See what it is costing you.
          </h2>
          <p className="text-ink-soft font-light leading-relaxed max-w-reading mb-8">
            We fetch your site the way a phone does and grade what we can measure:
            mobile, speed, structure and search. Every finding is a fact off your own
            page. It is blunt, because polite audits change nothing.
          </p>
          <ScanTool />
        </div>
      </section>

      {/* The next step, named once, on white */}
      <section data-flow className="band-light px-6 py-24">
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
