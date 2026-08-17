import Link from "next/link";
import Icon from "@/components/Icon";
import type { Metadata } from "next";
import MessageUs from "@/components/MessageUs";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Talk to us",
  description:
    "Text, email or work your idea out first. However you get in touch, a person reads it and answers, usually the same day.",
  alternates: { canonical: "/book" },
  // Set in full because metadata merging is shallow. A page that declares
  // openGraph replaces the layout block outright, so anything omitted is gone.
  openGraph: {
    title: "Talk to us | FlowZone",
    description:
      "Three ways in and all of them reach a person. Text, email or work your idea out first. Usually answered the same day.",
    url: `${SITE.url}/book`,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

export default function Talk() {
  const hasPhone = Boolean(SITE.phone);

  return (
    <>
      <section className="relative overflow-hidden px-6 pt-20 pb-14">
        <div className="absolute inset-0 aurora drift pointer-events-none" />
        <div className="absolute inset-0 gridlight pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-12">
            <p className="label">Talk to us</p>
            <p className="label hidden sm:block">One person · usually same day</p>
          </div>
          <h1 className="display text-5xl md:text-8xl max-w-4xl">
            Three ways in.
            <br />
            All of them reach a person.
          </h1>
          <p className="lede max-w-reading mt-10">
            There is no support queue, no ticket number and no account manager. Every
            one of these lands with the person who would build the thing.
          </p>
        </div>
      </section>

      <section data-flow className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4">
          <div className="panel p-8 flex flex-col relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full bg-[#34D399]" />
            <span className="block mb-5 mt-1"><Icon name="chat" size={22} color="#2DD4BF" /></span>
            <h2 className="font-display text-2xl mb-2">Message us</h2>
            <p className="text-sm text-[#34D399] mb-5">Fastest. Lands on a phone.</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-7">
              {hasPhone
                ? "Opens your messages app with a text started. Good for a quick question, a rough idea, or a photo of the thing you are trying to describe."
                : "Coming shortly. Until the number is live, email is the fastest route and it is read by the same person."}
            </p>
            <div className="mt-auto">
              <MessageUs className="btn-primary w-full" />
              {hasPhone && (
                <p className="text-[12px] text-ink-mute mt-3.5">
                  Or save it:{" "}
                  <a href={`tel:${SITE.phone}`} className="text-ink-soft hover:text-accent transition-colors">
                    {SITE.phoneDisplay}
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="panel p-8 flex flex-col relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full bg-[#5B9BF9]" />
            <span className="block mb-5 mt-1"><Icon name="pencil" size={22} color="#5B9BF9" /></span>
            <h2 className="font-display text-2xl mb-2">Email us</h2>
            <p className="text-sm text-[#5B9BF9] mb-5">Best for detail.</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-7">
              Opens with the questions already asked, so you are not staring at a blank
              message wondering what we need to know.
            </p>
            <div className="mt-auto">
              <a href={SITE.mailto} className="btn-ghost w-full">
                Start an email <span className="arrow">→</span>
              </a>
            </div>
          </div>

          <div className="panel p-8 flex flex-col relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full bg-[#F0845F]" />
            <span className="block mb-5 mt-1"><Icon name="compass" size={22} color="#F0845F" /></span>
            <h2 className="font-display text-2xl mb-2">Work it out first</h2>
            <p className="text-sm text-[#F0845F] mb-5">Best if it is still fuzzy.</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-7">
              Six questions that turn a vague intention into a real brief, with a sketch
              of it building beside you as you answer. Send it when it is ready.
            </p>
            <div className="mt-auto">
              <Link href="/start" className="btn-ghost w-full">
                Open a work session <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section data-flow className="border-t border-rule px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <ContactForm accent="#5B9BF9" />
        </div>
      </section>

      <section data-flow className="border-t border-rule px-6 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="label mb-6">What happens next</p>
            <h2 className="display text-4xl md:text-5xl">
              You get an answer, not an auto reply.
            </h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-ink-soft font-light leading-relaxed max-w-reading">
              Whichever way you get in touch, the reply comes back with the same three
              things: which of the three parts you actually need, what it costs, and a
              date. If a cheaper build fits, we say so. If it is not something we
              should take on, we say that too and point you somewhere better.
            </p>
            <p className="text-ink-soft font-light leading-relaxed max-w-reading mt-4">
              No calls required at any point. If you want one anyway, ask and we will
              set it up.
            </p>
            <div className="flex flex-wrap gap-3 mt-10">
              <MessageUs />
              <Link href="/pricing" className="btn-ghost">
                See pricing first
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
