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

          <h1 className="start start-2 display text-[3rem] sm:text-6xl md:text-[5.25rem] max-w-4xl">
            You imagine it.
            <br />
            We get it <span className="text-accent">moving</span>.
          </h1>

          <p className="start start-3 text-xl md:text-2xl text-ink leading-snug max-w-3xl mt-8 font-light">
            FlowZone is the jumpstart. Arrive with an intention, leave with the
            running thing. Brand, site and system, built for you start to finish and
            live in days.
          </p>

          <p className="start start-4 text-base text-ink-soft leading-relaxed max-w-reading mt-5 font-light">
            Brand identity is what we are best at, the mark and the words and the feel,
            and we carry it straight through everything we build. AI gives us the
            speed. Humans give it the taste.
          </p>

          <div className="start start-5 flex flex-col sm:flex-row gap-3 mt-10">
            <a href={SITE.mailto} className="btn-primary">
              Start an email <span className="arrow">→</span>
            </a>
            <Link href="/work" className="btn-ghost">
              See the work <span className="arrow">→</span>
            </Link>
          </div>

          {/* Value at a glance */}
          <div className="start start-5 mt-16 grid grid-cols-2 lg:grid-cols-5 border-t border-l border-rule">
            {[
              { i: "📦", k: "What you get", v: "Brand, site and system", c: "#5B9BF9" },
              { i: "🙌", k: "How much you do", v: "Almost nothing. 100% done for you", c: "#2DD4BF" },
              { i: "⏱️", k: "How long", v: "Most builds live in 7 days", c: "#FBBF24" },
              { i: "💵", k: "What it costs", v: "Flat, from $997, paid once", c: "#A78BFA" },
              { i: "🔑", k: "What you own", v: "All of it. Code, domain, accounts", c: "#34D399" },
            ].map((x) => (
              <div key={x.k} className="border-b border-r border-rule px-5 py-6">
                <span className="block text-lg mb-3 leading-none">{x.i}</span>
                <p
                  className="text-[11px] font-medium uppercase tracking-label mb-2"
                  style={{ color: x.c }}
                >
                  {x.k}
                </p>
                <p className="text-sm text-ink font-light leading-snug">{x.v}</p>
              </div>
            ))}
          </div>

          {/* Hero product panel */}
          <div className="mt-20 panel overflow-hidden shadow-panel">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-rule bg-paper-deep">
              <span className="w-2.5 h-2.5 rounded-full bg-rule" />
              <span className="w-2.5 h-2.5 rounded-full bg-rule" />
              <span className="w-2.5 h-2.5 rounded-full bg-rule" />
              <span className="ml-3 text-[11px] font-medium text-ink-mute">cardsrg.com</span>
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
      <section data-flow className="border-t border-rule px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="panel p-8 md:p-12 grid md:grid-cols-12 gap-10">
            <div className="md:col-span-5">
              <p className="label mb-6">What the name means</p>
              <p className="font-display text-5xl md:text-6xl leading-none">
                flow<span className="text-accent">zone</span>
              </p>
              <p className="text-[13px] text-ink-mute mt-4">
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
      <section data-flow className="border-t border-rule px-6 py-24">
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

          <div className="hidden md:block relative h-px mb-4 mx-[16.6%]">
            <span className="flowline absolute inset-0 block" />
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
                    <span className="text-xl leading-none">{p.icon}</span>
                    <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden>
                      <circle cx="7" cy="7" r="7" fill={p.color} />
                    </svg>
                    <p className="label">{p.num}</p>
                  </div>
                  {"lead" in p && p.lead && (
                    <p
                      className="text-[11px] font-medium uppercase tracking-label"
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

      {/* ---------- How it works, in four steps ---------- */}
      <section data-flow className="border-t border-rule px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-6">How it works</p>
          <h2 className="display text-4xl md:text-5xl max-w-3xl mb-14">
            Four steps. One week. You are busy for about twenty minutes of it.
          </h2>

          <div className="hidden lg:block relative h-px mb-4 mx-[12.5%]">
            <span className="flowline absolute inset-0 block" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                i: "✍️",
                c: "#5B9BF9",
                step: "Step 1",
                day: "Day 0",
                t: "Send the intention",
                b: "One short form. A few sentences about what you want to exist. No discovery call, no brief, no deck.",
                you: "15 minutes",
              },
              {
                i: "👀",
                c: "#A78BFA",
                step: "Step 2",
                day: "Days 1 to 2",
                t: "See a real direction",
                b: "Not a mood board. An actual first pass in a browser, with your words and your colors in it.",
                you: "One reply",
              },
              {
                i: "🔨",
                c: "#FBBF24",
                step: "Step 3",
                day: "Days 3 to 5",
                t: "We build it all",
                b: "Real pages, real copy, real payments, real forms. The system gets wired in and tested with live data.",
                you: "Nothing",
              },
              {
                i: "🚀",
                c: "#34D399",
                step: "Step 4",
                day: "Days 6 to 7",
                t: "It goes live and it is yours",
                b: "On your domain, tested on a phone, handed over with docs. You own the code and the accounts.",
                you: "Approve it",
              },
            ].map((x) => (
              <div key={x.step} className="panel p-6 flex flex-col">
                <span className="block text-2xl mb-4 leading-none">{x.i}</span>
                <div className="flex items-baseline gap-2 mb-3">
                  <p
                    className="text-[11px] font-medium uppercase tracking-label"
                    style={{ color: x.c }}
                  >
                    {x.step}
                  </p>
                  <p className="label">· {x.day}</p>
                </div>
                <h3 className="font-display text-xl leading-snug mb-2.5">{x.t}</h3>
                <p className="text-sm text-ink-soft font-light leading-relaxed mb-5">
                  {x.b}
                </p>
                <div className="mt-auto border-t border-rule pt-4">
                  <p className="label mb-1">Your time</p>
                  <p className="text-sm" style={{ color: x.c }}>
                    {x.you}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/how-we-work" className="btn-ghost">
              The long version, including the awkward questions
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Work ---------- */}
      <section data-flow className="bg-white text-[#0B1322] px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-10">
            <p className="text-[11px] font-medium uppercase tracking-label text-[#3D6FE8]">Selected work</p>
            <Link href="/work" className="text-[11px] font-medium uppercase tracking-label text-[#647089] hover:text-[#3D6FE8] transition-colors">
              All work →
            </Link>
          </div>

          <Link href="/work" className="group block border border-[#E8EEF7] bg-white overflow-hidden">
            <img
              src="/assets/crg-cards.jpg"
              alt="CardsRG product grid showing graded Lionel Messi and Stan Lee cards with prices and cart buttons"
              className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.015]"
            />
            <div className="grid md:grid-cols-12 gap-6 p-7 border-t border-[#E8EEF7]">
              <div className="md:col-span-7">
                <h3 className="font-display text-2xl text-[#0B1322] group-hover:text-accent transition-colors">
                  CardsRG
                </h3>
                <p className="text-sm text-[#647089] mt-2 font-light leading-relaxed max-w-reading">
                  A collector trading card storefront taken from an idea to a live shop.
                  Brand mark, full storefront, product pages, cart and checkout.
                </p>
              </div>
              <div className="md:col-span-5 md:text-right">
                <p className="text-[11px] font-medium uppercase tracking-label text-[#647089] mb-2">Brand · Storefront · Checkout</p>
                <p className="text-[11px] font-medium text-[#3D6FE8]">cardsrg.com</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ---------- Proof points ---------- */}
      <section data-flow className="border-t border-rule px-6 py-24">
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
                i: "🤝",
                c: "#2DD4BF",
                k: "You stop managing vendors",
                v: "A designer, a copywriter, a developer and someone to wire the tools together is four contracts and four handoffs. Here it is one studio and one thread of email.",
              },
              {
                i: "💵",
                c: "#A78BFA",
                k: "You know the number first",
                v: "Flat price agreed before work starts. No hourly billing, no scope creep invoice at the end, no retainer you forget to cancel.",
              },
              {
                i: "⏱️",
                c: "#FBBF24",
                k: "You launch in a week",
                v: "Most builds are live in seven days. That is the difference between testing an idea this month and testing it next quarter.",
              },
              {
                i: "🔑",
                c: "#34D399",
                k: "You own the asset",
                v: "The code, the domain, the accounts, the content. Nothing is held hostage and there is no platform you have to keep paying us for.",
              },
            ].map((s) => (
              <div key={s.k} className="border-t-2 pt-5" style={{ borderTopColor: s.c }}>
                <span className="block text-2xl mb-4 leading-none">{s.i}</span>
                <p className="font-display text-xl mb-3">{s.k}</p>
                <p className="text-sm text-ink-soft leading-relaxed font-light">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- The philosophy line ---------- */}
      <section data-flow className="border-t border-rule px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="label mb-8">Why it can be this fast</p>
          <p className="display text-3xl md:text-5xl leading-[1.15]">
            AI gives us the speed.
            <br />
            Humans give it the <span className="text-accent">taste</span>.
          </p>
          <p className="text-ink-soft font-light leading-relaxed mt-8 max-w-reading mx-auto">
            A model can produce a hundred layouts in a minute. Knowing which one is
            right is the part you are actually paying for, and it is the part that does
            not get delegated. That is the whole trade: a week instead of two months,
            without it looking like everyone else's AI site.
          </p>
        </div>
      </section>

      {/* ---------- Chat ---------- */}
      <section data-flow className="border-t border-rule px-6 py-24">
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
      <section data-flow className="bg-paper-deep glow border-t border-rule px-6 py-28">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] font-medium uppercase tracking-label text-ink-mute mb-8">
            Start here
          </p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mb-8">
            Bring the imagination.
            <br />
            We bring the running thing.
          </h2>
          <p className="text-ink-soft max-w-md mx-auto mb-10 leading-relaxed font-light">
            A few sentences is enough. You get a real reply with scope, price and a
            date. No discovery call required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={SITE.mailto} className="btn-primary">
              Start an email <span className="arrow">→</span>
            </a>
            <Link href="/pricing" className="btn-ghost">
              See pricing first
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
