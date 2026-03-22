"use client";
import { useEffect, useState } from "react";

type Step = {
  label: string;
  detail?: string;
};

type DemoCardProps = {
  badge: string;
  trigger: string;
  triggerSub: string;
  steps: Step[];
  result: string;
  saving: string;
  color?: string;
};

function StepDot({ state }: { state: "pending" | "active" | "done" }) {
  if (state === "done") {
    return (
      <div className="w-7 h-7 rounded-full bg-green-900 border-2 border-green-500 flex items-center justify-center flex-shrink-0 transition-all duration-300">
        <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className="w-7 h-7 rounded-full bg-sky-900 border-2 border-sky-400 flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-[0_0_10px_rgba(96,165,250,0.5)]">
        <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-600 flex-shrink-0 transition-all duration-300" />
  );
}

function DemoCard({ badge, trigger, triggerSub, steps, result, saving }: DemoCardProps) {
  const [phase, setPhase] = useState(-1);

  useEffect(() => {
    // phase: -1=waiting, 0..N-1=step active, N=result, N+1=hold, then reset
    const total = steps.length + 2;
    const timings = [800, ...steps.map(() => 1400), 2000, 600];
    let current = -1;

    function advance() {
      current = (current + 1) % total;
      setPhase(current);
      const delay = timings[current + 1] ?? 600;
      setTimeout(advance, delay);
    }

    const init = setTimeout(advance, 900);
    return () => clearTimeout(init);
  }, [steps.length]);

  const getStepState = (i: number): "pending" | "active" | "done" => {
    if (phase < 0) return "pending";
    if (phase > i) return "done";
    if (phase === i) return "active";
    return "pending";
  };

  const showResult = phase >= steps.length;

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
      {/* Top bar */}
      <div className="bg-slate-900 border-b border-slate-700 px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 block" />
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 block" />
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 block" />
        </div>
        <span className="text-slate-200 text-xs font-bold ml-1">FlowZone <span className="text-sky-400">AI</span></span>
        <span className="ml-auto text-[10px] font-bold text-sky-400 bg-sky-950 border border-sky-800 px-2 py-0.5 rounded-full">● {badge}</span>
      </div>

      {/* Body */}
      <div className="bg-slate-950 p-5 min-h-[260px]">
        {/* Trigger */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-3 mb-5">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wide mb-1">⚡ Trigger</div>
          <div className="text-slate-100 text-sm font-bold">{trigger}</div>
          <div className="text-slate-400 text-xs mt-0.5">{triggerSub}</div>
        </div>

        {/* Steps */}
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <StepDot state={getStepState(i)} />
                {i < steps.length - 1 && (
                  <div className={`w-0.5 h-5 mt-0.5 transition-colors duration-500 ${phase > i ? "bg-sky-500" : "bg-slate-700"}`} />
                )}
              </div>
              <div className="pb-4 flex-1">
                <div className={`text-xs font-semibold transition-colors duration-300 ${
                  getStepState(i) === "done" ? "text-green-400" :
                  getStepState(i) === "active" ? "text-sky-300" : "text-slate-500"
                }`}>
                  {step.label}
                </div>
                {step.detail && getStepState(i) !== "pending" && (
                  <div className="text-[11px] text-slate-400 mt-1 bg-slate-800 rounded-lg px-3 py-2 border border-slate-700">
                    {step.detail}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Result */}
        <div className={`transition-all duration-500 ${showResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <div className="bg-green-950 border border-green-800 rounded-xl p-3 flex items-start gap-2.5">
            <div className="text-green-400 text-base mt-0.5">✓</div>
            <div>
              <div className="text-green-300 text-sm font-bold">{result}</div>
              <div className="text-sky-400 text-xs font-semibold mt-0.5">{saving}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemoAnimation() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <DemoCard
        badge="Lead Automation"
        trigger="New Lead: Alex Johnson"
        triggerSub="acmecorp.com · via Contact Form · just now"
        steps={[
          { label: "Lead detected & enriched" },
          { label: "Personalizing follow-up email", detail: "To: alex@acmecorp.com · Re: Acme Corp's workflow" },
          { label: "Email sent automatically" },
        ]}
        result="Replied in 1.8 seconds"
        saving="Saves 3+ hrs/day"
      />
      <DemoCard
        badge="Invoice Automation"
        trigger="Job Complete: SEO Campaign"
        triggerSub="Client: NexaGroup · $2,800 · marked done"
        steps={[
          { label: "Job completion detected" },
          { label: "Invoice auto-generated", detail: "#INV-2024-089 · To: billing@nexagroup.co · $2,800" },
          { label: "Invoice sent & tracked" },
        ]}
        result="$2,800 invoice sent in 3 seconds"
        saving="Saves 5+ hrs/week"
      />
      <DemoCard
        badge="Report Automation"
        trigger="Monday 9:00 AM — Weekly Trigger"
        triggerSub="Pulling from 5 data sources"
        steps={[
          { label: "Pulling Analytics, CRM & Stripe data" },
          { label: "Compiling weekly summary report", detail: "Revenue ↑18% · Leads ↑12% · Visits ↑9%" },
          { label: "Report delivered to inbox" },
        ]}
        result="Report delivered — 0 manual work"
        saving="Saves 2+ hrs/week"
      />
    </div>
  );
}
