import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { QUESTION_GROUPS } from "@/lib/questions";
import NodeWeb from "@/app/components/NodeWeb";
import MessageUs, { TicketNote } from "@/components/MessageUs";

const DESC =
  "Straight answers to the questions people actually ask: how to make a business look professional, where to start with an idea, who can do a logo and a website and what it costs.";

export const metadata: Metadata = {
  title: "Brand, Logo and Website Questions, Answered",
  description: DESC,
  alternates: { canonical: "/questions" },
  openGraph: {
    title: "Brand, Logo and Website Questions, Answered | FlowZone Studio",
    description: DESC,
    url: `${SITE.url}/questions`,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

export default function Questions() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE.url}/questions#faq`,
    mainEntity: QUESTION_GROUPS.flatMap((g) =>
      g.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        url: `${SITE.url}/questions#${i.id}`,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    ),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <NodeWeb className="opacity-90" />
        <div className="absolute inset-0 gridlight pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-12">
            <p className="label">Questions</p>
            <p className="label hidden sm:block">Asked the way people ask them</p>
          </div>
          <h1 className="display text-5xl md:text-7xl max-w-4xl">
            Not sure what to ask for? Start here.
          </h1>
          <p className="lede max-w-reading mt-10">
            Most people do not arrive saying &ldquo;brand identity.&rdquo; They arrive with an
            idea and a feeling that it should look more real. These are the questions we hear
            most, answered straight, whether or not you ever hire us.
          </p>
          <nav aria-label="Topics" className="flex flex-wrap gap-x-6 gap-y-2 mt-10">
            {QUESTION_GROUPS.map((g) => (
              <a key={g.name} href={`#${g.items[0].id}`} className="text-sm underline underline-offset-4">
                {g.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {QUESTION_GROUPS.map((g, gi) => (
        <section
          key={g.name}
          data-flow
          className={`${gi % 2 === 0 ? "band-light" : "bg-paper-deep"} px-6 py-20`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="border-b border-rule pb-4 mb-6">
              <h2 className="label">{g.name}</h2>
            </div>
            {g.items.map((i) => (
              <div
                key={i.id}
                id={i.id}
                className="scroll-mt-24 border-t border-rule py-10 grid md:grid-cols-12 gap-8"
              >
                <h3 className="md:col-span-5 font-display text-2xl md:text-3xl leading-tight">{i.q}</h3>
                <div className="md:col-span-7">
                  <p className="text-ink-soft leading-relaxed">{i.a}</p>
                  {i.link && (
                    <Link href={i.link.href} className="inline-block mt-4 text-sm underline underline-offset-4">
                      {i.link.label} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section data-flow className="band-light band-flow px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-8">
            Your question not here?
            <br />
            Send the idea instead.
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <MessageUs />
          </div>
          <TicketNote className="text-center" />
        </div>
      </section>
    </>
  );
}
