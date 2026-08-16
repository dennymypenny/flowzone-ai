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
      <section className="px-6 pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
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
