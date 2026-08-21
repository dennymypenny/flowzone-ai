import Link from "next/link";
import Icon from "@/components/Icon";
import AddToCart from "@/app/components/AddToCart";
import type { Metadata } from "next";
import MessageUs from "@/components/MessageUs";
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

        {/* The reel opens the page, edge to edge and unframed. Its own
            background is #060B1F against the page's #0C1424, six levels
            apart, so a fade at the bottom is all it takes to make the seam
            disappear and the film read as part of the page. */}
        <div className="relative w-full">
          <video
            className="w-full h-auto md:h-[56vh] md:min-h-[320px] md:max-h-[620px] md:object-cover block"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/studio-reel-poster.jpg"
            aria-label="FlowZone studio reel: you bring the idea, we build the brand, the site and the system"
          >
            <source src="/assets/studio-reel.webm" type="video/webm" />
            <source src="/assets/studio-reel.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-x-0 bottom-0 h-24 md:h-40 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(12,20,36,0) 0%, rgba(12,20,36,0.75) 55%, #0C1424 100%)",
            }}
          />
          <div
            className="absolute inset-y-0 left-0 w-16 md:w-28 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, #0C1424 0%, rgba(12,20,36,0) 100%)",
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-16 md:w-28 pointer-events-none"
            style={{
              background:
                "linear-gradient(270deg, #0C1424 0%, rgba(12,20,36,0) 100%)",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-14 md:pt-10 md:pb-20">

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

      {/* White, on purpose. The page was three dark bands in a row and
          nothing popped. This is also where the three parts finally get
          named in words, using the same lines the film uses. */}
      <section data-flow className="band-light px-6 py-14 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {[
              {
                n: "01",
                c: "#2B57C4",
                k: "Brand",
                b: "What people recognise you by.",
                d: "The mark, the colours, the words. The part that makes you look like you meant it.",
              },
              {
                n: "02",
                c: "#155E9C",
                k: "Site",
                b: "Where people go to decide.",
                d: "A page that answers the question and asks for the next step, instead of a profile and a DM.",
              },
              {
                n: "03",
                c: "#0F6B4F",
                k: "System",
                b: "What runs it behind the scenes.",
                d: "Booking, checkout, follow-up. The parts nobody sees and everybody feels.",
              },
            ].map((x) => (
              <div key={x.k} className="border-t-2 pt-5" style={{ borderTopColor: x.c }}>
                <p
                  className="text-[11px] font-medium uppercase tracking-label mb-3"
                  style={{ color: x.c }}
                >
                  {x.n} · {x.k}
                </p>
                <p className="font-display text-2xl md:text-[1.75rem] leading-snug text-[#0B1322] mb-3">
                  {x.b}
                </p>
                <p className="text-sm text-[#49566E] font-light leading-relaxed max-w-reading">
                  {x.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One picture doing the work of a paragraph: the constellation is
          already overhead and the person is standing inside it. The line is
          the distance argument, which lands harder than any promise. */}
      <section data-flow className="relative overflow-hidden border-t border-rule">
        <img
          src="/assets/constellation.jpg"
          alt="A person standing at the centre of wide concentric rings, under a night sky of connected points"
          className="w-full h-[68vh] min-h-[420px] max-h-[760px] object-cover object-[center_42%] block"
          loading="lazy"
          decoding="async"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,12,28,0.82) 0%, rgba(6,12,28,0.45) 34%, rgba(6,12,28,0.06) 60%, rgba(6,12,28,0.35) 100%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 px-6 pt-10 md:pt-14">
          <div className="max-w-6xl mx-auto">
            <p className="text-[11px] font-medium uppercase tracking-label text-[#9FC4E8] mb-4">
              The distance
            </p>
            <h2
              className="font-display text-[2.5rem] sm:text-6xl md:text-7xl leading-[0.98] text-white max-w-[16ch]"
              style={{ textShadow: "0 2px 30px rgba(6,12,28,0.6)" }}
            >
              You are not starting from nothing. You are two or three moves
              from live.
            </h2>
          </div>
        </div>
      </section>

      {/* The four builds, front and center. Click one, land in the ticket
          with it preselected. Colors are the on-white pairs. */}
      <section data-flow className="band-light px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-6 mb-10">
            <div className="md:col-span-7">
              <p className="label mb-4">Studio Services</p>
              <h2 className="display text-4xl md:text-5xl">
                Pick what you need.
                <br />
                We build it.
              </h2>
            </div>
            <p className="md:col-span-5 text-ink-soft font-light leading-relaxed self-end max-w-reading">
              Know what you need? Pick it and open a ticket: four questions, no
              call. Not sure? Open one anyway, tell us the idea, and we will
              tell you which build fits.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                k: "identity",
                icon: "palette",
                c: "#2B57C4",
                n: "01",
                name: "The Identity Build",
                one: "Your logo, colors and words. A brand people remember.",
                from: "From $500",
              },
              {
                k: "site",
                icon: "compass",
                c: "#155E9C",
                n: "02",
                name: "The Site Build",
                one: "A website that looks legit and turns visitors into customers.",
                from: "From $500",
              },
              {
                k: "storefront",
                icon: "banknote",
                c: "#A03D14",
                n: "03",
                name: "The Storefront Build",
                one: "An online store. Cart, checkout, money in your account.",
                from: "From $2,500",
              },
              {
                k: "engine",
                icon: "bolt",
                c: "#0F6B4F",
                n: "04",
                name: "The Engine Build",
                one: "Follow-ups, booking and invoicing that run themselves.",
                from: "From $500",
              },
            ].map((b) => (
              <Link
                key={b.k}
                href={`/intake?build=${b.k}`}
                className="panel panel-lift p-6 flex flex-col group border-t-2 transition-all"
                style={{ borderTopColor: b.c }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ background: `${b.c}14`, color: b.c }}
                  >
                    <Icon name={b.icon} className="w-5 h-5" />
                  </span>
                  <p
                    className="text-[11px] font-medium uppercase tracking-label"
                    style={{ color: b.c }}
                  >
                    {b.n}
                  </p>
                </div>
                <h3 className="font-display text-xl leading-snug mb-2">{b.name}</h3>
                <p className="text-sm text-ink-soft font-light leading-relaxed mb-8">
                  {b.one}
                </p>
                <div className="mt-auto border-t border-rule pt-4 flex items-center justify-between gap-3">
                  <span className="font-display text-2xl">
                    {b.from.replace("From ", "")}
                    <span className="text-[11px] font-sans font-medium uppercase tracking-label text-ink-mute ml-2">from</span>
                  </span>
                  <AddToCart id={b.k} showPrice={false} />
                </div>
              </Link>
            ))}
          </div>

          {/* The price-fear killer, warm and green: most small jobs land
              under fifty dollars. #0F6B4F is 6.49:1 on white. */}
          <div
            className="mt-6 rounded-[18px] p-8 md:p-10 grid md:grid-cols-12 gap-8 items-center border"
            style={{
              background: "linear-gradient(120deg, #EDFBF4 0%, #DDF6E9 55%, #CBF1DD 100%)",
              borderColor: "#0F6B4F2E",
              boxShadow: "0 24px 48px -28px rgba(15, 107, 79, 0.35)",
            }}
          >
            <div className="md:col-span-7">
              <p
                className="text-[11px] font-medium uppercase tracking-label mb-3"
                style={{ color: "#0F6B4F" }}
              >
                The small job menu
              </p>
              <h3 className="font-display text-4xl md:text-5xl leading-[1.02] mb-4">
                Most small jobs?{" "}
                <span style={{ color: "#0F6B4F" }}>Under $50.</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  ["flyer", "A flyer or post", "$49.99"],
                  ["form", "A form, wired in", "$49.99"],
                  ["logo", "A logo refresh", "$49.99"],
                  ["fix", "A fix pass", "$49.99"],
                  ["reel", "A promo reel", "$74.99"],
                  ["page", "A new page", "$99.99"],
                ].map(([id, w, price]) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-2.5 text-sm font-light rounded-full pl-4 pr-1.5 py-1 bg-white/85 border"
                    style={{ borderColor: "#0F6B4F26" }}
                  >
                    <span className="text-ink-soft">{w}</span>
                    <span className="font-medium" style={{ color: "#0F6B4F" }}>
                      {price}
                    </span>
                    <AddToCart id={id} showPrice={false} />
                  </span>
                ))}
              </div>
            </div>
            <div className="md:col-span-5 md:text-right">
              <p className="text-sm text-ink-soft font-light leading-relaxed mb-5 md:ml-auto max-w-xs">
                Add what you need to the cart and send it as one ticket. Same
                studio, same taste. Done in days, not weeks.
              </p>
              <Link href="/intake?build=small" className="btn-primary">
                Start a small job <span className="arrow">→</span>
              </Link>
            </div>
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

          {/* The headline numbers only. The trend line, the content split
              and the before and after live on /work, where somebody who
              cares enough to click can read the whole thing. */}
          <div className="mt-8 rounded-2xl border border-[#DCE5F2] bg-white p-6 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-7">
              <p className="text-[11px] font-medium uppercase tracking-label text-[#3D6FE8]">
                What it plugged into
              </p>
              <p className="text-[11px] font-medium uppercase tracking-label text-[#647089]">
                Instagram · last 90 days
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { n: "89,212", k: "Views", c: "#2B57C4" },
                { n: "28,027", k: "People reached", c: "#155E9C" },
                { n: "4,743", k: "Interactions", c: "#3D6FE8" },
                { n: "+998", k: "Net new followers", c: "#0F6B4F" },
              ].map((m) => (
                <div key={m.k}>
                  <p
                    className="font-display text-3xl md:text-4xl leading-none"
                    style={{ color: m.c }}
                  >
                    {m.n}
                  </p>
                  <p className="text-[11px] font-medium uppercase tracking-label text-[#647089] mt-2">
                    {m.k}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-sm text-[#647089] font-light leading-relaxed mt-7 max-w-reading">
              The audience was already there. It had nowhere to go but a DM.
              The storefront is what it points at now.
            </p>
          </div>

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
