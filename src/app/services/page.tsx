import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "What We Build",
  description:
    "Brand, site and the system that runs it. Three parts of one piece of work, from a studio that does all three.",
};

const PARTS = [
  {
    num: "01",
    name: "Brand",
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
      <section className="px-6 pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
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

      {/* Parts */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          {PARTS.map((p) => (
            <div key={p.name} className="border-t border-rule py-16 grid md:grid-cols-12 gap-10">
              <div className="md:col-span-4">
                <p className="label mb-6">{p.num}</p>
                <h2 className="font-display text-6xl leading-none mb-3">{p.name}</h2>
                <p className="text-accent">{p.line}</p>
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
                      <span className="text-accent shrink-0">/</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scope honesty */}
      <section className="bg-paper-deep px-6 py-24 mt-8">
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
                Tell us the idea
              </Link>
              <a href={`mailto:${SITE.email}`} className="btn-ghost">
                {SITE.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-paper-deep glow border-t border-rule px-6 py-28">
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
