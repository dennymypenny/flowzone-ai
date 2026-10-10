"use client";
import { useCallback, useEffect, useState } from "react";
import { SHOP, SHOP_NAME, PAYABLES } from "@/lib/payables";
import { money } from "@/lib/catalog";

/**
 * flowzone.dev/studio/pay, Denny's pay link maker. Oct 9 2026.
 *
 * Agree a price with a client, type it here, get a Stripe link to text or
 * email them. Each link takes one payment and lands them on /paid. Locked by
 * PAY_KEY (Vercel env), typed once and remembered in this browser only.
 * Not linked from anywhere, not indexed (robots + noindex).
 */

type Link = { id: string; url: string; active: boolean; client: string; what: string; amount: number; monthly: boolean };

const KEY = "fz-pay-key";

/** One tap fills in the build and its usual price. The checkout shows that build's card. */
const PRESETS = [
  { kind: "site", what: "Website build", amount: "500", label: "Site Build", c: "#5B9BF9" },
  { kind: "identity", what: "Brand identity build", amount: "500", label: "Identity Build", c: "#4C7BE8" },
  { kind: "engine", what: "Systems build", amount: "500", label: "Engine Build", c: "#34D399" },
  { kind: "full", what: "Brand, site and system build", amount: "1500", label: "Full Build", c: "#5B8CFF" },
  { kind: "storefront", what: "Online store build", amount: "2500", label: "Storefront Build", c: "#F0845F" },
  { kind: "", what: "", amount: "", label: "Custom", c: "#93A2BC" },
];

const EMPTY = { client: "", what: "", amount: "", email: "", ticket: "", monthly: false, kind: "" };
const usd = (c: number) => `$${(c / 100).toLocaleString("en-US", { minimumFractionDigits: c % 100 ? 2 : 0 })}`;
const field =
  "w-full bg-[#10141D] text-white placeholder-[#6B7890] border border-white/10 rounded-[11px] px-4 py-3 text-[15px] focus:outline-none focus:border-white focus:ring-2 focus:ring-white/15";

export default function StudioPay() {
  const [key, setKey] = useState("");
  const [keyDraft, setKeyDraft] = useState("");
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [made, setMade] = useState<{ url: string; client: string; what: string; amount: string; monthly: boolean } | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    try {
      setKey(localStorage.getItem(KEY) || "");
    } catch {
      /* fine, ask every time */
    }
  }, []);

  const call = useCallback(
    async (method: string, body?: unknown) => {
      const res = await fetch("/api/pay-link", {
        method,
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        try {
          localStorage.removeItem(KEY);
        } catch {}
        setKey("");
      }
      return data as { ok?: boolean; error?: string; url?: string; links?: Link[] };
    },
    [key]
  );

  const load = useCallback(async () => {
    if (!key) return;
    const d = await call("GET");
    if (d.ok && d.links) setLinks(d.links);
    else if (d.error) setErr(d.error);
  }, [key, call]);

  useEffect(() => {
    load();
  }, [load]);

  const copy = async (text: string, tag: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(tag);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* the link is on screen, they can select it */
    }
  };

  if (!key) {
    return (
      <div className="min-h-screen bg-paper-deep pt-32 px-4">
        <form
          className="max-w-sm mx-auto rounded-[20px] border border-white/10 p-7 space-y-4"
          style={{ background: "#07090F" }}
          onSubmit={(e) => {
            e.preventDefault();
            const k = keyDraft.trim();
            if (!k) return;
            try {
              localStorage.setItem(KEY, k);
            } catch {}
            setKey(k);
          }}
        >
          <h1 className="font-display text-2xl text-white">Pay links</h1>
          <p className="text-sm text-[#9AA7BD]">Studio only. Type the studio key (PAY_KEY in Vercel).</p>
          <input type="password" autoComplete="current-password" className={field} placeholder="Studio key" value={keyDraft} onChange={(e) => setKeyDraft(e.target.value)} />
          <button className="fz-go w-full rounded-[12px] font-semibold py-3">Open</button>
        </form>
      </div>
    );
  }

  // Full client name: "Control Theory", not "Control". Most clients are businesses.
  const first = made?.client.trim();
  const message = made
    ? `Hi${first ? ` ${first}` : ""}, here is your secure payment link for ${made.what} (${made.amount}${made.monthly ? " a month" : ""}): ${made.url}\n\nOnce it goes through we get started. Thank you for believing in yourself and in us!`
    : "";

  return (
    <div className="min-h-screen bg-paper-deep pt-24 sm:pt-28 pb-24 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_380px] gap-5">
        <form
          className="rounded-[24px] border border-white/10 p-6 sm:p-8 space-y-4"
          style={{ background: "#07090F" }}
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setErr("");
            const d = await call("POST", { ...f, amount: f.amount });
            setBusy(false);
            if (d.ok && d.url) {
              setMade({ url: d.url, client: f.client, what: f.what, amount: `$${Number(f.amount.replace(/[$,\s]/g, "")).toLocaleString("en-US", { minimumFractionDigits: f.amount.includes(".") ? 2 : 0 })}`, monthly: f.monthly });
              setF(EMPTY);
              load();
            } else setErr(d.error || "That did not work.");
          }}
        >
          <div>
            <h1 className="font-display text-3xl text-white tracking-tight">Make a pay link</h1>
            <p className="text-[#9AA7BD] mt-1 text-sm">Agreed a price? Type it in, send them the link. One payment per link.</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8190A8] mb-2">What are they paying for?</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => {
                const on = f.kind === p.kind;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setF({ ...f, kind: p.kind, what: p.what || (PRESETS.some((x) => x.what === f.what) ? "" : f.what), amount: p.amount || f.amount })}
                    className="inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-sm font-medium border transition-colors"
                    style={on ? { background: "#FFFFFF", color: "#0C1424", borderColor: "#FFFFFF" } : { background: "#10141D", color: "#E2E8F0", borderColor: "rgba(255,255,255,0.1)" }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: p.c }} />
                    {p.label}
                    {p.amount && <span className={on ? "text-[#475569]" : "text-[#8190A8]"}>${Number(p.amount).toLocaleString("en-US")}</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input className={field} placeholder="Client name" value={f.client} onChange={(e) => setF({ ...f, client: e.target.value })} />
            <input className={field} placeholder="Ticket (optional), FZ-1234" value={f.ticket} onChange={(e) => setF({ ...f, ticket: e.target.value })} />
            <input required className={`${field} sm:col-span-2`} placeholder="What it is for, e.g. Logo and website" value={f.what} onChange={(e) => setF({ ...f, what: e.target.value })} />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">$</span>
              <input required inputMode="decimal" className={`${field} pl-8 text-lg font-semibold`} placeholder="Amount" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} />
            </div>
            <input type="email" className={field} placeholder="Their email (optional)" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm text-[#C9D2E3] cursor-pointer select-none">
            <input type="checkbox" className="accent-white" checked={f.monthly} onChange={(e) => setF({ ...f, monthly: e.target.checked })} />
            Charge this every month (care, retainers, monthly graphics)
          </label>
          {err && <p className="text-sm text-[#F0845F]">{err}</p>}
          <button disabled={busy} className="fz-go w-full rounded-[12px] font-semibold py-4 text-base">
            {busy ? "Making the link…" : "Make the link →"}
          </button>

          {made && (
            <div className="fz-settle rounded-[16px] p-5 mt-2" style={{ background: "#ECFDF5" }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0F6B4F] mb-2">Link ready</p>
              <p className="font-display text-xl text-[#0C1424] mb-1">
                {made.amount}{made.monthly ? "/mo" : ""} for {made.what}
              </p>
              <p className="text-sm text-[#2B57C4] break-all mb-4">{made.url}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => copy(made.url, "url")} className="rounded-[10px] px-4 py-2.5 text-sm font-semibold text-white" style={{ background: "#0F6B4F" }}>
                  {copied === "url" ? "Copied" : "Copy link"}
                </button>
                <button type="button" onClick={() => copy(message, "msg")} className="rounded-[10px] px-4 py-2.5 text-sm font-semibold bg-white text-[#0C1424] border border-[#CBD5E1]">
                  {copied === "msg" ? "Copied" : "Copy message"}
                </button>
                <a href={`sms:?&body=${encodeURIComponent(message)}`} className="rounded-[10px] px-4 py-2.5 text-sm font-semibold bg-white text-[#0C1424] border border-[#CBD5E1]">Text it</a>
                <a href={`mailto:?subject=${encodeURIComponent(`Your FlowZone payment link: ${made.what}`)}&body=${encodeURIComponent(message)}`} className="rounded-[10px] px-4 py-2.5 text-sm font-semibold bg-white text-[#0C1424] border border-[#CBD5E1]">Email it</a>
              </div>
            </div>
          )}
        </form>

        <aside className="rounded-[24px] border border-white/10 p-5" style={{ background: "#0A0D14" }}>
          <div className="flex items-baseline mb-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8190A8]">Recent links</p>
            <button type="button" onClick={load} className="ml-auto text-xs text-white underline underline-offset-4">Refresh</button>
          </div>
          {links.length === 0 ? (
            <p className="text-sm text-[#6B7890]">Links you make show up here.</p>
          ) : (
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.id} className="rounded-[12px] border border-white/[0.07] p-3" style={{ background: "#10141D", opacity: l.active ? 1 : 0.55 }}>
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-semibold text-white truncate">{l.client || "No name"}</p>
                    <p className="ml-auto text-sm font-semibold text-[#F0845F] shrink-0">{usd(l.amount)}{l.monthly ? "/mo" : ""}</p>
                  </div>
                  <p className="text-xs text-[#9AA7BD] truncate">{l.what}</p>
                  <div className="flex gap-3 mt-2 text-xs">
                    <button type="button" onClick={() => copy(l.url, l.id)} className="text-white underline underline-offset-4">{copied === l.id ? "Copied" : "Copy"}</button>
                    {l.active ? (
                      <button type="button" onClick={async () => { await call("PATCH", { id: l.id, active: false }); load(); }} className="text-[#9AA7BD] underline underline-offset-4">Turn off</button>
                    ) : (
                      <span className="text-[#6B7890]">Off or paid</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8190A8] mb-1">Service links</p>
            <p className="text-xs text-[#6B7890] mb-3">Flat-price pages anyone can buy from. Copy and send.</p>
            <ul className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
              {SHOP.map((id) => {
                const p = PAYABLES.find((x) => x.id === id)!;
                const url = `https://www.flowzone.dev/buy/${id}`;
                return (
                  <li key={id} className="flex items-center gap-2 text-sm">
                    <a href={`/buy/${id}`} target="_blank" rel="noreferrer" className="text-white truncate hover:underline">{SHOP_NAME[id]}</a>
                    <span className="text-[#F0845F] text-xs shrink-0">{money(p.cents)}{p.monthly ? "/mo" : ""}</span>
                    <button type="button" onClick={() => copy(url, `svc-${id}`)} className="ml-auto text-xs text-[#9AA7BD] underline underline-offset-4 shrink-0">
                      {copied === `svc-${id}` ? "Copied" : "Copy"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <button
            type="button"
            onClick={() => {
              try { localStorage.removeItem(KEY); } catch {}
              setKey("");
            }}
            className="mt-5 text-xs text-[#6B7890] underline underline-offset-4"
          >
            Lock this browser
          </button>
        </aside>
      </div>
    </div>
  );
}
