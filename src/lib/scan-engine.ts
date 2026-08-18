/**
 * The scan engine behind /scan.
 *
 * Somebody pastes a link, this fetches the page once, reads the HTML the way
 * a crawler and a phone would, and grades it against the basics: mobile
 * viewport, speed, weight, SEO tags, headings, alt text, a visible ask.
 *
 * House rules:
 * - One fetch, mobile user agent, hard timeout, 2MB cap. No headless browser,
 *   no third party API, no per-scan cost.
 * - Every verdict is a measured fact. Nothing here guesses or generates.
 * - Never fetch anything private. The SSRF guard below resolves DNS and
 *   refuses loopback, RFC1918 and link-local before a single byte moves.
 */

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export type CheckStatus = "pass" | "warn" | "fail";

export type Check = {
  id: string;
  label: string;
  status: CheckStatus;
  points: number;
  max: number;
  /** One blunt sentence about what was measured. Shown to the visitor. */
  detail: string;
};

export type Category = {
  id: string;
  name: string;
  score: number;
  max: number;
  checks: Check[];
};

export type ScanReport = {
  url: string;
  finalUrl: string;
  host: string;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  verdict: string;
  ttfbMs: number;
  totalMs: number;
  htmlKb: number;
  categories: Category[];
  /** The worst findings, worst first. Fuel for the teaser and the email. */
  topFixes: string[];
};

export class ScanError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

/* ------------------------------------------------------------------ */
/* URL safety                                                          */
/* ------------------------------------------------------------------ */

const PRIVATE_V4 = [
  /^127\./, /^10\./, /^192\.168\./, /^169\.254\./, /^0\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
];

function ipIsPrivate(ip: string): boolean {
  if (isIP(ip) === 4) return PRIVATE_V4.some((re) => re.test(ip));
  const v6 = ip.toLowerCase();
  return (
    v6 === "::1" || v6 === "::" ||
    v6.startsWith("fc") || v6.startsWith("fd") || v6.startsWith("fe80") ||
    // v4 mapped
    (v6.startsWith("::ffff:") && ipIsPrivate(v6.slice(7)))
  );
}

export async function normalizeTarget(raw: string): Promise<URL> {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) throw new ScanError("Paste a link first.");
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    throw new ScanError("That does not look like a web address.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new ScanError("Only http and https links can be scanned.");
  }
  if (url.port && url.port !== "80" && url.port !== "443") {
    throw new ScanError("Links with custom ports cannot be scanned.");
  }
  const host = url.hostname.toLowerCase();
  if (
    host === "localhost" || !host.includes(".") ||
    host.endsWith(".local") || host.endsWith(".internal") || host.endsWith(".lan")
  ) {
    throw new ScanError("That address is not reachable from the public internet.");
  }
  if (isIP(host)) {
    if (ipIsPrivate(host)) throw new ScanError("That address is not reachable from the public internet.");
  } else {
    let addrs;
    try {
      addrs = await lookup(host, { all: true });
    } catch {
      throw new ScanError("That domain does not resolve. Check the spelling.");
    }
    if (addrs.some((a) => ipIsPrivate(a.address))) {
      throw new ScanError("That address is not reachable from the public internet.");
    }
  }
  return url;
}

/* ------------------------------------------------------------------ */
/* Fetch                                                               */
/* ------------------------------------------------------------------ */

const MOBILE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1 FlowZoneScan/1.0";

const MAX_BYTES = 2 * 1024 * 1024;

async function fetchPage(url: URL) {
  const started = Date.now();
  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        "User-Agent": MOBILE_UA,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5",
        "Accept-Language": "en-US,en;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
  } catch (e) {
    const msg = e instanceof Error && e.name === "TimeoutError"
      ? "The site took longer than 15 seconds to answer. That alone is a finding."
      : "The site refused the connection. If it only answers over plain http, that is finding number one.";
    throw new ScanError(msg, 422);
  }
  const ttfbMs = Date.now() - started;
  if (!res.ok) {
    throw new ScanError(`The site answered with an error (HTTP ${res.status}). Fix that before anything on this list.`, 422);
  }
  const type = res.headers.get("content-type") || "";
  if (!type.includes("html")) {
    throw new ScanError("That link is not a web page. Paste the address of a page, usually the homepage.", 422);
  }

  // Read at most 2MB so a huge page cannot hold the scan hostage.
  const reader = res.body?.getReader();
  let html = "";
  let bytes = 0;
  if (reader) {
    const decoder = new TextDecoder("utf-8", { fatal: false });
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (bytes >= MAX_BYTES) { reader.cancel().catch(() => {}); break; }
    }
  } else {
    html = await res.text();
    bytes = Buffer.byteLength(html);
  }
  const totalMs = Date.now() - started;
  return { html, bytes, ttfbMs, totalMs, finalUrl: res.url || url.href };
}

/* ------------------------------------------------------------------ */
/* HTML reading helpers (regex on one document, no DOM dependency)     */
/* ------------------------------------------------------------------ */

const stripComments = (h: string) => h.replace(/<!--[\s\S]*?-->/g, "");

function metaContent(html: string, name: string, attr = "name"): string | null {
  const re = new RegExp(
    `<meta[^>]*\\b${attr}\\s*=\\s*["']${name}["'][^>]*>`, "i"
  );
  const tag = html.match(re)?.[0];
  if (!tag) return null;
  return tag.match(/content\s*=\s*["']([\s\S]*?)["']/i)?.[1]?.trim() ?? null;
}

const textOf = (fragment: string) =>
  fragment.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/* ------------------------------------------------------------------ */
/* The checks                                                          */
/* ------------------------------------------------------------------ */

const CTA_WORDS =
  /\b(book|buy|shop|order|get started|start now|start free|contact|call|quote|schedule|sign ?up|subscribe|join|try|demo|reserve|apply|enroll|donate|add to cart|checkout|get a|talk to|hire|request)\b/i;

export async function runScan(rawUrl: string): Promise<ScanReport> {
  const url = await normalizeTarget(rawUrl);
  const page = await fetchPage(url);
  const html = stripComments(page.html);
  const lower = html.toLowerCase();
  const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? html.slice(0, 20000);
  const htmlKb = Math.round(page.bytes / 1024);
  const finalUrl = new URL(page.finalUrl);

  const checks: Record<string, Check[]> = { design: [], perf: [], content: [] };
  const add = (
    cat: "design" | "perf" | "content",
    id: string, label: string, max: number,
    status: CheckStatus, detail: string
  ) => {
    const points = status === "pass" ? max : status === "warn" ? Math.round(max / 2) : 0;
    checks[cat].push({ id, label, status, points, max, detail });
  };

  /* ---- Design and UX ---- */

  const viewport = metaContent(head, "viewport");
  add("design", "viewport", "Mobile viewport", 10,
    viewport ? "pass" : "fail",
    viewport
      ? "A viewport tag is set, so phones render the page at phone size."
      : "No viewport tag. Phones show this page zoomed out like a desktop from 2009, and most of your visitors are on phones.");

  const anchorTexts = Array.from(html.matchAll(/<(a|button)\b[^>]*>([\s\S]*?)<\/\1>/gi))
    .map((m) => textOf(m[2])).filter(Boolean);
  const hasCta = anchorTexts.some((t) => CTA_WORDS.test(t) && t.length < 60);
  add("design", "cta", "A clear ask", 8,
    hasCta ? "pass" : "fail",
    hasCta
      ? "At least one link or button actually asks for the sale or the booking."
      : "No link or button on this page asks the visitor to do anything. A site without an ask is a brochure nobody mailed.");

  const fontFamilies = new Set<string>();
  for (const m of Array.from(lower.matchAll(/fonts\.googleapis\.com\/css2?\?[^"']*/g))) {
    for (const f of Array.from(m[0].matchAll(/family=([a-z0-9+%-]+)/g))) fontFamilies.add(f[1].split(":")[0]);
  }
  for (const m of Array.from(lower.matchAll(/@font-face[^}]*font-family\s*:\s*["']?([^;"'}]+)/g))) fontFamilies.add(m[1].trim());
  const fontCount = fontFamilies.size;
  add("design", "fonts", "Type discipline", 4,
    fontCount <= 3 ? "pass" : fontCount <= 5 ? "warn" : "fail",
    fontCount === 0
      ? "No custom fonts detected. System type is fine as long as it is deliberate."
      : fontCount <= 3
        ? `${fontCount} font ${fontCount === 1 ? "family" : "families"} loaded. Restrained, as it should be.`
        : `${fontCount} font families loaded. Past three it stops being a type system and starts being a ransom note.`);

  const hasFavicon = /<link[^>]*rel\s*=\s*["'][^"']*icon[^"']*["']/i.test(head);
  add("design", "favicon", "Browser tab identity", 3,
    hasFavicon ? "pass" : "warn",
    hasFavicon
      ? "A favicon is declared. Small thing, but the tab looks owned."
      : "No favicon declared. The browser tab shows a blank page glyph, which reads as unfinished.");

  /* ---- Performance and technical ---- */

  add("perf", "https", "HTTPS", 8,
    finalUrl.protocol === "https:" ? "pass" : "fail",
    finalUrl.protocol === "https:"
      ? "The site serves over HTTPS."
      : "The site serves over plain http. Browsers literally print the words Not Secure next to your name.");

  add("perf", "ttfb", "Server response", 9,
    page.ttfbMs < 500 ? "pass" : page.ttfbMs < 1200 ? "warn" : "fail",
    page.ttfbMs < 500
      ? `First byte in ${page.ttfbMs}ms. The server is not the problem.`
      : page.ttfbMs < 1200
        ? `First byte took ${page.ttfbMs}ms. Noticeable on a phone connection, and Google notices too.`
        : `First byte took ${page.ttfbMs}ms. Visitors are staring at a white screen for over a second before anything even starts.`);

  add("perf", "weight", "Page weight", 9,
    htmlKb < 120 ? "pass" : htmlKb < 350 ? "warn" : "fail",
    htmlKb < 120
      ? `${htmlKb}KB of HTML. Lean.`
      : htmlKb < 350
        ? `${htmlKb}KB of HTML before a single image loads. Heavy for a page that has one job.`
        : `${htmlKb}KB of HTML alone. That is the size of a small app before the images arrive.`);

  const scriptCount = (lower.match(/<script\b/g) || []).length;
  add("perf", "scripts", "Script load", 5,
    scriptCount <= 15 ? "pass" : scriptCount <= 30 ? "warn" : "fail",
    scriptCount <= 15
      ? `${scriptCount} script ${scriptCount === 1 ? "tag" : "tags"}. Reasonable.`
      : `${scriptCount} script tags on one page. Every one of them runs before the page feels usable.`);

  const imgTags = Array.from(html.matchAll(/<img\b[^>]*>/gi)).map((m) => m[0]);
  const lazyOrSized = imgTags.filter((t) => /loading\s*=\s*["']lazy["']/i.test(t) || (/\bwidth\s*=/i.test(t) && /\bheight\s*=/i.test(t)));
  add("perf", "img-loading", "Image loading hygiene", 4,
    imgTags.length === 0 || lazyOrSized.length >= imgTags.length * 0.6 ? "pass"
      : lazyOrSized.length >= imgTags.length * 0.3 ? "warn" : "fail",
    imgTags.length === 0
      ? "No inline images to judge here."
      : `${lazyOrSized.length} of ${imgTags.length} images are lazy loaded or properly sized. ${lazyOrSized.length >= imgTags.length * 0.6 ? "Good hygiene." : "The rest shove the layout around while they load."}`);

  /* ---- Content and SEO ---- */

  const title = textOf(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  add("content", "title", "Page title", 7,
    title && title.length >= 15 && title.length <= 65 ? "pass" : title ? "warn" : "fail",
    !title
      ? "No title tag. Google invents one for you, and Google is not your copywriter."
      : title.length < 15
        ? `The title is "${title}". ${title.length} characters says nothing about what you do or where.`
        : title.length > 65
          ? `The title runs ${title.length} characters. Google cuts it off mid sentence in the results.`
          : `"${title}" reads well and fits in a search result.`);

  const desc = metaContent(head, "description");
  add("content", "description", "Meta description", 7,
    desc && desc.length >= 50 && desc.length <= 165 ? "pass" : desc ? "warn" : "fail",
    !desc
      ? "No meta description. Your search listing shows whatever text Google scrapes, which is usually your cookie banner."
      : desc.length < 50
        ? `The description is only ${desc.length} characters. That is a shrug where your pitch should be.`
        : desc.length > 165
          ? `The description runs ${desc.length} characters and gets truncated in search results.`
          : "The description is a real pitch at a length Google actually shows.");

  const h1s = Array.from(html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)).map((m) => textOf(m[1])).filter(Boolean);
  add("content", "h1", "One headline", 6,
    h1s.length === 1 ? "pass" : h1s.length === 0 ? "fail" : "warn",
    h1s.length === 1
      ? `One h1: "${h1s[0].slice(0, 70)}". Correct.`
      : h1s.length === 0
        ? "No h1 on the page. Neither visitors nor Google are told what this page is about."
        : `${h1s.length} h1 tags fighting for the same job. Pick one headline.`);

  const h2Count = (lower.match(/<h2\b/g) || []).length;
  add("content", "structure", "Skimmable structure", 3,
    h2Count >= 2 ? "pass" : h2Count === 1 ? "warn" : "fail",
    h2Count >= 2
      ? `${h2Count} section headings. The page can be skimmed.`
      : "Almost no section headings. Nobody reads a wall, they skim it, and this page gives them nothing to skim.");

  const missingAlt = imgTags.filter((t) => !/\balt\s*=\s*["'][^"']+["']/i.test(t)).length;
  add("content", "alt", "Image alt text", 7,
    imgTags.length === 0 || missingAlt === 0 ? "pass"
      : missingAlt <= imgTags.length * 0.3 ? "warn" : "fail",
    imgTags.length === 0
      ? "No inline images to caption."
      : missingAlt === 0
        ? `All ${imgTags.length} images carry alt text.`
        : `${missingAlt} of ${imgTags.length} images have no alt text. Invisible to screen readers and to Google Images.`);

  const ogTitle = metaContent(head, "og:title", "property");
  const ogImage = metaContent(head, "og:image", "property");
  add("content", "og", "Social preview", 5,
    ogTitle && ogImage ? "pass" : ogTitle || ogImage ? "warn" : "fail",
    ogTitle && ogImage
      ? "Open Graph title and image are set. Shared links look intentional."
      : "Open Graph tags are missing or partial. Paste this link into a text message and watch it show up as a bare grey box.");

  const hasCanonical = /<link[^>]*rel\s*=\s*["']canonical["']/i.test(head);
  add("content", "canonical", "Canonical URL", 3,
    hasCanonical ? "pass" : "warn",
    hasCanonical
      ? "A canonical URL is declared."
      : "No canonical tag. If this page answers on more than one address, Google splits your credit between them.");

  const navBlock = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/i)?.[1] ?? "";
  const navLinks = (navBlock.match(/<a\b/gi) || []).length;
  add("content", "nav", "Navigation size", 2,
    navLinks === 0 || navLinks <= 8 ? "pass" : navLinks <= 12 ? "warn" : "fail",
    navLinks === 0
      ? "No nav element found to judge."
      : navLinks <= 8
        ? `${navLinks} ${navLinks === 1 ? "link" : "links"} in the nav. Decisive.`
        : `${navLinks} links in the nav. A menu that long is a site admitting it does not know what matters.`);

  /* ---- Assemble ---- */

  const categories: Category[] = [
    { id: "design", name: "Design and mobile", checks: checks.design, score: 0, max: 0 },
    { id: "perf", name: "Speed and technical", checks: checks.perf, score: 0, max: 0 },
    { id: "content", name: "Content and search", checks: checks.content, score: 0, max: 0 },
  ];
  for (const c of categories) {
    c.score = c.checks.reduce((s, k) => s + k.points, 0);
    c.max = c.checks.reduce((s, k) => s + k.max, 0);
  }
  const score = categories.reduce((s, c) => s + c.score, 0);
  const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 45 ? "D" : "F";
  const verdict = {
    A: "Solid. The gap between you and better is polish, not surgery.",
    B: "Decent bones with real leaks. Each one below is losing you visitors quietly.",
    C: "This site is working against the business. The fixes are known and none of them are exotic.",
    D: "Most visitors are gone before this page finishes making its case.",
    F: "This site is costing you customers today, not someday.",
  }[grade] as string;

  const topFixes = categories
    .flatMap((c) => c.checks)
    .filter((k) => k.status !== "pass")
    .sort((a, b) => (b.max - b.points) - (a.max - a.points))
    .slice(0, 3)
    .map((k) => k.detail);

  return {
    url: url.href,
    finalUrl: page.finalUrl,
    host: finalUrl.hostname,
    score, grade, verdict,
    ttfbMs: page.ttfbMs,
    totalMs: page.totalMs,
    htmlKb,
    categories,
    topFixes,
  };
}
