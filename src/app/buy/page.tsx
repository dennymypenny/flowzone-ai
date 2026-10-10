import type { Metadata } from "next";
import { PAYABLES, DETAILS, SHOP, SHOP_NAME } from "@/lib/payables";
import { money } from "@/lib/catalog";

/** flowzone.dev/buy: every fixed-price service, each linking to its own page. */
export const metadata: Metadata = {
  title: "Buy a service",
  description: "Graphics, ads, video and web jobs at flat prices. Pick one, pay by card, send the details.",
  alternates: { canonical: "/buy" },
};

const GROUPS = ["Graphics", "Video", "Web", "Plans"] as const;

export default function BuyIndex() {
  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 px-4" style={{ background: "#F4F1EA" }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-4xl sm:text-5xl text-[#141821] tracking-tight">Flat price, start today</h1>
        <p className="text-[#3D3A33] mt-3 max-w-xl leading-relaxed">Pick a service, pay by card and send the details. A person starts on it, usually the same day.</p>
        {GROUPS.map((g) => (
          <section key={g} className="mt-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6B6558] mb-4 border-b border-[#141821] pb-2">{g}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {SHOP.filter((id) => DETAILS[id].group === g).map((id) => {
                const p = PAYABLES.find((x) => x.id === id)!;
                return (
                  <a key={id} href={`/buy/${id}`} className="group block overflow-hidden bg-white text-[#141821] border border-[#141821] transition-transform hover:-translate-y-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/pay/${id}.jpg`} alt="" loading="lazy" className="block w-full aspect-square object-cover" />
                    <div className="p-4">
                      <p className="font-semibold leading-tight">{SHOP_NAME[id]}</p>
                      <p className="text-sm text-[#64748B] mt-1">
                        <span className="font-semibold text-[#B03A12]">{money(p.cents)}{p.monthly ? "/mo" : ""}</span> · {DETAILS[id].time}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
