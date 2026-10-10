"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { clearCart } from "@/app/components/cart";
import { SITE } from "@/lib/site";
import Tilt3D from "@/components/Tilt3D";

/**
 * Where Stripe sends people after they pay. Oct 9 2026.
 *
 * Same green receipt as the /intake thank you. It reads the session back from
 * /api/checkout so it can say what was paid. When the payment came from a
 * Pay now button there is no brief yet, so it asks for one right here and
 * files it as a ticket. Pay links from /studio/pay already have a brief, so
 * those just get the thank you.
 */

type Summary = { ok: boolean; paid?: boolean; amount?: number; monthly?: boolean; name?: string; email?: string; items?: string[]; what?: string };

const usd = (c: number) => `$${(c / 100).toLocaleString("en-US", { minimumFractionDigits: c % 100 ? 2 : 0 })}`;
const field =
  "w-full bg-white text-[#0C1424] placeholder-[#94A3B8] border border-[#CBD5E1] rounded-[11px] px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F6B4F] focus:ring-2 focus:ring-[#0F6B4F]/15";

function Paid() {
  const sp = useSearchParams();
  const id = sp.get("session_id") || "";
  const [s, setS] = useState<Summary | null>(null);
  const [me, setMe] = useState({ name: "", email: "", business: "" });
  const [brief, setBrief] = useState("");
  const [sent, setSent] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [openedAt] = useState(() => Date.now());

  useEffect(() => {
    clearCart();
    if (!id) {
      setS({ ok: false });
      return;
    }
    fetch(`/api/checkout?session_id=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((d: Summary) => {
        setS(d);
        if (d.ok) setMe((m) => ({ ...m, name: d.name || "", email: d.email || "" }));
      })
      .catch(() => setS({ ok: false }));
  }, [id]);

  const first = (s?.name || "").trim().split(/\s+/)[0];
  const fromButton = s?.ok && !s.what;
  const forWhat = s?.what || (s?.items || []).join(", ");

  const sendBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    setSent("sending");
    const res = await fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...me,
        business: me.business || me.name,
        service: "A Small Job",
        description: `PAID ${s?.amount ? usd(s.amount) : ""}${s?.monthly ? "/mo" : ""} by card for: ${forWhat}\n\n${brief}`,
        elapsedMs: Date.now() - openedAt,
      }),
    }).catch(() => null);
    setSent(res && res.ok ? "done" : "error");
  };

  return (
    <div className="fz-ty-page min-h-screen px-4 pt-28 pb-20 flex items-start sm:items-center justify-center">
      <Tilt3D className="max-w-xl w-full">
      <div className="fz-ty-card w-full rounded-[24px] bg-white text-[#0C1424] overflow-hidden">
        <div className="px-6 sm:px-10 pt-10 pb-8 text-center" style={{ background: "#ECFDF5" }}>
          <div className="relative mx-auto mb-6 h-20 w-20">
            <span aria-hidden className="fz-ty-burst">
              {Array.from({ length: 12 }).map((_, i) => (
                <i key={i} style={{ ["--a" as string]: `${i * 30}deg`, ["--c" as string]: ["#10B981", "#2B57C4", "#34D399", "#5B9BF9", "#0F6B4F", "#C6E4F8"][i % 6] }} />
              ))}
            </span>
            <span className="fz-ty-ring relative flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "#10B981" }}>
              <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path className="fz-ty-check" d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
          </div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] mb-3" style={{ color: "#0F6B4F" }}>
            {s?.ok && s.amount ? `Payment of ${usd(s.amount)}${s.monthly ? " a month" : ""} received` : "Payment received"}
          </p>
          <h1 className="font-display text-[34px] sm:text-[42px] leading-[1.05] tracking-tight">
            We are so glad you are here{first ? `, ${first}` : ""}.
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#334155] max-w-md mx-auto">
            <span className="font-semibold text-[#0F6B4F]">Thanks for believing in yourself and in us.</span> You are booked in
            {forWhat ? <> for <span className="text-[#0C1424] font-medium">{forWhat}</span></> : null}. Stripe is emailing your receipt now.
          </p>
        </div>

        <div className="px-6 sm:px-10 py-7">
          {fromButton && sent !== "done" ? (
            <form onSubmit={sendBrief} className="space-y-3">
              <p className="font-display text-xl">One last thing: what should we make?</p>
              <p className="text-sm text-[#475569] leading-relaxed">
                Tell us the words, links, colors or anything you have. Dennis starts as soon as this lands.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <input required aria-label="Your name" placeholder="Your name" className={field} value={me.name} onChange={(e) => setMe({ ...me, name: e.target.value })} />
                <input required type="email" aria-label="Email" placeholder="Email" className={field} value={me.email} onChange={(e) => setMe({ ...me, email: e.target.value })} />
                <input aria-label="Business name" placeholder="Business name" className={`${field} sm:col-span-2`} value={me.business} onChange={(e) => setMe({ ...me, business: e.target.value })} />
                <textarea required minLength={10} rows={4} aria-label="What to make" placeholder="What it is for, the text on it, any links or examples you like" className={`${field} sm:col-span-2 resize-none`} value={brief} onChange={(e) => setBrief(e.target.value)} />
              </div>
              {sent === "error" && (
                <p className="text-sm text-[#B03A12]">
                  That did not send. Email it to <a className="underline" href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Brief for my order: ${forWhat}`)}&body=${encodeURIComponent(brief)}`}>{SITE.email}</a> and we will pick it up.
                </p>
              )}
              <button type="submit" disabled={sent === "sending"} className="w-full rounded-[12px] px-5 py-3.5 font-semibold text-white disabled:opacity-70" style={{ background: "#0F6B4F" }}>
                {sent === "sending" ? "Sending…" : "Send it to Dennis →"}
              </button>
            </form>
          ) : (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B] mb-3">What happens next</p>
              <ol className="grid grid-cols-3 gap-2 mb-7">
                {[
                  { t: "Paid", d: "Just now", done: true },
                  { t: sent === "done" ? "Brief sent" : "Dennis starts", d: sent === "done" ? "Just now" : "Usually today", done: sent === "done" },
                  { t: "First look", d: "In your inbox", done: false },
                ].map((st, i) => (
                  <li key={st.t}>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-semibold mb-2"
                      style={st.done ? { background: "#10B981", color: "#fff" } : { background: "#F1F5F9", color: "#0F6B4F", boxShadow: "inset 0 0 0 1.5px #A7F3D0" }}>
                      {st.done ? "✓" : i + 1}
                    </span>
                    <p className="text-[14px] font-semibold leading-tight">{st.t}</p>
                    <p className="text-[12px] text-[#64748B] mt-0.5">{st.d}</p>
                  </li>
                ))}
              </ol>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/work" className="flex-1 text-center rounded-[12px] px-5 py-3.5 font-semibold text-white" style={{ background: "#0F6B4F" }}>
                  See what we have built &rarr;
                </a>
                <a href="/" className="flex-1 text-center rounded-[12px] px-5 py-3.5 font-semibold bg-[#F1F5F9]">Back to home</a>
              </div>
            </>
          )}
          <p className="text-xs text-[#64748B] mt-5 text-center">
            Questions about your order? <a href={`mailto:${SITE.email}`} className="text-[#0F6B4F] font-medium underline underline-offset-4">{SITE.email}</a>
          </p>
        </div>
      </div>
      </Tilt3D>
    </div>
  );
}

export default function PaidPage() {
  return (
    <Suspense fallback={<div className="fz-ty-page min-h-screen" />}>
      <Paid />
    </Suspense>
  );
}
