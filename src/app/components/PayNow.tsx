"use client";
import { useState } from "react";
import { addToCart } from "@/app/components/cart";
import { CATALOG } from "@/lib/catalog";

/**
 * "Pay now": straight to Stripe Checkout for one or more fixed-price items.
 * Oct 9 2026. Sends ids only, the server prices them (lib/payables.ts).
 *
 * If cards are not switched on yet, or Stripe says no, nothing dead-ends: the
 * items go in the cart and the visitor lands on the ticket with them.
 */
/** True once STRIPE_SECRET_KEY was set at build time (see next.config.js). */
export const PAY_ON = process.env.NEXT_PUBLIC_PAY_ON === "1";

export async function startCheckout(items: string[], extra: { email?: string; ticket?: string } = {}) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, back: window.location.pathname, ...extra }),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; fallback?: string; error?: string };
  if (data.ok && data.url) {
    window.location.href = data.url;
    return { ok: true as const };
  }
  return { ok: false as const, fallback: data.fallback, error: data.error || "Checkout did not open." };
}

export default function PayNow({
  items,
  label = "Pay now",
  className = "",
  dark = false,
}: {
  items: string[];
  label?: string;
  className?: string;
  dark?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  if (!PAY_ON) return null;
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setBusy(true);
        const r = await startCheckout(items).catch(() => ({ ok: false as const, fallback: "/intake?cart=1" }));
        if (!r.ok) {
          items.forEach((id) => {
            const c = CATALOG.find((x) => x.id === id);
            if (c) addToCart(c);
          });
          window.location.href = r.fallback || "/intake?cart=1";
        }
      }}
      className={`paybtn inline-flex items-center gap-1.5 text-sm font-semibold rounded-[11px] px-3.5 py-1.5 disabled:opacity-70 disabled:cursor-wait ${className}`}
    >
      {busy ? "Opening…" : (
        <>
          {label}
          <span aria-hidden className="paybtn-arrow">&rarr;</span>
        </>
      )}
    </button>
  );
}
