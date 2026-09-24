/**
 * The two emails a ticket sends: the studio copy (lands in the lead inbox) and
 * the customer's thank-you. Email clients ignore <style> blocks and most modern
 * CSS, so everything here is tables and inline styles. Space Grotesk and
 * Figtree load where the client allows it (Apple Mail, iOS) and fall back to
 * Helvetica/Arial everywhere else, which still reads right.
 *
 * The ocean banners, the script "Thank you" and the "Dennis" signature are images in
 * public/assets/email, because Gmail strips web fonts and a script font that
 * falls back to Arial is worse than none.
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

const SITE_URL = "https://www.flowzone.dev";
const IMG = {
  photo: `${SITE_URL}/assets/email/dennis-avatar.png`,
  heroThanks: `${SITE_URL}/assets/email/hero-thanks.jpg`,
  heroTicket: `${SITE_URL}/assets/email/hero-ticket.jpg`,
  sign: `${SITE_URL}/assets/email/dennis.png`,
};

/** Same prices as the tiles on /intake. `c` is the dark twin that passes contrast on the tint. */
const BUILDS: Record<string, { c: string; tint: string; emoji: string; from: string; one: string }> = {
  "The Identity Build": { c: "#2B57C4", tint: "#EDF2FD", emoji: "\u{1F3A8}", from: "From $500", one: "Logo, colors and words people remember." },
  "The Site Build": { c: "#155E9C", tint: "#EAF3FE", emoji: "\u{1F310}", from: "From $500", one: "A website that turns visitors into customers." },
  "The Full Build": { c: "#2B57C4", tint: "#EDF2FD", emoji: "\u{1F680}", from: "From $1,500", one: "Brand, site and system, wired together." },
  "The Storefront Build": { c: "#B03A12", tint: "#FDF0EA", emoji: "\u{1F6D2}", from: "From $2,500", one: "Cart, checkout, money in your account." },
  "The Engine Build": { c: "#0F6B4F", tint: "#E8F7F1", emoji: "\u{2699}\u{FE0F}", from: "From $500", one: "Follow-ups, booking and invoicing, handled." },
  "A Small Job": { c: "#8A5100", tint: "#FEF6E4", emoji: "\u{2702}\u{FE0F}", from: "From $49.99", one: "A reel, a logo, a page, a fix." },
};
const NOT_SURE = { c: "#1E3A8A", tint: "#EFF3F9", emoji: "\u{1F9ED}", from: "We will recommend one", one: "You bring the idea, we find the right build." };

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
const isNotSure = (s: string) => /not sure/i.test(s);
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
const INK = "#0C1424";
const SOFT = "#4A5873";
const MUTE = "#8190A8";
const LINE = "#E7ECF4";
const PAD = "padding-left:36px;padding-right:36px";

const dot = (c: string, size = 9) =>
  `<span style="display:inline-block;width:${size}px;height:${size}px;border-radius:50%;background:${c};vertical-align:middle"></span>`;
const link = `<span style="display:inline-block;width:9px;height:2px;background:#C9DDF5;vertical-align:middle"></span>`;
const mark = () => `${dot("#1E3A8A")}${link}${dot("#5B9BF9")}${link}${dot("#A9D3F2")}`;

const label = (t: string) =>
  `<div style="font-family:${BODY};font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${MUTE};margin:0 0 12px">${t}</div>`;

/** Airy canvas, a white card that opens on a branded ocean banner, quiet footer. */
const frame = (hero: { src: string; alt: string }, preheader: string, inner: string, footer: string) => `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#F3F6FB">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#F3F6FB">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F6FB">
<tr><td align="center" style="padding:32px 14px 40px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px">
  <tr><td style="background:#FFFFFF;border-radius:22px;border:1px solid ${LINE};box-shadow:0 18px 40px -24px rgba(12,20,36,0.18);overflow:hidden">
    <img src="${hero.src}" width="580" alt="${hero.alt}" style="display:block;width:100%;max-width:580px;height:auto;border:0;background:#0C1424">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${inner}</table>
  </td></tr>
  <tr><td style="padding:22px 8px 0;font-family:${BODY};font-size:12px;line-height:1.7;color:${MUTE};text-align:center">${footer}</td></tr>
</table>
</td></tr></table>
</body></html>`;

/** The build as a soft tinted tile: emoji in a white square, name, one line, price. */
const buildTile = (service: string) => {
  const b = buildMeta(service);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${b.tint};border-radius:16px">
    <tr>
      <td style="width:62px;padding:18px 0 18px 18px;vertical-align:middle">
        <div style="width:44px;height:44px;line-height:44px;text-align:center;font-size:22px;background:#FFFFFF;border-radius:12px">${b.emoji}</div>
      </td>
      <td style="padding:18px 18px 18px 12px;vertical-align:middle;font-family:${BODY}">
        <div style="font-family:${DISPLAY};font-size:18px;font-weight:600;color:${INK};letter-spacing:-0.02em">${esc(service)}</div>
        <div style="font-size:14px;line-height:1.5;color:${SOFT};margin-top:2px">${b.one} <span style="color:${b.c};font-weight:600;white-space:nowrap">${b.from}</span></div>
      </td>
    </tr></table>`;
};

/** Their words as a quote, so it feels heard and not filed. */
const quote = (description: string) =>
  `<div style="font-family:${BODY};font-size:15px;line-height:1.7;color:#1B2638;border-left:3px solid #5B9BF9;padding:2px 0 2px 18px;white-space:pre-wrap">${esc(description)}</div>`;

const button = (href: string, text: string) => `
  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="background:${INK};border-radius:12px">
      <a href="${href}" style="display:inline-block;padding:15px 26px;font-family:${BODY};font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none">${text}&nbsp;&nbsp;&rarr;</a>
    </td></tr></table>`;

/** The copy that lands in the studio inbox. Read it in five seconds, answer it in one tap. */
export function studioEmail(t: Ticket, id = ticketId(), now = new Date()) {
  const first = firstName(t.name);
  const replySubject = encodeURIComponent(
    isNotSure(t.service) ? `Your project with FlowZone` : `Your ${bare(t.service)} with FlowZone`
  );
  const replyBody = encodeURIComponent(`Hi ${first},\n\nThank you so much for reaching out. `);
  const wants = isNotSure(t.service) ? "has an idea and wants help picking a build" : `wants the ${esc(bare(t.service))}`;
  const row = (k: string, v: string) => `
    <tr>
      <td style="padding:12px 0;border-top:1px solid ${LINE};font-family:${BODY};font-size:13px;color:${MUTE};width:96px;vertical-align:top">${k}</td>
      <td style="padding:12px 0;border-top:1px solid ${LINE};font-family:${BODY};font-size:15px;color:${INK}">${v}</td>
    </tr>`;

  const inner = `
  <tr><td style="${PAD};padding-top:34px">
    <div style="font-family:${BODY};font-size:13px;font-weight:600;color:#2B57C4;margin:0 0 10px">Ticket ${id}</div>
    <div style="font-family:${DISPLAY};font-size:28px;line-height:1.2;font-weight:600;color:${INK};letter-spacing:-0.03em">${esc(first)} from ${esc(t.business)} ${wants}.</div>
    <div style="font-family:${BODY};font-size:15px;line-height:1.6;color:${SOFT};margin-top:12px">A fresh one just came in. They already got a thank-you note saying you usually reply the same day.</div>
  </td></tr>
  <tr><td style="${PAD};padding-top:26px">${buildTile(t.service)}</td></tr>
  <tr><td style="${PAD};padding-top:28px">${label("In their words")}${quote(t.description)}</td></tr>
  <tr><td style="${PAD};padding-top:28px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Name", esc(t.name))}
      ${row("Email", `<a href="mailto:${esc(t.email)}" style="color:#2B57C4;text-decoration:none">${esc(t.email)}</a>`)}
      ${row("Business", esc(t.business))}
      ${row("Received", received(now))}
    </table>
  </td></tr>
  <tr><td style="${PAD};padding-top:26px;padding-bottom:36px">
    ${button(`mailto:${esc(t.email)}?subject=${replySubject}&amp;body=${replyBody}`, `Reply to ${esc(first)}`)}
    <div style="font-family:${BODY};font-size:13px;color:${MUTE};margin-top:12px">Or just hit reply, it goes straight to them.</div>
  </td></tr>`;

  return {
    subject: `New ticket from ${first}: ${isNotSure(t.service) ? "needs a build picked" : bare(t.service)}`,
    html: frame({ src: IMG.heroTicket, alt: "New ticket" }, `${t.business}: ${t.description.slice(0, 100)}`, inner, `Ticket ${id} &nbsp;·&nbsp; flowzone.dev/intake`),
  };
}

/** The customer's receipt. A warm thank-you from a person, and what happens next. */
export function receiptEmail(t: Ticket, id = ticketId()) {
  const first = firstName(t.name);
  const what = isNotSure(t.service) ? "your idea" : `the ${esc(bare(t.service))}`;
  const step = (n: string, c: string, fg: string, title: string, line: string, last = false) => `
    <tr>
      <td style="width:42px;vertical-align:top;padding:0 0 ${last ? 0 : 18}px">
        <div style="width:28px;height:28px;line-height:28px;text-align:center;border-radius:50%;background:${c};font-family:${DISPLAY};font-size:13px;font-weight:600;color:${fg}">${n}</div>
      </td>
      <td style="vertical-align:top;padding:3px 0 ${last ? 0 : 18}px;font-family:${BODY}">
        <div style="font-size:15px;font-weight:600;color:${INK}">${title}</div>
        <div style="font-size:14px;line-height:1.6;color:${SOFT};margin-top:2px">${line}</div>
      </td>
    </tr>`;

  const inner = `
  <tr><td style="${PAD};padding-top:30px">
    <div style="font-family:${DISPLAY};font-size:30px;line-height:1.18;font-weight:600;color:${INK};letter-spacing:-0.03em;margin-top:0">${esc(first)}, we are so happy you reached out.</div>
    <div style="font-family:${BODY};font-size:16px;line-height:1.7;color:${SOFT};margin-top:16px">
      Your ticket for ${what} just landed, and honestly, this is our favorite part of the job. A real business, a fresh idea and the chance to help get it moving.
    </div>
    <div style="font-family:${BODY};font-size:16px;line-height:1.7;color:${SOFT};margin-top:12px">
      I am reading it myself and will get back to you soon, usually the same day.
    </div>
  </td></tr>
  <tr><td style="${PAD};padding-top:26px">${buildTile(t.service)}</td></tr>
  <tr><td style="${PAD};padding-top:32px">
    ${label("What happens from here")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${step("1", "#1E3A8A", "#FFFFFF", "I read every word", "No bots, no hand-offs. A person reads your idea and thinks it through.")}
      ${step("2", "#5B9BF9", "#FFFFFF", "You get a simple plan", "What we build, what it costs and when it is ready, in plain words. A call only if you want one.")}
      ${step("3", "#C6E4F8", INK, "We get it moving", "Say the word and we start. You see progress as it happens.", true)}
    </table>
  </td></tr>
  <tr><td style="${PAD};padding-top:32px">${label("What you sent us")}${quote(t.description)}</td></tr>
  <tr><td style="${PAD};padding-top:32px;padding-bottom:34px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LINE}"><tr>
      <td style="padding-top:22px;width:70px;vertical-align:middle">
        <img src="${IMG.photo}" width="56" height="56" alt="Dennis" style="display:block;width:56px;height:56px;border:0">
      </td>
      <td style="padding-top:22px;vertical-align:middle;font-family:${BODY}">
        <div style="font-size:14px;color:${SOFT}">Talk soon,</div>
        <img src="${IMG.sign}" width="104" height="43" alt="Dennis" style="display:block;width:104px;height:auto;border:0;margin:0 0 0 -6px">
        <div style="font-size:12px;color:${MUTE};margin-top:-2px">Founder, FlowZone</div>
      </td>
    </tr></table>
    <div style="font-family:${BODY};font-size:14px;line-height:1.6;color:${SOFT};margin-top:22px;background:#F6F8FC;border-radius:12px;padding:14px 16px">
      <span style="font-weight:600;color:${INK}">P.S.</span> Thought of something else? Just reply to this email. It comes straight to me.
    </div>
  </td></tr>`;

  return {
    subject: `Thank you, ${first}! We got your ticket`,
    html: frame(
      { src: IMG.heroThanks, alt: "Thank you" },
      `Thank you for reaching out. I am reading ${isNotSure(t.service) ? "your idea" : `your ${bare(t.service)} ticket`} now.`,
      inner,
      `Ticket ${id}<br/>
       <a href="${SITE_URL}" style="color:${MUTE};text-decoration:none"><span style="font-family:${DISPLAY};font-weight:600;color:${INK}">FlowZone</span> &nbsp;·&nbsp; flowzone.dev</a><br/>
       You imagine it. We get it moving.`
    ),
  };
}
