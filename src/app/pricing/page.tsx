import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Three flat packages for brand, site and the system that runs it. One payment, no retainers, delivered in days.",
};

const tiers = [
  {
    name: "Starter",
    price: "$997",
    tagline: "One thing, built properly.",
    best: false,
    blurb:
      "You know exactly what you need. A brand, a site, or one system. We build that one thing and hand it over finished.",
    includes: [
      "One part: Brand, Site or System",
      "Designed against your brand, never a template",
      "Fast on mobile, live on your own domain",
      "One full round of revisions",
      "30 days of post launch support",
    ],
    cta: "Start with Starter",
  },
  {
    name: "Growth",
    price: "$2,497",
    tagline: "All three, working together.",
    best: true,
    blurb:
      "The one most people should take. Brand, site and one system wired into it, so the thing runs after launch instead of sitting there.",
    includes: [
      "Everything in Starter",
      "Brand identity: logo, palette, type and usage rules",
      "Full site or storefront, up to 6 pages",
      "One system built in (intake, booking, invoicing or reporting)",
      "Payments, forms and email wired end to end",
      "Two rounds of revisions",
      "60 days of post launch support",
    ],
    cta: "Start with Growth",
  },
  {
    name: "Scale",
    price: "Custom",
    tagline: "More moving parts.",
    best: false,
    blurb:
      "Multiple brands, a bigger catalog, or systems that have to talk to tools you already run. We scope it together and quote it flat.",
    includes: [
      "Everything in Growth",
      "Multi brand or large catalog storefronts",
      "Custom API and tool integrations",
      "Ongoing build partnership if you want it",
      "A direct line to me, not a support queue",
      "Flat quote agreed before any work starts",
    ],
    cta: "Get a quote",
  },
];

export default function Pricing() {
  return (
    <>
      {/* Header */}
      <section className="px-6 pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
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
            You know the number before we start. No hourly billing, no scope creep
            invoice at the end and no retainer you forget to cancel. If a cheaper tier
            fits your idea, we will tell you that before you pay.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-4 items-start">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`panel p-8 flex flex-col relative ${t.best ? "border-accent/45 bg-raised glow" : ""}`}
            >
              <div className="flex items-baseline justify-between mb-6">
                <p className="label">{t.name}</p>
                {t.best && <p className="font-mono text-[11px] uppercase tracking-label text-accent">Most taken</p>}
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
                href={`/intake?service=${encodeURIComponent(t.name)}`}
                className={`${t.best ? "btn-primary" : "btn-ghost"} mt-auto w-full`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Every project */}
      <section className="bg-paper-deep px-6 py-24">
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
      <section className="bg-paper-deep glow border-t border-rule px-6 py-28">
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
