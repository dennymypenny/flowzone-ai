import type { Metadata } from "next";
import NodeWeb from "@/app/components/NodeWeb";
import ScanTool from "@/app/components/ScanTool";
import { SITE } from "@/lib/site";

/**
 * /scan, second life.
 *
 * This route used to sell the automation era's $97 AI Scan and sat noindexed
 * so it could die quietly. Now it is the studio's working lead magnet: paste
 * a link, the server actually fetches and grades the page, and the full
 * teardown costs an email address. Because it is a real tool again it goes
 * back into the index, the sitemap and the nav.
 */

export const metadata: Metadata = {
  title: "Free Site Scan",
  description:
    "Paste your link. We fetch your site the way a phone does and grade it on mobile, speed, structure and search, with every finding named. Free, about ten seconds.",
  alternates: { canonical: "/scan" },
  // Set in full because metadata merging is shallow. A page that declares
  // openGraph replaces the layout block outright, so anything omitted is gone.
  openGraph: {
    title: "Free Site Scan | FlowZone",
    description:
      "Paste your link. We fetch your site the way a phone does and grade it on mobile, speed, structure and search, with every finding named. Free, about ten seconds.",
    url: `${SITE.url}/scan`,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

const graded = [
  {
    name: "Design and mobile",
    desc: "Whether phones get a phone-sized page, whether anything on the page actually asks for the sale and whether the type reads as designed or defaulted.",
  },
  {
    name: "Speed and technical",
    desc: "HTTPS, how long the server keeps people staring at a white screen, how much page they download before the first image and how the images behave while they load.",
  },
  {
    name: "Content and search",
    desc: "The title and description Google shows, whether the page has one headline or none, alt text, the social preview a shared link gets and how decisive the navigation is.",
  },
];

export default function ScanPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <NodeWeb className="opacity-90" />
        <div className="absolute inset-0 gridlight pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-rule pb-4 mb-12">
            <p className="label">Free Site Scan</p>
            <p className="label hidden sm:block">Real checks · about ten seconds</p>
          </div>
          <h1 className="display text-5xl md:text-7xl max-w-4xl mb-6">
            Paste your link.
            <br />
            See what it is costing you.
          </h1>
          <p className="lede max-w-2xl mb-12">
            We fetch your site the way a phone does and grade what we can measure: mobile,
            speed, structure and search. Every finding is a fact off your own page, not a
            sales script. It will be blunt with you, because polite audits change nothing.
          </p>
          <ScanTool />
        </div>
      </section>

      <section className="band-light px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <p className="label mb-10">What gets graded</p>
          <div className="grid md:grid-cols-3 gap-6">
            {graded.map((g) => (
              <div key={g.name} className="panel p-7">
                <h2 className="text-lg font-display text-ink mb-3">{g.name}</h2>
                <p className="text-sm text-ink-soft leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-ink-mute mt-10 max-w-2xl">
            The scan reads your live page once, as a visitor. It does not log in, does not
            crawl your whole site and does not store the page. What it can measure, it
            grades hard. What needs human eyes, like whether the brand has taste, is what
            we do on the other side of the report.
          </p>
        </div>
      </section>
    </>
  );
}
