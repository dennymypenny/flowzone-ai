import Link from "next/link";
import type { Metadata } from "next";

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
      "One form, a few sentences. No discovery call, no 40-question brief, no proposal deck. If we need something clarified we email you the same day, and if we think you need a smaller package than the one you picked we say so before you pay.",
    you: "15 minutes",
  },
  {
    tag: "Days 1–2",
    title: "We come back with a direction",
    body:
      "Not a mood board. An actual first pass you can look at, in a browser, with your words and your colors in it. This is the fastest part because AI does the heavy lifting on structure and first drafts. It is also where a human matters most, because taste is the part a model still gets wrong.",
    you: "One reply, thumbs up or tell us what is off",
  },
  {
    tag: "Days 3–5",
    title: "We build the real thing",
    body:
      "Real pages, real copy, real payments, real forms that land in your inbox. Everything is built on Next.js and deployed to Vercel, which means it loads fast and does not fall over. If your package includes a system, this is when it gets wired in and tested with live data.",
    you: "Nothing. Go run your business.",
  },
  {
    tag: "Days 6–7",
    title: "It goes live and it is yours",
    body:
      "Connected to your domain, tested on a phone, handed over with documentation that explains what everything does and how to change it. You own the code and the accounts. There is no platform to stay subscribed to and nothing gets held hostage.",
    you: "Approve, then start using it",
  },
];

const principles = [
  {
    icon: "🎛️",
    title: "AI for speed, a person for taste",
    body:
      "AI is why a build takes a week instead of two months. A person is why it does not look like everyone else's AI site. Every layout, headline and color decision gets looked at by a human before it ships.",
  },
  {
    icon: "📦",
    title: "Flat price, agreed up front",
    body:
      "You know the number before we start. No hourly billing, no scope creep invoice at the end, no retainer you forget to cancel. If the scope genuinely changes we talk about it before doing the work.",
  },
  {
    icon: "🔑",
    title: "You own everything",
    body:
      "The code, the domain, the accounts, the content. We hand over the keys at the end. Plenty of studios keep clients locked in on purpose, and it is a bad way to run a business.",
  },
  {
    icon: "💬",
    title: "You talk to the person building it",
    body:
      "No account manager relaying messages to a contractor. The person who replies to your email is the person writing the code.",
  },
];

const faqs = [
  {
    q: "How many clients have you worked with?",
    a: "We are early. The studio has shipped real work, including cardsrg.com, a full collector trading card storefront, and we are taking on a small number of projects at a time on purpose. You get a lot more attention than you would from a shop juggling thirty accounts, and the pricing reflects where we are rather than where we want to be.",
  },
  {
    q: "Why is there no portfolio page?",
    a: "Because we would rather show you the process than pad a page with work that is not ours. Ask us for a walkthrough of what we have built and we will show you the real thing, live, including the parts that were hard.",
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
    a: "Most builds, yes. Larger storefronts and multi-system projects take longer and we tell you the real date before you pay, not after. A missed date you were warned about is a schedule. A missed date you were not is a lie.",
  },
];

export default function HowWeWork() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-20 pb-16 px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">How We Work</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            You Bring the Idea. We Build the Whole Thing.
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Here is exactly what happens between the form you fill out and the thing you launch. No mystery, no
            discovery phase, no six-week runway before anything exists.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {days.map((d, i) => (
              <div
                key={d.tag}
                className="relative border border-gray-200 rounded-2xl p-8 hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="shrink-0 md:w-32">
                    <span className="inline-block bg-blue-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                      {d.tag}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-gray-900 text-xl mb-3">
                      <span className="text-blue-200 mr-2">{String(i + 1).padStart(2, "0")}</span>
                      {d.title}
                    </p>
                    <p className="text-gray-500 leading-relaxed mb-4">{d.body}</p>
                    <p className="text-sm">
                      <span className="font-bold text-gray-900">What you do: </span>
                      <span className="text-gray-500">{d.you}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">How We Run It</h2>
            <p className="text-gray-500 text-lg">Four things we do not compromise on.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl p-7 border border-gray-100">
                <div className="text-3xl mb-3">{p.icon}</div>
                <p className="font-black text-gray-900 text-lg mb-2">{p.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Straight answers */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Straight Answers</h2>
            <p className="text-gray-500 text-lg">Including the ones most studios dodge.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="border border-gray-200 rounded-2xl p-7">
                <p className="font-black text-gray-900 mb-3">{f.q}</p>
                <p className="text-gray-500 leading-relaxed text-sm">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Start the Clock?</h2>
          <p className="text-blue-200 text-lg mb-8">
            Day 0 takes fifteen minutes. Tell us the idea and we will come back with a direction, a scope and a real
            delivery date.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/intake"
              className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg"
            >
              Start Your Project →
            </Link>
            <Link
              href="/pricing"
              className="inline-block border-2 border-blue-400 text-white font-bold px-8 py-4 rounded-xl hover:border-white transition-colors text-lg"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
