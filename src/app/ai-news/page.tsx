import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "AI News & Resources | FlowZone AI",
    description: "The best AI automation news, tools, and industry updates â curated for business owners who want to stay ahead.",
};

const newsOutlets = [
  { name: "The Rundown AI", url: "https://www.therundown.ai", description: "Daily AI news digest covering the biggest developments in artificial intelligence.", tag: "Newsletter" },
  { name: "AI Breakfast", url: "https://www.aibreakfast.com", description: "Morning briefing on AI tools, product launches, and business use cases.", tag: "Newsletter" },
  { name: "TechCrunch â AI", url: "https://techcrunch.com/category/artificial-intelligence/", description: "Breaking news and analysis on AI startups, funding, and enterprise adoption.", tag: "News" },
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/", description: "Enterprise-focused AI coverage â tools, trends, and transformation stories.", tag: "News" },
  { name: "The Neuron", url: "https://www.theneurondaily.com", description: "Practical AI newsletter focused on tools and workflows for business professionals.", tag: "Newsletter" },
  { name: "Ben's Bites", url: "https://bensbites.co", description: "Curated roundup of everything happening in AI â tools, research, and opportunities.", tag: "Newsletter" },
  { name: "MIT Technology Review", url: "https://www.technologyreview.com/topic/artificial-intelligence/", description: "In-depth analysis on AI's impact on business and society.", tag: "Research" },
  { name: "Anthropic News", url: "https://www.anthropic.com/news", description: "Official updates from Anthropic on Claude and AI safety research.", tag: "Official" },
  { name: "OpenAI Blog", url: "https://openai.com/blog", description: "Product updates and research from OpenAI â GPT, Sora, and beyond.", tag: "Official" },
  { name: "Google DeepMind Blog", url: "https://deepmind.google/discover/blog/", description: "Research and product updates from Google's AI research division.", tag: "Official" },
  { name: "No Code MBA", url: "https://www.nocode.mba", description: "Tutorials and news on no-code and low-code automation tools for businesses.", tag: "Tools" },
  { name: "Lenny's Newsletter", url: "https://www.lennysnewsletter.com", description: "Product and growth insights â increasingly AI-focused for operators and founders.", tag: "Newsletter" },
  ];

const tools = [
  { name: "Make", url: "https://www.make.com", description: "Visual automation platform â connects any app without code." },
  { name: "n8n", url: "https://n8n.io", description: "Open-source workflow automation for technical teams." },
  { name: "Zapier", url: "https://zapier.com", description: "The original no-code automation tool." },
  { name: "Relevance AI", url: "https://relevanceai.com", description: "Build and deploy AI agents for business workflows." },
  { name: "Lindy AI", url: "https://www.lindy.ai", description: "AI employee platform for automating business tasks." },
  { name: "Clay", url: "https://www.clay.com", description: "AI-powered prospecting and outreach enrichment." },
  { name: "Instantly", url: "https://instantly.ai", description: "Cold email outreach and deliverability platform." },
  { name: "Beehiiv", url: "https://www.beehiiv.com", description: "Newsletter platform built for growth." },
  ];

const tagColors: Record<string, string> = {
    Newsletter: "bg-purple-50 text-purple-700",
    News: "bg-orange-50 text-orange-700",
    Research: "bg-green-50 text-green-700",
    Official: "bg-gray-100 text-gray-700",
    Tools: "bg-yellow-50 text-yellow-800",
};

export default function AiNews() {
    return (
          <>
            {/* Hero */}
                <section className="bg-white pt-20 pb-16 px-6 border-b border-gray-100">
                        <div className="max-w-4xl mx-auto text-center">
                                  <p className="text-sky-600 font-semibold text-sm uppercase tracking-wider mb-4">Stay Ahead</p>
                                  <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                                              AI News &amp; Resources
                                  </h1>
                                  <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                                              The best newsletters, news outlets, and tools to keep you current on AI and automation. We follow all of this so we can bring it directly into your business.
                                  </p>
                        </div>
                </section>
          
            {/* News Outlets */}
                <section className="py-20 px-6 bg-white">
                        <div className="max-w-6xl mx-auto">
                                  <div className="mb-12">
                                              <p className="text-sky-600 font-semibold text-sm uppercase tracking-wider mb-3">What We Read</p>
                                              <h2 className="text-3xl font-black text-gray-900 mb-2">Top News Sources &amp; Newsletters</h2>
                                              <p className="text-gray-500">These are the sources we follow to stay sharp â and bring that knowledge into every automation we build.</p>
                                  </div>
                                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {newsOutlets.map((outlet) => (
                          <a
                                            key={outlet.name}
                                            href={outlet.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block border border-gray-200 rounded-2xl p-6 hover:border-sky-300 hover:shadow-md transition-all"
                                          >
                                          <div className="flex items-start justify-between mb-3">
                                                            <h3 className="font-bold text-gray-900 group-hover:text-sky-600 transition-colors">{outlet.name}</h3>
                                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ml-2 ${tagColors[outlet.tag] ?? "bg-gray-100 text-gray-600"}`}>
                                                              {outlet.tag}
                                                            </span>
                                          </div>
                                          <p className="text-sm text-gray-500 leading-relaxed">{outlet.description}</p>
                                          <p className="text-xs text-sky-500 mt-3 font-medium">Visit &#8594;</p>
                          </a>
                        ))}
                                  </div>
                        </div>
                </section>
          
            {/* Tools */}
                <section className="py-20 px-6 bg-gray-50">
                        <div className="max-w-6xl mx-auto">
                                  <div className="mb-12">
                                              <p className="text-sky-600 font-semibold text-sm uppercase tracking-wider mb-3">The Stack</p>
                                              <h2 className="text-3xl font-black text-gray-900 mb-2">AI Automation Tools We Use</h2>
                                              <p className="text-gray-500">The platforms powering the automations we build for clients every day.</p>
                                  </div>
                                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {tools.map((tool) => (
                          <a
                                            key={tool.name}
                                            href={tool.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block bg-white border border-gray-200 rounded-xl p-5 hover:border-sky-300 hover:shadow-sm transition-all"
                                          >
                                          <h3 className="font-bold text-gray-900 group-hover:text-sky-600 transition-colors mb-2">{tool.name}</h3>
                                          <p className="text-sm text-gray-500">{tool.description}</p>
                          </a>
                        ))}
                                  </div>
                        </div>
                </section>
          
            {/* CTA */}
                <section className="py-20 px-6 bg-sky-600">
                        <div className="max-w-3xl mx-auto text-center">
                                  <h2 className="text-4xl font-black text-white mb-4">Want Us to Build These Into Your Business?</h2>
                                  <p className="text-sky-100 text-lg mb-8">
                                              We follow every tool and trend on this page â and put it to work for our clients. Tell us what you want to automate.
                                  </p>
                                  <Link href="/intake" className="inline-block bg-white text-sky-600 font-bold px-8 py-4 rounded-xl hover:bg-sky-50 transition-colors">
                                              Get Your Free AI Audit &#8594;
                                  </Link>
                        </div>
                </section>
          </>
        );
}</>
