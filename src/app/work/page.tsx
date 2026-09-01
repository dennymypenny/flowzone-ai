import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import NodeWeb from "@/app/components/NodeWeb";
import MessageUs, { TicketNote } from "@/components/MessageUs";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Some of the work FlowZone has shipped. A storefront built end to end, three reels cut for sound-off feeds, a product animation and brand graphics for clients, all of it live.",
  alternates: { canonical: "/work" },
  // Set in full because metadata merging is shallow. A page that declares
  // openGraph replaces the layout block outright, so anything omitted is gone.
  openGraph: {
    title: "Work | FlowZone",
    description:
      "Some of our work, and we are always looking for the next one. A storefront built end to end, three reels cut for sound-off feeds, a product animation and brand graphics for clients.",
    url: `${SITE.url}/work`,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

export default function Work() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <NodeWeb className="opacity-90" />
        <div className="absolute inset-0 gridlight pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-12">
            <p className="label">Work</p>
            <p className="label">Everything here is real and live</p>
          </div>
          {/* Not "a short list, on purpose". That apologised for the count
              before anybody saw the work. This is an invitation instead. */}
          <h1 className="display text-5xl md:text-8xl max-w-4xl">
            Some of our work.
            <br />
            Always looking for more.
          </h1>
          <p className="lede max-w-reading mt-10">
            A storefront built end to end, three reels cut for sound-off feeds,
            a product animation and brand graphics for clients. Everything here
            is live and
            every piece of it was made by us. If you have something you want
            built,{" "}
            <Link
              href="/intake"
              className="underline decoration-rule underline-offset-4 hover:text-ink transition-colors"
            >
              tell us about it
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CardsRG */}
      <section data-flow className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="border-t border-rule pt-10 grid md:grid-cols-12 gap-10 mb-10">
            <div className="md:col-span-4">
              <p className="label mb-4">01 · In-house build</p>
              <h2 className="font-display text-5xl leading-none mb-4">CardsRG</h2>
              <a
                href="https://cardsrg.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                cardsrg.com ↗
              </a>
            </div>
            <div className="md:col-span-8">
              <p className="text-ink-soft leading-relaxed max-w-reading">
                CardsRG is ours. A collector trading card shop for PSA graded cards,
                rare inserts and pack rips, built by this studio and still run by it.
                This is not a case study we were handed. It is the whole job done on
                ourselves, with our own money on the line.
              </p>
              <p className="text-ink-soft leading-relaxed max-w-reading mt-4">
                We built the brand mark, the content engine that grew the audience,
                the whole storefront, product pages with grade and set detail, cart
                and checkout. Dark, loud and fast, because that is what the audience
                responds to. It went live in under two weeks and it sells.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 border-t border-rule pt-6">
                {[
                  ["Brand", "Mark and palette"],
                  ["Site", "Full storefront"],
                  ["Commerce", "Cart and checkout"],
                  ["Stack", "Next.js on Vercel"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="label mb-1.5">{k}</p>
                    <p className="text-sm text-ink-soft">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel overflow-hidden">
              <img
                src="/assets/crg-hero.jpg"
                alt="CardsRG homepage with the CRG shield logo and the headline Rip. Pull. Collect."
                className="w-full h-auto"
              />
            </div>
            <div className="panel overflow-hidden">
              <img
                src="/assets/crg-cards.jpg"
                alt="CardsRG product grid showing graded Lionel Messi and Stan Lee cards with prices and cart buttons"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* The channel art, before and after. Same shop, same logo, and
              the second one tells you where to buy something. */}
          <div className="border-t border-rule pt-10 mt-16">
            <p className="label mb-4">Before and after</p>
            <h3 className="font-display text-3xl md:text-4xl leading-tight mb-3 max-w-2xl">
              The channel had the audience. It did not have a door.
            </h3>
            <p className="text-ink-soft font-light leading-relaxed max-w-reading mb-8">
              The old banner was a poster. The new one is a directory: what
              they sell, where to buy it, and the shop address, on the first
              screen anybody lands on.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  src: "/assets/crg-yt-before.jpg",
                  tag: "Before",
                  c: "#93A2BC",
                  note: "A logo on lightning. Nothing to do next.",
                  alt: "The old CardsRG channel banner: the CRG shield on a white lightning background with a subscribe button",
                },
                {
                  src: "/assets/crg-yt-after.jpg",
                  tag: "After",
                  c: "#5B8CFF",
                  note: "What they sell, and four ways to buy it.",
                  alt: "The new CardsRG channel banner in shop pink, listing Pokemon, One Piece, sports, slabs and sealed, with Instagram, eBay, cardsrg.com and email",
                },
              ].map((x) => (
                <figure key={x.tag} className="panel overflow-hidden flex flex-col">
                  <img src={x.src} alt={x.alt} className="w-full h-auto block" loading="lazy" />
                  <figcaption className="px-5 py-4 border-t border-rule flex items-baseline gap-3">
                    <span
                      className="text-[11px] font-medium uppercase tracking-label shrink-0"
                      style={{ color: x.c }}
                    >
                      {x.tag}
                    </span>
                    <span className="text-sm text-ink-soft font-light">{x.note}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* The receipts. The audience and the storefront are the same
              studio's work, both halves of one loop, and the page says so. */}
          <div className="border-t border-rule pt-10 mt-16">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-8">
              <p className="label">What the brand did in 90 days</p>
              <p className="label">Instagram · last 90 days</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {[
                { n: "89,212", k: "Views", c: "#A8C4FF" },
                { n: "28,027", k: "People reached", c: "#5B8CFF" },
                { n: "4,743", k: "Interactions", c: "#C6E4F8" },
                { n: "+998", k: "Net new followers", c: "#34D399" },
              ].map((m) => (
                <div key={m.k}>
                  <p
                    className="font-display text-4xl md:text-5xl leading-none"
                    style={{ color: m.c }}
                  >
                    {m.n}
                  </p>
                  <p className="label mt-2">{m.k}</p>
                </div>
              ))}
            </div>

            <div className="panel p-5 md:p-6">
              <svg
                viewBox="0 0 640 150"
                className="w-full h-[130px] md:h-[170px] block"
                preserveAspectRatio="none"
                role="img"
                aria-label="Daily views: flat through late May, climbing from early July, spiking to sixteen thousand in the week of August 19"
              >
                <defs>
                  <linearGradient id="crgWorkLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7E9FD8" />
                    <stop offset="55%" stopColor="#C6E4F8" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0.0,146.7 L 7.9,146.6 L 15.8,146.7 L 23.7,146.5 L 31.6,146.6 L 39.5,146.7 L 47.4,146.4 L 55.3,146.6 L 63.2,146.7 L 71.1,146.5 L 79.0,146.6 L 86.9,146.7 L 94.8,146.6 L 102.7,146.4 L 110.6,146.6 L 118.5,146.7 L 126.4,146.5 L 134.3,146.6 L 142.2,146.7 L 150.1,146.6 L 158.0,146.5 L 165.9,146.7 L 173.8,146.6 L 181.7,146.4 L 189.6,146.6 L 197.5,146.7 L 205.4,146.5 L 213.3,146.6 L 221.2,146.7 L 229.1,146.6 L 237.0,130.9 L 244.9,120.1 L 252.8,128.2 L 260.7,117.4 L 268.6,130.0 L 276.5,121.9 L 284.4,129.1 L 292.3,133.6 L 300.2,126.4 L 308.1,131.8 L 316.0,124.6 L 324.0,130.0 L 331.9,127.3 L 339.8,132.7 L 347.7,115.6 L 355.6,126.4 L 363.5,121.0 L 371.4,128.2 L 379.3,122.8 L 387.2,130.0 L 395.1,134.5 L 403.0,123.7 L 410.9,129.1 L 418.8,119.2 L 426.7,126.4 L 434.6,112.9 L 442.5,124.6 L 450.4,117.4 L 458.3,125.5 L 466.2,108.4 L 474.1,121.0 L 482.0,103.9 L 489.9,115.6 L 497.8,110.2 L 505.7,117.4 L 513.6,97.6 L 521.5,113.8 L 529.4,103.0 L 537.3,111.1 L 545.2,92.2 L 553.1,106.6 L 561.0,99.4 L 568.9,110.2 L 576.8,84.1 L 584.7,103.0 L 592.6,4.0 L 600.5,65.2 L 608.4,90.4 L 616.3,79.6 L 624.2,103.0 L 632.1,128.2 L 640.0,133.6"
                  fill="none"
                  stroke="url(#crgWorkLine)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="flex justify-between mt-3">
                <span className="label">May 22</span>
                <span className="label">Jul 5</span>
                <span className="label">Aug 19</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mt-6">
              {[
                { k: "Reels", v: "42K", w: "93%", c: "#5B8CFF" },
                { k: "Posts", v: "30K", w: "67%", c: "#A8C4FF" },
              ].map((b) => (
                <div key={b.k}>
                  <div className="flex items-baseline justify-between mb-2">
                    <p className="text-sm text-ink">{b.k}</p>
                    <p className="text-sm" style={{ color: b.c }}>
                      {b.v} views
                    </p>
                  </div>
                  <div className="h-1.5 rounded-full bg-rule overflow-hidden">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: b.w, background: b.c }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-ink-soft font-light leading-relaxed mt-8 max-w-reading">
              This audience was built post by post, by the same studio that then
              built the place it points at. Brand, content and storefront are one
              loop, and these numbers are what the loop produced. That is the
              argument for hiring us instead of a logo guy and a web guy.
            </p>
          </div>
        </div>
      </section>

      {/* Motion: three reels, on white. Two are client work and one is a
          studio sample, and each says which it is, because the rule on this
          page is that nothing pretends. Three across with the write-up under
          each, so a fourth drops in without a relayout. */}
      <section data-flow className="band-light px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="border-t border-rule pt-10 mb-12">
            <p className="label mb-4">02 · Motion</p>
            <div className="grid md:grid-cols-12 gap-10">
              <h2 className="md:col-span-6 font-display text-5xl leading-none">
                Reels built for
                <br />
                sound-off feeds.
              </h2>
              <p className="md:col-span-6 text-ink-soft leading-relaxed self-end max-w-reading">
                Short vertical pieces that make the whole pitch on screen, in
                seconds, with no audio needed. They ship alongside a brand or
                storefront build so the launch does not go out silent.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Shutters Depot",
                kind: "Client work",
                base: "shutters-depot-reel",
                aria: "Shutters Depot promo reel: Miami, hurricane season does not wait. Accordion shutters, hurricane panels, impact doors and windows.",
                blurb:
                  "Cut for a hurricane protection company in Hialeah. Twenty-five seconds that walk the product line, accordion shutters, panels and impact windows, with the urgency Miami actually feels every June.",
                link: { href: "https://shutters-depot.com", label: "shutters-depot.com ↗" },
                facts: [["Length", "25 seconds"], ["Made for", "Instagram and TikTok"]],
              },
              {
                name: "ABC Capital Group",
                kind: "Client work",
                base: "abc-capital-reel",
                aria: "ABC Capital Group reel: selling a house in South Florida should not be this hard. Over one hundred million bought and sold across Miami-Dade, Broward and Palm Beach, and a four step process ending in a fair all-cash offer.",
                blurb:
                  "A cash home buyer working Miami-Dade, Broward and Palm Beach. Calm and editorial on purpose, because the audience is somebody under pressure to sell and loud would have read as a scam.",
                link: { href: "https://www.abccapitalgroupusa.com/", label: "abccapitalgroupusa.com ↗" },
                facts: [["Length", "21 seconds"], ["Made for", "Instagram and TikTok"]],
              },
              {
                name: "Vice City Property Runs",
                kind: "Studio sample",
                base: "vice-city-reel",
                aria: "Vice City Property Runs promo reel: can't make a property appointment? Property runs across South Florida, open seven days a week, same day service.",
                blurb:
                  "A sample cut in the studio for a South Florida property appointment service. The whole pitch in fourteen seconds: the problem, the coverage, the hours, the handle.",
                link: null,
                facts: [["Length", "14 seconds"], ["Made for", "Instagram and TikTok"]],
              },
            ].map((r) => (
              <div key={r.base} className="flex flex-col">
                <div className="panel overflow-hidden">
                  <video
                    className="w-full h-auto block"
                    poster={`/assets/${r.base}-poster.jpg`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    preload="metadata"
                    aria-label={r.aria}
                  >
                    <source src={`/assets/${r.base}.webm`} type="video/webm" />
                    <source src={`/assets/${r.base}.mp4`} type="video/mp4" />
                  </video>
                </div>
                <div className="mt-6 flex flex-col flex-1">
                  <p className="label mb-3">{r.kind}</p>
                  <h3 className="font-display text-2xl leading-tight mb-2">{r.name}</h3>
                  {r.link && (
                    <a
                      href={r.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline"
                    >
                      {r.link.label}
                    </a>
                  )}
                  <p className="text-sm text-ink-soft font-light leading-relaxed mt-4">
                    {r.blurb}
                  </p>
                  <div className="border-t border-rule mt-auto pt-4 space-y-2.5">
                    {r.facts.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <p className="label">{k}</p>
                        <p className="text-sm text-ink-soft">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The SlipFolio piece is landscape and explains a product, so it does
          not belong in the vertical reel grid. It gets the full width and the
          write-up sits under it. */}
      <section data-flow className="px-6 py-24 border-t border-rule">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-10 mb-10">
            <div className="md:col-span-6">
              <p className="label mb-4">03 · Product animation</p>
              <h2 className="font-display text-5xl leading-none mb-4">
                Explaining the thing
                <br />
                the screenshot cannot.
              </h2>
            </div>
            <p className="md:col-span-6 text-ink-soft leading-relaxed self-end max-w-reading">
              Some products only make sense in motion. Twelve seconds showing
              the actual mechanic beats a paragraph trying to describe it, and
              it works on a landing page, in an ad and in a pitch deck without
              being recut.
            </p>
          </div>

          <div className="panel overflow-hidden">
            <video
              className="w-full h-auto block"
              poster="/assets/slipfolio-hype-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
              aria-label="SlipFolio product animation: a fifty dollar bet slip on Lakers minus four and a half, with a slice of the stake investing automatically, win or lose. Every bet builds a portfolio."
            >
              <source src="/assets/slipfolio-hype.webm" type="video/webm" />
              <source src="/assets/slipfolio-hype.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="grid md:grid-cols-12 gap-10 mt-8">
            <div className="md:col-span-5">
              <p className="label mb-3">Client work</p>
              <h3 className="font-display text-3xl leading-none mb-2">SlipFolio</h3>
              <a
                href="https://slip-folio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                slip-folio.com ↗
              </a>
            </div>
            <div className="md:col-span-7">
              <p className="text-ink-soft font-light leading-relaxed max-w-reading">
                SlipFolio turns a bet slip into an investment: a slice of every
                stake goes into a portfolio, win or lose. That is one sentence
                to read and a hard idea to picture, so the animation shows it
                happening on the slip itself, then lands the line.
              </p>
              <div className="border-t border-rule mt-6 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  ["Length", "12 seconds"],
                  ["Format", "16:9 landscape"],
                  ["Made for", "Site and ads"],
                  ["Audio", "None needed"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="label mb-1.5">{k}</p>
                    <p className="text-sm text-ink-soft">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NextPlayU is one banner, and that is the point: it sits here as the
          proof behind the single-graphic offer. Landscape, so it gets the full
          width like SlipFolio rather than a grid slot. */}
      <section data-flow className="px-6 py-24 border-t border-rule">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-10 mb-10">
            <div className="md:col-span-6">
              <p className="label mb-4">04 · Brand graphics</p>
              <h2 className="font-display text-5xl leading-none mb-4">
                One graphic,
                <br />
                doing a whole introduction.
              </h2>
            </div>
            <p className="md:col-span-6 text-ink-soft leading-relaxed self-end max-w-reading">
              Sometimes the job is not a site or a reel. It is one banner that
              has to carry the name, the mark, the promise and the address, and
              look like a brand that has been around for years.
            </p>
          </div>

          <div className="panel overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/npu-banner.png"
              alt="NextPlayU banner: NPU monogram and wordmark over black and gold, with the line Your next play starts here. From college and pro sports to careers where high performers outperform. nextplayu.io"
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>

          <div className="grid md:grid-cols-12 gap-10 mt-8">
            <div className="md:col-span-5">
              <p className="label mb-3">Client work</p>
              <h3 className="font-display text-3xl leading-none mb-2">NextPlayU</h3>
              <a
                href="https://nextplayu.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                nextplayu.io ↗
              </a>
            </div>
            <div className="md:col-span-7">
              <p className="text-ink-soft font-light leading-relaxed max-w-reading">
                NextPlayU helps college and pro athletes make the jump from
                sports into careers. The banner leads with the monogram, holds
                one line and one promise, and keeps the black and gold doing the
                talking. Built as a single graphic, delivered ready to post.
              </p>
              <div className="border-t border-rule mt-6 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  ["Piece", "Brand banner"],
                  ["Format", "4:1 wide"],
                  ["Made for", "Site and socials"],
                  ["Turnaround", "Single graphic"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="label mb-1.5">{k}</p>
                    <p className="text-sm text-ink-soft">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Walkthrough: the thinking behind the mark, on white ----------
          The longest read on the site, so it gets the light band. Every step
          carries a signal colour, and none of the dark-theme values survive on
          white, so each one has a paired dark value in `cl` below. Ratios on
          #FFFFFF: #2B57C4 6.44, #A8175E 7.12, #0E6E85 5.85, #8A5100 6.45,
          #0F6B4F 6.49, #155E9C 6.75. The originals measured 3.96, 3.29, 1.57,
          1.67 and 1.92. */}
      <section data-flow className="band-light px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-6">Walk through one decision at a time</p>
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            <h2 className="md:col-span-7 display text-4xl md:text-5xl">
              Anyone can show you
              <br />
              a finished logo.
            </h2>
            <p className="md:col-span-5 text-ink-soft font-light leading-relaxed self-end max-w-reading">
              The finished thing tells you almost nothing. What decided it is the part
              worth reading, so here is the CRG mark taken apart, one choice at a time,
              including the ones we got wrong first.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="panel overflow-hidden">
                <img
                  src="/assets/crg-hero.jpg"
                  alt="The CRG shield mark in place on the CardsRG storefront"
                  className="w-full h-auto"
                />
              </div>
              <p className="text-[11px] text-ink-mute font-light mt-3 leading-relaxed">
                The mark in the place it actually has to work: small, in a corner, next
                to a menu, on top of a photograph. That is the real test, not a
                presentation slide.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-10">
              {[
                {
                  n: "01",
                  c: "#4C7BE8",
                  cl: "#2B57C4",
                  t: "A shield, because the category already speaks it",
                  b: "Trading cards live inside sports crests, team badges and holo foil. A shield is not a clever idea, it is the shape the audience already reads as authority, and using the language your buyer already speaks beats being original at them.",
                },
                {
                  n: "02",
                  c: "#FF3D9A",
                  cl: "#A8175E",
                  t: "Two accents, not five",
                  b: "Teal and magenta, and nothing else fighting them. Card culture is visually loud, so the mark had to hold its own against a photo of forty foil packs without joining the noise. Two colors far apart on the wheel do that. Five would have turned into mush at the size it actually gets used.",
                },
                {
                  n: "03",
                  c: "#38E1FF",
                  cl: "#0E6E85",
                  t: "The crown earns its place",
                  b: "It is not decoration. The business is built on grails, the one card everyone is chasing, so the crown is the promise restated at the top of the mark. Every element should be answering a question about the business. If it is only there because it looked good, it comes out.",
                },
                {
                  n: "04",
                  c: "#FBBF24",
                  cl: "#8A5100",
                  t: "Chrome that survives being shrunk",
                  b: "The bevel and the inner glow read as premium at full size, but the mark spends its life at forty pixels in a browser tab. So the silhouette had to work in one flat color first, and the shine got added on top. Build it the other way around and you get a logo that dies the moment it is small.",
                },
                {
                  n: "05",
                  c: "#34D399",
                  cl: "#0F6B4F",
                  t: "The subline does the explaining",
                  b: "RIPS and GRAILS sits under the shield so the mark never has to explain itself. Three letters cannot tell a first-time visitor what the business does. Two words can, and they can be dropped when the audience knows you.",
                },
              ].map((x) => (
                <div key={x.n} className="border-l-2 pl-6" style={{ borderLeftColor: x.cl }}>
                  <p
                    className="text-[11px] font-medium uppercase tracking-label mb-2.5"
                    style={{ color: x.cl }}
                  >
                    {x.n}
                  </p>
                  <h3 className="font-display text-2xl leading-snug mb-3">{x.t}</h3>
                  <p className="text-sm text-ink-soft font-light leading-relaxed">{x.b}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The one that was wrong first */}
          <div className="mt-20 panel p-8 md:p-10">
            <div className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-5">
                <p className="label mb-4">And the one we got wrong first</p>
                <h3 className="font-display text-3xl leading-snug mb-4">
                  The thumbnail that did not work.
                </h3>
                <p className="text-sm text-ink-soft font-light leading-relaxed">
                  Version one: two people behind a pile of packs against a bright sky.
                  It looked fine and it performed badly, which is the most useful kind
                  of failure because it is specific.
                </p>
              </div>
              <div className="md:col-span-7 space-y-6">
                {[
                  {
                    k: "What was wrong",
                    c: "#FBBF24",
                    cl: "#8A5100",
                    v: "Half the frame was empty sky. On a phone, at the size a thumbnail is actually seen, the faces were smaller than a fingernail and the product was an unreadable smear along the bottom.",
                  },
                  {
                    k: "What changed",
                    c: "#34D399",
                    cl: "#0F6B4F",
                    v: "Faces scaled up until they carry the frame, product pushed into every remaining gap so the density itself is the message, sky deleted entirely. Same two people, same packs, same shoot. Only the decisions changed.",
                  },
                  {
                    k: "The rule underneath it",
                    c: "#5B9BF9",
                    cl: "#155E9C",
                    v: "Design for the size it gets viewed at, not the size you are working at. Almost every weak thumbnail, logo and hero image is a thing that was judged on a big screen and lives on a small one.",
                  },
                ].map((r) => (
                  <div key={r.k} className="border-t border-rule pt-5">
                    <p
                      className="text-[11px] font-medium uppercase tracking-label mb-2"
                      style={{ color: r.cl }}
                    >
                      {r.k}
                    </p>
                    <p className="text-sm text-ink-soft font-light leading-relaxed max-w-reading">
                      {r.v}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-ink-soft font-light leading-relaxed max-w-reading mt-14">
            This is the level every decision gets, on every build, whether or not
            anybody ever asks. You are welcome to ask.
          </p>
        </div>
      </section>

      {/* Honest note */}
      <section data-flow className="bg-paper-deep px-6 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="label mb-6">The Honest Bit</p>
            <h2 className="display text-4xl md:text-5xl">
              New studio.
              <br />
              Not a new obsession.
            </h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-ink-soft leading-relaxed max-w-reading">
              FlowZone is new. The thing it is built on is not. Brand, design and the
              way a company sounds have been the obsession for years, long before any
              of it had a name or an invoice attached. This page is short because the
              studio is at the beginning, not because the work is a side interest we
              picked up recently.
            </p>
            <p className="text-ink-soft leading-relaxed max-w-reading mt-4">
              It also means everything here is real. No concepts dressed up as clients,
              no logos we had nothing to do with. And what you get for arriving early
              is the version of a studio everyone says they want later: the person who
              answers your email is the person who builds the thing, and the pricing
              reflects where we are rather than where we intend to be.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <MessageUs />
              <Link href="/how-we-work" className="btn-ghost">
                How we work
              </Link>
            </div>
            <TicketNote />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-flow className="bg-paper-deep glow border-t border-rule px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-6">
            Want to be the next one on this page?
          </h2>
          <div className="mt-4 flex justify-center">
            <MessageUs className="btn-primary" />
          </div>
          <TicketNote className="text-center" />
        </div>
      </section>
    </>
  );
}
