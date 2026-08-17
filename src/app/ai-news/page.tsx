import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI News and Resources",
  description: "The newsletters, news outlets and tools FlowZone follows to stay current on AI.",
  alternates: { canonical: "/ai-news" },
  // A link list from the automation era. Nothing links to it and it pulls
  // traffic away from /pricing. Live for old links, out of the index.
  robots: { index: false, follow: false },
  // Set in full because metadata merging is shallow. A page that declares
  // openGraph replaces the layout block outright, so anything omitted is gone.
  openGraph: {
    title: "AI News and Resources | FlowZone",
    description: "The newsletters, news outlets and tools FlowZone follows to stay current on AI.",
    url: "/ai-news",
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

const newsOutlets = [
  { name: "The Rundown AI", url: "https://www.therundown.ai", description: "Daily AI news digest covering the biggest developments in artificial intelligence.", tag: "Newsletter" },
  { name: "AI Breakfast", url: "https://www.aibreakfast.com", description: "Morning briefing on AI tools, product launches, and business use cases.", tag: "Newsletter" },
  { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/", description: "Breaking news and analysis on AI startups, funding, and enterprise adoption.", tag: "News" },
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/", description: "Enterprise focused AI coverage. Tools, trends and transformation stories.", tag: "News" },
  { name: "The Neuron", url: "https://www.theneurondaily.com", description: "Practical AI newsletter focused on tools and workflows for business professionals.", tag: "Newsletter" },
  { name: "Ben's Bites", url: "https://bensbites.co", description: "Curated roundup of everything happening in AI. Tools, research and opportunities.", tag: "Newsletter" },
  { name: "MIT Technology Review", url: "https://www.technologyreview.com/topic/artificial-intelligence/", description: "In depth analysis on AI's impact on business and society.", tag: "Research" },
  { name: "Anthropic News", url: "https://www.anthropic.com/news", description: "Official updates from Anthropic on Claude and AI safety research.", tag: "Official" },
  { name: "OpenAI Blog", url: "https://openai.com/blog", description: "Product updates and research from OpenAI. GPT, Sora and beyond.", tag: "Official" },
  { name: "Google DeepMind Blog", url: "https://deepmind.google/discover/blog/", description: "Research and product updates from Google's AI research division.", tag: "Official" },
  { name: "No Code MBA", url: "https://www.nocode.mba", description: "Tutorials and news on no-code and low-code workflow tools for businesses.", tag: "Tools" },
  { name: "Lenny's Newsletter", url: "https://www.lennysnewsletter.com", description: "Product and growth insights, increasingly AI focused for operators and founders.", tag: "Newsletter" },
  ];

const tools = [
  { name: "Make", url: "https://www.make.com", description: "Visual systems platform. Connects any app without code." },
  { name: "n8n", url: "https://n8n.io", description: "Open-source workflow systems for technical teams." },
  { name: "Zapier", url: "https://zapier.com", description: "The original no-code workflow tool." },
  { name: "Relevance AI", url: "https://relevanceai.com", description: "Build and deploy AI agents for business workflows." },
  { name: "Lindy AI", url: "https://www.lindy.ai", description: "AI employee platform for automating business tasks." },
  { name: "Clay", url: "https://www.clay.com", description: "AI-powered prospecting and outreach enrichment." },
  { name: "Instantly", url: "https://instantly.ai", description: "Cold email outreach and deliverability platform." },
  { name: "Beehiiv", url: "https://www.beehiiv.com", description: "Newsletter platform built for growth." },
  ];

// Tag chips read on the dark canvas: a tinted wash behind light text.
// The 50/700 pairs these replaced were light theme leftovers and went
// invisible on #0C1424. The signal colours (speed, price, own, effort) are
// deliberately not used here, they carry a fixed meaning elsewhere.
const tagColors: Record<string, string> = {
  Newsletter: "bg-purple-400/15 text-purple-300",
  News: "bg-orange-400/15 text-orange-300",
  Research: "bg-emerald-400/15 text-emerald-300",
  Official: "bg-raised text-ink-soft",
  Tools: "bg-amber-400/15 text-amber-300",
};

export default function AiNews() {
    return (
          <>
            {/* Hero */}
                <section className="bg-paper pt-20 pb-16 px-6 border-b border-rule">
                        <div className="max-w-4xl mx-auto text-center">
                                  <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Stay Ahead</p>
                                  <h1 className="text-5xl md:text-6xl font-display font-normal text-ink mb-6 leading-tight">
                                              AI News &amp; Resources
                                  </h1>
                                  <p className="text-xl text-ink-mute max-w-2xl mx-auto leading-relaxed">
                                              The best newsletters, news outlets and tools to keep you current on AI and the systems it powers. We follow all of it so we can bring it straight into the work we build for you.
                                  </p>
                        </div>
                </section>
          
            {/* News Outlets */}
                <section className="py-20 px-6 bg-paper">
                        <div className="max-w-6xl mx-auto">
                                  <div className="mb-12">
                                              <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">What We Read</p>
                                              <h2 className="text-3xl font-display font-normal text-ink mb-2">Top News Sources &amp; Newsletters</h2>
                                              <p className="text-ink-mute">These are the sources we follow to stay sharp, and that knowledge goes into every brand, site and system we build.</p>
                                  </div>
                                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {newsOutlets.map((outlet) => (
                          <a
                                            key={outlet.name}
                                            href={outlet.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block border border-rule rounded-xl p-6 hover:border-rule hover:shadow-md transition-all"
                                          >
                                          <div className="flex items-start justify-between mb-3">
                                                            <h3 className="font-bold text-ink group-hover:text-accent transition-colors">{outlet.name}</h3>
                                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ml-2 ${tagColors[outlet.tag] ?? "bg-paper-deep text-ink-soft"}`}>
                                                              {outlet.tag}
                                                            </span>
                                          </div>
                                          <p className="text-sm text-ink-mute leading-relaxed">{outlet.description}</p>
                                          <p className="text-xs text-accent mt-3 font-medium">Visit &#8594;</p>
                          </a>
                        ))}
                                  </div>
                        </div>
                </section>
          
            {/* Tools */}
                <section className="py-20 px-6 bg-paper-deep">
                        <div className="max-w-6xl mx-auto">
                                  <div className="mb-12">
                                              <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">The Stack</p>
                                              <h2 className="text-3xl font-display font-normal text-ink mb-2">AI Tools We Use</h2>
                                              <p className="text-ink-mute">The platforms behind the brands, sites and systems we build for clients every day.</p>
                                  </div>
                                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {tools.map((tool) => (
                          <a
                                            key={tool.name}
                                            href={tool.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block bg-paper border border-rule rounded-xl p-5 hover:border-rule hover:shadow-sm transition-all"
                                          >
                                          <h3 className="font-bold text-ink group-hover:text-accent transition-colors mb-2">{tool.name}</h3>
                                          <p className="text-sm text-ink-mute">{tool.description}</p>
                          </a>
                        ))}
                                  </div>
                        </div>
                </section>
          
            {/* CTA */}
                <section className="py-20 px-6 bg-accent">
                        <div className="max-w-3xl mx-auto text-center">
                                  <h2 className="text-4xl font-display font-normal text-white mb-4">Want Us to Build These Into Your Business?</h2>
                                  <p className="text-paper/60 text-lg mb-8">
                                              We follow every tool and trend on this page and put it to work for our clients. You bring the idea. We build the whole thing.
                                  </p>
                                  <Link href="/intake" className="inline-block bg-paper text-accent font-bold px-8 py-4 rounded-xl hover:bg-paper-deep transition-colors">
                                              Get Your Free AI Audit &#8594;
                                  </Link>
                        </div>
                </section>
          </>
        );
}
