import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { QUICK_JOBS, CARE, money } from "@/lib/catalog";
import OfferPanel from "./OfferPanel";

/**
 * /landing-page, added Sep 23 2026. The $99.99 "one new page or landing page"
 * quick job as its own offer, with optional website care at a discount.
 * Same high-contrast black panel as /intake. Every price comes from catalog.ts.
 */

const PAGE = QUICK_JOBS.find((j) => j.id === "page")!;
const PRICE = money(PAGE.price);

export const metadata: Metadata = {
  title: `A landing page for ${PRICE}`,
  description: `One landing page, designed and built by a person for ${PRICE} flat. Add website care for ${money(CARE.withPage)} a month, cancel anytime.`,
  alternates: { canonical: "/landing-page" },
  openGraph: {
    title: `A landing page for ${PRICE} | FlowZone Studio`,
    description: `One page that says what you do and gets people to act. ${PRICE} flat. Optional website care, cancel anytime.`,
    url: `${SITE.url}/landing-page`,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

const STEPS = [
  { n: "01", t: "Send a ticket", b: "Tap what you need, add a line about your business. Takes about a minute." },
  { n: "02", t: "Get a plan", b: "A person reads it and replies with the plan and a date, usually the same day." },
  { n: "03", t: "Go live", b: "We build the page, you look it over, it goes live. You own it." },
];

const FAQS = [
  {
    q: "What counts as a landing page?",
    a: "One scrolling page with a single job: say what you do, show why you, and point to one clear next step like call, book, buy or email.",
  },
  {
    q: "What does website care cover?",
    a: "Keeping your site up and working after launch: text and photo updates when you need them, fixes when something breaks, and a check that it still loads fast. Bigger changes get quoted first.",
  },
  {
    q: "Do I have to sign up for care?",
    a: `No. Care is never required. It is month to month at ${money(CARE.monthly)}, or ${money(CARE.withPage)} a month when you get it with the page, and you can cancel anytime.`,
  },
  {
    q: "Do I own the page?",
    a: "Yes. The code, the content and the accounts are yours at handover, with or without care.",
  },
];

export default function LandingPageOffer() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Landing page design and build",
        url: `${SITE.url}/landing-page`,
        provider: { "@id": `${SITE.url}/#organization` },
        offers: [
          { "@type": "Offer", name: "Landing page", price: (PAGE.price / 100).toFixed(2), priceCurrency: "USD" },
          {
            "@type": "Offer",
            name: "Website care",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: (CARE.monthly / 100).toFixed(2),
              priceCurrency: "USD",
              unitText: "MONTH",
            },
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-paper-deep pt-28 pb-24 px-4 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="max-w-6xl mx-auto space-y-6">
        <OfferPanel pagePrice={PAGE.price} careMonthly={CARE.monthly} careWithPage={CARE.withPage} />

        {/* How it goes */}
        <section className="rounded-[24px] border border-white/10 p-6 sm:p-8" style={{ background: "#07090F" }}>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8190A8] mb-5">How it goes</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className="rounded-[16px] border border-white/[0.07] p-5" style={{ background: "#10141D" }}>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full font-display text-xs font-semibold"
                    style={{ background: ["#1E3A8A", "#5B9BF9", "#C6E4F8"][i], color: i === 2 ? "#0C1424" : "#fff" }}
                  >
                    {i + 1}
                  </span>
                  <p className="font-display text-lg text-white">{s.t}</p>
                </div>
                <p className="text-sm text-[#C9D2E3] leading-relaxed">{s.b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Questions */}
        <section className="rounded-[24px] border border-white/10 p-6 sm:p-8" style={{ background: "#07090F" }}>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8190A8] mb-5">Straight answers</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-[16px] border border-white/[0.07] p-5" style={{ background: "#10141D" }}>
                <h2 className="font-display text-lg text-white mb-2">{f.q}</h2>
                <p className="text-sm text-[#C9D2E3] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
