import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Automation insights, case studies, and how-to guides from the FlowZone AI team.",
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
    title: "Make vs Zapier: Which Is Better for Business Automation in 2026?",
    excerpt:
      "Both platforms are popular, but they serve very different use cases. Here's how we choose between them for our clients.",
    date: "March 5, 2026",
    readTime: "7 min read",
    tag: "Tools",
  },
  {
    slug: "ai-automation-roi-calculator",
    title: "How to Calculate the ROI of Automation Before You Build",
    excerpt:
      "Don't guess — use this simple formula to prove the value of automation to yourself (or your boss) before committing a dollar.",
    date: "February 28, 2026",
    readTime: "5 min read",
    tag: "Finance",
  },
  {
    slug: "airtable-automation-guide",
    title: "The Complete Guide to Airtable Automation for Small Teams",
    excerpt:
      "Airtable is more powerful than most people realize. Here's how to use its native automations — plus when to bring in external tools.",
    date: "February 20, 2026",
    readTime: "10 min read",
    tag: "Tutorial",
  },
];

const TAG_COLORS: Record<string, string> = {
  Tutorial: "bg-indigo-100 text-indigo-700",
  Strategy: "bg-green-100 text-green-700",
  Tools: "bg-blue-100 text-blue-700",
  Finance: "bg-yellow-100 text-yellow-700",
};

export default function Blog() {
  return (
    <>
      <section className="bg-white pt-20 pb-16 px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-4">Blog</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">Automation Insights</h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Guides, case studies, and tutorials from the FlowZone AI team.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border border-gray-100 rounded-2xl p-8 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${TAG_COLORS[post.tag] || "bg-gray-100 text-gray-600"}`}>
                  {post.tag}
                </span>
                <span className="text-gray-400 text-sm">{post.date}</span>
                <span className="text-gray-300 text-sm">·</span>
                <span className="text-gray-400 text-sm">{post.readTime}</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-3 leading-tight">
                <Link href={`/blog/${post.slug}`} className="hover:text-indigo-600 transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition-colors"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-indigo-50 border-t border-indigo-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Ready to automate your business?</h2>
          <p className="text-gray-500 mb-6">Get a free custom automation plan — delivered in 24 hours.</p>
          <Link
            href="/intake"
            className="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Get Your Free AI Audit →
          </Link>
        </div>
      </section>
    </>
   "�)