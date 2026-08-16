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
            The studio is early. We would rather show you one shop we actually built,
            end to end, than a grid of logos we had nothing to do with.
          </p>
        </div>
      </section>

      {/* CardsRG */}
      <section className="px-6 pb-24">
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
      <section className="bg-paper-deep px-6 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="label mb-6">Straight Answer</p>
            <h2 className="display text-4xl md:text-5xl">Why is this list short?</h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-ink-soft leading-relaxed max-w-reading">
              Because it is honest. The studio is new and takes on a small number of
              projects at a time. You could pad a work page with concepts and stock
              mockups and most people would never check. We would rather you hire us
              knowing exactly what has been shipped.
            </p>
            <p className="text-ink-soft leading-relaxed max-w-reading mt-4">
              What you get in exchange for being early: the person who replies to your
              email is the person who builds the thing, and the pricing reflects where
              the studio is rather than where it wants to be.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <Link href="/intake" className="btn-primary">
                Start a project
              </Link>
              <Link href="/how-we-work" className="btn-ghost">
                How we work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-paper-deep glow border-t border-rule px-6 py-24">
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
