"use client";
import { useEffect, useState } from "react";

const demos = [
  {
    badge: "Lead Automation",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&q=80",
    imageAlt: "Business professional responding to clients",
    clientName: "Alex Johnson",
    clientCo: "Acme Corp",
    overlayTitle: "New Lead Auto-Replied",
    overlayDetail: "acmecorp.com · via Contact Form",
    stat: "47",
    statUnit: "leads handled this week",
    highlight: "Avg response: 1.8 seconds",
    caption: "Every new lead gets a personalized follow-up instantly — while you focus on delivering work.",
  },
  {
    badge: "Invoice Automation",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=80",
    imageAlt: "Freelancer completing a project",
    clientName: "NexaGroup",
    clientCo: "billing@nexagroup.co",
    overlayTitle: "Invoice #INV-089 Sent",
    overlayDetail: "SEO Campaign Setup · Auto-generated",
    stat: "\$2,800",
    statUnit: "collected with zero follow-up",
    highlight: "Sent in 3 seconds · paid in 2 days",
    caption: "Mark a job complete and your invoice goes out automatically — no templates, no copy-paste.",
  },
  {
    badge: "Weekly Reports",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=700&q=80",
    imageAlt: "Team reviewing business performance",
    clientName: "Weekly Report",
    clientCo: "Auto-generated · Every Monday",
    overlayTitle: "\$24.8K Revenue — Week of Mar 17",
    overlayDetail: "↑ 18% vs last week · 47 leads · 3,241 visits",
    stat: "5",
    statUnit: "sources compiled in 4 seconds",
    highlight: "Lands in your inbox at 9:00 AM",
    caption: "Pull data from 5 tools automatically. Your weekly report writes itself while you sleep.",
  },
];

export default function DemoAnimation() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {demos.map((d, i) => (
        <div
          key={i}
          className="group relative rounded-2xl overflow-hidden shadow-xl cursor-pointer"
          style={{ height: "420px" }}
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(null)}
        >
          {/* Photo */}
          <img
            src={d.image}
            alt={d.imageAlt}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-900/25 to-gray-900/10" />

          {/* Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              {d.badge}
            </span>
          </div>

          {/* Floating white card */}
          <div className="absolute top-14 left-4 right-4 z-10 bg-white rounded-xl p-4 shadow-2xl">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs font-bold text-gray-900">{d.overlayTitle}</p>
                <p className="text-xs text-gray-500 mt-0.5">{d.overlayDetail}</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                ✓ Done
              </span>
            </div>
            <div className="border-t border-gray-100 pt-2.5 mt-2 flex items-end gap-1.5">
              <span className="text-2xl font-black text-sky-600 leading-none">{d.stat}</span>
              <span className="text-xs text-gray-500 pb-0.5 leading-tight">{d.statUnit}</span>
            </div>
            <p className="text-xs text-sky-600 font-semibold mt-1.5">{d.highlight}</p>
          </div>

          {/* Bottom caption */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <p className="text-white/90 text-sm font-medium leading-snug">{d.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
