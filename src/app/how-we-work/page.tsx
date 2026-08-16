import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "How We Work",
  description:
    "What actually happens between your idea and a finished brand, site or storefront. Seven days, four steps, one person on it the whole way.",
};

const days = [
  {
    tag: "Day 0",
    title: "You tell us the idea",
    body:
      "One form, a few sentences. No discovery call, no 40 question brief, no proposal deck. If we need something clarified we email you the same day, and if we think you need a smaller package than the one you picked we say so before you pay.",
    you: "15 minutes",
  },
  {
    tag: "Days 1 to 2",
    title: "We come back with a direction",
    body:
      "Not a mood board. An actual first pass you can look at, in a browser, with your words and your colors in it. This is the fastest part because AI does the heavy lifting on structure and first drafts. It is also where a human matters most, because taste is the part a model still gets wrong.",
    you: "One reply. Thumbs up or tell us what is off",
  },
  {
    tag: "Days 3 to 5",
    title: "We build the real thing",
    body:
      "Real pages, real copy, real payments, real forms that land in your inbox. Everything is built on Next.js and deployed to Vercel, which means it loads fast and does not fall over. If your package includes a system, this is when it gets wired in and tested with live data.",
    you: "Nothing. Go run your business",
  },
  {
    tag: "Days 6 to 7",
    title: "It goes live and it is yours",
    body:
      "Connected to your domain, tested on a phone, handed over with documentation that explains what everything does and how to change it. You own the code and the accounts. There is no platform to stay subscribed to and nothing gets held hostage.",
    you: "Approve, then start using it",
  },
];

const principles = [
  {
    title: "AI for speed, a person for taste",
    body:
      "AI is why a build takes a week instead of two months. A person is why it does not look like everyone else's AI site. Every layout, headline and color decision gets looked at by a human before it ships.",
  },
  {
    title: "Flat price, agreed up front",
    body:
      "You know the number before we start. No hourly billing, no scope creep invoice at the end, no retainer you forget to cancel. If the scope genuinely changes we talk about it before doing the work.",
  },
  {
    title: "You own everything",
    body:
      "The code, the domain, the accounts, the content. We hand over the keys at the end. Plenty of studios keep clients locked in on purpose and it is a bad way to run a business.",
  },
  {
    title: "You talk to the person building it",
    body:
      "No account manager relaying messages to a contractor. The person who replies to your email is the person writing the code.",
  },
];

const faqs = [
  {
    q: "How many clients have you worked with?",
    a: "We are early. The studio has shipped real work, including cardsrg.com, a full collector trading card storefront, and we take on a small number of projects at a time on purpose. You get a lot more attention than you would from a shop juggling thirty accounts, and the pricing reflects where we are rather than where we want to be.",
  },
  {
    q: "Why is the work page so short?",
    a: "Because it is honest. Everything on it is live and was built here. We could pad it with concepts and stock mockups and most people would never check, but you would find out eventually and that is a bad way to start.",
  },
  {
    q: "What if I do not like the first direction?",
    a: "Tell us and we redo it. Revisions are included in every package, and the whole reason you see something real on day 2 rather than day 6 is so a wrong direction costs you a day instead of a week.",
  },
  {
    q: "What if my idea does not fit one of the three packages?",
    a: "Then it is a Scale project and we quote it flat after we understand it. Send it over either way. If it is smaller than you think, we will tell you and point you at the cheaper package.",
  },
  {
    q: "Do you actually deliver in 7 days?",
    a: "Most builds, yes. Larger storefronts and multi system projects take longer and we tell you the real date before you pay, not after. A missed date you were warned about is a schedule. A missed date you were not is a lie.",
  },
];

export default function HowWeWork() {
  return (
    <>
      {/* Header */}
      <section className="px-6 pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-12">
            <p className="label">How We Work</p>
            <p className="label hidden sm:block">Seven days · Four steps</p>
          </div>
          <h1 className="display text-5xl md:text-8xl max-w-4xl">
            From an idea
            <br />
            to a live thing.
          </h1>
          <p className="lede max-w-reading mt-10">
            No agency theatre. Here is exactly what happens, what we need from you and
            when, so you can decide before you spend anything.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section data-flow className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          {days.map((d) => (
            <div key={d.tag} className="border-t border-rule py-12 grid md:grid-cols-12 gap-8">
              <div className="md:col-span-3">
                <p className="label mb-3">{d.tag}</p>
                <p className="font-display text-3xl leading-none">{d.title}</p>
              </div>
              <div className="md:col-span-6">
                <p className="text-ink-soft leading-relaxed">{d.body}</p>
              </div>
              <div className="md:col-span-3 md:text-right">
                <p className="label mb-2">Your time</p>
                <p className="text-sm text-ink-soft">{d.you}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section data-flow className="bg-paper-deep px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="border-b border-rule pb-4 mb-14">
            <p className="label">How We Operate</p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-14 gap-y-12">
            {principles.map((p) => (
              <div key={p.title}>
                <h2 className="font-display text-3xl leading-tight mb-3">{p.title}</h2>
                <p className="text-ink-soft leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section data-flow className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="border-b border-rule pb-4 mb-14 flex items-baseline justify-between">
            <p className="label">Straight Answers</p>
            <p className="label hidden sm:block">Including the awkward ones</p>
          </div>
          {faqs.map((f) => (
            <div key={f.q} className="border-t border-rule py-10 grid md:grid-cols-12 gap-8">
              <h3 className="md:col-span-5 font-display text-2xl md:text-3xl leading-tight">
                {f.q}
              </h3>
              <p className="md:col-span-7 text-ink-soft leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section data-flow className="bg-paper-deep glow border-t border-rule px-6 py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] mb-8">
            Still reading?
            <br />
            Send us the idea.
          </h2>
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
