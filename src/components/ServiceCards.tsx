"use client";
import { useRef, useState } from "react";
import Link from "next/link";

const services = [
  {
    icon: "📩",
    title: "Lead Follow-Up",
    description: "Auto-respond to new leads via email, SMS, or DMs within seconds of sign-up.",
    video: "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-close-up-2-3004-large.mp4",
    color: "from-sky-600/80",
  },
  {
    icon: "🧾",
    title: "Invoicing & Billing",
    description: "Generate, send, and track invoices automatically. Get paid faster with zero manual work.",
    video: "https://assets.mixkit.co/videos/preview/mixkit-man-types-on-a-laptop-in-an-office-2-7457-large.mp4",
    color: "from-emerald-600/80",
  },
  {
    icon: "📅",
    title: "Appointment Scheduling",
    description: "Sync calendars, send reminders, and handle rescheduling — all on autopilot.",
    video: "https://assets.mixkit.co/videos/preview/mixkit-business-woman-taking-notes-in-a-meeting-8-16023-large.mp4",
    color: "from-violet-600/80",
  },
  {
    icon: "📊",
    title: "Reporting & Analytics",
    description: "Pull data from any tool and deliver clean weekly summaries direct to your inbox.",
    video: "https://assets.mixkit.co/videos/preview/mixkit-business-team-working-in-an-office-4-4178-large.mp4",
    color: "from-orange-600/80",
  },
  {
    icon: "🤝",
    title: "Client Onboarding",
    description: "Send welcome sequences, collect documents, and set up new clients in minutes.",
    video: "https://assets.mixkit.co/videos/preview/mixkit-two-people-shaking-hands-at-a-business-meeting-2-4177-large.mp4",
    color: "from-pink-600/80",
  },
  {
    icon: "🔁",
    title: "Data Entry & Sync",
    description: "Eliminate copy-paste between your CRM, spreadsheets, and other platforms forever.",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-laptop-and-discussing-work-with-a-colleague-4190-large.mp4",
    color: "from-sky-700/80",
  },
];

function ServiceCard({ s }: { s: typeof services[0] }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnter = () => {
    setHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    setHovered(false);
    if (videoRef.current) videoRef.current.pause();
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{ height: "260px" }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Default state: light card */}
      <div
        className="absolute inset-0 bg-gray-50 border border-gray-100 rounded-2xl transition-opacity duration-500"
        style={{ opacity: hovered ? 0 : 1 }}
      />

      {/* Video background */}
      <video
        ref={videoRef}
        src={s.video}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: hovered ? 1 : 0 }}
      />

      {/* Gradient overlay on video */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${s.color} to-gray-900/70 transition-opacity duration-500`}
        style={{ opacity: hovered ? 1 : 0 }}
      />

      {/* Content */}
      <div className="absolute inset-0 p-7 flex flex-col justify-between z-10">
        <div>
          <span
            className="text-3xl mb-4 block transition-all duration-300"
            style={{ filter: hovered ? "brightness(0) invert(1)" : "none" }}
          >
            {s.icon}
          </span>
          <h3
            className="font-bold text-lg mb-2 transition-colors duration-300"
            style={{ color: hovered ? "white" : "#111827" }}
          >
            {s.title}
          </h3>
          <p
            className="text-sm leading-relaxed transition-colors duration-300"
            style={{ color: hovered ? "rgba(255,255,255,0.85)" : "#6b7280" }}
          >
            {s.description}
          </p>
        </div>
        <div
          className="transition-all duration-300"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)" }}
        >
          <Link
            href="/intake"
            className="inline-flex items-center gap-1.5 text-white text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors"
          >
            Automate this &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ServiceCards() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sky-600 font-semibold text-sm uppercase tracking-wider mb-3">Our Services</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">What We Automate</h2>
          <p className="text-gray-500 text-lg">If your team does it manually more than once a week, we can automate it.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <ServiceCard key={i} s={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
