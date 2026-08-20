import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import NodeWeb from "@/app/components/NodeWeb";
import IdeaLens from "@/app/components/IdeaLens";
import ScanTool from "@/app/components/ScanTool";

export const metadata: Metadata = {
  title: "Try It",
  description:
    "Two free tools, live on this page. Shape your idea in the playground, or scan your site and see what it is costing you.",
  alternates: { canonical: "/try" },
  // Set in full because metadata merging is shallow. A page that declares
  // openGraph replaces the layout block outright, so anything omitted is gone.
  openGraph: {
    title: "Try It | FlowZone",
    description:
      "Two free tools, live on this page. Shape your idea in the playground, or scan your site and see what it is costing you.",
    url: `${SITE.url}/try`,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

/* One goal, pitch-page shape: five-second hero, problem and solution in two
   lines, then the demo IS the product — both tools working, side by side.
   No invented testimonials; the proof line is real work. One CTA at the end. */
export default function TryIt() {
  return (
    <>
      {/* The whole dark half floats in one space: a single node-galaxy canvas
          runs behind the hero AND both tool panels, instead of stopping at the
          hero's edge like every other page. */}
      <div className="relative overflow-hidden">
        <NodeWeb className="opacity-90" />
        <div className="absolute inset-0 gridlight pointer-events-none" />

      {/* Hero: what this is, in five seconds */}
      <section className="relative px-6 pt-16 pb-10">
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-10">
            <p className="label">Try It</p>
            <p className="label hidden sm:block">Free · no signup · no call</p>
          </div>
          <h1 className="display text-4xl md:text-6xl max-w-3xl">
            Try the studio before you hire it.
          </h1>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-2 mt-6 max-w-4xl">
            <p className="text-ink-soft font-light leading-relaxed">
              <span className="text-ink">The problem:</span> every studio says
              trust us, then asks for a call before showing you anything.
            </p>
            <p className="text-ink-soft font-light leading-relaxed">
              <span className="text-ink">Our answer:</span> two of our tools,
              live on this page. Use them, keep what they give you.
            </p>
          </div>
        </div>
      </section>

      {/* The demo IS the product: both tools working, side by side */}
      <section data-flow className="relative px-6 pb-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 items-start">
          <div className="panel p-6 md:p-8">
            <div className="flex items-baseline justify-between gap-4 mb-2">
              <p className="label">01 · The playground</p>
            </div>
            <h2 className="font-display text-2xl md:text-3xl leading-snug mb-2">
              Have an idea? Type it.
            </h2>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-6">
              It starts shaping the name, the look and the brief with you, right
              here.
            </p>
            <IdeaLens />
            <p className="text-xs text-ink-mute font-light mt-5">
              Want the full experience with all four tracks?{" "}
              <Link href="/start" className="text-accent hover:underline">
                Enter the Flow →
              </Link>
            </p>
          </div>

          <div id="scan" className="panel p-6 md:p-8 scroll-mt-24">
            <div className="flex items-baseline justify-between gap-4 mb-2">
              <p className="label">02 · The Free Site Scan</p>
            </div>
            <h2 className="font-display text-2xl md:text-3xl leading-snug mb-2">
              Have a site? Paste it.
            </h2>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-6">
              We fetch it the way a phone does and grade mobile, speed,
              structure and search. Blunt on purpose, and every finding is a
              fact off your own page.
            </p>
            <ScanTool />
          </div>
        </div>
      </section>
      </div>

      {/* Real proof, then the one CTA */}
      <section data-flow className="band-light px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="label justify-center mb-6">The next step</p>
          <h2 className="font-display text-4xl md:text-5xl leading-[0.98] mb-5">
            Liked what they told you?
          </h2>
          <p className="lede max-w-xl mx-auto mb-8">
            These tools come from the same studio that designs and ships real
            builds, like{" "}
            <Link href="/work" className="text-accent hover:underline">
              cardsrg.com
            </Link>
            . The next step is a build ticket: four questions, no meeting, a
            real answer from the person who does the work.
          </p>
          <Link href="/intake" className="btn-primary">
            Start a Ticket <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
