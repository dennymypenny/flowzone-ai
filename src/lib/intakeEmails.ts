/**
 * The two emails a ticket sends: the studio copy (lands in the lead inbox) and
 * the customer's receipt. Email clients ignore <style> blocks and most modern
 * CSS, so everything here is tables and inline styles. Space Grotesk and
 * Figtree load where the client allows it (Apple Mail, iOS) and fall back to
 * Helvetica/Arial everywhere else, which still reads right.
 *
 * Every value that came from the visitor goes through esc() before it lands.
 */

export type Ticket = {
  name: string;
  email: string;
  business: string;
  service: string;
  description: string;
};

export const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Same colors and prices as the tiles on /intake. */
const BUILDS: Record<string, { c: string; emoji: string; from: string; one: string }> = {
  "The Identity Build": { c: "#4C7BE8", emoji: "\u{1F3A8}", from: "From $500", one: "Logo, colors and words." },
  "The Site Build": { c: "#5B9BF9", emoji: "\u{1F310}", from: "From $500", one: "A website that turns visitors into customers." },
  "The Full Build": { c: "#5B8CFF", emoji: "\u{1F680}", from: "From $1,500", one: "Brand, site and system, wired together." },
  "The Storefront Build": { c: "#F0845F", emoji: "\u{1F6D2}", from: "From $2,500", one: "Cart, checkout, money in your account." },
  "The Engine Build": { c: "#34D399", emoji: "\u{2699}\u{FE0F}", from: "From $500", one: "Follow-ups, booking and invoicing." },
  "A Small Job": { c: "#FBBF24", emoji: "\u{2702}\u{FE0F}", from: "From $49.99", one: "A reel, a logo, a page, a fix." },
};
const NOT_SURE = { c: "#93A2BC", emoji: "\u{1F9ED}", from: "Quote after we read it", one: "We will tell you which build fits." };

export const buildMeta = (service: string) => {
  const hit =
    BUILDS[service] ||
    Object.entries(BUILDS).find(([k]) => k.toLowerCase().includes(service.toLowerCase().replace(/^the /, "")))?.[1];
  return hit || NOT_SURE;
};

/** Short, human ticket number. Not a database id, just something to say out loud. */
export const ticketId = (d = new Date()) => "FZ-" + d.getTime().toString(36).slice(-5).toUpperCase();

/** "The Site Build" reads wrong after "your", so drop the article there. */
const bare = (s: string) => s.replace(/^the\s+/i, "");

const firstName = (n: string) => n.trim().split(/\s+/)[0] || n;

const received = (d = new Date()) =>
  d.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }) + " PT";

const DISPLAY = "'Space Grotesk',Helvetica,Arial,sans-serif";
const BODY = "Figtree,Helvetica,Arial,sans-serif";

const dot = (c: string) =>
  `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${c};vertical-align:middle"></span>`;

/** Shared frame: navy header with the mark, white card, quiet footer. */
const frame = (preheader: string, header: string, inner: string, footer: string) => `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#EEF2F8">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#EEF2F8">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F8">
<tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:18px;overflow:hidden;border:1px solid #DCE3EF">
  <tr><td style="height:3px;line-height:3px;font-size:0;background:#4C7BE8">&nbsp;</td></tr>
  <tr><td style="background:#0C1424;padding:22px 28px 26px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-family:${DISPLAY};font-size:17px;font-weight:600;color:#F1F3F7;letter-spacing:-0.01em">
        ${dot("#1E3A8A")}<span style="display:inline-block;width:10px;height:2px;background:#DDEEFB;vertical-align:middle"></span>${dot("#5B9BF9")}<span style="display:inline-block;width:10px;height:2px;background:#DDEEFB;vertical-align:middle"></span>${dot("#C6E4F8")}
        <span style="padding-left:10px;vertical-align:middle">FlowZone</span>
      </td>
    </tr></table>
    ${header}
  </td></tr>
  ${inner}
  <tr><td style="padding:22px 28px 26px;border-top:1px solid #E6EBF3;font-family:${BODY};font-size:12px;line-height:1.6;color:#7A879E">
    ${footer}
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

const buildCard = (service: string) => {
  const b = buildMeta(service);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #DCE3EF;border-left:4px solid ${b.c};border-radius:11px">
    <tr><td style="padding:16px 18px;font-family:${BODY}">
      <div style="font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#7A879E;margin:0 0 6px">Build</div>
      <div style="font-family:${DISPLAY};font-size:20px;font-weight:600;color:#0C1424;letter-spacing:-0.02em">${b.emoji}&nbsp; ${esc(service)}</div>
      <div style="font-size:14px;color:#4A5873;margin-top:4px">${b.one} <span style="color:#B03A12;font-weight:600;white-space:nowrap">${b.from}</span></div>
    </td></tr></table>`;
};

const ideaBlock = (label: string, description: string) => `
  <div style="font-family:${BODY};font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#7A879E;margin:0 0 8px">${label}</div>
  <div style="font-family:${BODY};font-size:15px;line-height:1.65;color:#1B2638;background:#F4F7FC;border-radius:11px;padding:18px 20px;white-space:pre-wrap">${esc(description)}</div>`;

const button = (href: string, text: string) => `
  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="background:#5B8CFF;border-radius:11px">
      <a href="${href}" style="display:inline-block;padding:14px 26px;font-family:${BODY};font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none">${text} &rarr;</a>
    </td></tr></table>`;

/** The copy that lands in the studio inbox. Built to be read in five seconds and answered in one tap. */
export function studioEmail(t: Ticket, id = ticketId(), now = new Date()) {
  const first = firstName(t.name);
  const replySubject = encodeURIComponent(`Your ${bare(t.service)} with FlowZone`);
  const replyBody = encodeURIComponent(`Hi ${first},\n\nThanks for sending this over. `);
  const row = (k: string, v: string) => `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid #E6EBF3;font-family:${BODY};font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#7A879E;width:110px;vertical-align:top">${k}</td>
      <td style="padding:11px 0;border-bottom:1px solid #E6EBF3;font-family:${BODY};font-size:15px;color:#1B2638">${v}</td>
    </tr>`;

  const header = `
    <div style="font-family:${BODY};font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#A8C4FF;margin:26px 0 8px">New ticket &nbsp;·&nbsp; ${id}</div>
    <div style="font-family:${DISPLAY};font-size:30px;line-height:1.15;font-weight:600;color:#F1F3F7;letter-spacing:-0.028em">${esc(t.name)}</div>
    <div style="font-family:${BODY};font-size:15px;color:#ABB8CF;margin-top:6px">${esc(t.business)}</div>`;

  const inner = `
  <tr><td style="padding:26px 28px 6px">${buildCard(t.service)}</td></tr>
  <tr><td style="padding:14px 28px 4px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Email", `<a href="mailto:${esc(t.email)}" style="color:#2B57C4;text-decoration:none">${esc(t.email)}</a>`)}
      ${row("Business", esc(t.business))}
      ${row("Received", received(now))}
    </table>
  </td></tr>
  <tr><td style="padding:22px 28px 6px">${ideaBlock("The idea", t.description)}</td></tr>
  <tr><td style="padding:22px 28px 28px">
    ${button(`mailto:${esc(t.email)}?subject=${replySubject}&amp;body=${replyBody}`, `Reply to ${esc(first)}`)}
    <div style="font-family:${BODY};font-size:13px;color:#7A879E;margin-top:12px">Or just hit reply. It goes straight to them.</div>
  </td></tr>`;

  return {
    subject: `New ticket: ${t.name}, ${t.service}`,
    html: frame(
      `${t.business} wants ${t.service}. ${t.description.slice(0, 90)}`,
      header,
      inner,
      `Ticket ${id} from flowzone.dev/intake. They got a receipt that says you usually answer the same day.`
    ),
  };
}

/** The customer's receipt. Tells them a person has it and what happens next. */
export function receiptEmail(t: Ticket, id = ticketId()) {
  const first = firstName(t.name);
  const step = (n: string, c: string, title: string, line: string) => `
    <tr>
      <td style="width:34px;vertical-align:top;padding:0 0 16px">${dot(c)}</td>
      <td style="vertical-align:top;padding:0 0 16px;font-family:${BODY}">
        <div style="font-size:15px;font-weight:600;color:#0C1424"><span style="color:#7A879E;font-weight:500">${n}</span>&nbsp; ${title}</div>
        <div style="font-size:14px;line-height:1.55;color:#4A5873;margin-top:2px">${line}</div>
      </td>
    </tr>`;

  const header = `
    <div style="font-family:${BODY};font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#A8C4FF;margin:26px 0 8px">Ticket received &nbsp;·&nbsp; ${id}</div>
    <div style="font-family:${DISPLAY};font-size:30px;line-height:1.15;font-weight:600;color:#F1F3F7;letter-spacing:-0.028em">Got it, ${esc(first)}. A person is reading this.</div>`;

  const inner = `
  <tr><td style="padding:26px 28px 6px">${buildCard(t.service)}</td></tr>
  <tr><td style="padding:26px 28px 6px">
    <div style="font-family:${BODY};font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#7A879E;margin:0 0 14px">What happens next</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${step("01", "#1E3A8A", "We read it", "Every ticket gets read by a person, usually the same day.")}
      ${step("02", "#5B9BF9", "You get a plan", "Scope, price and a date, in plain words. No call required.")}
      ${step("03", "#C6E4F8", "We get it moving", "Say yes and the build starts. You see progress as it happens.")}
    </table>
  </td></tr>
  <tr><td style="padding:12px 28px 28px">${ideaBlock("What you sent", t.description)}</td></tr>`;

  return {
    subject: `Ticket received: your ${bare(t.service)}`,
    html: frame(
      `We have your ${bare(t.service)} ticket. A person reads it, usually the same day.`,
      header,
      inner,
      `Forgot something? Reply to this email and it comes straight to us.<br/><br/>
       <span style="font-family:${DISPLAY};font-weight:600;color:#0C1424">FlowZone</span> &nbsp;·&nbsp; <a href="https://www.flowzone.dev" style="color:#2B57C4;text-decoration:none">flowzone.dev</a><br/>
       You imagine it. We get it moving.`
    ),
  };
}
