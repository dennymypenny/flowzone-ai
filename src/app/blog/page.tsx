import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog | FlowZone AI",
  description: "Systems insights, case studies, and how-to guides from the FlowZone AI team.",
};

const posts = [
  {
    slug: "how-to-automate-lead-intake",
    title: "How to Automate Your Lead Intake in 48 Hours",
    excerpt:
      "Most businesses lose 30% of potential clients to slow follow-up. Here's how to build a system that responds instantly — without hiring anyone.",
    date: "March 15, 2026",
    readTime: "6 min read",
    tag: "Tutorial",
  },
  {
    slug: "5-workflows-every-service-business-should-automate",
    title: "5 Workflows Every Service Business Should Automate First",
    excerpt:
      "Before you automate everything, focus on the highest-ROI tasks. These 5 workflows save most service businesses 10+ hours a week.",
    date: "March 10, 2026",
    readTime: "8 min read",
    tag: "Strategy",
  },
  {
    slug: "make-vs-zapier-for-business-automation",
    title: "Make vs Zapier: Which Is Better for Business Systems in 2026?",
    excerpt:
      "Both platforms are popular, but they serve very different use cases. Here's how we choose between them for our clients.",
    date: "March 5, 2026",
    readTime: "7 min read",
    tag: "Tools",
  },
  {
    slug: "ai-automation-roi-calculator",
    title: "How to Calculate the ROI of Systems Before You Build",
    excerpt:
      "Don't guess — use this simple formula to prove the value of systems to yourself (or your boss) before committing a dollar.",
    date: "February 28, 2026",
    readTime: "5 min read",
    tag: "Finance",
  },
  {
    slug: "airtable-automation-guide",
    title: "The Complete Guide to Airtable Automations for Small Teams",
    excerpt:
      "Airtable is more powerful than most people realize. Here's how to use its native Automations — plus when to bring in external tools.",
    date: "February 20, 2026",
    readTime: "10 min read",
    tag: "Tutorial",
  },
];

const TAG_COLORS: Record<string, string> = {
  Tutorial: "bg-paper-deep text-accent",
  Strategy: "bg-green-100 text-green-700",
  Tools: "bg-paper-deep text-accent",
  Finance: "bg-yellow-100 text-yellow-700",
};

export default function Blog() {
  return (
    <>
      <section className="bg-paper pt-20 pb-16 px-6 border-b border-rule">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Blog</p>
          <h1 className="text-5xl md:text-6xl font-display font-normal text-ink mb-6">Systems Insights</h1>
          <p className="text-xl text-ink-mute leading-relaxed">
            Guides, case studies, and tutorials from the FlowZone AI team.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-paper">
        <div className="max-w-3xl mx-auto space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border border-rule rounded-xl p-8 hover:border-rule hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${TAG_COLORS[post.tag] || "bg-paper-deep text-ink-soft"}`}>
                  {post.tag}
                </span>
                <span className="text-ink-mute text-sm">{post.date}</span>
                <span className="text-gray-300 text-sm">&middot;</span>
                <span className="text-ink-mute text-sm">{post.readTime}</span>
              </div>
              <h2 className="text-2xl font-display font-normal text-ink mb-3 leading-tight">
                <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-ink-mute leading-relaxed mb-4">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-accent font-semibold text-sm hover:text-sky-800 transition-colors"
              >
                Read more &rarr;
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-paper-deep border-t border-rule">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-display font-normal text-ink mb-4">Ready to build the whole thing?</h2>
          <p className="text-ink-mute mb-6">Tell us the idea. We will come back with a plan in 24 hours.</p>
          <Link
            href={SITE.mailto}
            className="inline-block bg-accent text-white font-bold px-8 py-4 rounded-xl hover:bg-accent-deep transition-colors"
          >
            Get Your Free Build Plan &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
