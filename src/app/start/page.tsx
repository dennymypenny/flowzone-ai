import Link from "next/link";
import type { Metadata } from "next";
import StartModes from "@/app/components/StartModes";
import IdeaLens from "@/app/components/IdeaLens";
import FlowPath from "@/app/components/FlowPath";
import Arrival from "@/app/components/Arrival";
import Icon from "@/components/Icon";
import { SITE } from "@/lib/site";
import NodeWeb from "@/app/components/NodeWeb";

export const metadata: Metadata = {
  title: "Flow Mode",
  description:
    "Flow through the zone with your thoughts. Six moves, and you walk away holding a real brief for your idea, yours to keep whether you hire us or not.",
  alternates: { canonical: "/start" },
  // Set in full because metadata merging is shallow. A page that declares
  // openGraph replaces the layout block outright, so anything omitted is gone.
  openGraph: {
    title: "Flow Mode | FlowZone",
    description:
      "Six moves, and you walk away holding a real brief for your idea. Yours to keep whether you hire us or not.",
    url: `${SITE.url}/start`,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

/**
 * Flow Mode follows the mark: three dots, three moves.
 *
 * The page used to open with a headline, a paragraph, a numbered eyebrow and
 * a second headline before anybody reached the one box that does anything.
 * That is a brochure. On a page whose whole point is a tool, the tool is the
 * hero, so the input sits in the first screen and the promise under it is
 * three short marks rather than a paragraph.
 * Dot 1 the idea, dot 2 the shape, dot 3 the files you keep.
 * The FlowPath strip charges left to right as the visitor moves through,
 * so the page itself does what the company does: it takes an idea and
 * gets it moving along the line.
 */

export default function Start() {
  return (
    <>
      <Arrival />
      {/* Light through the whole flow */}
      <div className="fixed inset-0 -z-10 lightshaft pointer-events-none" aria-hidden />
      <section className="relative overflow-hidden px-6 pt-24 pb-6">
        <NodeWeb className="opacity-90" />
        <div className="absolute inset-0 gridlight pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <p className="chip">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              Flow Mode
            </p>
          </div>
          <h1 className="display text-5xl md:text-8xl max-w-4xl">
            <span className="text-gradient-white">Enter</span>{" "}
            <span className="text-gradient">the Flow</span>
            <span className="text-gradient-white">.</span>
          </h1>
          <p className="lede max-w-reading mt-8 mb-12">
            A free idea studio that runs inside this page. Start with the thing
            you keep meaning to start.
          </p>

          <div id="flow-idea" className="scroll-mt-28">
            <IdeaLens />
          </div>

          {/* The three things somebody actually wants to know before they type
              into a box on a stranger's website. */}
          <ul className="flex flex-wrap gap-x-8 gap-y-3 mt-10 text-sm text-ink-soft font-light">
            {[
              ["shield", "No signup, no card"],
              ["disk", "Nothing is uploaded"],
              ["download", "You keep the files"],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-center gap-2.5">
                <Icon name={icon} size={16} color="#5B9BF9" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The idea travels this line as you scroll */}
      <FlowPath />

      {/* ---------- Dot 2: the shape ---------- */}
      <section id="flow-shape" className="border-t border-rule px-6 pt-20 pb-24 scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          <h2 className="display text-3xl md:text-5xl max-w-2xl mb-4">
            Now give it a shape.
          </h2>
          <p className="text-ink-soft font-light leading-relaxed max-w-reading mb-10">
            Four tools, all running here in the browser. Pick the one that
            matches what you need next. Your work in each is saved separately,
            so switching never costs you anything.
          </p>
          <StartModes />
        </div>
      </section>

      {/* ---------- Dot 3: yours to keep ---------- */}
      {/* The chapter about what you walk out with is the one that has to land,
          so it gets the light. Near black on white reads at 16:1, where the
          dark sections run at about 9. */}
      <section id="flow-keep" data-flow className="band-light px-6 pt-20 pb-24 scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-8">Yours to keep</p>
          <div className="grid md:grid-cols-12 gap-10 mb-14">
            <h2 className="md:col-span-6 display text-4xl md:text-5xl">
              Leave holding real files.
            </h2>
            <p className="md:col-span-6 text-ink-soft font-light leading-relaxed self-end max-w-reading">
              A brief is the thing every designer, developer and agency asks you for,
              and the reason quotes come back vague is that almost nobody has one.
              Walk out with this and you can brief anybody. We are one option on that
              list, not the point of it.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                i: "puzzle",
                // Paired down for the light band. #5B9BF9 is 2.80:1 on white,
                // #155E9C is 6.75:1. Same blue family, readable.
                c: "#155E9C",
                t: "It asks the taste question",
                b: "How it should feel is the part most briefs skip entirely, and it is the part that decides whether you like the result.",
              },
              {
                i: "disk",
                // #2DD4BF is 1.86:1 on white, #0C6E80 is 5.90:1.
                c: "#0C6E80",
                t: "It saves as you go",
                b: "Close the tab, sleep on it, come back. Your session is still here and nothing was sent anywhere.",
              },
              {
                i: "download",
                // #34D399 is 1.92:1 on white, #0F6B4F is 6.49:1.
                c: "#0F6B4F",
                t: "It comes with you",
                b: "Logos as SVG, palettes as CSS, the video, the brief. Real files, downloaded, yours.",
              },
            ].map((x) => (
              <div key={x.t} className="panel panel-lift p-7">
                <span className="block mb-4"><Icon name={x.i} size={22} color={x.c} /></span>
                <p
                  className="text-[11px] font-medium uppercase tracking-label mb-3"
                  style={{ color: x.c }}
                >
                  {x.t}
                </p>
                <p className="text-sm text-ink-soft font-light leading-relaxed">{x.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-flow className="bg-paper-deep glow border-t border-rule px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mb-6">
            Already know what you want?
          </h2>
          <p className="text-ink-soft font-light mb-9 max-w-md mx-auto leading-relaxed">
            Skip the session. Send it straight over and you will get back which parts
            you need, a price and a date.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={SITE.mailto} className="btn-primary shine">
              Start an email <span className="arrow">→</span>
            </a>
            <Link href="/services" className="btn-ghost">
              See what we build
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
