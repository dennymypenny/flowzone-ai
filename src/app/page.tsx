import Link from "next/link";
import Icon from "@/components/Icon";
import AddToCart from "@/app/components/AddToCart";
import type { Metadata } from "next";
import MessageUs, { TicketNote } from "@/components/MessageUs";
import Testimonials from "@/components/Testimonials";
import { SITE } from "@/lib/site";
import PitchPath from "@/app/components/PitchPath";
import FastVideo from "@/app/components/FastVideo";

export const metadata: Metadata = {
  title: "FlowZone Studio | Brand, Website and Storefront Design",
  description: `${SITE.line} ${SITE.descriptor}`,
  alternates: { canonical: "/" },
  // openGraph merging is shallow, so siteName, type and locale get repeated on
  // every page. The card image is not repeated because app/opengraph-image.png
  // is file based metadata, which every route inherits on its own.
  openGraph: {
    title: "FlowZone Studio | Brand, Website and Storefront Design",
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
      {/* ---------- 1 · Hero ---------- */}
      {/* Light, centered and type-first, on real water. The wash is held
          back a step so the ocean reads, and the type is solid ink so
          nothing looks faded on a phone. The reel sits in branded player
          chrome so the film reads as ours, not a stock drop-in. */}
      <section
        className="band-light relative overflow-hidden px-6"
        style={{
          background:
            "linear-gradient(180deg, #F3F7FE 0%, #EEF4FC 55%, #EAF1FB 100%)",
        }}
      >
        <div className="absolute inset-0" aria-hidden>
          <FastVideo
            className="absolute inset-0 w-full h-full object-cover"
            rate={1.15}
            preload="auto"
            poster="/assets/ocean-hero-poster.jpg"
            sources={[
              { src: "/assets/ocean-hero.webm", type: "video/webm" },
              { src: "/assets/ocean-hero.mp4", type: "video/mp4" },
            ]}
          />
          {/* Transparent white wash so the type reads and the waves stay a texture. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(240,246,253,0.78) 0%, rgba(240,246,253,0.62) 45%, rgba(234,241,251,0.92) 100%)",
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto pt-20 pb-16 md:pt-28 md:pb-24 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-label text-[#2B57C4] mb-6">
            FlowZone Studio
          </p>

          <h1
            className="display text-[2.5rem] leading-[1.04] sm:text-6xl md:text-[5.25rem] max-w-4xl mx-auto text-[#0B1322]"
            style={{ fontWeight: 600 }}
          >
            You imagine it.
            <br />
            We get it <span className="text-gradient">moving</span>.
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-[#1C2942] leading-snug max-w-2xl mx-auto mt-6">
            We design the brand, build the site or storefront, and wire the
            system that runs it. One flat price, paid once.
          </p>

          <div className="flex items-center justify-center gap-2.5 mt-6 flex-wrap">
            {[
              { c: "#2B57C4", w: "Brand" },
              { c: "#155E9C", w: "Site" },
              { c: "#0F6B4F", w: "System" },
            ].map((d) => (
              <span
                key={d.w}
                className="inline-flex items-center gap-2 rounded-full border bg-white/85 px-3.5 py-1.5 text-[12px] font-medium tracking-wide"
                style={{ borderColor: `${d.c}40`, color: d.c }}
              >
                <span
                  className="block w-1.5 h-1.5 rounded-full"
                  style={{ background: d.c }}
                  aria-hidden
                />
                {d.w}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
            <MessageUs className="btn-primary shine" />
          </div>
          <TicketNote className="text-center" />

          <p className="mt-5 text-sm text-[#33405A]">
            Builds are flat and paid once, no hourly billing.{" "}
            <Link
              href="/pricing"
              className="text-[#1C2942] hover:text-[#0B1322] transition-colors underline decoration-[#C9D6EA] underline-offset-4"
            >
              See the prices
            </Link>
          </p>

        </div>
      </section>

      {/* ---------- 2 · The name as a verb, in space ---------- */}
      <section data-flow className="relative overflow-hidden px-6 py-16 md:py-20 bg-black">
        <img
          src="/assets/space-distance.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,11,31,0.55) 0%, rgba(6,11,31,0.35) 50%, rgba(6,11,31,0.7) 100%), radial-gradient(55% 60% at 50% 40%, rgba(91,155,249,0.18) 0%, rgba(6,11,31,0) 70%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto">
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
              <p className="text-ink-soft font-light leading-relaxed mt-4 max-w-reading">
                We named the studio after the gap because closing it is the entire
                service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 2b · The reel ---------- */}
      {/* A clean light band, so the dark reel pops instead of sinking into
          a dark backdrop. The frame is a window with the three logo dots as
          its traffic lights, so the film reads as ours before it plays. The
          price row under it is the pitch in one line. */}
      <section
        className="band-light relative overflow-hidden px-6 pb-16 md:pb-24 pt-12 md:pt-16"
        style={{
          background: "linear-gradient(180deg, #EAF1FB 0%, #F7FAFF 100%)",
        }}
      >
        <div
          className="absolute left-1/2 top-16 -translate-x-1/2 w-[70%] h-[60%] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(closest-side, rgba(76,123,232,0.16), rgba(76,123,232,0))",
          }}
          aria-hidden
        />
        <div className="relative max-w-6xl mx-auto text-center">
          <p className="text-[11px] font-semibold uppercase tracking-label text-[#2B57C4] mb-5">
            What a build looks like
          </p>
          <div className="relative max-w-5xl mx-auto">
            <div
              className="relative overflow-hidden rounded-[18px] border bg-[#060B1F]"
              style={{
                borderColor: "#D6DEEC",
                boxShadow:
                  "0 40px 90px -40px rgba(11,19,34,0.45), 0 16px 40px -24px rgba(43,87,196,0.35)",
              }}
            >
              {/* Window chrome: the three logo dots as the traffic lights. */}
              <div
                className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b"
                style={{
                  background: "#0A1129",
                  borderColor: "rgba(76,123,232,0.3)",
                }}
              >
                <span className="flex items-center gap-1.5" aria-hidden>
                  {["#2B57C4", "#4C7BE8", "#A8C4FF"].map((c) => (
                    <span
                      key={c}
                      className="block w-2.5 h-2.5 rounded-full"
                      style={{ background: c }}
                    />
                  ))}
                </span>
                <span className="font-display text-[15px] leading-none text-white">
                  flow<span style={{ color: "#5B8CFF" }}>zone</span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-label text-[#8FA3C8]">
                  Studio reel
                </span>
              </div>
              <FastVideo
                className="w-full h-auto block"
                rate={1.25}
                poster="/assets/studio-reel-poster.jpg"
                ariaLabel="FlowZone studio reel: you bring the idea, we build the brand, the site and the system"
                sources={[
                  { src: "/assets/studio-reel.mp4", type: "video/mp4" },
                  { src: "/assets/studio-reel.webm", type: "video/webm" },
                ]}
              />
            </div>
            <p className="mt-3 text-[12px] text-[#647089]">
              The studio reel, at speed. Brand, site and system.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {[
              { w: "Identity", p: "from $500", c: "#2B57C4", h: "/intake?build=identity" },
              { w: "Site", p: "from $500", c: "#155E9C", h: "/intake?build=site" },
              { w: "Storefront", p: "from $2,500", c: "#A03D14", h: "/intake?build=storefront" },
            ].map((x) => (
              <Link
                key={x.w}
                href={x.h}
                className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[13px] transition-colors hover:bg-[#F4F7FC]"
                style={{ borderColor: `${x.c}55` }}
              >
                <span className="font-medium" style={{ color: x.c }}>{x.w}</span>
                <span className="text-[#1C2942]">{x.p}</span>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-[13px] text-[#49566E]">
            Flat, paid once. Tell us the idea and you see your number before anything starts.
          </p>
        </div>
      </section>

      {/* ---------- 3 · Three parts ---------- */}
      {/* White, on purpose. The page was three dark bands in a row and
          nothing popped. Cards rather than columns, because the three parts
          are the whole offer and a hairline border was not carrying that.
          Each card is tinted with its own part colour so the three read as a
          set before a single word is read. */}
      <section data-flow className="band-light px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center flex-wrap gap-y-2 mb-6">
            {[
              { c: "#2B57C4", w: "Brand" },
              { c: "#155E9C", w: "Site" },
              { c: "#0F6B4F", w: "System" },
            ].map((d, i) => (
              <span key={d.w} className="flex items-center">
                {i > 0 && (
                  <span
                    className="block w-6 h-px mx-2.5"
                    style={{ background: "#C9D6EA" }}
                    aria-hidden
                  />
                )}
                <span
                  className="block w-2 h-2 rounded-full"
                  style={{ background: d.c }}
                  aria-hidden
                />
              </span>
            ))}
            <span className="text-[11px] font-medium uppercase tracking-label text-[#647089] ml-4">
              Three parts, one studio
            </span>
          </div>

          <p className="text-[#49566E] font-light leading-relaxed max-w-reading mb-10">
            Any one of these on its own fails quietly. That&apos;s why we
            don&apos;t sell them on their own.
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                n: "01",
                k: "Brand",
                icon: "palette",
                c: "#2B57C4",
                b: "What people recognize you by.",
                d: "The mark, the colors, the words. The part that makes you look like you meant it.",
              },
              {
                n: "02",
                k: "Site",
                icon: "compass",
                c: "#155E9C",
                b: "Where people go to decide.",
                d: "A page that answers the question and asks for the next step, instead of a profile and a DM.",
              },
              {
                n: "03",
                k: "System",
                icon: "bolt",
                c: "#0F6B4F",
                b: "What runs it behind the scenes.",
                d: "Booking, checkout, follow-up. The parts nobody sees and everybody feels.",
              },
            ].map((x) => (
              <div
                key={x.k}
                className="relative rounded-[18px] border bg-white p-7 md:p-8 flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                style={{
                  borderColor: `${x.c}2E`,
                  backgroundImage: `linear-gradient(180deg, ${x.c}0F 0%, rgba(255,255,255,0) 42%)`,
                  boxShadow: `0 24px 48px -30px ${x.c}66`,
                }}
              >
                <span
                  className="absolute top-0 left-0 h-[3px] w-full"
                  style={{ background: x.c }}
                  aria-hidden
                />
                <div className="flex items-center justify-between mb-6 mt-1">
                  <span
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full"
                    style={{ background: `${x.c}1A`, color: x.c }}
                  >
                    <Icon name={x.icon} className="w-6 h-6" />
                  </span>
                  <span
                    className="text-[11px] font-medium uppercase tracking-label"
                    style={{ color: x.c }}
                  >
                    {x.n} · {x.k}
                  </span>
                </div>
                <p className="font-display text-[1.6rem] md:text-3xl leading-[1.12] text-[#0B1322] mb-3">
                  {x.b}
                </p>
                <p className="text-sm text-[#49566E] font-light leading-relaxed">
                  {x.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The distance argument, as type. The picture that used to sit here
          was stock, and a design studio's site cannot carry an image that is
          not work. The line lands on its own. */}
      <section data-flow className="relative border-t border-rule px-6 py-28 md:py-44 overflow-hidden bg-black">
        <img
          src="/assets/space-distance.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* A soft blue nebula glow behind the words so the type feels lit
            from inside the sky rather than pasted on it. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(55% 60% at 38% 50%, rgba(91,155,249,0.18) 0%, rgba(6,11,31,0) 70%)",
          }}
        />
        {/* The game layer: a little ship runs the node route, the same
            three-dot mark the studio uses, played as a course. Pure SVG
            SMIL, no JS, pointer-events off. */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1200 520"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <path
            id="fz-course"
            d="M40,460 C180,340 240,200 400,220 C520,235 560,340 480,380 C370,425 375,280 500,268 C640,255 700,390 840,345 C945,310 935,180 1060,150 C1110,138 1150,110 1185,85"
            fill="none"
            stroke="rgba(159,196,232,0.22)"
            strokeWidth="1.4"
            strokeDasharray="3 7"
          />
          {[
            [40, 460, "#1E3A8A"],
            [400, 220, "#5B9BF9"],
            [840, 345, "#5B9BF9"],
            [1160, 100, "#C6E4F8"],
          ].map(([x, y, c], i) => (
            <circle key={i} cx={x as number} cy={y as number} r="5" fill={c as string} opacity="0.9">
              <animate
                attributeName="r"
                values="4;7;4"
                dur="2.4s"
                begin={`${i * 0.6}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.55;1;0.55"
                dur="2.4s"
                begin={`${i * 0.6}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
          <g>
            {/* Speed streaks behind the ship */}
            <line x1="-26" y1="-6" x2="-44" y2="-6" stroke="#5B9BF9" strokeWidth="2" strokeLinecap="round" opacity="0.5">
              <animate attributeName="opacity" values="0.5;0.1;0.5" dur="0.22s" repeatCount="indefinite" />
            </line>
            <line x1="-22" y1="0" x2="-52" y2="0" stroke="#C6E4F8" strokeWidth="2" strokeLinecap="round" opacity="0.7">
              <animate attributeName="opacity" values="0.7;0.2;0.7" dur="0.18s" repeatCount="indefinite" />
            </line>
            <line x1="-26" y1="6" x2="-44" y2="6" stroke="#5B9BF9" strokeWidth="2" strokeLinecap="round" opacity="0.5">
              <animate attributeName="opacity" values="0.5;0.1;0.5" dur="0.26s" repeatCount="indefinite" />
            </line>
            {/* The ship, bigger */}
            <path d="M2,0 L-20,9 L-14,0 L-20,-9 Z" fill="#E8F1FD" />
            <circle cx="-23" cy="0" r="3.6" fill="#5B9BF9" opacity="0.9">
              <animate attributeName="r" values="3.6;5.2;3.6" dur="0.3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.3;0.9" dur="0.3s" repeatCount="indefinite" />
            </circle>
            <animateMotion
              dur="6s"
              repeatCount="indefinite"
              rotate="auto"
              keyPoints="0;0.28;0.55;0.8;1"
              keyTimes="0;0.34;0.52;0.78;1"
              calcMode="linear"
            >
              <mpath href="#fz-course" />
            </animateMotion>
          </g>
          </svg>

        <div className="relative max-w-6xl mx-auto">
          <p className="text-[11px] font-medium uppercase tracking-label text-[#9FC4E8] mb-5">
            The distance
          </p>
          <h2
            className="font-display text-[2.5rem] sm:text-6xl md:text-7xl leading-[1.02] max-w-[16ch]"
            style={{
              backgroundImage:
                "linear-gradient(115deg, #FFFFFF 0%, #E8F1FD 38%, #9FC4E8 68%, #5B9BF9 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "#E8F1FD",
              filter: "drop-shadow(0 0 26px rgba(91,155,249,0.35))",
            }}
          >
            You are not starting from nothing. You are two or three moves
            from live.
          </h2>
          <p className="text-sm text-[#9AA7BE] font-light mt-6 max-w-reading">
            The gap between your idea and a live brand is smaller than it
            looks from where you stand.
          </p>
        </div>
      </section>

      {/* ---------- 3.5 · Start the conversation ---------- */}
      {/* The pitch, worked as a conversation: pick the sentence you have
          said out loud, get the build that fixes it, land in the ticket. */}
      <PitchPath />

      {/* ---------- 4 · The four builds ---------- */}
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
                  <span className="font-display text-2xl">{b.from}</span>
                  <AddToCart id={b.k} showPrice={false} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 5 · Point of view, on white for contrast ---------- */}
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
              {
                n: "05",
                c: "#155E9C",
                t: "We would rather lose the job than ship the wrong fix",
                b: "If what you're asking for won't work, we say so before you pay, not after.",
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
                Naming and name treatment, logo and wordmark, color and type systems,
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

      {/* ---------- 6 · CardsRG, the in-house proof ---------- */}
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
              A FlowZone brand, start to finish
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-[#0B1322] mt-3 max-w-3xl">
              An Instagram DM business,
              <br />
              turned into a real shop.
            </h2>
            <p className="text-[#647089] font-light leading-relaxed max-w-reading mt-4">
              CardsRG is ours. We built the brand, the storefront and the content
              engine, and we still run it. Which means this isn&apos;t a case study
              we were handed — it&apos;s the whole job done on ourselves, with our
              own money on the line. It went live in under two weeks and it sells.
            </p>
          </div>

          <Link href="/work" className="group block">
            <div className="grid md:grid-cols-12 gap-4">
              <div className="md:col-span-8 relative overflow-hidden rounded-2xl border border-[#DCE5F2] shadow-[0_30px_70px_-30px_rgba(11,19,34,0.45)]">
                <img
                  src="/assets/crg-hero.jpg"
                  alt="CardsRG storefront homepage, dark with the headline Rip. Pull. Collect."
                  className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-[1.015]"
                />
                <span className="absolute top-4 left-4 text-[11px] font-medium uppercase tracking-label text-white bg-[#0B1322]/80 rounded-full px-3 py-1.5">
                  In-house build
                </span>
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
                What the brand did in 90 days
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
              We built the audience and then built the thing it points at. Same
              studio, both halves. That&apos;s the argument for hiring us instead
              of a logo guy and a web guy.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/work"
                className="btn border border-[#C9D6EA] text-[#0B1322] hover:bg-[#F4F7FC]"
              >
                See the full build <span className="arrow">→</span>
              </Link>
              <MessageUs />
            </div>
            <TicketNote className="text-center" />
          </div>
        </div>
      </section>

      {/* ---------- 7 · The small job menu ---------- */}
      {/* Four items, not nine. The POV above says a logo alone fails, so the
          menu no longer sells one. These jobs assume the foundation exists. */}
      <section data-flow className="band-light px-6 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-[18px] p-8 md:p-10 grid md:grid-cols-12 gap-8 items-center border"
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
                Already have a system?{" "}
                <span style={{ color: "#0F6B4F" }}>Keep it fed.</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  ["flyer", "A graphic", "$49.99"],
                  ["socialpack", "A social post pack", "$49.99"],
                  ["page", "A new page", "$99.99"],
                  ["fix", "A fix pass", "$49.99"],
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
              <p className="text-sm text-ink-soft font-light mt-4">
                Need something not listed? Ask in the ticket.
              </p>
            </div>
            <div className="md:col-span-5 md:text-right">
              <p className="text-sm text-ink-soft font-light leading-relaxed mb-5 md:ml-auto max-w-xs">
                These are for brands that already have a foundation to work from
                — ours or someone else&apos;s. Cheap because the hard part is
                already decided: the colors, the type, the voice, the rules. If
                you don&apos;t have that yet, a $49.99 graphic won&apos;t fix
                it, and we&apos;ll tell you so. That&apos;s a build.
              </p>
              <Link href="/intake?build=small" className="btn-primary">
                Start a ticket <span className="arrow">→</span>
              </Link>
              <TicketNote className="md:ml-auto max-w-xs" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 8 · In their words (absent until real) ---------- */}
      <Testimonials />

      {/* ---------- 9 · Closing CTA ---------- */}
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
          <div className="flex flex-col items-center mb-6">
            <img
              src="/assets/denny-valdes.jpg"
              alt="Dennis V. of FlowZone"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border border-rule"
            />
            <p className="text-sm text-ink mt-3 font-medium">Dennis V.</p>
          </div>
          <p className="text-ink-soft max-w-md mx-auto mb-8 leading-relaxed font-light">
            A few sentences is enough. You get a real reply, from me.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <MessageUs className="btn-primary shine" />
          </div>
          <TicketNote className="text-center" />
        </div>
      </section>
    </>
  );
}
