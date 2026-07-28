import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Three flat-rate packages for brands, sites, storefronts and the systems that run them. One-time payment, no retainers, delivered in days.",
};

const tiers = [
  {
    name: "Starter",
    price: "$997",
    tagline: "One thing, built properly.",
    best: false,
    blurb:
      "You know exactly what you need. A site, a storefront, a dashboard, one system. We build it and hand it over finished.",
    includes: [
      "One complete build (site, storefront, or system)",
      "Brand-matched design, not a template",
      "Mobile-first and fast, deployed live on your domain",
      "One full round of revisions",
      "30 days of post-launch support",
    ],
    cta: "Start with Starter",
  },
  {
    name: "Growth",
    price: "$2,497",
    tagline: "The whole thing, running on its own.",
    best: true,
    blurb:
      "The one most people want. Brand, site or storefront, and one business system wired into it so the thing actually runs after launch.",
    includes: [
      "Everything in Starter",
      "Brand identity: logo, palette, type, and usage rules",
      "Full site or storefront, up to 6 pages",
      "One business system built in (lead intake, booking, invoicing, or reporting)",
      "Payments, forms and email wired end to end",
      "Two rounds of revisions",
      "60 days of post-launch support",
    ],
    cta: "Start with Growth",
  },
  {
    name: "Scale",
    price: "Custom",
    tagline: "You have more moving parts.",
    best: false,
    blurb:
      "Multiple brands, a bigger catalog, or systems that have to talk to tools you already run. We scope it together and quote it flat.",
    includes: [
      "Everything in Growth",
      "Multi-brand or large-catalog storefronts",
      "Custom API and tool integrations",
      "Ongoing build partnership if you want it",
      "Direct line to me, not a support queue",
      "Flat quote before any work starts",
    ],
    cta: "Get a Quote",
  },
];

export default function Pricing() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-20 pb-16 px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">Pricing</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">Three Ways to Work Together</h1>
          <p className="text-xl text-gray-500 leading-relaxed mb-6">
            Flat rate, paid once, delivered in days. No retainers, no hourly billing, no surprises at the end.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 inline-block">
            <p className="text-blue-700 font-semibold text-sm">
              💡 Not sure which one fits? Tell us the idea and we will point you at the right tier, even if it is the cheaper one.
            </p>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6 items-start">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl p-8 flex flex-col h-full transition-all ${
                t.best
                  ? "border-2 border-blue-600 shadow-xl lg:-mt-4 lg:pb-12 bg-white"
                  : "border border-gray-200 hover:border-blue-400 hover:shadow-md bg-white"
              }`}
            >
              {t.best && (
                <span className="self-start bg-blue-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <p className="font-black text-gray-900 text-2xl">{t.name}</p>
              <p className="text-sm font-semibold text-blue-600 mb-4">{t.tagline}</p>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-black text-gray-900">{t.price}</span>
                {t.price !== "Custom" && <span className="text-sm text-gray-400 mb-1.5">one time</span>}
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{t.blurb}</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {t.includes.map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm text-gray-600 leading-relaxed">
                    <span className="text-blue-600 font-bold shrink-0">✓</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/intake?service=${encodeURIComponent(t.name)}`}
                className={`block text-center font-bold px-5 py-3.5 rounded-xl transition-colors mt-auto ${
                  t.best
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border-2 border-gray-200 text-gray-900 hover:border-blue-600 hover:text-blue-600"
                }`}
              >
                {t.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Every Project Includes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🚀", title: "Fast Delivery", body: "Most builds ship in 3–7 business days. You get a working, tested product, not a rough draft." },
              { icon: "🎨", title: "A Human on It", body: "AI gives us the speed. A person makes the calls on taste, layout and what actually reads well." },
              { icon: "📖", title: "Full Documentation", body: "Every build comes with clear docs explaining what it does, how to use it, and how to request changes." },
              { icon: "🤝", title: "Post-Launch Support", body: "Support after delivery is built into every tier. Something breaks, we fix it free." },
              { icon: "🔒", title: "Secure and Reliable", body: "Industry-standard security on every build. Your data and your customers' data stay protected." },
              { icon: "⚙️", title: "Tool Agnostic", body: "We work with 200+ tools. If it has an API or a webhook, we can build with it." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="font-bold text-gray-900 mb-2">{item.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Not Sure Where to Start?</h2>
          <p className="text-blue-200 text-lg mb-8">
            Tell us the idea in a few sentences. We will come back with the right tier, a scope, and a delivery date.
          </p>
          <Link
            href="/intake"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg"
          >
            Start Your Project →
          </Link>
        </div>
      </section>
    </>
  );
}
