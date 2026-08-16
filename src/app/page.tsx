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
        <div className="absolute inset-0 aurora pointer-events-none" />

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

          <p className="text-xl md:text-2xl text-ink leading-snug max-w-3xl mt-8 font-light">
            You bring the intention. We jumpstart it into a real thing: the brand, the
            site and the systems that run it, done for you and live in days. That is
            what we mean by FlowZone.
          </p>

          <p className="text-base text-ink-soft leading-relaxed max-w-reading mt-5 font-light">
            Brand identity is what we are best at, the mark and the words and the feel,
            and we carry it straight through everything we build. A model does the fast
            part. A person decides what is good.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Link href="/intake" className="btn-primary">
              Start a project
            </Link>
            <Link href="/work" className="btn-ghost">
              See the work
            </Link>
          </div>

          {/* Value at a glance */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-5 border-t border-l border-rule">
            {[
              ["What you get", "Brand, site and system"],
              ["How much you do", "Almost nothing. 100% done for you"],
              ["How long", "Most builds live in 7 days"],
              ["What it costs", "Flat, from $997, paid once"],
              ["What you own", "All of it. Code, domain, accounts"],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-r border-rule px-5 py-6">
                <p className="label mb-2.5">{k}</p>
                <p className="text-sm text-ink font-light leading-snug">{v}</p>
              </div>
            ))}
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

      {/* ---------- The name as a verb ---------- */}
      <section className="border-t border-rule px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="panel p-8 md:p-12 grid md:grid-cols-12 gap-10">
            <div className="md:col-span-5">
              <p className="label mb-6">What the name means</p>
              <p className="font-display text-5xl md:text-6xl leading-none">
                flow<span className="text-accent">zone</span>
              </p>
              <p className="font-mono text-[13px] text-ink-mute mt-4">
                verb · flowzoned, flowzoning
              </p>
            </div>
            <div className="md:col-span-7">
              <p className="text-xl md:text-2xl text-ink font-light leading-snug">
                To take an intention and get it moving. To go from a thing you keep
                meaning to start, to a thing that is live, branded and running on its
                own.
              </p>
              <p className="text-ink-soft font-light leading-relaxed mt-6 max-w-reading">
                Everybody has the intention. A shop they want to open, a service they
                want to sell, a company that exists but does not look like it yet. The
                gap is never the idea. It is the design, the words, the build and the
                plumbing, all needed at once, by someone who has none of them lying
                around. That gap is the whole job.
              </p>
              <p className="text-ink font-light leading-relaxed mt-5 max-w-reading">
                You hand us the intention. We hand you back the running thing.
              </p>
            </div>
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
              Brand is where we are strongest, and it is where every project starts.
              But a brand with no site is a logo and a site with no system is a
              brochure, so we build all three and you never hand off between vendors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {PILLARS.map((p) => (
              <div key={p.name} className="panel p-7 flex flex-col relative overflow-hidden">
                <span
                  className="absolute top-0 left-0 h-[3px] w-full"
                  style={{ background: p.color }}
                />
                <div className="flex items-center justify-between mb-8 mt-1">
                  <div className="flex items-center gap-3">
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                      <circle cx="7" cy="7" r="7" fill={p.color} />
                    </svg>
                    <p className="label">{p.num}</p>
                  </div>
                  {"lead" in p && p.lead && (
                    <p
                      className="font-mono text-[11px] uppercase tracking-label"
                      style={{ color: p.color }}
                    >
                      Our strength
                    </p>
                  )}
                </div>
                <h3 className="font-display text-3xl mb-1.5">{p.name}</h3>
                <p className="text-sm mb-5" style={{ color: p.color }}>
                  {p.line}
                </p>
                <p className="text-sm text-ink-soft leading-relaxed font-light mb-7">
                  {p.body}
                </p>
                <ul className="mt-auto space-y-2.5 border-t border-rule pt-5">
                  {p.items.map((i) => (
                    <li key={i} className="text-sm text-ink-soft font-light flex gap-3">
                      <span style={{ color: p.color }}>/</span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 panel p-8 md:p-10 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <p className="label mb-4">Why three</p>
              <h3 className="font-display text-2xl md:text-3xl leading-snug mb-4">
                Three dots in the logo, three parts to the work. That was on purpose.
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed font-light max-w-reading">
                Each dot is a stage, and each one hands off to the next. It is also the
                order we build in, because a site designed before the brand exists is a
                guess and a system built before the site exists has nothing to plug
                into. Every colour on this site comes from one of the three.
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="border border-rule p-6">
                <p className="label mb-4">All of it, done for you</p>
                <p className="text-sm text-ink-soft leading-relaxed font-light">
                  You are not briefing a team, reviewing tickets or chasing a
                  freelancer. You send the idea, answer a couple of questions, and it
                  comes back finished. Written, designed, built, tested and live.
                </p>
              </div>
              <Link href="/services" className="btn-ghost w-full mt-4">
                What that looks like in detail
              </Link>
            </div>
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
          <div className="mb-14">
            <p className="label mb-6">Why a company hires us</p>
            <h2 className="display text-4xl md:text-5xl max-w-3xl">
              One vendor, one price, one person accountable.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                k: "You stop managing vendors",
                v: "A designer, a copywriter, a developer and someone to wire the tools together is four contracts and four handoffs. Here it is one studio and one thread of email.",
              },
              {
                k: "You know the number first",
                v: "Flat price agreed before work starts. No hourly billing, no scope creep invoice at the end, no retainer you forget to cancel.",
              },
              {
                k: "You launch in a week",
                v: "Most builds are live in seven days. That is the difference between testing an idea this month and testing it next quarter.",
              },
              {
                k: "You own the asset",
                v: "The code, the domain, the accounts, the content. Nothing is held hostage and there is no platform you have to keep paying us for.",
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
