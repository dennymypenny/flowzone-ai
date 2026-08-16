import Link from "next/link";
import ChatWidget from "@/app/components/ChatWidget";
import { SITE, PILLARS } from "@/lib/site";

export const metadata = {
  title: "FlowZone AI | Creative Studio",
  description: `${SITE.line} ${SITE.descriptor}`,
};

export default function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 glow pointer-events-none" />
        <div className="absolute inset-0 grid-bg fade-b pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="inline-flex items-center gap-2.5 border border-rule bg-raised/60 rounded-full pl-2 pr-3.5 py-1.5 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-mono text-[11px] uppercase tracking-label text-ink-soft">
              Creative studio · Brand, site, system
            </span>
          </div>

          <h1 className="display text-[2.85rem] sm:text-6xl md:text-[5rem] max-w-5xl">
            AI gives us the speed.
            <br />
            Humans give it the{" "}
            <span className="text-accent">taste</span>.
          </h1>

          <p className="lede max-w-reading mt-8">
            FlowZone is a small creative studio. We build the brand, the site and the
            system that runs it, as one piece of work rather than three invoices. A
            model does the fast part. A person decides what is good.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Link href="/intake" className="btn-primary">
              Start a project
            </Link>
            <Link href="/work" className="btn-ghost">
              See the work
            </Link>
          </div>

          {/* Hero product panel */}
          <div className="mt-20 panel overflow-hidden shadow-panel">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-rule bg-paper-deep">
              <span className="w-2.5 h-2.5 rounded-full bg-rule" />
              <span className="w-2.5 h-2.5 rounded-full bg-rule" />
              <span className="w-2.5 h-2.5 rounded-full bg-rule" />
              <span className="ml-3 font-mono text-[11px] text-ink-mute">cardsrg.com</span>
            </div>
            <img
              src="/assets/crg-hero.jpg"
              alt="CardsRG storefront homepage, a dark collector card shop with the Rip. Pull. Collect. headline"
              className="w-full h-auto block"
            />
          </div>
        </div>
      </section>

      {/* ---------- Three pillars ---------- */}
      <section className="border-t border-rule px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-10">What we build</p>

          <div className="grid md:grid-cols-12 gap-10 mb-14">
            <h2 className="md:col-span-6 display text-4xl md:text-5xl">
              Three parts.
              <br />
              One piece of work.
            </h2>
            <p className="md:col-span-6 text-ink-soft leading-relaxed font-light self-end max-w-reading">
              Most studios sell you one of these and leave you to find the other two.
              A brand with no site is a logo. A site with no system is a brochure. We
              do the whole arc so the seams do not show.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {PILLARS.map((p) => (
              <div key={p.name} className="panel p-7 flex flex-col">
                <div className="flex items-baseline justify-between mb-8">
                  <p className="label">{p.num}</p>
                  <span className="w-6 h-px bg-rule" />
                </div>
                <h3 className="font-display text-3xl mb-1.5">{p.name}</h3>
                <p className="text-sm text-accent mb-5">{p.line}</p>
                <p className="text-sm text-ink-soft leading-relaxed font-light mb-7">
                  {p.body}
                </p>
                <ul className="mt-auto space-y-2.5 border-t border-rule pt-5">
                  {p.items.map((i) => (
                    <li key={i} className="text-sm text-ink-soft font-light flex gap-3">
                      <span className="text-accent">/</span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/services" className="btn-ghost">
              What that looks like in detail
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Work ---------- */}
      <section className="border-t border-rule px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-10">
            <p className="label">Selected work</p>
            <Link href="/work" className="label hover:text-ink transition-colors">
              All work →
            </Link>
          </div>

          <Link href="/work" className="group block panel overflow-hidden">
            <img
              src="/assets/crg-cards.jpg"
              alt="CardsRG product grid showing graded Lionel Messi and Stan Lee cards with prices and cart buttons"
              className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.015]"
            />
            <div className="grid md:grid-cols-12 gap-6 p-7 border-t border-rule">
              <div className="md:col-span-7">
                <h3 className="font-display text-2xl group-hover:text-accent transition-colors">
                  CardsRG
                </h3>
                <p className="text-sm text-ink-soft mt-2 font-light leading-relaxed max-w-reading">
                  A collector trading card storefront taken from an idea to a live shop.
                  Brand mark, full storefront, product pages, cart and checkout.
                </p>
              </div>
              <div className="md:col-span-5 md:text-right">
                <p className="label mb-2">Brand · Storefront · Checkout</p>
                <p className="font-mono text-[11px] text-ink-mute">cardsrg.com</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ---------- Proof points ---------- */}
      <section className="border-t border-rule px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-14">How it works here</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                k: "A person signs off",
                v: "Every layout, headline and color decision gets looked at by a human before it ships. That is the whole point of the studio.",
              },
              {
                k: "Flat price, paid once",
                v: "You know the number before we start. No hourly billing, no retainer you forget to cancel.",
              },
              {
                k: "You own everything",
                v: "The code, the domain, the accounts, the content. We hand over the keys and nothing is held hostage.",
              },
              {
                k: "Live in days",
                v: "Most builds ship inside a week. It matters, but it is the last reason to hire us, not the first.",
              },
            ].map((s) => (
              <div key={s.k}>
                <p className="font-display text-xl mb-3">{s.k}</p>
                <p className="text-sm text-ink-soft leading-relaxed font-light">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Chat ---------- */}
      <section className="border-t border-rule px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <p className="label mb-8">Ask first</p>
          <h2 className="display text-4xl md:text-5xl mb-4 max-w-2xl">
            Not sure what you actually need?
          </h2>
          <p className="text-ink-soft font-light mb-10 max-w-reading">
            No form, no call. Describe the thing you are launching and get a straight
            answer about which of the three parts it needs.
          </p>
          <ChatWidget />
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="bg-paper-deep glow border-t border-rule px-6 py-28">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute mb-8">
            Start here
          </p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.02] mb-8">
            Tell us the idea.
            <br />
            We will tell you what it takes.
          </h2>
          <p className="text-ink-soft max-w-md mx-auto mb-10 leading-relaxed font-light">
            A few sentences is enough. You get a real reply with scope, price and a
            date. No discovery call required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/intake" className="btn-primary">
              Start a project
            </Link>
            <a
              href={`mailto:${SITE.email}`}
              className="btn border border-rule text-ink hover:bg-raised hover:border-ink/25"
            >
              {SITE.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
