"use client";
import { useState } from "react";
import { startCheckout, PAY_ON } from "@/app/components/PayNow";

/** The big pay button on /buy/<id>. Falls back to a ticket if cards are off. */
export default function BuyButton({ id, label }: { id: string; label: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  if (!PAY_ON) {
    return (
      <a href="/intake?build=small" className="block w-full text-center rounded-[14px] px-6 py-4 text-lg font-semibold text-white" style={{ background: "#0F6B4F" }}>
        Start a ticket &rarr;
      </a>
    );
  }
  return (
    <>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setErr("");
          const r = await startCheckout([id]).catch(() => ({ ok: false as const, error: "" }));
          if (!r.ok) {
            setBusy(false);
            setErr("Checkout did not open. Try again, or start a ticket and we will send a pay link.");
          }
        }}
        className="paybtn w-full rounded-[14px] px-6 py-4 text-lg font-semibold flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-wait"
      >
        {busy ? "Opening secure checkout…" : (
          <>
            <span className="paybtn-tag">Save 10%</span>
            <span>{label}</span>
            <span aria-hidden className="paybtn-arrow">&rarr;</span>
          </>
        )}
      </button>
      {err && <p className="text-sm text-[#B03A12] mt-2">{err}</p>}
    </>
  );
}
