import Link from "next/link";
import type { Metadata } from "next";
import { SITE, PILLARS } from "@/lib/site";
import { LANDING_NAV, PRICE_LINE, type Landing } from "@/lib/landing";
import NodeWeb from "@/app/components/NodeWeb";
import MessageUs, { TicketNote } from "@/components/MessageUs";

/* One template for every search landing page. Content lives in
   lib/landing.ts. Everything ships visible: data-flow only on sections
   below the header, same as the rest of the site. */

export function landingMetadata(l: Landing): Metadata {
  return {
    title: l.title,
    description: l.description,
    alternates: { canonical: `/${l.slug}` },
    openGraph: {
      title: `${l.title} | FlowZone Studio`,
      description: l.description,
      url: `${SITE.url}/${l.slug}`,
      siteName: "FlowZone",
      type: "website",
      locale: "en_US",
    },
  };
}

function LandingSchema({ l }: { l: Landing }) {
  const url = `${SITE.url}/${l.slug}`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: l.service,
        serviceType: l.service,
        description: l.answer,
        url,
        provider: { "@id": `${SITE.url}/#organization` },
        areaServed: [
          { "@type": "AdministrativeArea", name: "Orange County, California" },
          { "@type": "AdministrativeArea", name: "Los Angeles County, California" },
          { "@type": "Country", name: "United States" },
        ],
        offers: l.offers
          ? l.offers.map((o) => ({
              "@type": "Offer",
              name: o.name,
              price: o.price,
              priceCurrency: "USD",
              url: `${SITE.url}/pricing`,
            }))
          : [
              { "@type": "Offer", name: "One Build", price: "500", priceCurrency: "USD", url: `${SITE.url}/pricing` },
              { "@type": "Offer", name: "The Full Build", price: "1500", priceCurrency: "USD", url: `${SITE.url}/pricing` },
              {
                "@type": "Offer",
                name: "The Storefront",
                priceSpecification: { "@type": "PriceSpecification", minPrice: "2500", priceCurrency: "USD" },
                url: `${SITE.url}/pricing`,
              },
            ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: l.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "FlowZone Studio", item: SITE.url },
          { "@type": "ListItem", position: 2, name: l.label, item: url },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function LandingPage({ l }: { l: Landing }) {
  return (
    <>
      <LandingSchema l={l} />

      {/* Header. The answer sits right under the h1 on purpose: it is the
          sentence search snippets and answer engines lift. */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <NodeWeb className="opacity-90" />
        <div className="absolute inset-0 gridlight pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-12">
            <p className="label">{l.label}</p>
            <p className="label hidden sm:block">FlowZone Studio</p>
          </div>
          <h1 className="display text-5xl md:text-7xl max-w-4xl">{l.h1}</h1>
          <p className="lede max-w-reading mt-10">{l.answer}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <MessageUs />
            <Link href="/work" className="btn-ghost">
              See the work <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section data-flow className="band-light px-6 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="label mb-4">What you get</p>
            <h2 className="font-display text-4xl leading-tight">
              Everything, finished and handed over.
            </h2>
          </div>
          <ul className="md:col-span-8 grid sm:grid-cols-2 gap-x-10">
            {l.get.map((g) => (
              <li key={g} className="border-t border-rule py-5 text-ink-soft leading-relaxed">
                {g}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who it is for */}
      <section data-flow className="bg-paper-deep px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="border-b border-rule pb-4 mb-12">
            <p className="label">Who it is for</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {l.forWho.map((w) => (
              <div key={w.name}>
                <h3 className="font-display text-2xl leading-tight mb-3">{w.name}</h3>
                <p className="text-ink-soft leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three parts, the studio's own framing */}
      <section data-flow className="band-light px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="border-b border-rule pb-4 mb-12 flex items-baseline justify-between">
            <p className="label">One studio, three parts</p>
            <p className="label hidden sm:block">{SITE.line}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {PILLARS.map((p) => (
              <div key={p.name}>
                <p className="label mb-3">{p.num}</p>
                <h3 className="font-display text-3xl leading-none mb-3">{p.name}</h3>
                <p className="text-ink-soft leading-relaxed">{p.line}</p>
              </div>
            ))}
          </div>
          <p className="text-ink-soft leading-relaxed mt-14 max-w-reading">
            {l.priceLine ?? PRICE_LINE}{" "}
            <Link href="/pricing" className="underline underline-offset-4">
              See pricing
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section data-flow className="bg-paper-deep px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="border-b border-rule pb-4 mb-6">
            <p className="label">Straight answers</p>
          </div>
          {l.faqs.map((f) => (
            <div key={f.q} className="border-t border-rule py-10 grid md:grid-cols-12 gap-8">
              <h3 className="md:col-span-5 font-display text-2xl md:text-3xl leading-tight">{f.q}</h3>
              <p className="md:col-span-7 text-ink-soft leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related + CTA */}
      <section data-flow className="band-light band-flow px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-8">
            Got the idea?
            <br />
            Send it over.
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <MessageUs />
          </div>
          <TicketNote className="text-center" />
          <p className="label mt-14 mb-4 justify-center">Also from the studio</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            {l.related.map((r) => (
              <Link key={r} href={`/${r}`} className="text-sm underline underline-offset-4">
                {LANDING_NAV[r]}
              </Link>
            ))}
            <Link href="/services" className="text-sm underline underline-offset-4">
              Everything we build
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
