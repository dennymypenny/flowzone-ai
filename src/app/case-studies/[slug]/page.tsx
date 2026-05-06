import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const cases = [
  {
    slug: "verde-supply",
    client: "Verde Supply Co.",
    tag: "E-Commerce Automation",
    icon: "🌿",
    industry: "Retail & E-Commerce",
    location: "Austin, TX",
    timeline: "6 days",
    services: ["AI Chatbot Agent", "Email Nurture Sequences", "Customer Support Triage"],
    headline: "How a Sustainable Retailer Recovered $62K in Lost Revenue With Three Automations",
    summary: "Verde Supply Co. sells premium outdoor and camping gear through their Shopify store. They were growing fast — nearly 8,000 monthly visitors — but a massive percentage of that traffic was walking away. Their abandoned cart rate had climbed to 43%, customer support was a bottleneck, and they had no systematic way to collect reviews after purchase. In six days, FlowZone AI deployed three automations that turned those leaks into revenue.",
    challenge: "Verde's founder Carlos had spent two years building a loyal customer base through content marketing and Instagram. But the backend was running on duct tape. When a customer abandoned a cart, nothing happened. When someone emailed a question about product sizing or return policy, it sat in an inbox until someone got to it — sometimes hours later, sometimes the next morning. And after a purchase, there was zero follow-up. No thank you. No review ask. No upsell. Carlos knew he was leaving money on the table but had no idea how much until we ran the numbers: at a 43% abandonment rate on a 3% recovery baseline, Verde was walking away from an estimated $18,000 every month.",
    solution: "We approached the project in three parallel tracks. First, a three-step abandoned cart email sequence timed at 1 hour, 24 hours, and 72 hours post-abandonment. Second, an AI chatbot trained on Verde's full product catalog, sizing guides, and return policy deployed on the site. Third, a post-purchase email flow with a review request, care tips, and a cross-sell recommendation based on what was purchased.",
    steps: [
      { step: "Discovery & Mapping", detail: "Audited the full customer journey from ad click to post-purchase. Identified three high-value drop-off points: cart abandonment, unanswered pre-purchase questions, and zero post-purchase communication." },
      { step: "Abandoned Cart Sequence", detail: "Built a three-email flow in Klaviyo triggered by cart abandonment. Email 1 (1 hr): soft reminder with cart contents. Email 2 (24 hrs): social proof and free shipping callout. Email 3 (72 hrs): 10% off with urgency trigger. Subject lines A/B tested at launch." },
      { step: "AI Support Chatbot", detail: "Trained a custom chatbot on Verde's product catalog, FAQs, sizing charts, shipping policy, and return process. Deployed on product pages and the cart. Handles 80% of pre-purchase questions without human intervention. Escalates to email for edge cases." },
      { step: "Post-Purchase Flow", detail: "A 4-email sequence beginning 2 days after delivery confirmation. Email 1: product care guide. Email 2: review request on Trustpilot. Email 3: related product recommendation. Email 4: 60-day repurchase prompt for consumables." },
      { step: "Launch & Optimization", detail: "Went live on day 6. Monitored open rates, click rates, and recovery revenue for the first 30 days. Adjusted send times and subject lines based on early data. Recovery rate climbed from 3% to 34% within the first month." },
    ],
    metrics: [
      { label: "Cart Recovery Rate", value: "34%" },
      { label: "Support Tickets Reduced", value: "80%" },
      { label: "Revenue Recovered (Mo. 1)", value: "$62K" },
      { label: "ROI at 90 Days", value: "4.8x" },
    ],
    quote: "We went from manually answering the same 12 questions every day to having the chatbot handle almost all of them. The cart recovery alone paid for everything in the first week.",
    quoteName: "Carlos M., Founder — Verde Supply Co.",
  },
  {
    slug: "pinnacle-media",
    client: "Pinnacle Media Group",
    tag: "Reporting Automation",
    icon: "📊",
    industry: "Marketing Agency",
    location: "New York, NY",
    timeline: "5 days",
    services: ["Automated Reporting & Dashboards", "Content Repurposing Automation", "Custom API & Tool Integrations"],
    headline: "How a Marketing Agency Got 12 Hours a Week Back by Automating Client Reporting",
    summary: "Pinnacle Media Group manages paid media, SEO, and social campaigns for 14 mid-market clients. Every Monday, their team spent the entire weekend manually pulling performance data from Google Ads, Meta, LinkedIn, GA4, SEMrush, and their internal project tracker — then formatting it into branded PDF reports for each client. It was costing the agency 12+ hours every week, and clients were still complaining reports were late. FlowZone automated the entire reporting stack in 5 days.",
    challenge: "The agency had grown faster than their systems. What started as a two-client operation where reporting was manageable had ballooned to 14 clients across four channels. Each client had a custom reporting template with different KPIs, date ranges, and formatting preferences. Two account managers were spending roughly 6 hours each on Sunday pulling data, building slides, and sending emails. They were burning out, making errors, and losing billable hours to work that could be automated. Worse, a few clients had recently complained about reports arriving Monday afternoon instead of Monday morning.",
    solution: "We built a centralized reporting engine that pulls live data from all six platforms via API, populates each client's custom template, renders a branded PDF, and emails it to the client and their internal stakeholders — every Monday at 7:30 AM without anyone touching it.",
    steps: [
      { step: "Platform API Integration", detail: "Connected Google Ads, Meta Ads, LinkedIn Ads, Google Analytics 4, and SEMrush via their respective APIs. Built a unified data layer that normalizes metrics across platforms into a consistent schema." },
      { step: "Client Template Mapping", detail: "Mapped each of the 14 client reporting templates to the data layer. Built a configuration file per client that defines which metrics to pull, what date ranges to use, and what the benchmark comparisons should be." },
      { step: "Automated PDF Generation", detail: "Built a rendering pipeline that populates each template with live data, applies client branding, and exports a pixel-perfect PDF. Handles charts, tables, percentage changes, and commentary blocks." },
      { step: "Scheduled Delivery", detail: "Set up a Monday 7:30 AM automated send for all 14 reports simultaneously. Each report goes to the correct client contacts and internal account manager with a subject line that includes the client name and reporting period." },
      { step: "Slack Alert Integration", detail: "Added a secondary output: a Slack message sent to the internal agency channel each Monday morning confirming all 14 reports sent successfully, with a direct link to each one for quick review." },
    ],
    metrics: [
      { label: "Hours Saved Per Week", value: "12 hrs" },
      { label: "Client Reports Automated", value: "47" },
      { label: "On-Time Delivery Rate", value: "100%" },
      { label: "Error Rate", value: "0%" },
    ],
    quote: "We used to spend every Sunday night doing reporting. Now it goes out automatically every Monday at 7:30 AM. My team has their weekends back and clients are happier. It's not even close.",
    quoteName: "Rachel T., Director of Operations — Pinnacle Media Group",
  },
  {
    slug: "sofia-navarro",
    client: "Sofia Navarro Design",
    tag: "Lead & Invoice Automation",
    icon: "🎨",
    industry: "Design Consultancy",
    location: "Miami, FL",
    timeline: "4 days",
    services: ["Lead Intake & CRM Automation", "Invoice & Payment Workflows", "Email Nurture Sequences"],
    headline: "How a Freelance Designer Added $42K in Revenue by Automating Her Admin",
    summary: "Sofia Navarro is a senior UX and product designer serving tech startups and growth-stage companies. Her work is in high demand — but her business was running on sticky notes, a shared Google Sheet, and memory. Leads came in through her website, Instagram DMs, and LinkedIn, and fell through the cracks regularly. Invoices went out late or not at all. And follow-up with warm prospects was nonexistent. Four days of automation changed all of that.",
    challenge: "Sofia's problem was not a lack of clients — it was a lack of systems. She was billing at a premium rate but spending 20 or more hours per month on intake, proposal writing, invoice chasing, and lead follow-up. Worse, she had no way to nurture the dozens of prospects who expressed interest but were not ready to start immediately. Those people would eventually hire someone, just not Sofia because she had not stayed in touch. A back-of-envelope calculation showed she was losing an estimated $10,000 to $15,000 per quarter in missed opportunities alone.",
    solution: "We built three interconnected systems: a lead intake and CRM pipeline that captures and tracks every inquiry, a follow-up email sequence that nurtures prospects over 21 days, and a fully automated invoicing workflow tied to project milestones.",
    steps: [
      { step: "Unified Lead Capture", detail: "Built a single intake form embedded on her site and linkable from Instagram bio and LinkedIn. Form captures project type, budget range, timeline, and contact info. Feeds directly into Airtable CRM with auto-tagging by project type and lead source." },
      { step: "Instant Response & Qualification", detail: "Automated reply goes out within 60 seconds of form submission. Personalizes by project type. Sets expectations on timeline and next steps. Warm leads tagged for immediate follow-up, cold leads enter the nurture sequence." },
      { step: "21-Day Nurture Sequence", detail: "7-email sequence deployed over 21 days for prospects not yet ready to start. Emails include: case studies, process walkthrough, client testimonials, FAQ answers, and a soft call-to-action. Opens the door for re-engagement without being pushy." },
      { step: "Milestone-Based Invoicing", detail: "Invoice automation tied to project phase. When a project phase is marked complete in Airtable, an invoice drafts automatically in Stripe with the correct amount, due date, and line items. Sends to client immediately. Overdue reminders trigger at 3, 7, and 14 days." },
      { step: "Proposal Follow-Up", detail: "When a proposal is sent and not responded to within 5 days, an automated follow-up goes out. If still no response at 10 days, a second lighter-touch follow-up goes. Response rate on proposals increased from 41% to 78%." },
    ],
    metrics: [
      { label: "Additional Revenue in Q1", value: "$42K" },
      { label: "Proposal Response Rate", value: "78%" },
      { label: "Admin Hours Saved / Month", value: "22 hrs" },
      { label: "Lead Response Time", value: "< 60 sec" },
    ],
    quote: "I was a designer who spent half her day doing admin that wasn't even being done well. FlowZone automated everything except the actual design work. I feel like I finally run a real business.",
    quoteName: "Sofia N., Founder — Sofia Navarro Design",
  },
  {
    slug: "regal-home",
    client: "Regal Home Services",
    tag: "Booking & Reviews",
    icon: "🏠",
    industry: "Home Services",
    location: "Phoenix, AZ",
    timeline: "7 days",
    services: ["Appointment Booking & Reminders", "Lead Intake & CRM Automation", "Email Nurture Sequences"],
    headline: "How a Cleaning Company Cut Cancellations by 41% and Generated 220 Five-Star Reviews",
    summary: "Regal Home Services provides residential cleaning, deep cleans, and move-in/move-out cleaning in Phoenix and surrounding suburbs. Owner Marcus was running the entire operation through phone calls and a paper calendar. Cancellations were rampant, new bookings took forever to confirm, and despite doing excellent work, their Google and Yelp presence barely reflected it. We rebuilt their entire client communication layer in one week.",
    challenge: "Marcus had 40 recurring clients and a referral-based pipeline, but the operation had a serious infrastructure problem. Booking happened exclusively by phone during business hours. Clients who called after 5 PM heard a voicemail and often called a competitor instead. Cancellations were happening at a 28% rate primarily because clients forgot about appointments. And despite Marcus's crew doing genuinely great work, they had only 14 Google reviews after 3 years in business — because nobody ever asked. The business had real potential being choked by operational gaps.",
    solution: "We built an online booking flow, an SMS-based appointment reminder sequence, and an automated post-service review funnel that asked every client for a review within 2 hours of job completion.",
    steps: [
      { step: "Online Booking Integration", detail: "Deployed a booking widget on Regal's website tied to Calendly with custom logic for service type, square footage, and first-time vs. recurring client. Confirmations go out automatically via email and text the moment a booking is made." },
      { step: "3-Touch Reminder Sequence", detail: "SMS and email reminders sent at 48 hours, 24 hours, and 2 hours before each appointment. The 2-hour reminder includes a link to reschedule or confirm. Cancellations must be done 24 hours in advance, reducing last-minute no-shows significantly." },
      { step: "Post-Service Review Flow", detail: "2 hours after a job is marked complete, an SMS goes to the client: a personal-feeling thank-you with a direct link to leave a Google review. Followed by an email version 24 hours later. The sequence is paused for clients who already left a review." },
      { step: "Recurring Client Nurture", detail: "Monthly email to the full client list with seasonal cleaning tips, a referral incentive, and a reminder to book if they have not in 45 days. Reactivated 7 dormant clients in the first 60 days." },
      { step: "New Lead Intake", detail: "Added a contact form to the site with instant automated response and a link to book online. Voicemail callers receive an auto-text with the booking link. No more leads lost to after-hours inquiries." },
    ],
    metrics: [
      { label: "Cancellation Rate Reduction", value: "41%" },
      { label: "5-Star Reviews Generated", value: "220" },
      { label: "Booking Volume Increase", value: "2.1x" },
      { label: "After-Hours Leads Captured", value: "100%" },
    ],
    quote: "Before, I had a sticky note system to remember who needed follow-up. Now I have 220 five-star reviews, clients actually show up, and I'm booking twice as many jobs. I wish I'd done this three years ago.",
    quoteName: "Marcus R., Owner — Regal Home Services",
  },
  {
    slug: "northgate-realty",
    client: "Northgate Realty Group",
    tag: "CRM & Lead Nurture",
    icon: "🏡",
    industry: "Real Estate",
    location: "Denver, CO",
    timeline: "7 days",
    services: ["Lead Intake & CRM Automation", "Email Nurture Sequences", "Automated Reporting & Dashboards"],
    headline: "How a Denver Brokerage Tripled Lead Conversion and Closed $2.4M More in One Quarter",
    summary: "Northgate Realty Group is a 6-agent independent brokerage in Denver operating in one of the most competitive real estate markets in the country. They were generating 200+ leads per month from Zillow, Realtor.com, and their own site — but converting fewer than 4% of them. The problem was not the leads. It was what happened after they came in. We built a CRM and lead nurture system that changed the math entirely.",
    challenge: "Every agent had their own system for tracking leads — some used spreadsheets, some used their phone's notes app, and one was working entirely from memory. When a lead came in at 9 PM on a Saturday, it might not get a response until Monday morning. In a market where a buyer might tour 3 homes over a weekend and make an offer by Sunday, that 36-hour response gap was fatal. Northgate was also not staying in contact with leads who were 3-12 months out from buying. Those people would eventually buy — just through whoever had stayed in touch.",
    solution: "We built a unified lead intake system that feeds all sources into a single Airtable CRM, sends an immediate automated response within 90 seconds of any inquiry, and enrolls leads in a long-term nurture sequence tailored to their buying timeline.",
    steps: [
      { step: "Lead Source Unification", detail: "Connected Zillow, Realtor.com, and the website contact form into a single Airtable CRM via Zapier webhooks. Every lead normalized to the same format regardless of source. Auto-tagged by lead source, buyer vs. seller, and estimated timeline." },
      { step: "90-Second Response System", detail: "Any new lead triggers an immediate personalized email and SMS within 90 seconds. Email references their specific inquiry (neighborhood, price range, property type) and introduces their assigned agent. SMS keeps it short and conversational." },
      { step: "Short-Term Buyer Sequence", detail: "Leads tagged as 0-3 months from purchase enter a high-touch 10-email sequence over 21 days. Includes new listings matching their criteria, market updates, first-time buyer guides, and soft CTAs to book a showing." },
      { step: "Long-Term Nurture Sequence", detail: "Leads 3-12 months out enter a lower-frequency monthly sequence. Neighborhood spotlights, mortgage rate updates, market trend reports, and personal check-ins. Keeps Northgate top of mind for the 8+ months until the lead is ready to move." },
      { step: "Agent Dashboard", detail: "Built a live dashboard in Airtable that shows each agent their active leads, follow-up tasks, and pipeline value. Weekly email digest sent to the broker with conversion metrics, lead volume by source, and top-performing agents." },
    ],
    metrics: [
      { label: "Lead-to-Appointment Rate", value: "3x" },
      { label: "Average Response Time", value: "< 90 sec" },
      { label: "Q1 Additional Closings", value: "$2.4M" },
      { label: "Long-Nurture Conversion", value: "18%" },
    ],
    quote: "We had 200 leads a month and were converting 4% of them. Now we're converting 12%. That difference alone is worth more than I can calculate. The system just works.",
    quoteName: "Derek N., Broker-Owner — Northgate Realty Group",
  },
  {
    slug: "luxe-medspa",
    client: "Luxe MedSpa",
    tag: "Appointment Automation",
    icon: "💆",
    industry: "Health & Wellness",
    location: "Los Angeles, CA",
    timeline: "5 days",
    services: ["Appointment Booking & Reminders", "Email Nurture Sequences", "AI Chatbot Agent"],
    headline: "How a High-End Med Spa Recovered $8,400 Per Month and Cut No-Shows by 63%",
    summary: "Luxe MedSpa offers Botox, dermal fillers, laser treatments, and wellness services in West Los Angeles. They had a strong reputation and steady new client flow, but two problems were silently costing them a fortune: a 31% no-show rate that left treatment rooms empty, and no system to bring clients back for the follow-up sessions that their treatments required. In five days, we fixed both.",
    challenge: "At an average ticket of $450 per appointment, Luxe was losing an estimated $8,400 every month to no-shows alone. Most of these clients had not cancelled. They had simply forgotten, or something came up and they did not bother to reschedule. The second problem was deeper: Botox clients need to come back every 3-4 months. Filler clients need touch-ups. Laser clients need multiple sessions. But Luxe had no system to remind clients when they were due. The spa was leaving enormous amounts of money on the table just by not communicating at the right times.",
    solution: "We deployed a three-part system: a robust appointment reminder sequence, a treatment-cycle follow-up tied to each service type, and an AI chatbot on their website to capture and qualify leads after hours.",
    steps: [
      { step: "Appointment Reminder Sequence", detail: "Three-touch reminder system: email at 72 hours, SMS at 24 hours, and a final SMS 3 hours before the appointment. Each message includes a one-tap reschedule link. Cancellations require 24-hour notice, which dramatically reduced same-day no-shows." },
      { step: "Treatment-Cycle Automation", detail: "Built service-specific follow-up sequences tied to appointment type. Botox clients receive a follow-up at 10 weeks post-treatment reminding them their next appointment should be scheduled. Filler clients at 4 months. Laser clients after each session in their multi-session package. Each message is warm and educational, not salesy." },
      { step: "New Client Welcome Flow", detail: "After a first appointment is booked, a 3-email welcome sequence goes out. Email 1: what to expect and how to prepare. Email 2: pre-treatment skincare guidelines. Email 3: a personal note from the medical director with their direct contact info. First-visit retention improved by 29%." },
      { step: "After-Hours Chatbot", detail: "An AI chatbot deployed on the services pages and homepage. Answers common questions about treatments, pricing, downtime, and contraindications. Captures lead information and books consultations directly into the scheduling system. Converted 34 leads in the first 30 days." },
      { step: "Reactivation Campaign", detail: "One-time campaign sent to all clients who had not visited in 6+ months. Personalized by last service received. Offered a complimentary consultation to assess their current needs. Reactivated 22 dormant clients in 30 days, generating $9,900 in revenue." },
    ],
    metrics: [
      { label: "No-Show Rate Reduction", value: "63%" },
      { label: "Revenue Recovered / Month", value: "$8,400" },
      { label: "Rebooking Rate", value: "44%" },
      { label: "Leads Captured by Chatbot (Mo. 1)", value: "34" },
    ],
    quote: "The no-show problem was costing us almost $100K a year and we didn't even realize it. Within the first month of running the reminders, we recovered most of it. The treatment-cycle follow-ups brought back clients I assumed were gone forever.",
    quoteName: "Dr. Priya S., Medical Director — Luxe MedSpa",
  },
  {
    slug: "james-okafor",
    client: "Okafor Consulting",
    tag: "Admin & Invoice Automation",
    icon: "💻",
    industry: "Software Consulting",
    location: "Chicago, IL",
    timeline: "4 days",
    services: ["Invoice & Payment Workflows", "Lead Intake & CRM Automation", "Automated Reporting & Dashboards"],
    headline: "How a Senior Software Consultant Doubled His Capacity by Automating His Back Office",
    summary: "James Okafor is a senior software architect and consultant charging $250 per hour for his time. For three years, he had been spending 15 or more hours every month — the equivalent of nearly $4,000 in billable time — on admin work: chasing invoices, following up with leads, onboarding new clients, and manually tracking project status. Four days of automation gave that time back and doubled what his practice could handle.",
    challenge: "James's problem was invisible until we mapped it. He was technically fully booked, but 15 hours of his monthly capacity was being consumed by tasks that had nothing to do with software: drafting invoices in Google Docs, emailing them manually, following up when they went unpaid, responding to the same onboarding questions from every new client, and losing track of warm prospects he had spoken to months earlier. He had also turned down two projects that quarter because he felt too busy — despite the fact that the busyness was largely administrative.",
    solution: "We automated James's entire back office in four tracks: a unified lead CRM, a milestone-based invoicing engine, a client onboarding workflow, and a simple project reporting dashboard.",
    steps: [
      { step: "Lead CRM Setup", detail: "Built a pipeline in Airtable that captures leads from his site, LinkedIn, and referrals into a single view. Auto-stages by status: cold, warm, proposal sent, active, closed. Weekly digest email sent to James every Monday with his pipeline summary and any leads that need attention." },
      { step: "Milestone-Based Invoicing", detail: "Invoices now generate automatically when James marks a project milestone complete. The system pulls the client name, project code, milestone amount, and due date — drafts the invoice in Stripe — and sends it within minutes. Overdue reminders send automatically at 3, 7, and 14 days." },
      { step: "Client Onboarding Flow", detail: "New clients receive a 4-message onboarding sequence immediately after signing. Includes: welcome email with project timeline, a questionnaire capturing all technical context, a request for system access credentials via a secure form, and a calendar link to schedule the kickoff call. James no longer sends any of this manually." },
      { step: "Project Status Dashboard", detail: "A lightweight weekly status email auto-generates for each active project on Friday afternoon. Summarizes hours logged, milestones completed, blockers, and next week's planned work. Clients receive it automatically — no more manual status update requests." },
      { step: "Proposal Follow-Up", detail: "When a proposal is sent and not responded to within 4 business days, a follow-up email goes out automatically. A second follow-up at 10 days. James's proposal close rate went from 52% to 71% in the first quarter after implementation." },
    ],
    metrics: [
      { label: "Admin Hours Saved / Month", value: "15 hrs" },
      { label: "Billable Value Recovered", value: "$3,750/mo" },
      { label: "Proposal Close Rate", value: "71%" },
      { label: "Invoice Collection Time", value: "↓ 68%" },
    ],
    quote: "I was billing $250 an hour and spending 15 hours a month on $0/hour work. That's fixed. I took on two new clients the quarter after we launched this and my invoices now get paid faster than they ever did when I was sending them manually.",
    quoteName: "James O., Principal Consultant — Okafor Consulting",
  },
  {
    slug: "mesa-crossfit",
    client: "Mesa CrossFit",
    tag: "Member Retention",
    icon: "🏋️",
    industry: "Fitness & Wellness",
    location: "Mesa, AZ",
    timeline: "7 days",
    services: ["Email Nurture Sequences", "Appointment Booking & Reminders", "Lead Intake & CRM Automation"],
    headline: "How an Independent CrossFit Gym Reactivated 89 Lapsed Members and Cut Churn by 31%",
    summary: "Mesa CrossFit is a 240-member independent gym competing against franchise fitness chains with massive marketing budgets. Owner Tanya had built a tight community over six years, but member churn was accelerating — mostly quietly. Members would stop showing up, their membership would lapse, and the gym would never reach out. In 60 days following our engagement, 89 members came back, and monthly churn dropped by nearly a third.",
    challenge: "The typical fitness gym loses 30-50% of its members annually. Mesa CrossFit was no exception. But the problem was structural: the gym had no system for catching members before they left. When someone went two weeks without attending class, nothing happened. When their membership billing failed, an automated system cancelled them and that was it — no human touchpoint, no attempt to save the relationship. And for new members, the onboarding experience was essentially: sign the waiver, here's your keycard, good luck. First-month retention was poor because new members felt lost before they felt hooked.",
    solution: "We built three systems: a new member onboarding sequence, an attendance-triggered early warning system for at-risk members, and a reactivation campaign targeting lapsed members from the past 12 months.",
    steps: [
      { step: "New Member Onboarding", detail: "7-message sequence beginning the day a new membership is activated. Day 1: welcome email with gym guide and coach intro. Day 3: first class tips and what to expect. Day 7: check-in from head coach. Day 14: progress check and encouragement. Day 21: community invitation (open gym, social events). Day 30: milestone celebration and 90-day goal setting prompt. First-month retention improved from 61% to 84%." },
      { step: "Attendance Monitoring & Alerts", detail: "Integration built between the gym's check-in software and the email system. If a member has not attended in 10 days, a personal check-in email is triggered. If 21 days pass, a second message goes out from the head coach by name. Both emails include a class booking link. Saved 34 memberships in the first 60 days from members who otherwise would have quietly quit." },
      { step: "Lapsed Member Reactivation", detail: "Identified 340 lapsed members from the past 12 months in the CRM. Launched a 3-message reactivation campaign over 10 days: a personal message from Tanya, a limited-time comeback offer (first month at 50%), and a final message with social proof. 89 members reactivated in 60 days at an average value of $139/month." },
      { step: "Trial Lead Nurture", detail: "Visitors who booked a free trial class but did not convert to membership entered a 5-day follow-up sequence. Day 1: recap email with class highlights. Day 2: FAQ about the membership. Day 3: testimonial from a new member. Day 5: special offer to sign up this week. Trial-to-membership conversion improved from 31% to 54%." },
      { step: "Monthly Community Email", detail: "A monthly member newsletter sent on the first of each month. Highlights PRs from the community, upcoming events, programming previews, and spotlight stories. Open rate of 61%. Strengthens community identity and reduces the likelihood of cancellation for borderline members." },
    ],
    metrics: [
      { label: "Monthly Churn Reduction", value: "31%" },
      { label: "Members Reactivated (60 days)", value: "89" },
      { label: "First-Month Retention", value: "84%" },
      { label: "Trial Conversion Rate", value: "54%" },
    ],
    quote: "We brought back 89 people who had ghosted us just by sending the right message at the right time. That's over $12,000 a month in recurring revenue we had already written off. And the new member experience is night and day from what it was.",
    quoteName: "Tanya K., Owner — Mesa CrossFit",
  },
];

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = cases.find((c) => c.slug === slug);
  if (!cs) return {};
  return {
    title: cs.client + " Case Study",
    description: cs.headline,
  };
}

export async function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = cases.find((c) => c.slug === slug);
  if (!cs) notFound();

  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-20 pb-16 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-blue-600 text-sm font-semibold mb-8 hover:underline">
            ← All Case Studies
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{cs.icon}</span>
            <div>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">{cs.tag}</span>
              <p className="text-gray-400 text-sm mt-1">{cs.industry} · {cs.location}</p>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">{cs.headline}</h1>
          <p className="text-xl text-gray-500 leading-relaxed">{cs.summary}</p>
        </div>
      </section>

      {/* Key metrics */}
      <section className="bg-blue-600 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {cs.metrics.map((m) => (
            <div key={m.label}>
              <p className="text-3xl md:text-4xl font-black text-white">{m.value}</p>
              <p className="text-blue-200 text-sm mt-1 leading-tight">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Body */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-16">

          {/* Main content */}
          <div className="md:col-span-2 space-y-14">

            {/* Challenge */}
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">The Challenge</p>
              <h2 className="text-2xl font-black text-gray-900 mb-4">What Was Holding Them Back</h2>
              <p className="text-gray-600 leading-relaxed text-[17px]">{cs.challenge}</p>
            </div>

            {/* Solution */}
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">The Solution</p>
              <h2 className="text-2xl font-black text-gray-900 mb-4">What We Built</h2>
              <p className="text-gray-600 leading-relaxed text-[17px] mb-8">{cs.solution}</p>

              <div className="space-y-6">
                {cs.steps.map((s, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">{s.step}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote */}
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-2xl px-8 py-7">
              <p className="text-gray-800 text-lg leading-relaxed italic mb-4">"{cs.quote}"</p>
              <p className="font-bold text-gray-900 text-sm">{cs.quoteName}</p>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">

            {/* Delivery */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Project Details</p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Client</p>
                  <p className="font-bold text-gray-900">{cs.client}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Industry</p>
                  <p className="font-bold text-gray-900">{cs.industry}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Location</p>
                  <p className="font-bold text-gray-900">{cs.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Delivery Time</p>
                  <p className="font-bold text-blue-600">{cs.timeline}</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Services Used</p>
              <div className="flex flex-col gap-2">
                {cs.services.map((s) => (
                  <span key={s} className="inline-block bg-white border border-gray-200 text-gray-700 text-sm font-semibold px-3 py-2 rounded-xl">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-blue-600 rounded-2xl p-6 text-center">
              <p className="font-black text-white text-lg mb-2">Get These Results</p>
              <p className="text-blue-200 text-sm mb-5 leading-relaxed">Tell us what you want automated. We will build it in 7 days or less.</p>
              <Link href="/intake" className="block bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                Start Your Project →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Other case studies */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-6">More Case Studies</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {cases.filter((c) => c.slug !== cs.slug).slice(0, 4).map((c) => (
              <Link key={c.slug} href={`/case-studies/${c.slug}`} className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{c.icon}</span>
                  <p className="font-bold text-gray-900 text-sm">{c.client}</p>
                </div>
                <p className="text-gray-400 text-xs mb-3">{c.industry}</p>
                <p className="text-blue-600 font-bold text-sm">{c.metric} →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
