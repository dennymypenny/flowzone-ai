import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import NodeWeb from "@/app/components/NodeWeb";
import AddToCart from "@/app/components/AddToCart";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Three flat packages for brand, site and the system that runs it. One payment, no retainers, and a date agreed before you pay.",
  alternates: { canonical: "/pricing" },
  // Set in full because metadata merging is shallow. A page that declares
  // openGraph replaces the layout block outright, so anything omitted is gone.
  openGraph: {
    title: "Pricing | FlowZone",
    description:
      "Three flat packages for brand, site and the system that runs it. One payment, no retainers, and a date agreed before you pay.",
    url: `${SITE.url}/pricing`,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

const tiers = [
  {
    link: "/intake",
    name: "One Build",
    price: "$500",
    tagline: "Pick one thing. Get it done.",
    best: false,
    blurb:
      "Your identity, your site, or the system that runs things — one build, finished and handed over. Less than most agencies charge for a discovery call.",
    includes: [
      "One build: Identity, Site or Engine",
      "Designed for you, never a template",
      "A full round of revisions",
      "30 days of support after launch",
    ],
    cta: "Start with one",
  },
  {
    link: "/intake?build=full",
    name: "The Full Build",
    price: "$1,500",
    tagline: "Brand, site and system. The whole thing.",
    best: true,
    blurb:
      "What most people are actually here for. The look, the site and the machinery wired together, live in weeks — for less than one month of a typical agency retainer.",
    includes: [
      "Identity, site and one working system",
      "Copy written for you, end to end",
      "Payments, forms and email wired in",
      "Two rounds of revisions, 60 days of support",
    ],
    cta: "Start the Full Build",
  },
  {
    link: "/intake?build=storefront",
    name: "The Storefront",
    price: "From $2,500",
    tagline: "A real shop, quoted flat.",
    best: false,
    blurb:
      "Cart, checkout and money in your account, like cardsrg.com. Bigger catalogs and custom integrations get scoped together and quoted flat before anything starts.",
    includes: [
      "Everything in The Full Build",
      "Full storefront with cart and checkout",
      "Your existing tools connected",
      "A flat number agreed before you pay",
    ],
    cta: "Get your flat quote",
  },
];

export default function Pricing() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <NodeWeb className="opacity-90" />
        <div className="absolute inset-0 gridlight pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-12">
            <p className="label">Pricing</p>
            <p className="label hidden sm:block">Flat · Paid once · No retainers</p>
          </div>
          <h1 className="display text-5xl md:text-8xl max-w-4xl">
            Three ways
            <br />
            to work together.
          </h1>
          <p className="lede max-w-reading mt-10">
            Three numbers, all flat, all agreed before we start. No hourly billing and
            no retainer you forget to cancel. If the cheaper tier fits your idea, we
            will tell you that before you pay.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section data-flow className="band-light px-6 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-4 items-start">
          {tiers.map((t) => (
            <div
              key={t.name}
              className="panel p-8 flex flex-col relative"
              // On white the raised fill and the glow that marked the popular
              // tier both disappear, so the ring carries it instead. #2B57C4 is
              // 6.44:1 on white, the same blue the light band gives text-accent.
              style={
                t.best
                  ? {
                      borderColor: "#2B57C4",
                      boxShadow:
                        "0 0 0 1px #2B57C4, 0 24px 50px -26px rgba(11, 19, 34, 0.45)",
                    }
                  : undefined
              }
            >
              <div className="flex items-baseline justify-between mb-6">
                <p className="label">{t.name}</p>
                {t.best && <p className="text-[11px] font-medium uppercase tracking-label text-accent">Best value</p>}
              </div>

              <p className="font-display text-5xl leading-none mb-3 text-ink">{t.price}</p>
              <p className="text-sm mb-6 text-accent">{t.tagline}</p>

              <p className="text-sm leading-relaxed mb-8 text-ink-soft font-light">{t.blurb}</p>

              <ul className="space-y-3 mb-10 flex-1 border-t border-rule pt-6">
                {t.includes.map((line) => (
                  <li key={line} className="flex gap-3 text-sm leading-relaxed text-ink-soft font-light">
                    <span className="text-accent shrink-0">/</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={t.link}
                className={`${t.best ? "btn-primary" : "btn-ghost"} mt-auto w-full`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Small jobs: the under-a-build menu, one line each */}
      <section data-flow className="px-6 py-16 border-t border-rule">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="label mb-4">Not ready for a build?</p>
            <h2 className="font-display text-3xl leading-snug mb-3">
              Most small jobs? Under $50.
            </h2>
            <p className="text-sm text-ink-soft font-light leading-relaxed max-w-reading">
              One-off pieces, priced like one-off pieces. Most of them are under fifty dollars. Open a ticket, pick A Small Job and say which one.
            </p>
            <Link href="/intake?build=small" className="btn-ghost mt-6">
              Start a small job <span className="arrow">→</span>
            </Link>
          </div>
          <div className="md:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-3 self-center">
            {[
              ["flyer", "One-off design — flyer, post or cover", "$49.99"],
              ["form", "Booking or contact form, wired to your email", "$49.99"],
              ["reel", "Promo reel, cut for sound-off feeds", "$74.99"],
              ["page", "One new page or landing page", "$99.99"],
              ["logo", "Logo-only refresh", "$49.99"],
              ["fix", "Speed and mobile fix pass", "$49.99"],
            ].map(([id, w, price]) => (
              <div key={id} className="flex items-center justify-between gap-4 border-b border-rule pb-3">
                <span className="text-sm text-ink-soft font-light">
                  {w} <span className="text-ink whitespace-nowrap">{price}</span>
                </span>
                <AddToCart id={id} showPrice={false} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Every project */}
      <section data-flow className="bg-paper-deep px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="border-b border-rule pb-4 mb-14">
            <p className="label">In Every Package</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {[
              {
                t: "A person on it",
                b: "AI gives us the speed. A human makes the calls on taste, layout and what actually reads well before anything ships.",
              },
              {
                t: "You own everything",
                b: "The code, the domain, the accounts, the content. Nothing is held hostage and there is no platform to stay subscribed to.",
              },
              {
                t: "Documentation",
                b: "Every build is handed over with clear docs on what it does, how to use it and how to ask for changes.",
              },
              {
                t: "Post launch support",
                b: "Support is built into every tier. If something breaks in that window we fix it free.",
              },
              {
                t: "Secure by default",
                b: "Standard security practice on every build. Your data and your customers' data stay protected.",
              },
              {
                t: "Your existing tools",
                b: "We build with what you already run. If it has an API or a webhook we can work with it.",
              },
            ].map((i) => (
              <div key={i.t}>
                <p className="font-display text-3xl leading-tight mb-3">{i.t}</p>
                <p className="text-sm text-ink-soft leading-relaxed">{i.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-flow className="bg-paper-deep glow border-t border-rule px-6 py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] mb-8">
            Not sure which one?
          </h2>
          <p className="text-ink-soft mb-10 max-w-md mx-auto leading-relaxed">
            Tell us the idea in a few sentences. We come back with the right tier, a
            scope and a delivery date, even when the right tier is the cheap one.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/intake" className="btn-primary">
              Start a project
            </Link>
            <a
              href={`mailto:${SITE.email}`}
              className="btn border border-rule text-ink hover:bg-raised"
            >
              {SITE.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
