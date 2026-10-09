"use client";
import { useState } from "react";
import { startCheckout } from "@/app/components/PayNow";

/**
 * On the /intake thank you, when the ticket is only fixed-price small jobs:
 * pay now and the work starts without waiting on a reply. Oct 9 2026.
 * Optional. If checkout will not open, it says so and the ticket still stands.
 */
export default function PayAfterTicket({ ids, email, ticket, total }: { ids: string[]; email: string; ticket: string; total: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <div className="mt-6 rounded-[16px] p-5 border" style={{ background: "#ECFDF5", borderColor: "#A7F3D0" }}>
      <p className="font-display text-lg leading-tight text-[#0C1424]">Want it started today?</p>
      <p className="text-sm text-[#334155] mt-1 mb-4">Pay now by card and Dennis starts on it right away. Or wait for the reply, either way works.</p>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setErr("");
          const r = await startCheckout(ids, { email, ticket }).catch(() => ({ ok: false as const, error: "Checkout did not open." }));
          if (!r.ok) {
            setBusy(false);
            setErr("Checkout did not open. No problem, your ticket is in and we will send a pay link.");
          }
        }}
        className="w-full rounded-[12px] px-5 py-3.5 font-semibold text-white disabled:opacity-70 disabled:cursor-wait"
        style={{ background: "#0F6B4F" }}
      >
        {busy ? "Opening checkout…" : `Pay ${total} now`} <span aria-hidden>&rarr;</span>
      </button>
      {err && <p className="text-xs text-[#B03A12] mt-2">{err}</p>}
      <p className="text-[11px] text-[#64748B] mt-2 text-center">Secure checkout by Stripe</p>
    </div>
  );
}
