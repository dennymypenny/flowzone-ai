"use client";
import { useRef, useState } from "react";

const demos = [
  {
    badge: "Lead Automation",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&q=80",
    imageAlt: "Business professional responding to clients",
    video: "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-close-up-2-3004-large.mp4",
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
    video: "https://assets.mixkit.co/videos/preview/mixkit-man-types-on-a-laptop-in-an-office-2-7457-large.mp4",
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
    video: "https://assets.mixkit.co/videos/preview/mixkit-business-team-working-in-an-office-4-4178-large.mp4",
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

function DemoCard({ demo }: { demo: typeof demos[0] }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      className="group relative rounded-2xl overflow-hidden shadow-xl cursor-pointer"
      style={{ height: "420px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Static background photo — always present */}
      <img
        src={demo.image}
        alt={demo.imageAlt}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: hovered ? 0 : 1 }}
      />

      {/* Video — loads silently, fades in on hover */}
      <video
        ref={videoRef}
        src={demo.video}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: hovered ? 1 : 0 }}
      />

      {/* Gradient overlay — always on top of whichever media is showing */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-900/25 to-gray-900/10 z-10" />

      {/* Badge */}
      <div className="absolute top-4 left-4 z-20">
        <span className="inline-flex items-center gap-1.5 bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          {demo.badge}
        </span>
      </div>

      {/* Play hint — visible before hover */}
      <div
        className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-full transition-opacity duration-300"
        style={{ opacity: hovered ? 0 : 1 }}
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        Preview
      </div>

      {/* Floating white stats card */}
      <div className="absolute top-14 left-4 right-4 z-20 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs font-bold text-gray-900">{demo.overlayTitle}</p>
            <p className="text-xs text-gray-500 mt-0.5">{demo.overlayDetail}</p>
          </div>
          <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
            ✓ Done
          </span>
        </div>
        <div className="border-t border-gray-100 pt-2.5 mt-2 flex items-end gap-1.5">
          <span className="text-2xl font-black text-sky-600 leading-none">{demo.stat}</span>
          <span className="text-xs text-gray-500 pb-0.5 leading-tight">{demo.statUnit}</span>
        </div>
        <p className="text-xs text-sky-600 font-semibold mt-1.5">{demo.highlight}</p>
      </div>

      {/* Bottom caption */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
        <p className="text-white/90 text-sm font-medium leading-snug">{demo.caption}</p>
      </div>
    </div>
  );
}

export default function DemoAnimation() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {demos.map((demo, i) => (
        <DemoCard key={i} demo={demo} />
      ))}
    </div>
  );
}
