import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Real work shipped by FlowZone. CardsRG, a collector trading card storefront taken from an idea to a live shop.",
};

export default function Work() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <div className="absolute inset-0 aurora drift pointer-events-none" />
        <div className="absolute inset-0 gridlight pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-12">
            <p className="label">Work</p>
            <p className="label">Everything here is real and live</p>
          </div>
          <h1 className="display text-5xl md:text-8xl max-w-4xl">
            A short list,
            <br />
            on purpose.
          </h1>
          <p className="lede max-w-reading mt-10">
This is where the studio starts, and it started from something we
            actually care about. One shop, built end to end, by people who wanted it
            to be good more than they wanted it to be finished.
          </p>
        </div>
      </section>

      {/* CardsRG */}
      <section data-flow className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="border-t border-rule pt-10 grid md:grid-cols-12 gap-10 mb-10">
            <div className="md:col-span-4">
              <p className="label mb-4">01 · Storefront</p>
              <h2 className="font-display text-5xl leading-none mb-4">CardsRG</h2>
              <a
                href="https://cardsrg.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                cardsrg.com ↗
              </a>
            </div>
            <div className="md:col-span-8">
              <p className="text-ink-soft leading-relaxed max-w-reading">
                A collector trading card shop for PSA graded cards, rare inserts and
                pack rips. It started as an Instagram DM business and needed to look
                like a real store without losing the energy that made people follow it
                in the first place.
              </p>
              <p className="text-ink-soft leading-relaxed max-w-reading mt-4">
                We built the brand mark, the whole storefront, product pages with grade
                and set detail, cart and checkout. Dark, loud and fast, because that is
                what the audience responds to. It went live and it sells.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 border-t border-rule pt-6">
                {[
                  ["Brand", "Mark and palette"],
                  ["Site", "Full storefront"],
                  ["Commerce", "Cart and checkout"],
                  ["Stack", "Next.js on Vercel"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="label mb-1.5">{k}</p>
                    <p className="text-sm text-ink-soft">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel overflow-hidden">
              <img
                src="/assets/crg-hero.jpg"
                alt="CardsRG homepage with the CRG shield logo and the headline Rip. Pull. Collect."
                className="w-full h-auto"
              />
            </div>
            <div className="panel overflow-hidden">
              <img
                src="/assets/crg-cards.jpg"
                alt="CardsRG product grid showing graded Lionel Messi and Stan Lee cards with prices and cart buttons"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Walkthrough: the thinking behind the mark ---------- */}
      <section data-flow className="border-t border-rule px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-6">Walk through one decision at a time</p>
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            <h2 className="md:col-span-7 display text-4xl md:text-5xl">
              Anyone can show you
              <br />
              a finished logo.
            </h2>
            <p className="md:col-span-5 text-ink-soft font-light leading-relaxed self-end max-w-reading">
              The finished thing tells you almost nothing. What decided it is the part
              worth reading, so here is the CRG mark taken apart, one choice at a time,
              including the ones we got wrong first.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="panel overflow-hidden">
                <img
                  src="/assets/crg-hero.jpg"
                  alt="The CRG shield mark in place on the CardsRG storefront"
                  className="w-full h-auto"
                />
              </div>
              <p className="text-[11px] text-ink-mute font-light mt-3 leading-relaxed">
                The mark in the place it actually has to work: small, in a corner, next
                to a menu, on top of a photograph. That is the real test, not a
                presentation slide.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-10">
              {[
                {
                  n: "01",
                  c: "#4C7BE8",
                  t: "A shield, because the category already speaks it",
                  b: "Trading cards live inside sports crests, team badges and holo foil. A shield is not a clever idea, it is the shape the audience already reads as authority, and using the language your buyer already speaks beats being original at them.",
                },
                {
                  n: "02",
                  c: "#FF3D9A",
                  t: "Two accents, not five",
                  b: "Teal and magenta, and nothing else fighting them. Card culture is visually loud, so the mark had to hold its own against a photo of forty foil packs without joining the noise. Two colours far apart on the wheel do that. Five would have turned into mush at the size it actually gets used.",
                },
                {
                  n: "03",
                  c: "#38E1FF",
                  t: "The crown earns its place",
                  b: "It is not decoration. The business is built on grails, the one card everyone is chasing, so the crown is the promise restated at the top of the mark. Every element should be answering a question about the business. If it is only there because it looked good, it comes out.",
                },
                {
                  n: "04",
                  c: "#FBBF24",
                  t: "Chrome that survives being shrunk",
                  b: "The bevel and the inner glow read as premium at full size, but the mark spends its life at forty pixels in a browser tab. So the silhouette had to work in one flat colour first, and the shine got added on top. Build it the other way around and you get a logo that dies the moment it is small.",
                },
                {
                  n: "05",
                  c: "#34D399",
                  t: "The subline does the explaining",
                  b: "RIPS and GRAILS sits under the shield so the mark never has to explain itself. Three letters cannot tell a first-time visitor what the business does. Two words can, and they can be dropped when the audience knows you.",
                },
              ].map((x) => (
                <div key={x.n} className="border-l-2 pl-6" style={{ borderLeftColor: x.c }}>
                  <p
                    className="text-[11px] font-medium uppercase tracking-label mb-2.5"
                    style={{ color: x.c }}
                  >
                    {x.n}
                  </p>
                  <h3 className="font-display text-2xl leading-snug mb-3">{x.t}</h3>
                  <p className="text-sm text-ink-soft font-light leading-relaxed">{x.b}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The one that was wrong first */}
          <div className="mt-20 panel p-8 md:p-10">
            <div className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-5">
                <p className="label mb-4">And the one we got wrong first</p>
                <h3 className="font-display text-3xl leading-snug mb-4">
                  The thumbnail that did not work.
                </h3>
                <p className="text-sm text-ink-soft font-light leading-relaxed">
                  Version one: two people behind a pile of packs against a bright sky.
                  It looked fine and it performed badly, which is the most useful kind
                  of failure because it is specific.
                </p>
              </div>
              <div className="md:col-span-7 space-y-6">
                {[
                  {
                    k: "What was wrong",
                    c: "#FBBF24",
                    v: "Half the frame was empty sky. On a phone, at the size a thumbnail is actually seen, the faces were smaller than a fingernail and the product was an unreadable smear along the bottom.",
                  },
                  {
                    k: "What changed",
                    c: "#34D399",
                    v: "Faces scaled up until they carry the frame, product pushed into every remaining gap so the density itself is the message, sky deleted entirely. Same two people, same packs, same shoot. Only the decisions changed.",
                  },
                  {
                    k: "The rule underneath it",
                    c: "#5B9BF9",
                    v: "Design for the size it gets viewed at, not the size you are working at. Almost every weak thumbnail, logo and hero image is a thing that was judged on a big screen and lives on a small one.",
                  },
                ].map((r) => (
                  <div key={r.k} className="border-t border-rule pt-5">
                    <p
                      className="text-[11px] font-medium uppercase tracking-label mb-2"
                      style={{ color: r.c }}
                    >
                      {r.k}
                    </p>
                    <p className="text-sm text-ink-soft font-light leading-relaxed max-w-reading">
                      {r.v}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-ink-soft font-light leading-relaxed max-w-reading mt-14">
            This is the level every decision gets, on every build, whether or not
            anybody ever asks. You are welcome to ask.
          </p>
        </div>
      </section>

      {/* Honest note */}
      <section data-flow className="bg-paper-deep px-6 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="label mb-6">The Honest Bit</p>
            <h2 className="display text-4xl md:text-5xl">
              New studio.
              <br />
              Not a new obsession.
            </h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-ink-soft leading-relaxed max-w-reading">
              FlowZone is new. The thing it is built on is not. Brand, design and the
              way a company sounds have been the obsession for years, long before any
              of it had a name or an invoice attached. This page is short because the
              studio is at the beginning, not because the work is a side interest we
              picked up recently.
            </p>
            <p className="text-ink-soft leading-relaxed max-w-reading mt-4">
              It also means everything here is real. No concepts dressed up as clients,
              no logos we had nothing to do with. And what you get for arriving early
              is the version of a studio everyone says they want later: the person who
              answers your email is the person who builds the thing, and the pricing
              reflects where we are rather than where we intend to be.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <a href={SITE.mailto} className="btn-primary">
                Start an email <span className="arrow">→</span>
              </a>
              <Link href="/how-we-work" className="btn-ghost">
                How we work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-flow className="bg-paper-deep glow border-t border-rule px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-6">
            Want to be the next one on this page?
          </h2>
          <a href={`mailto:${SITE.email}`} className="btn-primary mt-4">
            {SITE.email}
          </a>
        </div>
      </section>
    </>
  );
}
