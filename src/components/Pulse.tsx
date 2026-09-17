"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * Pulse: FlowZone's own visit counter, plus the small cookie notice.
 *
 * Without a cookie it still counts page views, visible time on each page, how
 * far people scroll, and which links and buttons get pressed. Those are totals
 * only, tied to a random id that lives in this tab and dies with it.
 *
 * With the visitor's okay it sets one first-party cookie, fz_vid, so a second
 * visit on another day reads as returning. No ads, nothing shared or sold.
 * Global Privacy Control is honored as a no, and the notice never shows.
 *
 * Denny's own visits: open any page with ?notrack=1 once on each device
 * (?notrack=0 undoes it).
 *
 * The notice is rendered only while it is needed, so nothing sits in the page
 * at opacity 0 waiting on a class.
 */

const CONSENT = "fz_consent";
const VID = "fz_vid";
const YEAR = 365 * 24 * 60 * 60;

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}
function setCookie(name: string, value: string, maxAge = YEAR) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax; Secure`;
}
function rid() {
  try {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 20);
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}
function ss(key: string, value?: string) {
  try {
    if (value === undefined) return window.sessionStorage.getItem(key) || "";
    window.sessionStorage.setItem(key, value);
  } catch {
    /* blocked storage just means a fresh session each page */
  }
  return value || "";
}
function optedOut() {
  try {
    return window.localStorage.getItem("flowzone.notrack") === "1";
  } catch {
    return false;
  }
}
function gpc() {
  return Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);
}

function send(payload: Record<string, unknown>) {
  if (optedOut()) return;
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon && navigator.sendBeacon("/api/track", new Blob([body], { type: "text/plain" }))) return;
  } catch {
    /* fall through to fetch */
  }
  fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "text/plain" } }).catch(
    () => {}
  );
}

function labelFor(el: HTMLElement) {
  const tagged = el.closest<HTMLElement>("[data-track]")?.dataset.track;
  if (tagged) return tagged;
  const text = (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 48);
  const href = el instanceof HTMLAnchorElement ? el.getAttribute("href") || "" : "";
  if (href && /^https?:/i.test(href) && !href.includes("flowzone.dev")) {
    try {
      return `${text || "Link"} (to ${new URL(href).hostname.replace(/^www\./, "")})`;
    } catch {
      /* odd href, use the text */
    }
  }
  if (href.startsWith("mailto:")) return `${text || "Email"} (email)`;
  if (href && href.startsWith("/")) return `${text || href} (to ${href.split("?")[0]})`;
  return text || el.tagName.toLowerCase();
}

export default function Pulse() {
  const pathname = usePathname() || "/";
  const [ask, setAsk] = useState(false);
  const visitor = useRef<{ id: string; type: "new" | "returning" | "anon" }>({ id: "", type: "anon" });
  const page = useRef({ path: "", shownAt: 0, visibleMs: 0, depth: 0 });

  // One time setup: opt-out flag, consent state, visitor id, listeners.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("notrack");
    try {
      if (q === "1") window.localStorage.setItem("flowzone.notrack", "1");
      if (q === "0") window.localStorage.removeItem("flowzone.notrack");
    } catch {
      /* ignore */
    }

    const choice = getCookie(CONSENT);
    if (choice === "yes" && !gpc()) {
      const existing = getCookie(VID);
      const id = existing || rid();
      if (!existing) setCookie(VID, id);
      visitor.current = { id, type: existing ? "returning" : "new" };
    } else if (!choice && !gpc()) {
      setAsk(true);
    }

    const flushLeave = () => {
      const pg = page.current;
      if (!pg.path) return;
      if (pg.shownAt) pg.visibleMs += Date.now() - pg.shownAt;
      pg.shownAt = 0;
      if (pg.visibleMs >= 500) send({ t: "leave", p: pg.path, ms: pg.visibleMs, sd: pg.depth });
      pg.visibleMs = 0;
    };
    const onVis = () => {
      const pg = page.current;
      if (document.visibilityState === "hidden") {
        flushLeave();
      } else if (pg.path && !pg.shownAt) {
        pg.shownAt = Date.now();
      }
    };
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const d = h > 0 ? Math.round((window.scrollY / h) * 100) : 100;
      if (d > page.current.depth) page.current.depth = Math.min(100, d);
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [role=button], [data-track]");
      if (!el || el.closest("[data-pulse-ignore]")) return;
      send({ t: "click", p: window.location.pathname, l: labelFor(el) });
    };
    const onAsk = () => setAsk(true);

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", flushLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("fz:cookies", onAsk);
    (window as Window & { __fzPulseFlush?: () => void }).__fzPulseFlush = flushLeave;
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", flushLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("fz:cookies", onAsk);
    };
  }, []);

  // A view on every route change, and a leave for the page before it.
  useEffect(() => {
    const flush = (window as Window & { __fzPulseFlush?: () => void }).__fzPulseFlush;
    if (flush && page.current.path && page.current.path !== pathname) flush();
    if (page.current.path === pathname) return;

    let sid = ss("fz_sid");
    if (!sid) sid = ss("fz_sid", rid());
    const n = Number(ss("fz_n") || "0") + 1;
    ss("fz_n", String(n));
    if (n === 1) ss("fz_vt", visitor.current.type);

    const params = new URLSearchParams(window.location.search);
    send({
      t: "view",
      p: pathname,
      s: sid,
      v: visitor.current.id,
      vt: visitor.current.type,
      n,
      r: n === 1 ? document.referrer : "",
      utm: n === 1 ? params.get("utm_source") || params.get("ref") || "" : "",
      w: window.innerWidth,
    });
    page.current = { path: pathname, shownAt: document.visibilityState === "visible" ? Date.now() : 0, visibleMs: 0, depth: 0 };
    // Short pages count as fully read once they fit on screen.
    requestAnimationFrame(() => {
      if (document.documentElement.scrollHeight <= window.innerHeight + 4) page.current.depth = 100;
    });
  }, [pathname]);

  const decide = (yes: boolean) => {
    setCookie(CONSENT, yes ? "yes" : "no");
    if (yes) {
      const existing = getCookie(VID);
      const id = existing || rid();
      if (!existing) setCookie(VID, id);
      visitor.current = { id, type: existing ? "returning" : "new" };
      // This visit already counted as anonymous; move it to new.
      if (!existing && ss("fz_vt") === "anon") {
        ss("fz_vt", "new");
        send({ t: "consent", p: window.location.pathname, v: id });
      }
    } else {
      setCookie(VID, "", 0);
      visitor.current = { id: "", type: "anon" };
    }
    setAsk(false);
  };

  if (!ask) return null;
  return (
    <div
      data-pulse-ignore
      role="region"
      aria-label="Cookie notice"
      className="fixed z-[65] left-3 right-3 bottom-3 md:left-auto md:right-6 md:bottom-6 md:w-[380px] rounded-[20px] border border-white/[0.1] bg-[#101A2E] shadow-[0_18px_50px_rgba(0,0,0,0.45)] p-5 text-ink"
    >
      <p className="text-[15px] font-semibold mb-1.5">One cookie, if that is okay</p>
      <p className="text-[14px] leading-relaxed text-ink-soft">
        It lets us see when someone comes back so we know what is worth making. No ads, nothing sold.{" "}
        <Link href="/privacy#cookies" className="underline underline-offset-2 text-accent-light">
          Privacy
        </Link>
      </p>
      <div className="mt-4 flex gap-2.5">
        <button
          type="button"
          onClick={() => decide(true)}
          className="flex-1 rounded-full bg-accent hover:bg-accent-deep text-white text-[14px] font-semibold py-2.5 transition-colors"
        >
          Okay
        </button>
        <button
          type="button"
          onClick={() => decide(false)}
          className="flex-1 rounded-full border border-white/[0.14] hover:border-white/30 text-ink text-[14px] font-semibold py-2.5 transition-colors"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}
