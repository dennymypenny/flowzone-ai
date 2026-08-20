import Link from "next/link";
import type { Metadata } from "next";
import ChatWidget from "@/app/components/ChatWidget";
import WorkSession from "@/app/components/WorkSession";
import MessageUs from "@/components/MessageUs";
import FlowRide from "@/app/components/FlowRide";
import { SITE, PILLARS } from "@/lib/site";
import NodeWeb from "@/app/components/NodeWeb";
import FlowField from "@/app/components/FlowField";

export const metadata: Metadata = {
  title: "FlowZone | Creative Studio",
  description: `${SITE.line} ${SITE.descriptor}`,
  alternates: { canonical: "/" },
  // openGraph merging is shallow, so siteName, type and locale get repeated on
  // every page. The card image is not repeated because app/opengraph-image.png
  // is file based metadata, which every route inherits on its own.
  openGraph: {
    title: "FlowZone | Creative Studio",
    description: `${SITE.line} ${SITE.descriptor}`,
    url: SITE.url,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

export default function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <NodeWeb className="opacity-90" />
        <FlowField />
        <div className="absolute inset-0 gridlight pointer-events-none" />
        {/* The mark, explained: points scatter, connect, resolve, then flow on. */}

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-14 md:pt-28 md:pb-20">

          {/* The mark, spelled out: each dot is a word */}
          <div className="flex items-center flex-wrap gap-y-2 mb-6" aria-label="Brand, site and system, one studio">
            {[
              { w: "Brand", c: "#4C7BE8", pulse: "pulse-1" },
              { w: "Site", c: "#5B9BF9", pulse: "pulse-2" },
              { w: "System", c: "#C6E4F8", pulse: "pulse-3" },
            ].map((d, i) => (
              <span key={d.w} className="flex items-center">
                {i > 0 && (
                  <span
                    className="block w-7 h-px mx-3"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(221,238,251,0.45), transparent)" }}
                    aria-hidden
                  />
                )}
                <span className="flex items-center gap-2">
                  <span
                    className={`block w-2.5 h-2.5 rounded-full ${d.pulse}`}
                    style={{ background: d.c, boxShadow: `0 0 12px ${d.c}66` }}
                    aria-hidden
                  />
                  <span
                    className="text-[11px] font-medium uppercase tracking-label"
                    style={{ color: d.c }}
                  >
                    {d.w}
                  </span>
                </span>
              </span>
            ))}
            <span className="text-[11px] font-medium uppercase tracking-label text-ink-mute ml-3">
              · one studio
            </span>
          </div>

          <h1 className="display text-[3rem] sm:text-6xl md:text-[5.25rem] max-w-4xl">
            <span className="text-gradient-white">You imagine it.</span>
            <br />
            We get it <span className="text-gradient">moving</span>.
          </h1>

          <p className="text-xl md:text-2xl text-ink leading-snug max-w-2xl mt-6 font-light">
            Arrive with an intention. Leave with the running thing.
            Brand, site and system, built for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <MessageUs className="btn-primary shine" />
            <FlowRide />
          </div>

          {/* The number is here for anybody who wants it, but it is not the
              first thing a stranger meets. Leading with a price makes people
              brace. Leading with the free thing makes them look. */}
          <p className="mt-8 text-sm text-ink-mute font-light">
            Builds are flat and
            paid once, no hourly billing, and you see your number before
            anything starts.{" "}
            <Link href="/pricing" className="text-ink-soft hover:text-ink transition-colors underline decoration-rule underline-offset-4">
              See the prices
            </Link>
          </p>

        </div>
      </section>

      {/* The four builds, front and center. Click one, land in the ticket
          with it preselected. Colors are the on-white pairs. */}
      <section data-flow className="band-light px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-6 mb-10">
            <div className="md:col-span-7">
              <p className="label mb-4">Pick your build</p>
              <h2 className="display text-4xl md:text-5xl">
                Four builds.
                <br />
                One ticket.
              </h2>
            </div>
            <p className="md:col-span-5 text-ink-soft font-light leading-relaxed self-end max-w-reading">
              Pick the one that sounds like your problem and open a ticket. Four
              questions, no meeting. Not sure which? The ticket has a lane for that
              too.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                k: "identity",
                c: "#2B57C4",
                n: "01",
                name: "The Identity Build",
                one: "Everything people recognize you by.",
                from: "From $600",
              },
              {
                k: "site",
                c: "#155E9C",
                n: "02",
                name: "The Site Build",
                one: "A site that explains you and asks for the sale.",
                from: "From $600",
              },
              {
                k: "storefront",
                c: "#A03D14",
                n: "03",
                name: "The Storefront Build",
                one: "A real shop. Cart, checkout, money in your account.",
                from: "From $2,497",
              },
              {
                k: "engine",
                c: "#0F6B4F",
                n: "04",
                name: "The Engine Build",
                one: "The machinery, so it runs without you.",
                from: "From $600",
              },
            ].map((b) => (
              <Link
                key={b.k}
                href={`/intake?build=${b.k}`}
                className="panel p-6 flex flex-col group border-t-2 hover:border-accent transition-colors"
                style={{ borderTopColor: b.c }}
              >
                <p
                  className="text-[11px] font-medium uppercase tracking-label mb-4"
                  style={{ color: b.c }}
                >
                  {b.n}
                </p>
                <h3 className="font-display text-xl leading-snug mb-2">{b.name}</h3>
                <p className="text-sm text-ink-soft font-light leading-relaxed mb-6">
                  {b.one}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm text-ink-soft">{b.from}</span>
                  <span className="text-sm text-accent">
                    Start <span className="arrow">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>




      {/* ---------- How close it already is ----------
          The problem most people have is not that the idea is far away, it is
          that nobody has ever measured the distance for them, so it stays
          vague and vague always feels far. This section measures it. It names
          the five things that stand between a thought and a live business,
          says out loud that most people already have three of them, and lets
          the reader count their own. Naming the gap is what shrinks it. */}
      <section data-flow className="band-light px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-4">The distance</p>
          <div className="grid md:grid-cols-12 gap-6 mb-10">
            <h2 className="md:col-span-7 display text-4xl md:text-5xl">
              Your idea is closer
              <br />
              than it feels.
            </h2>
            <p className="md:col-span-5 text-ink-soft font-light leading-relaxed self-end max-w-reading">
              Nobody ever measures the gap for you, so it stays a fog, and a fog
              always looks wider than it is. Here is the actual list. Five
              things stand between the thing in your head and a business people
              can find, pay and come back to.
            </p>
          </div>

          <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
            {[
              {
                n: "01",
                t: "A name and a look",
                b: "Something people can recognise twice.",
                have: "Most have a name already.",
              },
              {
                n: "02",
                t: "One sentence",
                b: "What it is, who it is for, said once and repeatable.",
                have: "Most can say it, just not shortly.",
              },
              {
                n: "03",
                t: "Somewhere to send people",
                b: "A page that answers and asks for the next step.",
                have: "Most have a profile, not a page.",
              },
              {
                n: "04",
                t: "A way to get paid",
                b: "Booking, checkout or an invoice that goes out on its own.",
                have: "Most are doing this by hand.",
              },
              {
                n: "05",
                t: "Something that runs without you",
                b: "Follow up, reminders, the parts you forget at 9pm.",
                have: "Almost nobody has this yet.",
              },
            ].map((x) => (
              <li
                key={x.n}
                className="surface p-5 flex flex-col"
              >
                <p className="text-[11px] font-medium uppercase tracking-label mb-2 text-[#2B57C4]">
                  {x.n}
                </p>
                <p className="font-display text-lg leading-snug mb-2">{x.t}</p>
                <p className="text-sm text-ink-soft font-light leading-relaxed mb-3">
                  {x.b}
                </p>
                <p className="text-[12px] text-ink-mute mt-auto">{x.have}</p>
              </li>
            ))}
          </ol>

          <p className="text-lg md:text-xl font-light leading-relaxed max-w-reading mb-8">
            Count the ones you already have. Almost everybody who lands here has
            three. That is the whole point. You are not starting from nothing,
            you are two or three moves from live, and those moves are the ones
            that keep getting put off because they are nobody's job.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/start" className="btn-primary shine">
              Find out which ones you are missing <span className="arrow">&rarr;</span>
            </Link>
            <MessageUs className="btn-ghost" label="Or just tell us the idea" />
          </div>
          <p className="text-[13px] text-ink-mute mt-4">
            Flow Mode asks six questions and tells you which move comes first.
            Free, no signup, nothing is uploaded.
          </p>
        </div>
      </section>

      {/* ---------- Three pillars ---------- */}
      <section data-flow className="border-t border-rule px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-6">What we build</p>

          <div className="grid md:grid-cols-12 gap-6 mb-10">
            <h2 className="md:col-span-6 display text-4xl md:text-5xl">
              Three parts.
              <br />
              One piece of work.
            </h2>
            <p className="md:col-span-6 text-ink-soft leading-relaxed font-light self-end max-w-reading">
              Brand first, then the site, then the system. One studio, no handoffs.
            </p>
          </div>

          <div className="hidden md:block relative h-px mb-4 mx-[16.6%]">
            <span className="flowline absolute inset-0 block" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {PILLARS.map((p) => (
              <div key={p.name} className="panel panel-lift p-5 flex flex-col relative overflow-hidden">
                <span
                  className="absolute top-0 left-0 h-[3px] w-full"
                  style={{ background: p.color }}
                />
                <div className="flex items-center justify-between mb-5 mt-1">
                  <div className="flex items-center gap-3">
                    {/* Denny asked for these. Emoji were retired site-wide as an
                        AI-slop tell, so they exist in exactly two places, here
                        and on the four levels, where they name the part rather
                        than decorate a bullet. */}
                    <span className="text-xl leading-none" aria-hidden>{p.emoji}</span>
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
                <h3 className="font-display text-2xl mb-1.5">{p.name}</h3>
                <p className="text-sm mb-3" style={{ color: p.color }}>
                  {p.line}
                </p>
                <p className="text-sm text-ink-soft leading-relaxed font-light mb-5">
                  {p.body}
                </p>
                <ul className="mt-auto space-y-2 border-t border-rule pt-4">
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

          <div className="mt-6 panel p-6 grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8">
              <p className="label mb-3">Why three</p>
              <h3 className="font-display text-2xl leading-snug mb-2">
                Three dots in the logo, three parts to the work. That was on purpose.
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed font-light max-w-reading">
                Each dot is a stage, and it is the order we build in. Every colour on
                this site comes from one of the three.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Link href="/services" className="btn-ghost">
                What that looks like in detail
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Point of view, on white for contrast ---------- */}
      <section data-flow className="band-light px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] font-medium uppercase tracking-label text-[#3D6FE8] mb-4">
            Where we have a point of view
          </p>
          <div className="grid md:grid-cols-12 gap-6 mb-10">
            <h2 className="md:col-span-7 font-display text-4xl md:text-5xl leading-[1.05] text-[#0B1322]">
              Brand identity and communications
              <br />
              are the home discipline here.
            </h2>
            <p className="md:col-span-5 text-[#49566E] font-light leading-relaxed self-end max-w-reading">
              It is the thing the studio is built around. Here is what we actually
              think.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
            {[
              {
                n: "01",
                c: "#2B57C4",
                t: "A logo is not a brand",
                b: "It is one asset inside a system. Buy a logo on its own and in six months you will have five versions of yourself.",
              },
              {
                n: "02",
                c: "#155E9C",
                t: "Most rebrands fail at the sentence, not the symbol",
                b: "The first thing a customer processes is a sentence. If it could describe any of your competitors, it has done nothing.",
              },
              {
                n: "03",
                c: "#B03A12",
                t: "Consistency beats cleverness",
                b: "One line repeated everywhere outperforms three good lines competing.",
              },
              {
                n: "04",
                c: "#0F6B4F",
                t: "Taste is a decision, not a vibe",
                b: "Every choice is defensible. If we cannot explain a decision to you, it was not a decision.",
              },
            ].map((x) => (
              <div key={x.n} className="border-t-2 pt-4" style={{ borderTopColor: x.c }}>
                <p
                  className="text-[11px] font-medium uppercase tracking-label mb-2"
                  style={{ color: x.c }}
                >
                  {x.n}
                </p>
                <h3 className="font-display text-xl leading-snug mb-2 text-[#0B1322]">{x.t}</h3>
                <p className="text-sm text-[#49566E] font-light leading-relaxed">{x.b}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-[#DCE5F2] bg-[#F6F9FE] p-6 grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8">
              <p className="text-[11px] font-medium uppercase tracking-label text-[#2B57C4] mb-2">
                What that covers
              </p>
              <p className="text-sm text-[#49566E] font-light leading-relaxed">
                Naming and name treatment, logo and wordmark, colour and type systems,
                verbal identity and tone, positioning and messaging hierarchy, launch
                copy, and the usage guide that keeps it all intact after we hand it
                over.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Link
                href="/work"
                className="btn border border-[#C9D6EA] text-[#0B1322] hover:bg-white"
              >
                See it applied <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Work ---------- */}
      <section data-flow className="band-light px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Dots and a caption, the same mark the whole studio runs on */}
          <div className="flex flex-col items-center text-center mb-10">
            <svg width="74" height="22" viewBox="0 0 58 18" fill="none" aria-hidden>
              <line x1="10.5" y1="9" x2="23.5" y2="9" stroke="#9FC4E8" strokeWidth="1.2" />
              <line x1="34.5" y1="9" x2="46.5" y2="9" stroke="#9FC4E8" strokeWidth="1.2" />
              <circle className="pulse-1" cx="6" cy="9" r="5.6" fill="#1E3A8A" style={{ transformOrigin: "6px 9px" }} />
              <circle className="pulse-2" cx="29" cy="9" r="5.6" fill="#5B9BF9" style={{ transformOrigin: "29px 9px" }} />
              <circle className="pulse-3" cx="52" cy="9" r="5.6" fill="#9FC4E8" style={{ transformOrigin: "52px 9px" }} />
            </svg>
            <p className="text-[11px] font-medium uppercase tracking-label text-[#3D6FE8] mt-4">
              Brand · Site · System, on one project
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-[#0B1322] mt-3 max-w-3xl">
              An Instagram DM business,
              <br />
              turned into a real shop.
            </h2>
            <p className="text-[#647089] font-light leading-relaxed max-w-reading mt-4">
              CardsRG sells PSA graded cards, rare inserts and pack rips. It had an
              audience and no storefront. It went live and it sells.
            </p>
          </div>

          <Link href="/work" className="group block">
            <div className="grid md:grid-cols-12 gap-4">
              <div className="md:col-span-8 overflow-hidden rounded-2xl border border-[#DCE5F2] shadow-[0_30px_70px_-30px_rgba(11,19,34,0.45)]">
                <img
                  src="/assets/crg-hero.jpg"
                  alt="CardsRG storefront homepage, dark with the headline Rip. Pull. Collect."
                  className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-[1.015]"
                />
              </div>
              <div className="md:col-span-4 overflow-hidden rounded-2xl border border-[#DCE5F2] shadow-[0_30px_70px_-30px_rgba(11,19,34,0.45)]">
                <img
                  src="/assets/crg-cards.jpg"
                  alt="CardsRG product grid showing real graded card listings"
                  className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-4 mt-5 items-start">
              <div className="md:col-span-5">
                <p className="font-display text-2xl text-[#0B1322] group-hover:text-accent transition-colors">
                  CardsRG
                </p>
                <p className="text-sm text-[#3D6FE8] mt-1">cardsrg.com</p>
              </div>
              <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#E8EEF7] pt-4">
                {[
                  ["Brand", "Mark and palette"],
                  ["Site", "Full storefront"],
                  ["Commerce", "Cart and checkout"],
                  ["Built in", "Under two weeks"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[11px] font-medium uppercase tracking-label text-[#647089] mb-1">
                      {k}
                    </p>
                    <p className="text-sm text-[#0B1322] font-light leading-snug">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Link>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
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
      <section data-flow className="border-t border-rule px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-4">How it works</p>
          <h2 className="display text-4xl md:text-5xl max-w-3xl mb-10">
            Four levels, and you are busy for about twenty minutes of it.
          </h2>

          <div className="hidden lg:block relative h-px mb-4 mx-[12.5%]">
            <span className="flowline absolute inset-0 block" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                i: "pencil",
                e: "✍️",
                c: "#5B9BF9",
                step: "Level 1",
                day: "The spark",
                t: "Send the intention",
                b: "One short form. A few sentences about what you want to exist. No discovery call, no brief, no deck. You get back a scope, a price and a date we work to.",
                you: "15 minutes",
              },
              {
                i: "eye",
                e: "👀",
                c: "#F0845F",
                step: "Level 2",
                day: "First look",
                t: "See a real direction",
                b: "Not a mood board. An actual first pass in a browser, with your words and your colors in it, while the idea still has heat on it.",
                you: "One reply",
              },
              {
                i: "hammer",
                e: "🔨",
                c: "#FBBF24",
                step: "Level 3",
                day: "The build",
                t: "We build it all",
                b: "Real pages, real copy, real payments, real forms. The system gets wired in and tested with live data.",
                you: "Nothing",
              },
              {
                i: "rocket",
                e: "🚀",
                c: "#34D399",
                step: "Level 4",
                day: "Live",
                t: "It goes live and it is yours",
                b: "On your domain, tested on a phone, handed over with docs.",
                you: "Approve it",
              },
            ].map((x, gi) => (
              <div key={x.step} className="panel panel-lift p-5 flex flex-col">
                <span className="block text-xl leading-none mb-3" aria-hidden>{x.e}</span>
                <div className="flex items-baseline gap-2 mb-2">
                  <p
                    className="text-[11px] font-medium uppercase tracking-label"
                    style={{ color: x.c }}
                  >
                    {x.step}
                  </p>
                  <p className="label">· {x.day}</p>
                </div>
                {/* Level meter, filled to here */}
                <div className="flex gap-1.5 mb-3" aria-hidden>
                  {[0, 1, 2, 3].map((seg) => (
                    <span
                      key={seg}
                      className="h-[3px] flex-1 rounded-full"
                      style={{
                        background: seg <= gi ? x.c : "#26355A",
                        opacity: seg <= gi ? 0.9 : 1,
                      }}
                    />
                  ))}
                </div>
                <h3 className="font-display text-lg leading-snug mb-2">{x.t}</h3>
                <p className="text-sm text-ink-soft font-light leading-relaxed mb-4">
                  {x.b}
                </p>
                <div className="mt-auto border-t border-rule pt-3">
                  <p className="label mb-1">Your time</p>
                  <p className="text-sm" style={{ color: x.c }}>
                    {x.you}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link href="/how-we-work" className="btn-ghost">
              The long version, including the awkward questions
            </Link>
          </div>
        </div>
      </section>


      {/* ---------- The name as a verb ---------- */}
      <section data-flow className="band-light px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="panel p-6 md:p-8 grid md:grid-cols-12 gap-6">
            <div className="md:col-span-5">
              <p className="label mb-4">What the name means</p>
              <p className="font-display text-5xl leading-none">
                flow<span className="text-accent">zone</span>
              </p>
              <p className="text-[13px] text-ink-mute mt-3">
                verb · flowzoned, flowzoning
              </p>
            </div>
            <div className="md:col-span-7">
              <p className="text-xl text-ink font-light leading-snug">
                To take an intention and get it moving. To go from a thing you keep
                meaning to start, to a thing that is live, branded and running on its
                own.
              </p>
              <p className="text-ink-soft font-light leading-relaxed mt-4 max-w-reading">
                The gap is never the idea. It is the design, the words, the build and the plumbing, all needed at once. That gap is the whole job.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- The obvious question ---------- */}
      <section data-flow className="band-light px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-4">The obvious question</p>
          <div className="grid md:grid-cols-12 gap-6 mb-10">
            <h2 className="md:col-span-7 display text-4xl md:text-5xl">
              Why not just ask AI
              <br />
              to do all this?
            </h2>
            <p className="md:col-span-5 text-ink-soft font-light leading-relaxed self-end max-w-reading">
              Fair. Here is the honest answer about where they stop.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
            {[
              {
                n: "01",
                c: "#2B57C4",
                t: "You have to know what to ask for",
                b: "AI gives you exactly what you describe. Most people cannot describe it yet, and that is the actual work.",
              },
              {
                n: "02",
                c: "#155E9C",
                t: "One logo is easy, fifty agreeing decisions are not",
                b: "Each piece takes ten minutes. Making them all look and sound like the same company is the whole job.",
              },
              {
                n: "03",
                c: "#8A5100",
                t: "The last ten percent is where projects die",
                b: "Projects do not die at the start. They die at ninety percent, six weeks in, at one in the morning.",
              },
              {
                n: "04",
                c: "#0F6B4F",
                t: "Nobody is accountable to a chat window",
                b: "You are hiring a person who is on the hook for the result, and who you can reply to.",
              },
            ].map((x) => (
              <div key={x.n} className="border-t-2 pt-4" style={{ borderTopColor: x.c }}>
                <p
                  className="text-[11px] font-medium uppercase tracking-label mb-2"
                  style={{ color: x.c }}
                >
                  {x.n}
                </p>
                <h3 className="font-display text-xl leading-snug mb-2">{x.t}</h3>
                <p className="text-sm text-ink-soft font-light leading-relaxed">{x.b}</p>
              </div>
            ))}
          </div>

          {/* The speed answer and the do-not-hire-us answer were two sections
              saying the same thing. One panel now. */}
          <div className="mt-10 panel p-6 grid md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
              <p className="label mb-3">Why it can be this fast</p>
              <p className="font-display text-2xl md:text-3xl leading-snug">
                AI gives us the speed. Humans give it the{" "}
                <span className="text-gradient">taste</span>.
              </p>
              <p className="text-sm text-ink-soft font-light leading-relaxed mt-3 max-w-reading">
                A model can produce a hundred layouts in a minute. Knowing which one is
                right is the part you are paying for. A week instead of two months,
                without it looking like everyone else's AI site.
              </p>
            </div>
            <div className="md:col-span-5 md:border-l md:border-rule md:pl-6 flex flex-col">
              <p className="label mb-3">And when you should not hire us</p>
              <p className="text-sm text-ink-soft font-light leading-relaxed">
                If you have taste, technical confidence and free evenings, build it
                yourself and keep the money.
              </p>
              <div className="mt-4 md:mt-auto">
                <Link href="/how-we-work" className="btn-ghost">
                  More straight answers <span className="arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Chat ---------- */}
      <section data-flow className="border-t border-rule px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <p className="label mb-4">Ask first</p>
          <h2 className="display text-4xl md:text-5xl mb-3 max-w-2xl">
            Not sure what you actually need?
          </h2>
          <p className="text-ink-soft font-light mb-6 max-w-reading">
            Describe the thing you are launching and get a straight answer about which
            of the three parts it needs.
          </p>
          <ChatWidget />

          <div className="mt-4">
            <WorkSession />
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section data-flow className="bg-paper-deep glow border-t border-rule px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] font-medium uppercase tracking-label text-ink-mute mb-6">
            Start here
          </p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mb-5">
            Bring the imagination.
            <br />
            We bring the running thing.
          </h2>
          <p className="text-ink-soft max-w-md mx-auto mb-8 leading-relaxed font-light">
            A few sentences is enough. You get a real reply.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <MessageUs className="btn-primary shine" />
            <a href={SITE.mailto} className="btn-ghost">
              Start an email <span className="arrow">→</span>
            </a>
          </div>
          <p className="text-[12px] text-ink-mute mt-6">
            Mail lands with a person, not in a queue.
          </p>
        </div>
      </section>
    </>
  );
}
