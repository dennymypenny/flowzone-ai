import Link from "next/link";
import type { Metadata } from "next";
import StartModes from "@/app/components/StartModes";
import IdeaLens from "@/app/components/IdeaLens";
import FlowPath from "@/app/components/FlowPath";
import Arrival from "@/app/components/Arrival";
import Icon from "@/components/Icon";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Flow Mode",
  description:
    "Flow through the zone with your thoughts. Six moves, and you walk away holding a real brief for your idea, yours to keep whether you hire us or not.",
};

/**
 * Flow Mode follows the mark: three dots, three moves.
 * Dot 1 the idea, dot 2 the shape, dot 3 the files you keep.
 * The FlowPath strip charges left to right as the visitor moves through,
 * so the page itself does what the company does: it takes an idea and
 * gets it moving along the line.
 */

function DotHeading({
  n,
  color,
  label,
}: {
  n: number;
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <svg width="30" height="14" viewBox="0 0 30 14" aria-hidden>
        <line x1="0" y1="7" x2="30" y2="7" stroke="#26355A" strokeWidth="1.5" />
        <circle cx={n === 1 ? 5 : n === 2 ? 15 : 25} cy="7" r="5" fill={color} />
      </svg>
      <p className="text-[11px] font-medium uppercase tracking-label" style={{ color }}>
        {n} · {label}
      </p>
    </div>
  );
}

export default function Start() {
  return (
    <>
      <Arrival />
      {/* Light through the whole flow */}
      <div className="fixed inset-0 -z-10 lightshaft pointer-events-none" aria-hidden />
      <section className="relative overflow-hidden px-6 pt-24 pb-6">
        <div className="absolute inset-0 aurora drift pointer-events-none" />
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
          <p className="lede max-w-reading mt-10">
            Flow Mode is a generative idea studio, free to use. Type what you
            imagine, shape it into a name, a logo, colours, words and a video,
            and leave with the files. Three dots, three moves.
          </p>
        </div>
      </section>

      {/* The idea travels this line as you scroll */}
      <FlowPath />

      {/* ---------- Dot 1: the idea ---------- */}
      <section id="flow-idea" className="relative overflow-hidden px-6 pt-16 pb-20 scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          <DotHeading n={1} color="#1E3A8A" label="The idea" />
          <h2 className="display text-3xl md:text-5xl max-w-2xl mb-8">
            Say the thing out loud.
          </h2>
          <IdeaLens />
        </div>
      </section>

      {/* ---------- Dot 2: the shape ---------- */}
      <section id="flow-shape" className="border-t border-rule px-6 pt-16 pb-24 scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          <DotHeading n={2} color="#5B9BF9" label="The shape" />
          <h2 className="display text-3xl md:text-5xl max-w-2xl mb-8">
            Now give it a shape.
          </h2>
          <StartModes />
        </div>
      </section>

      {/* ---------- Dot 3: yours to keep ---------- */}
      <section id="flow-keep" data-flow className="border-t border-rule px-6 pt-16 pb-24 scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          <DotHeading n={3} color="#C6E4F8" label="Yours to keep" />
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
                c: "#5B9BF9",
                t: "It asks the taste question",
                b: "How it should feel is the part most briefs skip entirely, and it is the part that decides whether you like the result.",
              },
              {
                i: "disk",
                c: "#2DD4BF",
                t: "It saves as you go",
                b: "Close the tab, sleep on it, come back. Your session is still here and nothing was sent anywhere.",
              },
              {
                i: "download",
                c: "#34D399",
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
