import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import NodeWeb from "@/app/components/NodeWeb";

export const metadata: Metadata = {
  title: "What We Build",
  description:
    "Brand, site and the system that runs it. Three parts of one piece of work, from a studio that does all three.",
  alternates: { canonical: "/services" },
  // Set in full because metadata merging is shallow. A page that declares
  // openGraph replaces the layout block outright, so anything omitted is gone.
  openGraph: {
    title: "What We Build | FlowZone",
    description:
      "Brand, site and the system that runs it. Three parts of one piece of work, from a studio that does all three.",
    url: `${SITE.url}/services`,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

const PARTS = [
  {
    num: "01",
    name: "Brand",
    color: "#4C7BE8",
    // Paired down for the light band. #4C7BE8 is only 3.96:1 on white,
    // #2B57C4 is 6.44:1.
    colorLight: "#2B57C4",
    line: "What people recognize you by.",
    intro:
      "Before anything gets designed, there has to be something to design against. We build the identity first so the site is an expression of it rather than a guess.",
    get: [
      "Logo and wordmark, drawn for you",
      "Color palette and type system",
      "Voice, positioning line and the words you repeat",
      "A usage guide you can hand to anyone",
    ],
    for: "Launching something new, or you have a site that looks nothing like the business you actually run.",
  },
  {
    num: "02",
    name: "Site",
    color: "#5B9BF9",
    // #5B9BF9 is 2.80:1 on white. #155E9C is 6.75:1.
    colorLight: "#155E9C",
    line: "Where people decide.",
    intro:
      "A marketing site or a full storefront, designed against your brand rather than a theme with your logo dropped in the corner. Written, built and deployed on your own domain.",
    get: [
      "Custom design, no templates and no page builder",
      "Marketing site or a full product storefront",
      "Copy written for you, not lorem ipsum you fill in later",
      "Payments, forms and email wired end to end",
      "Fast on a phone, tested before it ships",
    ],
    for: "You need the place people land to look like you mean it.",
  },
  {
    num: "03",
    name: "System",
    color: "#C6E4F8",
    // #C6E4F8 is 1.32:1 on white, near invisible. #1E3A8A is 10.36:1.
    colorLight: "#1E3A8A",
    line: "What keeps running after launch.",
    intro:
      "The unglamorous half. A beautiful site that drops leads on the floor is an expensive brochure. We build the part that catches them and keeps the business moving.",
    get: [
      "Lead intake, routing and instant follow up",
      "Booking, confirmations and reminders",
      "Invoicing, payment reminders and books that stay in sync",
      "Reporting and dashboards you will actually open",
      "Your existing tools connected instead of replaced",
    ],
    for: "Launch went fine and now you are doing the same three things by hand every day.",
  },
];

export default function Services() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <NodeWeb className="opacity-90" />
        <div className="absolute inset-0 gridlight pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-12">
            <p className="label">What We Build</p>
            <p className="label hidden sm:block">Brand · Site · System</p>
          </div>
          <h1 className="display text-5xl md:text-8xl max-w-4xl">
            Three parts.
            <br />
            One piece of work.
          </h1>
          <div className="grid md:grid-cols-12 gap-10 mt-12 items-end">
            <p className="md:col-span-6 lede max-w-reading">
              Brand identity is the studio's strongest work and where most projects
              start. You can buy any one part on its own, but we can take the whole
              thing end to end, and the seams between the three are exactly where
              projects usually fall apart.
            </p>
            <div className="md:col-span-6 md:flex md:justify-end">
              <Link href="/pricing" className="btn-primary">
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Parts, on white. This is where the three names get defined, so it
          takes the light. Every part colour has a dark twin above. */}
      <section data-flow className="band-light px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {PARTS.map((p) => (
            <div key={p.name} className="border-t-2 py-16 grid md:grid-cols-12 gap-10" style={{ borderTopColor: p.colorLight }}>
              <div className="md:col-span-4">
                <div className="flex items-center gap-3 mb-6">
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                    <circle cx="7" cy="7" r="7" fill={p.colorLight} />
                  </svg>
                  <p className="label">{p.num}</p>
                </div>
                <h2 className="font-display text-6xl leading-none mb-3">{p.name}</h2>
                <p style={{ color: p.colorLight }}>{p.line}</p>
              </div>

              <div className="md:col-span-4">
                <p className="text-ink-soft leading-relaxed">{p.intro}</p>
                <div className="mt-8 border-t border-rule pt-5">
                  <p className="label mb-2">Right for you if</p>
                  <p className="text-sm text-ink-soft leading-relaxed">{p.for}</p>
                </div>
              </div>

              <div className="md:col-span-4">
                <p className="label mb-5">What you get</p>
                <ul className="space-y-3">
                  {p.get.map((g) => (
                    <li key={g} className="text-sm text-ink-soft flex gap-3 leading-relaxed">
                      <span className="shrink-0" style={{ color: p.colorLight }}>/</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Named builds ---------- */}
      <section data-flow className="border-t border-rule px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-6">The builds</p>
          <div className="grid md:grid-cols-12 gap-10 mb-14">
            <h2 className="md:col-span-6 display text-4xl md:text-5xl">
              Four things you can
              <br />
              actually order.
            </h2>
            <div className="md:col-span-6 self-end">
              <p className="text-ink-soft font-light leading-relaxed max-w-reading">
                A build is a fixed piece of work with a name, a price and a date. We
                scope it before you pay, we do all of it, and we hand it over finished
                and live. No discovery phase, no hourly meter, no invoice at the end
                bigger than the number you agreed to. The date comes with your scope,
                and it is the date we work to.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: "\u{1F3A8}",
                c: "#4C7BE8",
                k: "identity",
                name: "The Identity Build",
                one: "Everything people recognize you by, and the rules that keep it that way.",
                what: [
                  "Logo, wordmark and any secondary marks",
                  "Color palette and type system, with the reasoning written down",
                  "Voice, positioning line and the words you repeat everywhere",
                  "Social avatars, banners and email signature set up",
                  "A usage guide you can hand to a printer, a contractor or a new hire",
                ],
                takes: "Starts the day you say go",
                from: "From $600",
                right: "You are launching, or your business has outgrown a logo you made in a hurry.",
              },
              {
                icon: "\u{1F310}",
                c: "#5B9BF9",
                k: "site",
                name: "The Site Build",
                one: "A marketing site that explains you properly and asks for the sale.",
                what: [
                  "Up to six pages, custom designed against your brand",
                  "Every word written for you, not a template you fill in",
                  "Contact and enquiry forms landing in your inbox",
                  "Fast on a phone, tested before it ships",
                  "Live on your own domain, and you own the code",
                ],
                takes: "Starts the day you say go",
                from: "From $600",
                right: "People are already finding you and the site is doing nothing to help.",
              },
              {
                icon: "\u{1F6D2}",
                c: "#F0845F",
                k: "storefront",
                name: "The Storefront Build",
                one: "A real shop. Products, cart, checkout, money in your account.",
                what: [
                  "Full storefront designed around your catalog",
                  "Product pages built for how your buyers actually decide",
                  "Cart, checkout and payments wired end to end",
                  "Inventory, categories and search set up",
                  "Order notifications and the admin you need to run it",
                ],
                takes: "Starts the day you say go",
                from: "From $2,497",
                right: "You are selling through DMs, a marketplace, or nothing at all yet.",
              },
              {
                icon: "\u{2699}\u{FE0F}",
                c: "#34D399",
                k: "engine",
                name: "The Engine Build",
                one: "The machinery behind the site, so the business runs without you doing it by hand.",
                what: [
                  "Lead intake that captures, sorts and replies in seconds",
                  "Booking with confirmations and reminders that stop no-shows",
                  "Invoicing, payment chasing and books that stay in sync",
                  "Weekly reporting that arrives without you asking",
                  "Connected to the tools you already use, not replacing them",
                ],
                takes: "Starts the day you say go",
                from: "From $600",
                right: "Launch went fine and now you do the same three jobs by hand every day.",
              },
            ].map((b) => (
              <div key={b.name} className="panel p-8 flex flex-col relative overflow-hidden">
                <span
                  className="absolute top-0 left-0 h-[3px] w-full"
                  style={{ background: b.c }}
                />
                <span className="block text-2xl mb-5 mt-1 leading-none">{b.icon}</span>
                <h3 className="font-display text-3xl mb-2">{b.name}</h3>
                <p className="text-sm mb-6" style={{ color: b.c }}>
                  {b.one}
                </p>

                <p className="label mb-4">What is in it</p>
                <ul className="space-y-2.5 mb-7">
                  {b.what.map((w) => (
                    <li key={w} className="text-sm text-ink-soft font-light flex gap-3 leading-relaxed">
                      <span style={{ color: b.c }}>/</span>
                      {w}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto border-t border-rule pt-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="label mb-1.5">Pace</p>
                    <p className="text-sm text-ink font-light">{b.takes}</p>
                  </div>
                  <div>
                    <p className="label mb-1.5">Price</p>
                    <p className="text-sm text-ink font-light">{b.from}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="label mb-1.5">Right for you if</p>
                    <p className="text-sm text-ink-soft font-light leading-relaxed">
                      {b.right}
                    </p>
                  </div>
                  <div className="col-span-2 pt-1">
                    <Link
                      href={`/intake?build=${b.k}`}
                      className="btn-primary w-full justify-center"
                    >
                      Start this build <span className="arrow">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 panel p-8 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <p className="label mb-3">Stacking them</p>
              <p className="text-ink-soft font-light leading-relaxed">
                Most people take Identity and Site together, because a site designed
                before the brand exists is a guess. Add the Engine when the launch is
                working and the manual jobs start piling up. Take all of it at once and
                it is quoted as one project, not three.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Link href="/intake" className="btn-primary">
                Ask which one fits <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Scope honesty */}
      <section data-flow className="band-light px-6 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="label mb-6">Scope</p>
            <h2 className="display text-4xl md:text-5xl">
              So where does everything else go?
            </h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-ink-soft leading-relaxed max-w-reading">
              Underneath one of the three. A landing page, a rebrand, a pitch deck, a
              product catalog, a booking flow, a dashboard: they are all Brand, Site or
              System wearing a different name, and we will tell you which one on the
              first email.
            </p>
            <p className="text-ink-soft leading-relaxed max-w-reading mt-4">
              We can take a project from a blank page to a live business, which is the
              point of grouping it this way. Three names instead of a menu of eleven,
              so you can see the whole shape of the work before you commit to any of it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <Link href="/intake" className="btn-primary">
                Start a ticket <span className="arrow">→</span>
              </Link>
              <a href={`mailto:${SITE.email}`} className="btn-ghost">
                {SITE.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-flow className="bg-paper-deep glow border-t border-rule px-6 py-28">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] mb-8">
            {SITE.line}
          </h2>
          <Link href="/work" className="btn-primary">
            See what that looks like
          </Link>
        </div>
      </section>
    </>
  );
}
