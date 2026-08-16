import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "FlowZone is a small creative studio. AI gives us the speed, humans give it the taste.",
};

export default function About() {
  return (
    <>
      {/* Header */}
      <section className="px-6 pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-12">
            <p className="label">About</p>
            <p className="label hidden sm:block">A small studio, on purpose</p>
          </div>
          <h1 className="display text-5xl md:text-8xl max-w-4xl">
            Good ideas deserve
            <br />
            more than a template.
          </h1>
          <p className="lede max-w-reading mt-10">
            FlowZone is a creative studio built on one belief. Every idea worth
            starting deserves a real brand, a real site and real systems behind it.
            Brand identity is the part we are best at, the mark and the words and the
            feel, and we carry it through everything else we build. AI gives us the
            speed. A person gives it the taste, the judgment and the finish.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto border-t border-rule pt-14 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <p className="label mb-6">The Story</p>
            <h2 className="display text-4xl md:text-5xl">
              Most ideas die between the napkin and the launch.
            </h2>
          </div>
          <div className="md:col-span-8 space-y-5 text-ink-soft leading-relaxed max-w-reading">
            <p>
              The brand never gets made. The site never goes live. The day to day
              busywork eats whatever energy was left over, and eighteen months later
              the idea is a note on somebody's phone.
            </p>
            <p>
              The problem is not a lack of tools. There have never been more tools. The
              problem is that turning an idea into a working business takes design,
              copy, code and systems at the same time, and almost nobody starting out
              has a team for all four.
            </p>
            <p>
              So that is what the studio is. The brand, the site, the storefront and the
              systems behind it, designed, built, tested and live in days. Not three
              vendors, three invoices and a lot of translation between them.
            </p>
            <p className="text-ink font-display text-2xl leading-snug pt-2">
              You bring the idea. We build the whole thing. You run the business.
            </p>
          </div>
        </div>
      </section>

      {/* Where we are, plainly */}
      <section className="bg-paper-deep px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="border-b border-rule pb-4 mb-14 flex items-baseline justify-between">
            <p className="label">Where The Studio Is</p>
            <p className="label hidden sm:block">No inflated numbers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
            {[
              {
                t: "Founded in 2026",
                b: "New, and we say so rather than implying a decade of history that does not exist.",
              },
              {
                t: "A small number of projects at a time",
                b: "Deliberately. It is why you get answers the same day instead of joining a queue.",
              },
              {
                t: "Real work only",
                b: "Everything on the work page is live and was built here. No concepts dressed up as clients.",
              },
              {
                t: "Strongest at brand",
                b: "Identity, copy and the feel of a thing. That is the work we care most about and the reason the rest holds together.",
              },
              {
                t: "Able to take the whole build",
                b: "Blank page to live business, without handing you off to a second vendor halfway through.",
              },
            ].map((i) => (
              <div key={i.t}>
                <p className="font-display text-3xl leading-tight mb-3">{i.t}</p>
                <p className="text-sm text-ink-soft leading-relaxed">{i.b}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col sm:flex-row gap-3">
            <Link href="/work" className="btn-ghost">
              See the work
            </Link>
            <a
              href={SITE.linkedinFounder}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              The founder on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Stand for */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="border-b border-rule pb-4 mb-14">
            <p className="label">What We Stand For</p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-14 gap-y-12">
            {[
              {
                t: "Taste is the job",
                b: "A model can produce a hundred layouts in a minute. Knowing which one is right is the part you are actually paying for, and it does not get delegated.",
              },
              {
                t: "Say the true thing",
                b: "No invented case studies, no borrowed testimonials, no five star average from clients who do not exist. If we are early, we tell you we are early.",
              },
              {
                t: "Finish what we start",
                b: "A project is done when it is live, documented and in your hands. Not when the design file is approved.",
              },
              {
                t: "No lock in",
                b: "You own the code, the domain and the accounts. If you want to take it somewhere else next year, take it.",
              },
            ].map((v) => (
              <div key={v.t}>
                <h3 className="font-display text-3xl leading-tight mb-3">{v.t}</h3>
                <p className="text-ink-soft leading-relaxed">{v.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-paper-deep glow border-t border-rule px-6 py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] mb-8">
            {SITE.line}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/intake" className="btn-primary">
              Start a project
            </Link>
            <a
              href={`mailto:${SITE.email}`}
              className="btn border border-rule text-ink hover:bg-raised hover:border-ink/25"
            >
              {SITE.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
