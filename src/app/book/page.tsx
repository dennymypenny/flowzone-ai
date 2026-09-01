import Link from "next/link";
import Icon from "@/components/Icon";
import type { Metadata } from "next";
import MessageUs, { TicketNote } from "@/components/MessageUs";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/site";
import NodeWeb from "@/app/components/NodeWeb";

export const metadata: Metadata = {
  title: "Start here",
  description:
    "Text, email or work your idea out first. However you get in touch, a person reads it and answers, usually the same day.",
  alternates: { canonical: "/book" },
  // Set in full because metadata merging is shallow. A page that declares
  // openGraph replaces the layout block outright, so anything omitted is gone.
  openGraph: {
    title: "Start here | FlowZone",
    description:
      "Three ways in and all of them reach a person. Text, email or work your idea out first. Usually answered the same day.",
    url: `${SITE.url}/book`,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

export default function Talk() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pt-20 pb-14">
        <NodeWeb className="opacity-90" />
        <div className="absolute inset-0 gridlight pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-12">
            <p className="label">Start here</p>
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

      {/* The three ways in, on white. Every signal colour in here is paired
          down to a dark twin for the band: emerald #34D399 (1.92:1 on white)
          becomes #0F6B4F at 6.49:1, teal #2DD4BF (1.86:1) becomes #0C6E80 at
          5.90:1, sky #5B9BF9 (2.80:1) becomes #155E9C at 6.75:1, and ember
          #F0845F (2.57:1) becomes #B03A12 at 6.07:1. */}
      <section data-flow className="band-light px-6 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4">
          <div className="panel p-8 flex flex-col relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full bg-[#0F6B4F]" />
            <span className="block mb-5 mt-1"><Icon name="chat" size={22} color="#0C6E80" /></span>
            <h2 className="font-display text-2xl mb-2">Send the rough version</h2>
            <p className="text-sm text-[#0F6B4F] mb-5">Fastest. No form.</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-7">
              A quick question, a half-formed idea, a photo of the thing you are
              trying to describe. It opens already started, so you only have to
              finish the sentence.
            </p>
            <div className="mt-auto">
              <a href={SITE.mailto} className="btn-primary w-full">
                Start it <span className="arrow">→</span>
              </a>
            </div>
          </div>

          <div className="panel p-8 flex flex-col relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full bg-[#155E9C]" />
            <span className="block mb-5 mt-1"><Icon name="pencil" size={22} color="#155E9C" /></span>
            <h2 className="font-display text-2xl mb-2">Email us</h2>
            <p className="text-sm text-[#155E9C] mb-5">Best for detail.</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-7">
              Opens with the questions already asked, so you are not staring at a blank
              message wondering what we need to know.
            </p>
            <div className="mt-auto">
              <a href={SITE.mailto} className="btn-ghost w-full">
                {SITE.email}
              </a>
            </div>
          </div>

          <div className="panel p-8 flex flex-col relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full bg-[#B03A12]" />
            <span className="block mb-5 mt-1"><Icon name="compass" size={22} color="#B03A12" /></span>
            <h2 className="font-display text-2xl mb-2">Work it out first</h2>
            <p className="text-sm text-[#B03A12] mb-5">Best if it is still fuzzy.</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-7">
              Six questions that turn a vague intention into a real brief, with a sketch
              of it building beside you as you answer. Send it when it is ready.
            </p>
            <div className="mt-auto">
              <Link href="/intake" className="btn-ghost w-full">
                Start a Ticket <span className="arrow">→</span>
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

      <section data-flow className="band-light px-6 py-24">
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
            <TicketNote />
          </div>
        </div>
      </section>
    </>
  );
}
