import Link from "next/link";
import ChatWidget from "@/app/components/ChatWidget";
import WorkSession from "@/app/components/WorkSession";
import MessageUs from "@/components/MessageUs";
import NodeFilm from "@/app/components/NodeFilm";
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
        <div className="absolute inset-0 aurora drift pointer-events-none" />
        <div className="absolute inset-0 gridlight pointer-events-none" />
        {/* The mark, explained: points scatter, connect, resolve, then flow on. */}
        <NodeFilm />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">

          <p className="chip mb-8">
            <svg width="26" height="10" viewBox="0 0 58 18" fill="none" aria-hidden>
              <line x1="10.5" y1="9" x2="23.5" y2="9" stroke="#DDEEFB" strokeWidth="1.6" />
              <line x1="34.5" y1="9" x2="46.5" y2="9" stroke="#DDEEFB" strokeWidth="1.6" />
              <circle cx="6" cy="9" r="5.6" fill="#4C7BE8" />
              <circle cx="29" cy="9" r="5.6" fill="#5B9BF9" />
              <circle cx="52" cy="9" r="5.6" fill="#C6E4F8" />
            </svg>
            Brand · Site · System, one studio
          </p>

          <h1 className="display text-[3rem] sm:text-6xl md:text-[5.25rem] max-w-4xl">
            <span className="text-gradient-white">You imagine it.</span>
            <br />
            We get it <span className="text-gradient">moving</span>.
          </h1>

          <p className="text-xl md:text-2xl text-ink leading-snug max-w-3xl mt-8 font-light">
            FlowZone is the jumpstart. Arrive with an intention, leave with the
            running thing. Brand, site and system, built for you start to finish,
            and sparked into action because we want to see it exist as much as you
            do.
          </p>

          <p className="text-base text-ink-soft leading-relaxed max-w-reading mt-5 font-light">
            Brand identity is what we are best at, the mark and the words and the feel,
            and we carry it straight through everything we build. AI gives us the
            speed. Humans give it the taste.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <MessageUs className="btn-primary" />
            <Link href="/work" className="btn-ghost">
              See the work <span className="arrow">→</span>
            </Link>
          </div>

          {/* Value at a glance */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { i: "📦", k: "What you get", v: "Brand, site and system", c: "#5B9BF9" },
              { i: "🙌", k: "How much you do", v: "Almost nothing. 100% done for you", c: "#2DD4BF" },
              { i: "⚡", k: "How fast it moves", v: "Started the day you say go", c: "#FBBF24" },
              { i: "💵", k: "What it costs", v: "Flat, from $600, paid once", c: "#A78BFA" },
              { i: "🔑", k: "What you own", v: "All of it. Code, domain, accounts", c: "#34D399" },
            ].map((x) => (
              <div key={x.k} className="panel panel-lift relative overflow-hidden px-5 py-6">
                <span
                  className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-16 rounded-full blur-2xl opacity-25 pointer-events-none"
                  style={{ background: x.c }}
                />
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
              <div key={p.name} className="panel panel-lift p-7 flex flex-col relative overflow-hidden">
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
              <div className="rounded-2xl border border-rule p-6">
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

      {/* ---------- Point of view ---------- */}
      <section data-flow className="border-t border-rule px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-6">Where we have a point of view</p>
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            <h2 className="md:col-span-7 display text-4xl md:text-5xl">
              Brand identity and communications
              <br />
              are the home discipline here.
            </h2>
            <p className="md:col-span-5 text-ink-soft font-light leading-relaxed self-end max-w-reading">
              Not a service line we added. It is the thing the studio is built
              around, and it is why the sites and systems hold together instead of
              looking assembled. Here is what we actually think, so you can decide
              whether we are the right people before you spend anything.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-14 gap-y-12">
            {[
              {
                n: "01",
                c: "#4C7BE8",
                t: "A logo is not a brand",
                b: "It is one asset inside a system. The system is the palette, the type scale, the voice, the way you write a subject line and the rules that keep all of it consistent when somebody else has to use it. Buy a logo on its own and in six months you will have five versions of yourself.",
              },
              {
                n: "02",
                c: "#5B9BF9",
                t: "Most rebrands fail at the sentence, not the symbol",
                b: "People agonize over the mark and leave the words to whoever is free. But the first thing a customer processes is a sentence, and if it could describe any of your competitors it has done nothing. Verbal identity is the harder half and it is where we start.",
              },
              {
                n: "03",
                c: "#A78BFA",
                t: "Consistency beats cleverness",
                b: "One line repeated everywhere outperforms three good lines competing. That applies to your site, your LinkedIn, your invoices and your email signature. Most identity work is really the discipline of not changing your mind in public.",
              },
              {
                n: "04",
                c: "#34D399",
                t: "Taste is a decision, not a vibe",
                b: "Every choice we make is defensible: why that weight, why that spacing, why this colour means one thing everywhere on the page and never gets used to decorate. If we cannot explain a decision to you, it was not a decision.",
              },
            ].map((x) => (
              <div key={x.n} className="border-t-2 pt-6" style={{ borderTopColor: x.c }}>
                <p
                  className="text-[11px] font-medium uppercase tracking-label mb-3"
                  style={{ color: x.c }}
                >
                  {x.n}
                </p>
                <h3 className="font-display text-2xl leading-snug mb-3">{x.t}</h3>
                <p className="text-sm text-ink-soft font-light leading-relaxed">{x.b}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 panel p-8 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <p className="label mb-3">What that covers</p>
              <p className="text-ink-soft font-light leading-relaxed">
                Naming and name treatment, logo and wordmark, colour and type systems,
                verbal identity and tone, positioning and messaging hierarchy, launch
                copy, and the usage guide that keeps it all intact after we hand it
                over.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Link href="/work" className="btn-ghost">
                See it applied <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Work ---------- */}
      <section data-flow className="bg-white text-[#0B1322] px-6 py-28">
        <div className="max-w-6xl mx-auto">
          {/* Dots and a caption, the same mark the whole studio runs on */}
          <div className="flex flex-col items-center text-center mb-14">
            <svg width="74" height="22" viewBox="0 0 58 18" fill="none" aria-hidden>
              <line x1="10.5" y1="9" x2="23.5" y2="9" stroke="#9FC4E8" strokeWidth="1.2" />
              <line x1="34.5" y1="9" x2="46.5" y2="9" stroke="#9FC4E8" strokeWidth="1.2" />
              <circle className="pulse-1" cx="6" cy="9" r="5.6" fill="#1E3A8A" style={{ transformOrigin: "6px 9px" }} />
              <circle className="pulse-2" cx="29" cy="9" r="5.6" fill="#5B9BF9" style={{ transformOrigin: "29px 9px" }} />
              <circle className="pulse-3" cx="52" cy="9" r="5.6" fill="#9FC4E8" style={{ transformOrigin: "52px 9px" }} />
            </svg>
            <p className="text-[11px] font-medium uppercase tracking-label text-[#3D6FE8] mt-6">
              Brand · Site · System, on one project
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-[#0B1322] mt-5 max-w-3xl">
              An Instagram DM business,
              <br />
              turned into a real shop.
            </h2>
            <p className="text-[#647089] font-light leading-relaxed max-w-reading mt-6">
              CardsRG sells PSA graded cards, rare inserts and pack rips. It had an
              audience and no storefront. We built the mark, the whole shop, product
              pages with grade and set detail, cart and checkout. It went live and it
              sells.
            </p>
          </div>

          <Link href="/work" className="group block">
            <div className="overflow-hidden rounded-2xl border border-[#DCE5F2] shadow-[0_30px_70px_-30px_rgba(11,19,34,0.45)]">
              <img
                src="/assets/crg-hero.jpg"
                alt="CardsRG storefront homepage, dark with the headline Rip. Pull. Collect."
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.015]"
              />
            </div>

            <div className="grid md:grid-cols-12 gap-6 mt-8 items-start">
              <div className="md:col-span-5">
                <p className="font-display text-3xl text-[#0B1322] group-hover:text-accent transition-colors">
                  CardsRG
                </p>
                <p className="text-sm text-[#3D6FE8] mt-1.5">cardsrg.com</p>
              </div>
              <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-[#E8EEF7] pt-5">
                {[
                  ["Brand", "Mark and palette"],
                  ["Site", "Full storefront"],
                  ["Commerce", "Cart and checkout"],
                  ["Built in", "Under two weeks"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[11px] font-medium uppercase tracking-label text-[#647089] mb-1.5">
                      {k}
                    </p>
                    <p className="text-sm text-[#0B1322] font-light leading-snug">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Link>

          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/work"
              className="btn border border-[#C9D6EA] text-[#0B1322] hover:bg-[#F4F7FC]"
            >
              See the full build <span className="arrow">→</span>
            </Link>
            <a href={SITE.mailto} className="btn-primary">
              Start yours <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ---------- How it works, in four steps ---------- */}
      <section data-flow className="border-t border-rule px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-6">How it works</p>
          <h2 className="display text-4xl md:text-5xl max-w-3xl mb-14">
            Four steps, and you are busy for about twenty minutes of it.
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
                day: "The spark",
                t: "Send the intention",
                b: "One short form. A few sentences about what you want to exist. No discovery call, no brief, no deck. You get back a scope, a price and a date, and that date is the one we work to.",
                you: "15 minutes",
              },
              {
                i: "👀",
                c: "#A78BFA",
                step: "Step 2",
                day: "First look",
                t: "See a real direction",
                b: "Not a mood board. An actual first pass in a browser, with your words and your colors in it, while the idea still has heat on it.",
                you: "One reply",
              },
              {
                i: "🔨",
                c: "#FBBF24",
                step: "Step 3",
                day: "The build",
                t: "We build it all",
                b: "Real pages, real copy, real payments, real forms. The system gets wired in and tested with live data.",
                you: "Nothing",
              },
              {
                i: "🚀",
                c: "#34D399",
                step: "Step 4",
                day: "Live",
                t: "It goes live and it is yours",
                b: "On your domain, tested on a phone, handed over with docs. You own the code and the accounts.",
                you: "Approve it",
              },
            ].map((x) => (
              <div key={x.step} className="panel panel-lift p-6 flex flex-col">
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
                i: "⚡",
                c: "#FBBF24",
                k: "We are as excited as you are",
                v: "That is the whole reason this moves. Nobody has to chase us for an update, because we want to see the thing exist too. You will feel it in the first reply, and again on the day it goes live.",
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

      {/* ---------- The obvious question ---------- */}
      <section data-flow className="border-t border-rule px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-6">The obvious question</p>
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            <h2 className="md:col-span-7 display text-4xl md:text-5xl">
              Why not just ask AI
              <br />
              to do all this?
            </h2>
            <p className="md:col-span-5 text-ink-soft font-light leading-relaxed self-end max-w-reading">
              Fair. You have the same models we do, and they are extraordinary. Here is
              the honest answer about where they stop, and where you genuinely do not
              need us.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-14 gap-y-12">
            {[
              {
                n: "01",
                c: "#4C7BE8",
                t: "You have to know what to ask for",
                b: "AI gives you exactly what you describe. Most people arrive knowing they want something and unable to say what, which is not a prompting problem, it is the actual work. Getting from a vague intention to a specific brief happens before anything gets typed into a model.",
              },
              {
                n: "02",
                c: "#5B9BF9",
                t: "One logo is easy, fifty agreeing decisions are not",
                b: "A mark, a palette, a type scale, a voice, a homepage, product pages, checkout, an intake flow. Each one takes ten minutes. Making all of them look and sound like the same company is the whole job, and it is where doing it yourself falls apart.",
              },
              {
                n: "03",
                c: "#FBBF24",
                t: "The last ten percent is where projects die",
                b: "You will get to something impressive in an afternoon. Then comes the domain, the payment webhook firing twice, the layout breaking on a phone, the form quietly going nowhere. Projects do not die at the start, they die at ninety percent, six weeks in, at one in the morning.",
              },
              {
                n: "04",
                c: "#34D399",
                t: "Nobody is accountable to a chat window",
                b: "A model will not notice it got something wrong, will not fix it for free, and will not answer when checkout breaks on a Friday night. You are hiring a person who is on the hook for the result, and who you can reply to.",
              },
            ].map((x) => (
              <div key={x.n} className="border-t-2 pt-6" style={{ borderTopColor: x.c }}>
                <p
                  className="text-[11px] font-medium uppercase tracking-label mb-3"
                  style={{ color: x.c }}
                >
                  {x.n}
                </p>
                <h3 className="font-display text-2xl leading-snug mb-3">{x.t}</h3>
                <p className="text-sm text-ink-soft font-light leading-relaxed">{x.b}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 panel p-8 md:p-10 grid md:grid-cols-12 gap-8">
            <div className="md:col-span-7">
              <p className="label mb-4">And when you should not hire us</p>
              <p className="text-ink-soft font-light leading-relaxed max-w-reading">
                If you have taste, some technical confidence and free evenings, build it
                yourself. You will do a decent job, you will learn a lot and you will
                keep the money. We would rather say that than take it from someone who
                did not need to spend it.
              </p>
              <p className="text-ink font-light leading-relaxed max-w-reading mt-4">
                We are not selling you access to AI. You already have that. We are the
                judgment on top of it, and the person who finishes.
              </p>
            </div>
            <div className="md:col-span-5 md:text-right md:self-end">
              <Link href="/how-we-work" className="btn-ghost">
                More straight answers <span className="arrow">→</span>
              </Link>
            </div>
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

          <div className="mt-4">
            <WorkSession />
          </div>
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
            <MessageUs className="btn-primary" />
            <a href={SITE.mailto} className="btn-ghost">
              Start an email <span className="arrow">→</span>
            </a>
          </div>
          <p className="text-[12px] text-ink-mute mt-6">
            Texts land on a phone, not in a queue. {SITE.phoneDisplay}
          </p>
        </div>
      </section>
    </>
  );
}
