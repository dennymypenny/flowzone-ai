import Link from "next/link";
import type { Metadata } from "next";
import StartModes from "@/app/components/StartModes";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work session",
  description:
    "Flow through the zone with your thoughts. Six moves, and you walk away holding a real brief for your idea, yours to keep whether you hire us or not.",
};

export default function Start() {
  return (
    <>
      <section className="px-6 pt-20 pb-14">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-12">
            <p className="label">Work session</p>
            <p className="label hidden sm:block">Free · No signup · Saves as you go</p>
          </div>
          <h1 className="display text-5xl md:text-8xl max-w-4xl">
            Flow through the zone
            <br />
            with your thoughts.
          </h1>
          <p className="lede max-w-reading mt-10">
            Most people know they want something and cannot describe it yet. That is
            normal, and it is the actual reason projects stall. So play with it here.
            Roll colours, make a real logo, pull references off the open web, and
            leave holding files you own.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <StartModes />
        </div>
      </section>

      <section data-flow className="border-t border-rule px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-6">Why bother</p>
          <div className="grid md:grid-cols-12 gap-10 mb-14">
            <h2 className="md:col-span-6 display text-4xl md:text-5xl">
              You keep the brief either way.
            </h2>
            <p className="md:col-span-6 text-ink-soft font-light leading-relaxed self-end max-w-reading">
              A brief is the thing every designer, developer and agency asks you for,
              and the reason quotes come back vague is that almost nobody has one.
              Walk out with this and you can brief anybody. We are one option on that
              list, not the point of it.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                i: "🧩",
                c: "#5B9BF9",
                t: "It asks the taste question",
                b: "How it should feel is the part most briefs skip entirely, and it is the part that decides whether you like the result.",
              },
              {
                i: "💾",
                c: "#2DD4BF",
                t: "It saves as you go",
                b: "Close the tab, sleep on it, come back. Your session is still here and nothing was sent anywhere.",
              },
              {
                i: "📥",
                c: "#34D399",
                t: "It comes with you",
                b: "Download it as an image or a text file at the end. It is your document about your idea.",
              },
            ].map((x) => (
              <div key={x.t} className="panel p-7">
                <span className="block text-2xl mb-4 leading-none">{x.i}</span>
                <p
                  className="text-[11px] font-medium uppercase tracking-label mb-3"
                  style={{ color: x.c }}
                >
                  {x.t}
                </p>
                <p className="text-sm text-ink-soft font-light leading-relaxed">{x.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-flow className="bg-paper-deep glow border-t border-rule px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mb-6">
            Already know what you want?
          </h2>
          <p className="text-ink-soft font-light mb-9 max-w-md mx-auto leading-relaxed">
            Skip the session. Send it straight over and you will get back which parts
            you need, a price and a date.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={SITE.mailto} className="btn-primary">
              Start an email <span className="arrow">→</span>
            </a>
            <Link href="/services" className="btn-ghost">
              See what we build
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
