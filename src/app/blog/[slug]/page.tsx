import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  author: string;
  content: Block[];
};

const posts: Post[] = [
  {
    slug: "how-to-automate-lead-intake",
    title: "How to Automate Your Lead Intake in 48 Hours",
    excerpt: "Most businesses lose 30% of potential clients to slow follow-up. Here's how to build a system that responds instantly — without hiring anyone.",
    date: "March 15, 2026",
    readTime: "6 min read",
    tag: "Tutorial",
    author: "FlowZone AI Team",
    content: [
      { type: "p", text: "Every day you wait more than 5 minutes to follow up with a new lead, your chances of closing that client drop by over 80%. Most small businesses are losing nearly a third of potential revenue simply because no one replied fast enough. The good news: you can fix this completely in 48 hours — without hiring a single person." },
      { type: "h2", text: "Why Lead Speed Matters More Than Lead Volume" },
      { type: "p", text: "A study by Harvard Business Review found that companies that respond to leads within an hour are 7x more likely to qualify them than those that respond after 60 minutes. Yet the average small business takes 47 hours to follow up. That gap is where revenue dies." },
      { type: "p", text: "The solution isn't hiring a VA or sitting by your inbox. It's building a system that responds the moment a lead comes in — at any hour, any day — and routes them toward booking." },
      { type: "h2", text: "Step 1: Centralize Your Lead Sources" },
      { type: "p", text: "Before automating anything, map every place a lead can enter your business: your website contact form, Instagram DMs, Google Business messages, referral emails, and any ads you're running. You need one inbox or database where all of these flow." },
      { type: "p", text: "We recommend Airtable or a simple CRM like GoHighLevel as your central hub. Connect each source using Make.com or Zapier — both offer native integrations for the most common lead sources." },
      { type: "h2", text: "Step 2: Write Your Auto-Response Templates" },
      { type: "p", text: "Your first message needs to do three things: acknowledge the inquiry, set expectations, and move the lead toward a next step (booking a call, answering a question, or viewing a resource)." },
      { type: "callout", text: "Example: 'Hi [Name], thanks for reaching out to FlowZone AI! I got your message and will personally review your situation within 2 hours. In the meantime, here's a quick look at how we've helped businesses like yours: [link]. Talk soon — Denny'" },
      { type: "p", text: "Personalize this with merge fields. Most automation tools let you pull in the lead's name, company, and what they inquired about. A message that feels personal converts significantly better than a generic autoresponder." },
      { type: "h2", text: "Step 3: Build the Automation in Make.com" },
      { type: "ul", items: [
        "Trigger: New form submission (Typeform, Webflow, or WordPress)",
        "Action 1: Add row to Airtable CRM with lead details",
        "Action 2: Send personalized email via Gmail or SendGrid",
        "Action 3: Send yourself a Slack or SMS notification",
        "Action 4: If lead scores high (e.g. budget field filled), create a task in your project management tool"
      ]},
      { type: "p", text: "The entire scenario takes about 20 minutes to set up. Once live, every new lead gets a response in under 60 seconds — even at 2am on a Sunday." },
      { type: "h2", text: "Step 4: Add Lead Scoring" },
      { type: "p", text: "Not all leads are equal. Add a simple scoring layer: assign points based on budget indicated, company size, urgency, and source. Leads above a threshold get flagged for immediate personal follow-up. Leads below get nurtured via an automated email sequence." },
      { type: "h2", text: "The Result" },
      { type: "p", text: "Our clients who implement this system typically see a 30–50% increase in booked calls within the first two weeks — with zero extra time spent on manual follow-up. One landscaping client went from missing 60% of leads to closing every qualified inquiry within 24 hours." },
      { type: "callout", text: "Want this built for your business? We'll set up your entire lead intake automation in 48 hours. Get your free AI audit to see exactly what we'd build." },
    ],
  },
  {
    slug: "5-workflows-every-service-business-should-automate",
    title: "5 Workflows Every Service Business Should Automate First",
    excerpt: "Before you automate everything, focus on the highest-ROI tasks. These 5 workflows save most service businesses 10+ hours a week.",
    date: "March 10, 2026",
    readTime: "8 min read",
    tag: "Strategy",
    author: "FlowZone AI Team",
    content: [
      { type: "p", text: "When business owners come to us wanting automation, the most common mistake is trying to automate everything at once. The smarter approach: identify the 5 workflows that eat the most time and have the most consistent process — and start there. These are the workflows that reliably save service businesses 10+ hours every single week." },
      { type: "h2", text: "1. Lead Follow-Up" },
      { type: "p", text: "We covered this in depth in our lead intake guide, but it bears repeating: automated lead follow-up is the single highest-ROI automation for any service business. A 60-second response time versus a 47-hour average is the difference between a closed deal and a lost opportunity." },
      { type: "p", text: "Time saved per week: 3–5 hours. Revenue recovered: often $2,000–$10,000/month for active businesses." },
      { type: "h2", text: "2. Invoice Generation & Payment Follow-Up" },
      { type: "p", text: "Manual invoicing is a silent time thief. Between logging into your accounting tool, filling in project details, attaching to an email, and chasing unpaid invoices — most service businesses spend 3–6 hours per week on billing." },
      { type: "p", text: "The fix: trigger invoice creation the moment a job is marked complete in your project management tool. Use QuickBooks, FreshBooks, or Stripe integrations to auto-generate the invoice, send it via email, and schedule a follow-up reminder if unpaid after 3 days." },
      { type: "h2", text: "3. Client Onboarding" },
      { type: "p", text: "Every new client needs the same things: a welcome email, a contract to sign, an intake form, access to a project portal, and a kickoff call scheduled. Doing this manually every time wastes 45–90 minutes per new client." },
      { type: "p", text: "Automate it: when a proposal is accepted or a payment is received, trigger a sequence that sends the welcome email, DocuSign contract, onboarding questionnaire, and Calendly link — all within minutes." },
      { type: "h2", text: "4. Weekly Reporting" },
      { type: "p", text: "If you send weekly reports to clients or review your own KPIs every Monday, you're likely spending 2–3 hours compiling data from multiple sources. This is one of the most automatable tasks in any business." },
      { type: "p", text: "Connect your data sources (Google Analytics, CRM, ad platforms, accounting software) to a reporting tool like Google Looker Studio or Airtable, and have a formatted report sent automatically every Monday morning." },
      { type: "h2", text: "5. Review & Testimonial Requests" },
      { type: "p", text: "Most service businesses know they should be asking for reviews but never get around to it. Automate a post-project sequence: 3 days after project completion, send a personalized email asking for a Google or Trustpilot review. If they click the link, great. If not, a gentle follow-up 5 days later." },
      { type: "p", text: "Businesses that implement this consistently average 4–8x more reviews within 90 days — which directly impacts SEO rankings and inbound leads." },
      { type: "h2", text: "Where to Start" },
      { type: "p", text: "If you're new to automation, start with lead follow-up. It's the fastest to implement and has the most immediate revenue impact. From there, move to invoicing, then onboarding. Each one builds on the last and creates a business that runs more smoothly every week." },
      { type: "callout", text: "Not sure which of these to tackle first for your specific business? Get a free AI audit — we'll map out your exact automation roadmap in 24 hours." },
    ],
  },
  {
    slug: "make-vs-zapier-for-business-automation",
    title: "Make vs Zapier: Which Is Better for Business Automation in 2026?",
    excerpt: "Both platforms are popular, but they serve very different use cases. Here's how we choose between them for our clients.",
    date: "March 5, 2026",
    readTime: "7 min read",
    tag: "Tools",
    author: "FlowZone AI Team",
    content: [
      { type: "p", text: "If you've started researching business automation, you've almost certainly encountered both Make (formerly Integromat) and Zapier. They're the two dominant platforms in the no-code automation space — and they're very different tools that serve different needs. Here's how we think about the decision for every client we work with." },
      { type: "h2", text: "Zapier: The Beginner-Friendly Powerhouse" },
      { type: "p", text: "Zapier was built with simplicity in mind. Its linear, step-by-step 'Zap' format is intuitive for anyone to understand, and it connects with over 7,000 apps — more than any other platform. If your automation need is straightforward (when X happens, do Y), Zapier is usually the fastest way to get it live." },
      { type: "ul", items: [
        "Pros: Easiest to learn, 7,000+ app integrations, reliable uptime, great support docs",
        "Cons: Gets expensive quickly at scale, limited logic for complex multi-step flows",
        "Best for: Simple 2–3 step automations, teams with no technical background",
        "Pricing: Free tier limited; paid plans from $19.99/month for 750 tasks"
      ]},
      { type: "h2", text: "Make: The Visual Automation Builder" },
      { type: "p", text: "Make is more powerful and significantly more affordable at scale. Instead of linear steps, it uses a visual canvas where you can build complex workflows with branching logic, iterators, error handling, and data transformations. It's the tool we use for 80% of our client builds at FlowZone AI." },
      { type: "ul", items: [
        "Pros: Visual builder, complex logic support, much cheaper per operation, excellent data transformation tools",
        "Cons: Steeper learning curve, fewer native app integrations than Zapier",
        "Best for: Complex multi-step workflows, businesses scaling operations, anyone who wants power at lower cost",
        "Pricing: Free tier available; paid plans from $9/month for 10,000 operations"
      ]},
      { type: "h2", text: "The Price Difference Is Significant" },
      { type: "p", text: "At 50,000 operations per month — which is realistic for an active business running lead follow-up, invoicing, and reporting automations — Zapier costs around $299/month. Make costs $16/month for the same volume. Over a year, that's a $3,396 difference for identical functionality." },
      { type: "h2", text: "How We Choose for Clients" },
      { type: "p", text: "We use Zapier when: the client needs something live in under an hour, the integration isn't supported by Make, or the team will be managing the automation themselves without technical support." },
      { type: "p", text: "We use Make when: the workflow has multiple branches or conditions, the business is processing high volumes, the automation involves data transformation or aggregation, or cost efficiency is a priority." },
      { type: "h2", text: "Our Recommendation" },
      { type: "p", text: "For most small to medium service businesses: start with Zapier to validate the automation, then migrate to Make once it's proven. For any business that's serious about building a scalable automation infrastructure, Make is the better long-term investment." },
      { type: "callout", text: "We build on both platforms and will always recommend the right tool for your specific situation — not the most expensive one. Get your free AI audit to see what we'd recommend for your business." },
    ],
  },
  {
    slug: "ai-automation-roi-calculator",
    title: "How to Calculate the ROI of Automation Before You Build",
    excerpt: "Don't guess — use this simple formula to prove the value of automation to yourself (or your boss) before committing a dollar.",
    date: "February 28, 2026",
    readTime: "5 min read",
    tag: "Finance",
    author: "FlowZone AI Team",
    content: [
      { type: "p", text: "One of the most common objections we hear before starting an automation project is: 'How do I know this will actually be worth it?' It's a fair question. The answer is to run the numbers before you build — and the math is simpler than most people expect." },
      { type: "h2", text: "The Core Formula" },
      { type: "callout", text: "Monthly ROI = (Hours saved per month × Your hourly rate) − Monthly tool cost" },
      { type: "p", text: "That's it. If your time is worth $100/hour and a workflow saves you 10 hours per month, that's $1,000 in value recovered. If the tool costs $50/month, your net ROI is $950/month — or $11,400/year from a single automation." },
      { type: "h2", text: "Step 1: Time the Manual Process" },
      { type: "p", text: "Before building anything, track how long the manual version takes. Don't estimate — actually time it over a week. Most people significantly underestimate repetitive task time. Invoice generation might feel like 10 minutes but adds up to 3 hours a week when you include formatting, emailing, and follow-ups." },
      { type: "h2", text: "Step 2: Calculate Monthly Hours Wasted" },
      { type: "p", text: "Multiply the time per task by frequency. If you send 20 invoices per month and each takes 15 minutes end-to-end, that's 5 hours/month on invoicing alone. At $100/hour, that's $500 of your time — every single month." },
      { type: "h2", text: "Step 3: Factor in Error Costs" },
      { type: "p", text: "Manual processes produce errors. A missed lead follow-up might cost a $3,000 project. A late invoice might delay $5,000 in cash flow by two weeks. These costs are real but often overlooked in ROI calculations. Conservative estimates only — but include them." },
      { type: "h2", text: "Step 4: Add the Revenue Side" },
      { type: "p", text: "Some automations don't just save time — they actively generate revenue. A lead follow-up system that converts one extra client per month at an average project value of $2,500 has a revenue impact of $30,000/year. That dwarfs the cost of any automation tool." },
      { type: "h2", text: "A Real Example" },
      { type: "ul", items: [
        "Process: Lead follow-up + CRM entry",
        "Time per lead: 12 minutes, 40 leads/month = 8 hours",
        "Hourly rate: $150/hour",
        "Monthly time value: $1,200",
        "Tool cost: $29/month (Make.com pro plan)",
        "Net monthly ROI: $1,171",
        "Annual ROI: $14,052 — from one automation"
      ]},
      { type: "p", text: "When you lay it out this way, the question is rarely 'Is it worth it?' — it's 'Why didn't we do this sooner?'" },
      { type: "callout", text: "Want us to run the ROI calculation for your specific business? That's exactly what we do in your free AI audit — no obligation, delivered in 24 hours." },
    ],
  },
  {
    slug: "airtable-automation-guide",
    title: "The Complete Guide to Airtable Automation for Small Teams",
    excerpt: "Airtable is more powerful than most people realize. Here's how to use its native automations — plus when to bring in external tools.",
    date: "February 20, 2026",
    readTime: "10 min read",
    tag: "Tutorial",
    author: "FlowZone AI Team",
    content: [
      { type: "p", text: "Airtable is one of the most underrated tools in the small business stack. Most teams use it as a fancy spreadsheet — but it has a robust native automation engine that can handle a surprising number of workflows without any external tools. Here's how to unlock it." },
      { type: "h2", text: "What Airtable Automations Can Do Natively" },
      { type: "p", text: "Airtable's built-in automation builder supports triggers and actions that cover most common business workflows. You can trigger automations when a record is created, when a field changes, when a date arrives, or on a custom schedule." },
      { type: "ul", items: [
        "Send email notifications when a lead status changes",
        "Create new records when a form is submitted",
        "Update fields automatically based on conditions",
        "Post messages to Slack when a project moves to a new stage",
        "Generate documents using page designer output",
        "Run scripts (with the Pro plan) for advanced logic"
      ]},
      { type: "h2", text: "Setting Up Your First Airtable Automation" },
      { type: "p", text: "Navigate to the Automations tab at the top of any base. Click 'Add automation' and choose your trigger. The most useful starting point for most businesses is 'When a record is created' — this fires every time a new row appears in your table, whether from a form, an import, or a manual entry." },
      { type: "p", text: "From there, add your actions. A simple but powerful sequence: send a confirmation email to the person who submitted the form, send yourself a Slack notification, and update a 'Status' field to 'New Lead.'" },
      { type: "h2", text: "The 5 Most Useful Airtable Automation Recipes" },
      { type: "h3", text: "1. New Lead Notification" },
      { type: "p", text: "Trigger: When record created in Leads table. Action: Send email to yourself with lead details. Action: Post to Slack #leads channel. Takes 5 minutes to set up and you'll never miss a lead in Airtable again." },
      { type: "h3", text: "2. Status-Change Client Update" },
      { type: "p", text: "Trigger: When 'Project Status' field changes. Condition: Only when value becomes 'Complete'. Action: Send client a project completion email with deliverables link. Eliminates the manual 'just checking in' email entirely." },
      { type: "h3", text: "3. Overdue Task Alert" },
      { type: "p", text: "Trigger: Scheduled — runs daily at 8am. Condition: Due date is before today AND Status is not 'Done'. Action: Send you a daily digest of overdue tasks. Simple but surprisingly powerful for staying on top of client work." },
      { type: "h3", text: "4. Invoice Trigger" },
      { type: "p", text: "Trigger: When 'Ready to Invoice' checkbox is checked. Action: Run a script that creates an invoice record in your Invoices table, pre-filled with client name, project details, and amount. Action: Send email notification to your accountant." },
      { type: "h3", text: "5. Review Request Sequence" },
      { type: "p", text: "Trigger: When 'Project Status' changes to 'Delivered'. Action: Wait 3 days (using Airtable's delay feature). Action: Send the client a personalized review request email with your Google review link." },
      { type: "h2", text: "When to Bring in External Tools" },
      { type: "p", text: "Airtable's native automations are powerful but have limits. You'll want to bring in Make.com or Zapier when you need: two-way syncing with external apps, complex conditional logic with multiple branches, data transformation before sending to another system, or integrations Airtable doesn't natively support (like QuickBooks or Stripe)." },
      { type: "p", text: "The sweet spot for most small teams: use Airtable automations for everything internal, and connect Make.com for anything that needs to talk to the outside world." },
      { type: "callout", text: "We build Airtable systems for service businesses every week. If you want a custom Airtable setup with automations built for your exact workflow, start with a free AI audit." },
    ],
  },
];

const TAG_COLORS: Record<string, string> = {
  Tutorial: "bg-sky-100 text-sky-700",
  Strategy: "bg-green-100 text-green-700",
  Tools: "bg-blue-100 text-blue-700",
  Finance: "bg-yellow-100 text-yellow-700",
};

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  return { title: `${post.title} | FlowZone AI`, description: post.excerpt };
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h2":
      return <h2 key={i} className="text-2xl font-black text-gray-900 mt-10 mb-4">{block.text}</h2>;
    case "h3":
      return <h3 key={i} className="text-lg font-bold text-gray-800 mt-6 mb-2">{block.text}</h3>;
    case "p":
      return <p key={i} className="text-gray-600 leading-relaxed mb-4">{block.text}</p>;
    case "ul":
      return (
        <ul key={i} className="list-none space-y-2 mb-6">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-gray-600">
              <span className="text-sky-500 font-bold mt-0.5">&#10003;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div key={i} className="bg-sky-50 border-l-4 border-sky-500 rounded-xl p-5 my-6">
          <p className="text-sky-800 font-medium leading-relaxed">{block.text}</p>
        </div>
      );
    default:
      return null;
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <section className="bg-white pt-20 pb-10 px-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <Link href="/blog" className="text-sky-600 text-sm font-semibold hover:text-sky-800 transition-colors mb-6 inline-block">
            &larr; Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${TAG_COLORS[post.tag] || "bg-gray-100 text-gray-600"}`}>
              {post.tag}
            </span>
            <span className="text-gray-400 text-sm">{post.date}</span>
            <span className="text-gray-300 text-sm">&middot;</span>
            <span className="text-gray-400 text-sm">{post.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">{post.excerpt}</p>
        </div>
      </section>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          {post.content.map((block, i) => renderBlock(block, i))}
        </div>
      </section>

      <section className="py-16 px-6 bg-sky-50 border-t border-sky-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Ready to automate your business?</h2>
          <p className="text-gray-500 mb-6">Get a free custom automation plan &mdash; delivered in 24 hours.</p>
          <Link
            href="/intake"
            className="inline-block bg-sky-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-sky-700 transition-colors"
          >
            Get Your Free AI Audit &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
