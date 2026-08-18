import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import type { ScanReport } from "@/lib/scan-engine";

/**
 * The unlock step on /scan.
 *
 * The visitor has already seen their score. They trade an email address for
 * the full teardown, which the page reveals and this route also delivers to
 * their inbox. Two sends, same rules as /api/intake:
 *
 * 1. The lead notification to the studio MUST land, or this returns non-200
 *    and the page keeps the report locked with an honest error. A scan lead
 *    is the whole point of the feature; losing one silently is the one
 *    unforgivable failure here.
 * 2. The visitor's copy is best effort and never fails the request.
 *
 * The report arrives from the client, so trust it the way you trust any form
 * field: escape everything, cap everything, and never let it decide anything
 * beyond what text appears in two emails.
 */

export const runtime = "nodejs";

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const FROM = process.env.RESEND_FROM || "FlowZone <onboarding@resend.dev>";

const STATUS_COLOR: Record<string, string> = {
  pass: "#0F6B4F",
  warn: "#8A5100",
  fail: "#B03A12",
};
const STATUS_WORD: Record<string, string> = {
  pass: "Pass",
  warn: "Needs work",
  fail: "Failing",
};

function reportHtml(r: ScanReport): string {
  const rows = r.categories
    .map((c) => {
      const checks = c.checks
        .map(
          (k) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #E2E8F0;white-space:nowrap;vertical-align:top">
            <span style="font-weight:700;color:${STATUS_COLOR[k.status] || "#333"}">${STATUS_WORD[k.status] || ""}</span>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #E2E8F0;vertical-align:top">
            <strong>${esc(k.label)}</strong><br>
            <span style="color:#4A5568">${esc(k.detail)}</span>
          </td>
        </tr>`
        )
        .join("");
      return `
      <h3 style="margin:28px 0 8px;font-size:16px;color:#0B1322">${esc(c.name)} — ${c.score}/${c.max}</h3>
      <table style="border-collapse:collapse;width:100%;font-size:14px">${checks}</table>`;
    })
    .join("");

  return `
  <div style="font-family:system-ui,sans-serif;max-width:640px">
    <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5B8CFF;margin:0 0 6px">FlowZone Site Scan</p>
    <h2 style="margin:0 0 4px;font-size:24px;color:#0B1322">${esc(r.host)} scored ${r.score}/100. Grade ${esc(r.grade)}.</h2>
    <p style="color:#4A5568;line-height:1.6;margin:0 0 18px">${esc(r.verdict)}</p>
    <p style="color:#4A5568;font-size:13px;margin:0 0 6px">Measured: first byte in ${Math.round(r.ttfbMs)}ms, ${r.htmlKb}KB of HTML, scanned as a phone.</p>
    ${rows}
    <div style="margin:30px 0;padding:20px;background:#F4F6FA;border-left:3px solid #5B8CFF">
      <p style="margin:0 0 8px;font-weight:700;color:#0B1322">Want it fixed instead of listed?</p>
      <p style="margin:0;color:#4A5568;line-height:1.6">This is exactly what The Site Build exists for. Scoped before payment, a fixed price and a date, handed over live. Reply to this email or start at <a href="https://www.flowzone.dev/intake" style="color:#3D6FE8">www.flowzone.dev/intake</a>.</p>
    </div>
    <p style="color:#888;font-size:12px">FlowZone · <a href="https://www.flowzone.dev" style="color:#3D6FE8">www.flowzone.dev</a></p>
  </div>`;
}

function looksLikeReport(r: unknown): r is ScanReport {
  if (!r || typeof r !== "object") return false;
  const o = r as Record<string, unknown>;
  return (
    typeof o.host === "string" && o.host.length < 300 &&
    typeof o.score === "number" && typeof o.grade === "string" &&
    Array.isArray(o.categories) && (o.categories as unknown[]).length <= 6 &&
    JSON.stringify(r).length < 40_000
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const raw = body as Record<string, unknown>;
  const email = String(raw.email ?? "").trim().slice(0, 200);
  const report = raw.report;

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Check the email address." }, { status: 400 });
  }
  if (!looksLikeReport(report)) {
    return NextResponse.json({ ok: false, error: "Run the scan again, the report did not come through." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[FlowZone Scan] LEAD LOST, no RESEND_API_KEY:", email, report.host);
    return NextResponse.json(
      { ok: false, error: "Email is not configured yet. Send us the link directly and we will run it by hand." },
      { status: 502 }
    );
  }

  const failing = report.categories
    .flatMap((c) => c.checks)
    .filter((k) => k.status !== "pass");

  const leadHtml = `
    <div style="font-family:system-ui,sans-serif;max-width:640px">
      <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5B8CFF;margin:0 0 6px">Scan lead</p>
      <h2 style="margin:0 0 12px;font-size:24px;color:#0B1322">${esc(email)}</h2>
      <p style="color:#4A5568;line-height:1.6">Scanned <a href="${esc(report.finalUrl)}">${esc(report.host)}</a> and unlocked the report. Score ${report.score}/100, grade ${esc(report.grade)}, ${failing.length} findings. Warm on arrival: they just read a list of what is wrong with their site.</p>
      ${reportHtml(report)}
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: SITE.leadInbox,
        reply_to: email,
        subject: `Scan Lead: ${report.host} Scored ${report.grade} (${report.score}/100)`,
        html: leadHtml,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[FlowZone Scan] LEAD LOST:", res.status, detail, "|", email, "|", report.host);
      return NextResponse.json(
        { ok: false, error: "That did not send. Email us the link directly and we will run it by hand." },
        { status: 502 }
      );
    }
  } catch (e) {
    console.error("[FlowZone Scan] LEAD LOST:", e, "|", email, "|", report.host);
    return NextResponse.json(
      { ok: false, error: "That did not send. Email us the link directly and we will run it by hand." },
      { status: 502 }
    );
  }

  // The visitor's copy. Best effort, never fails the unlock.
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: email,
        reply_to: SITE.leadInbox,
        subject: `Your Site Scan: ${report.host} Scored ${report.grade}`,
        html: reportHtml(report),
      }),
      signal: AbortSignal.timeout(10000),
    });
  } catch (e) {
    console.error("[FlowZone Scan] visitor copy failed:", e);
  }

  return NextResponse.json({ ok: true });
}
