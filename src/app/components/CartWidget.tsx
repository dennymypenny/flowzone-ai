"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { startCheckout, PAY_ON } from "@/app/components/PayNow";
import { cartPayId, payNowCents, PAY_NOW_OFF } from "@/lib/payables";
import {
  readCart,
  removeFromCart,
  clearCart,
  cartTotal,
  money,
  type CartItem,
} from "@/app/components/cart";

/** The nav cart: a count badge, and a slide-over with the items. */
export default function CartWidget() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener("fz-cart", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("fz-cart", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const [mounted, setMounted] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payErr, setPayErr] = useState("");
  // Card checkout only when every item has a fixed price. A build is quoted first.
  const canPay = PAY_ON && items.length > 0 && items.every((i) => cartPayId(i.id));
  const nowTotal = items.reduce((t, i) => t + payNowCents(i.price), 0);
  useEffect(() => setMounted(true), []);

  if (items.length === 0 && !open) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative p-2 text-ink hover:text-accent transition-colors"
        aria-label={`Cart, ${items.length} item${items.length === 1 ? "" : "s"}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.4 12.2a2 2 0 002 1.6h7.9a2 2 0 002-1.6L21 7H6" />
          <circle cx="9.5" cy="20" r="1.4" />
          <circle cx="17.5" cy="20" r="1.4" />
        </svg>
        {items.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-semibold inline-flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      {/* Portaled to body: the nav's backdrop-filter creates a containing
          block, which would clip a fixed overlay to the bar's height. */}
      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-sm bg-paper border-l border-rule p-6 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <p className="font-display text-2xl">Your cart</p>
              <button
                type="button"
                className="p-2 text-ink-soft hover:text-ink"
                onClick={() => setOpen(false)}
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-ink-soft font-light">
                Nothing in here yet. Add a build or a small job from any page.
              </p>
            ) : (
              <>
                <ul className="space-y-4 mb-6">
                  {items.map((i, idx) => (
                    <li key={`${i.id}-${idx}`} className="flex items-start justify-between gap-3 border-b border-rule pb-4">
                      <div>
                        <p className="text-sm text-ink font-light leading-snug">{i.name}</p>
                        <p className="text-sm text-ink-soft mt-1">
                          {i.from ? "from " : ""}
                          {money(i.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-ink-mute hover:text-ink text-sm p-1"
                        onClick={() => removeFromCart(idx)}
                        aria-label={`Remove ${i.name}`}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex items-baseline justify-between mb-6">
                  <p className="label">Total</p>
                  <p className="font-display text-3xl">
                    {items.some((i) => i.from) ? "from " : ""}
                    {money(cartTotal(items))}
                  </p>
                </div>
                {canPay && (
                  <div className="flex items-baseline justify-between -mt-4 mb-6">
                    <p className="text-sm font-semibold text-[#34D399]">Pay by card now, {PAY_NOW_OFF}% off</p>
                    <p className="font-display text-2xl text-[#34D399]">
                      <s className="text-base text-ink-mute mr-2">{money(cartTotal(items))}</s>
                      {money(nowTotal)}
                    </p>
                  </div>
                )}
                {canPay && (
                  <>
                    <button
                      type="button"
                      disabled={paying}
                      onClick={async () => {
                        setPaying(true);
                        setPayErr("");
                        const r = await startCheckout(items.map((i) => cartPayId(i.id))).catch(() => ({ ok: false as const, error: "Checkout did not open." }));
                        if (!r.ok) {
                          setPaying(false);
                          setPayErr(r.error || "Checkout did not open. Send it as a ticket instead.");
                        }
                      }}
                      className="paybtn w-full rounded-[12px] px-5 py-3.5 font-semibold mb-3 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-wait"
                    >
                      {paying ? "Opening checkout…" : (
                        <>
                          <span className="paybtn-tag">Save {PAY_NOW_OFF}%</span>
                          <span>{`Pay ${money(nowTotal)} now`}</span>
                          <span aria-hidden className="paybtn-arrow">→</span>
                        </>
                      )}
                    </button>
                    {payErr && <p className="text-xs text-[#B03A12] mb-3">{payErr}</p>}
                  </>
                )}
                <Link
                  href="/intake?cart=1"
                  className={`${canPay ? "btn-ghost" : "btn-primary"} w-full justify-center text-center`}
                  onClick={() => setOpen(false)}
                >
                  Send as a ticket <span className="arrow">→</span>
                </Link>
                <p className="text-xs text-ink-mute font-light leading-relaxed mt-4">
                  {canPay
                    ? "Pay by card through Stripe and send the details after, or send a ticket and pay once we reply."
                    : "No payment now. The ticket lands with a person, you get a reply and a start date, then you pay."}
                </p>
                <button
                  type="button"
                  className="text-xs text-ink-mute hover:text-ink mt-4 self-start"
                  onClick={() => clearCart()}
                >
                  Clear the cart
                </button>
              </>
            )}
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}
