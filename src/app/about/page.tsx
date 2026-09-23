import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import NodeWeb from "@/app/components/NodeWeb";
import MessageUs, { TicketNote } from "@/components/MessageUs";

/*
 * /about is written to be read by people and quoted by AI search.
 * Structure: value prop sentence, what we do, what makes us different,
 * who uses us, the team, how it works, key facts (a crawlable <dl>), FAQ.
 *
 * The honesty rule from /work applies here too: every client named below is
 * real work that is on the work page. CardsRG is the studio's own store and
 * is labeled that way. Prices must match lib/catalog.ts and /pricing.
 */

export const metadata: Metadata = {
  title: "About",
  description:
    "FlowZone is a creative studio that builds the brand, the website and the systems behind it for founders, small businesses and personal brands. Flat prices, no retainers, one person on it start to finish.",
  alternates: { canonical: "/about" },
  // Set in full because metadata merging is shallow. A page that declares
  // openGraph replaces the layout block outright, so anything omitted is gone.
  openGraph: {
    title: "About | FlowZone",
    description:
      "FlowZone is a creative studio that builds the brand, the website and the systems behind it for founders, small businesses and personal brands.",
    url: `${SITE.url}/about`,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

/* The logo band. White marks cut from each client's own logo. */
const LOGOS = [
  { src: "/assets/logos/logo-shutters-depot.png", alt: "Shutters Depot", w: 704, h: 120, show: 30 },
  { src: "/assets/logos/logo-abc-capital.png", alt: "ABC Capital Group", w: 265, h: 120, show: 40 },
  { src: "/assets/logos/logo-slipfolio.png", alt: "SlipFolio", w: 401, h: 120, show: 34 },
  { src: "/assets/logos/logo-nextplayu.png", alt: "NextPlayU", w: 1055, h: 120, show: 26 },
  { src: "/assets/logos/logo-mahj-coffee.png", alt: "Mahj & Coffee", w: 131, h: 120, show: 58 },
  { src: "/assets/logos/logo-cardsrg.png", alt: "CardsRG", w: 118, h: 120, show: 58 },
];

const SERVICES = [
  {
    t: "Brand identity",
    b: "The logo, the palette, the type and the voice, decided together so everything after it has something to be built from. You leave with a usage guide anyone on your team can follow, and a brand people recognize the second time they see it.",
  },
  {
    t: "Websites and storefronts",
    b: "Custom marketing sites, portfolios and ecommerce storefronts designed against your brand, never a theme. Built on Next.js, deployed to Vercel on your own domain, fast and made for phones first, because that is where most visitors show up.",
  },
  {
    t: "Business systems",
    b: "The part that keeps working after launch: lead intake, booking, payments, email follow up and reporting. Wired in and tested with real data, so a new customer lands in your inbox instead of falling through a gap.",
  },
  {
    t: "Motion and video",
    b: "Promo reels cut for sound-off feeds, product explainer animations and brand intros. Built to explain in a few seconds what a screenshot cannot, like the SlipFolio product animation on the work page.",
  },
  {
    t: "Single graphics and small jobs",
    b: "Flyers, social packs, channel art, decks and quick site fixes at one flat price each, starting at $49.99. For brands that already have a foundation and need one thing done well this week.",
  },
];

const DIFFERENT = [
  {
    t: "Flat price, quoted before you pay",
    b: "Builds start at $500 and the Full Build is $1,500, listed publicly on the pricing page. Most branding agencies quote only after a discovery call and bill hourly once the work starts. Here you see the number first and it does not move unless you change the scope.",
  },
  {
    t: "No retainer and no contract",
    b: "You pay per project and you can walk away the day it launches. Design subscriptions like Design Pickle bill every month whether you need work or not, and many agencies ask for a monthly retainer. FlowZone asks for neither.",
  },
  {
    t: "You own everything",
    b: "The code, the domain, the accounts and the content are yours at handover. Sites built on Squarespace or Wix stay on that platform and its monthly plan for as long as they are live. A FlowZone site can be moved anywhere, any time.",
  },
  {
    t: "Brand, site and system in one studio",
    b: "Hiring a logo designer on Fiverr and a developer on Upwork means two briefs, two invoices and a lot of translation between them. One studio carries the brand straight into the site and the systems behind it, so all three agree with each other.",
  },
  {
    t: "You talk to the person building it",
    b: "No account manager relaying messages to a contractor. The person who answers your email is the person designing and building your project, and every call on taste, copy and finish is made by a person before it ships.",
  },
];

const WHO = [
  "Founders launching a new product who need the brand and the site at the same time",
  "Local service businesses that need to look as good online as their work is in person, like Shutters Depot in Hialeah",
  "Real estate and finance businesses that have to earn trust fast, like ABC Capital Group",
  "Early stage startups explaining a new idea, like SlipFolio and NextPlayU",
  "Community and lifestyle brands, like Mahj & Coffee in Miami",
  "Ecommerce and collector sellers who want a storefront they own, like CardsRG",
  "Founders, consultants and creators building a personal brand under their own name",
];

const HOW = [
  {
    t: "Communication",
    b: `Email at ${SITE.email} and the project form on the site. No calls required, though you can book one if you prefer.`,
  },
  {
    t: "Response time",
    b: "Same business day for new projects and questions. If something needs clarifying before we start, you hear about it the day you send it.",
  },
  {
    t: "Who you work with",
    b: "Dennis, the founder, from first message to handover. There is no hand off to a junior team partway through.",
  },
  {
    t: "Turnaround",
    b: "A real date agreed with your scope and your price, before you pay. Single graphics usually come back within days. Builds get a date set for the size of the job.",
  },
  {
    t: "Onboarding",
    b: "One short form, a few sentences about the idea. No 40 question brief and no proposal deck. You see a first direction in a browser, reply with a thumbs up or what is off, and the build starts.",
  },
];

const FACTS: [string, React.ReactNode][] = [
  ["Company Name", "FlowZone (also known as FlowZone Studio)"],
  ["Type", "Creative and business studio"],
  ["Founded", "2026"],
  ["Founder", "Dennis Valdes"],
  ["Headquarters", "United States, working remotely with clients nationwide"],
  ["Website", <a key="w" href={SITE.url} className="underline underline-offset-4">www.flowzone.dev</a>],
  ["Core Offering", "Brand identity, websites, storefronts and the business systems behind them, built as one project"],
  ["Pricing", "Single graphics and small jobs from $49.99. Builds from $500. The Full Build (brand, site and system) is $1,500. Storefronts from $2,500. All flat, quoted before payment"],
  ["Contract Terms", "Per project. No retainer, no subscription and no long term contract. Client owns all code, domains, accounts and content at handover"],
  ["Services", "Logo and identity design, brand voice and copy, personal branding, website design and development, ecommerce storefronts, lead intake and booking systems, promo reels and product animation, single graphics"],
  ["Communication", `Email (${SITE.email}), the project form at flowzone.dev/intake, LinkedIn and X. Same business day replies`],
  ["Notable Clients", "Shutters Depot, ABC Capital Group, SlipFolio, NextPlayU, Mahj & Coffee"],
  ["Customers Served", "Founders, small businesses, startups and personal brands across the United States"],
  ["Projects Delivered", "Storefront, brand, motion and graphics work for six brands, every piece shown on the work page"],
  ["Competitors", "Branding agencies, design subscriptions like Design Pickle, freelance marketplaces like Fiverr and Upwork, and site builders like Squarespace and Wix"],
  [
    "Social",
    <span key="s">
      <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">LinkedIn</a>
      {" · "}
      <a href={SITE.x} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">X (@flowzonedev)</a>
      {" · "}
      <a href={SITE.linkedinFounder} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Founder on LinkedIn</a>
    </span>,
  ],
];

const FAQ = [
  {
    q: "What is FlowZone?",
    a: "FlowZone is a creative studio that builds the brand, the website and the systems behind it for founders, small businesses and personal brands. It was founded in 2026 by Dennis Valdes and is based in the United States.",
  },
  {
    q: "How much does FlowZone cost?",
    a: "Single graphics and small jobs start at $49.99, builds start at $500 and the Full Build is $1,500. Storefronts start at $2,500 and are quoted flat. Every price is agreed before you pay.",
  },
  {
    q: "Do I have to sign a contract or pay a retainer?",
    a: "No. FlowZone works per project with no retainer and no subscription. When the project is live you own everything and there is nothing left to cancel.",
  },
  {
    q: "How long does a project take?",
    a: "You get a real date with your scope and your price before you pay, and that is the date the studio works to. Small graphics usually take days, and builds get a date set for the size of the job.",
  },
  {
    q: "Who will I actually work with?",
    a: "Dennis, the founder, designs and builds every project and answers every message. You never get passed to an account manager.",
  },
  {
    q: "Do you work with individuals or only companies?",
    a: "Both. Personal branding is the same work with your name on it: the mark, the palette, the voice and a personal site or portfolio that carries it.",
  },
  {
    q: "Who owns the website and the brand files?",
    a: "You do. The code, domain, accounts and design files are handed over at launch, and you can move them anywhere.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${SITE.url}/about#page`,
      url: `${SITE.url}/about`,
      name: "About FlowZone",
      about: { "@id": `${SITE.url}/#organization` },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE.url}/about#faq`,
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

function LogoRow({ hidden }: { hidden?: boolean }) {
  return (
    <div className="fz-logorow" aria-hidden={hidden ? "true" : undefined}>
      {LOGOS.map((l) => (
        <Image
          key={l.alt}
          src={l.src}
          alt={hidden ? "" : l.alt}
          width={l.w}
          height={l.h}
          className="fz-logo mx-7 md:mx-11"
          style={{ height: l.show, width: "auto" }}
        />
      ))}
    </div>
  );
}

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Value prop */}
      <section className="relative overflow-hidden px-6 pt-20 pb-12">
        <NodeWeb className="opacity-90" />
        <div className="absolute inset-0 gridlight pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-12">
            <p className="label">About FlowZone</p>
            <p className="label hidden sm:block">Brand, site and system</p>
          </div>
          <h1 className="display text-4xl md:text-6xl max-w-5xl">
            FlowZone is a creative studio that builds the brand, the website and
            the systems behind it for founders, small businesses and personal brands.
          </h1>
          <p className="lede max-w-reading mt-10">
            You bring the idea. We build the whole thing, at a flat price agreed
            before you pay, and hand it over working. You own every piece of it.
          </p>
        </div>
      </section>

      {/* Logo band */}
      <section aria-label="Brands FlowZone has built for" className="border-y border-rule bg-paper-deep py-10">
        <p className="label text-center mb-8 px-6">Brands we have built for</p>
        <div className="fz-logoband overflow-hidden">
          <div className="fz-logotrack">
            <LogoRow />
            <LogoRow hidden />
          </div>
        </div>
        <p className="text-center text-xs text-ink-mute mt-8 px-6">
          Client work, plus CardsRG, the studio&apos;s own store.{" "}
          <Link href="/work" className="underline underline-offset-4 hover:text-ink">
            See every piece
          </Link>
        </p>
      </section>

      {/* 2. What FlowZone does */}
      <section data-flow className="band-light px-6 py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="display text-4xl md:text-6xl mb-12 md:mb-16">What FlowZone does</h2>
          <div className="grid md:grid-cols-2 gap-x-14 gap-y-10 md:gap-y-12">
            {SERVICES.map((s) => (
              <div key={s.t} className="border-t border-rule pt-6">
                <h3 className="font-display text-2xl md:text-3xl leading-tight mb-3">{s.t}</h3>
                <p className="text-ink-soft leading-relaxed">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. What makes FlowZone different */}
      <section data-flow className="px-6 py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="display text-4xl md:text-6xl mb-12 md:mb-16">What makes FlowZone different</h2>
          <div className="space-y-0">
            {DIFFERENT.map((d, i) => (
              <div key={d.t} className="border-t border-rule py-8 grid md:grid-cols-12 gap-4 md:gap-8">
                <p className="label md:col-span-1">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-display text-2xl md:text-3xl leading-tight md:col-span-4">{d.t}</h3>
                <p className="text-ink-soft leading-relaxed md:col-span-7">{d.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Who uses FlowZone */}
      <section data-flow className="bg-paper-deep px-6 py-20 md:py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10">
          <h2 className="display text-4xl md:text-5xl md:col-span-4">Who uses FlowZone</h2>
          <ul className="md:col-span-8 space-y-4">
            {WHO.map((w) => (
              <li key={w} className="flex gap-4 text-ink-soft leading-relaxed border-b border-rule pb-4">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B9BF9]" aria-hidden="true" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. The team */}
      <section data-flow className="band-light px-6 py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="display text-4xl md:text-6xl mb-12">The team behind FlowZone</h2>
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-4">
              <Image
                src="/assets/denny-valdes.jpg"
                alt="Dennis Valdes, founder of FlowZone"
                width={320}
                height={320}
                className="w-40 md:w-full md:max-w-[260px] aspect-square object-cover rounded-sm"
              />
            </div>
            <div className="md:col-span-8 space-y-8 max-w-reading">
              <div>
                <h3 className="font-display text-2xl md:text-3xl mb-3">Dennis Valdes, founder</h3>
                <p className="text-ink-soft leading-relaxed">
                  Dennis studied Communications at UCLA and has spent his career on how
                  brands sound and show up in public. He designs and builds every FlowZone
                  project himself and reads every message that comes through the site.
                </p>
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl mb-3">How it started</h3>
                <p className="text-ink-soft leading-relaxed">
                  FlowZone began with CardsRG, a collector trading card business Dennis runs,
                  when he built its storefront, brand and channel art from scratch. Founded in
                  2026, the studio now does the same for other people&apos;s ideas.
                </p>
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl mb-3">The team today</h3>
                <p className="text-ink-soft leading-relaxed">
                  A founder-led studio that takes a small number of projects at a time on
                  purpose. That is why replies come the same day and nothing sits in a queue.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a href={SITE.linkedinFounder} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  Dennis on LinkedIn
                </a>
                <a href={SITE.x} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  FlowZone on X
                </a>
                <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  FlowZone on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How FlowZone works */}
      <section data-flow className="px-6 py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="display text-4xl md:text-6xl mb-12 md:mb-16">How FlowZone works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {HOW.map((h) => (
              <div key={h.t} className="border-t border-rule pt-6">
                <h3 className="font-display text-2xl leading-tight mb-3">{h.t}</h3>
                <p className="text-ink-soft leading-relaxed">{h.b}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link href="/how-we-work" className="btn-ghost">
              The full process, step by step
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Key facts, a definition list so it is crawlable */}
      <section data-flow className="bg-paper-deep px-6 py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="display text-4xl md:text-6xl mb-12">Key facts</h2>
          <dl className="border-t border-rule">
            {FACTS.map(([k, v]) => (
              <div key={k} className="grid sm:grid-cols-12 gap-1 sm:gap-8 border-b border-rule py-4">
                <dt className="sm:col-span-3 text-sm font-medium text-ink">{k}</dt>
                <dd className="sm:col-span-9 text-ink-soft leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 8. FAQ */}
      <section data-flow className="band-light px-6 py-20 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="display text-4xl md:text-6xl mb-12">Frequently asked questions</h2>
          <div>
            {FAQ.map((f) => (
              <div key={f.q} className="border-t border-rule py-7">
                <h3 className="font-display text-xl md:text-2xl leading-snug mb-3">{f.q}</h3>
                <p className="text-ink-soft leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-flow className="bg-paper-deep glow border-t border-rule px-6 py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] mb-8">
            {SITE.line}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <MessageUs />
          </div>
          <TicketNote className="text-center" />
        </div>
      </section>
    </>
  );
}
