import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PAYABLES, DETAILS, SHOP, SHOP_NAME } from "@/lib/payables";
import { money } from "@/lib/catalog";
import BuyButton from "../BuyButton";

/**
 * flowzone.dev/buy/<id>: one shareable page per fixed-price service. Oct 9 2026.
 * Send the link, they see the product card, what is in it and the price, and
 * pay through Stripe. After paying they land on /paid and send the brief.
 */

export const dynamicParams = false;
export function generateStaticParams() {
  return SHOP.map((id) => ({ id }));
}

const C: Record<string, string> = { Builds: "#1E3A8A", Graphics: "#2B57C4", Web: "#0F6B4F", Video: "#8A5100", Plans: "#0C6E80" };

function find(id: string) {
  const p = PAYABLES.find((x) => x.id === id);
  const d = DETAILS[id];
  if (!p || !d || !SHOP.includes(id)) return null;
  return { p, d, name: SHOP_NAME[id], price: money(p.cents) };
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const f = find(params.id);
  if (!f) return {};
  const title = `${f.name}, ${f.price}${f.p.monthly ? "/mo" : ""}`;
  return {
    title,
    description: f.d.blurb,
    alternates: { canonical: `/buy/${params.id}` },
    openGraph: {
      siteName: "FlowZone",
      type: "website",
      title: `${title} | FlowZone`,
      description: f.d.blurb,
      url: `https://www.flowzone.dev/buy/${params.id}`,
      images: [{ url: `/pay/${params.id}.jpg`, width: 1200, height: 1200, alt: f.name }],
    },
    twitter: { card: "summary_large_image", images: [`/pay/${params.id}.jpg`] },
  };
}

export default function BuyPage({ params }: { params: { id: string } }) {
  const f = find(params.id);
  if (!f) notFound();
  const { p, d, name, price } = f;
  const per = p.monthly ? "a month" : p.from ? "to start" : "flat";
  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 px-4" style={{ background: "#F4F1EA" }}>
      <div className="max-w-5xl mx-auto">
        <a href="/buy" className="inline-block text-sm text-[#6B6558] hover:text-[#141821] mb-5">&larr; All services</a>
        <div className="grid md:grid-cols-2 overflow-hidden bg-white text-[#141821] border border-[#141821]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="md:border-r border-b md:border-b-0 border-[#141821] flex items-center" style={{ background: "#F4F1EA" }}>
            <img src={`/pay/${params.id}.jpg`} alt={`${name}, ${price}`} className="block w-full aspect-square object-cover" />
          </div>
          <div className="p-7 sm:p-10 flex flex-col">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] mb-3" style={{ color: C[d.group] }}>{d.group}</p>
            <h1 className="font-display text-[36px] sm:text-[44px] leading-[1.04] tracking-tight">{name}</h1>
            <p className="mt-3 text-[17px] leading-relaxed text-[#334155]">{d.blurb}</p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-[44px] leading-none tracking-tight" style={{ color: "#B03A12" }}>{price}</span>
              <span className="text-[#64748B]">{per}</span>
            </div>

            <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B] mb-3">What you get</p>
            <ul className="space-y-2.5">
              {d.includes.map((t) => (
                <li key={t} className="flex gap-2.5 text-[15px] leading-snug">
                  <svg className="mt-0.5 shrink-0" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3 3 7-7" /></svg>
                  {t}
                </li>
              ))}
              <li className="flex gap-2.5 text-[15px] leading-snug">
                <svg className="mt-0.5 shrink-0" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="#10B981" strokeWidth="1.8"><circle cx="8" cy="8" r="6.2" /><path d="M8 4.8V8l2.2 1.4" strokeLinecap="round" /></svg>
                <span><span className="font-medium">Turnaround:</span> {d.time}</span>
              </li>
            </ul>

            <div className="mt-auto pt-8">
              <BuyButton id={params.id} label={`Pay ${price}${p.monthly ? "/mo" : ""} and get started`} />
              <p className="flex items-center justify-center gap-2 text-xs text-[#64748B] mt-3">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" /></svg>
                Secure checkout by Stripe. You send the details right after paying.
              </p>
              <p className="text-center text-sm text-[#475569] mt-4">
                Need something different? <a href="/intake" className="text-[#0F6B4F] font-medium underline underline-offset-4">Start a ticket</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
