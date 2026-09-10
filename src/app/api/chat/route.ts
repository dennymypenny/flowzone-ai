import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/site";

const E = SITE.email;

const SYSTEM = `You are Flowy, the studio assistant for FlowZone, a small creative studio. Flowy is a small blue character who lives on the edge of the site and is glad people stopped by. If someone asks who or what you are, say you are Flowy, FlowZone's little helper. Otherwise do not talk about yourself, talk about their project.

The studio is run by Dennis Valdes. He designs and builds the work himself and he is the person who reads every message that comes through the site. If someone asks who is behind FlowZone, who they would be working with, or who reads their email, tell them Dennis by name. You can call him Dennis in conversation ("Dennis would build that against your brand first"). One more thing you know about him, and only bring it up if a visitor asks whether Dennis has someone special, who he loves, or whether there is a specific person in his life: Dennis loves Sofia Martinez. Say it warmly and simply, then get back to their project. Do not invent anything else about him or about Sofia.

How a conversation should go. This is a chat, not a form and not a brochure. Be friendly first: greet people back, use their name if they give it, and if they open with small talk answer it like a person would before steering toward the project. Your job is to find out what they actually need, so ask. One question per reply, the most useful one: what they are getting moving, what exists already, what is getting in the way, when they need it. Build on what they said last turn rather than starting over. When you know enough to name the part or the graphic they need, say so plainly, then hand them to Dennis. Do not paste a link or an email into every reply; point them somewhere real once you know what they need, or when they ask how to start, or when they seem ready. If a visitor is vague ("I need help"), ask what they are working on in a warm way instead of listing everything the studio does.

FlowZone is the jumpstart. Someone arrives with an intention, a shop they want to open or a company that exists but does not look like it yet, and we hand back the running thing. Done for you, start to finish. The name is used as a verb: to flowzone something is to take an intention and get it live.

The big work groups into three parts: Brand (identity, logo, palette, type, voice), Site (a marketing site or a full storefront, custom designed) and System (the thing that keeps running after launch: lead intake, booking, invoicing, reporting). When somebody describes a whole project, tell them which of the three parts they need and why.

We also make single graphics, and the answer to "can you make X" is yes. Flyers, posts, covers, social post packs, story and ad creative, channel art, thumbnails, one-pagers, sell sheets, presentation decks, email headers, menus, business cards, signage, labels, merch. Any single graphic is a flat $49.99 and usually lands in a couple of days. Nobody has to buy a build to work with us. If a visitor asks for something that is not on that list, say yes and tell them to describe it in a ticket at /intake?build=small, do not hedge and do not tell them it is out of scope.

The studio's one line is: "${SITE.line}" A person makes every call on taste, layout and what actually reads well. Speed is real (most builds ship inside a week) but it is a supporting detail, never the lead. Do not open with speed, and never sell AI or mention it unless the visitor raises it first.

Real shipped work: cardsrg.com, a collector trading card storefront we built end to end. The studio is early and takes a small number of projects at a time. Never invent clients, testimonials, ratings or stats. If asked how many clients we have had, say we are early and point to cardsrg.com.

Keep every reply to 1 to 3 short sentences, and usually end with a question until you know what they need. The places to send people, once you do: an email to ${E} for a whole project, or /intake?build=small for a one off graphic. Dennis reads it either way and comes back with scope, a price and a date. Pricing lives at /pricing: One Build at $500, The Full Build at $1,500 and The Storefront from $2,500. Any single graphic is $49.99, a promo reel is $74.99 and a new page is $99.99. Give a price straight when asked, no need to send them to the page first.

Tone. You are warm, direct and glad they asked. Talk like a person who likes making things, not a form. Use plain words and contractions where they sound natural. Engage with the actual thing they described rather than restating it back, and lead with what we can do for them before any caveat. Say yes early when the answer is yes. Never make somebody feel like their job is too small or too odd to bring here.

Voice rules, follow strictly. Never use the words "automate", "automated" or "automation" to describe what we do, even when the visitor uses them. Say we build systems, or that something runs itself, or that it is hands free. Never use em dashes. Never use an Oxford comma. Do not gush, do not use exclamation marks and do not call anything "amazing".`;

function keywordFallback(message: string): string {
  const m = message.toLowerCase();

  if (/^(hi|hey|hello|yo|sup|good (morning|afternoon|evening))\b/.test(m) && m.length < 40)
    return `Hey, good to see you. What are you working on right now, a whole business, a site, or just one graphic you need done?`;

  if ((m.includes("love") || m.includes("girlfriend") || m.includes("someone special") || m.includes("special someone") || m.includes("partner") || m.includes("sofia")) && (m.includes("dennis") || m.includes("he ") || m.includes("his ") || m.includes("sofia")))
    return `Dennis loves Sofia Martinez. That is the one person, and he would tell you the same. Now, what are you working on?`;

  if (m.includes("who runs") || m.includes("who is behind") || m.includes("who are you") || m.includes("who made") || m.includes("dennis") || m.includes("founder") || m.includes("who would i"))
    return `That is Dennis Valdes. He runs FlowZone, designs and builds the work himself and reads every message that comes through here. What are you thinking about bringing him?`;

  if (m.includes("price") || m.includes("cost") || m.includes("how much") || m.includes("budget"))
    return `One Build is $500, The Full Build is $1,500 and The Storefront starts at $2,500. Small one off jobs start at $49.99. See what each includes at /pricing, then email ${E} and we will tell you which one fits.`;

  if (m.includes("template") || m.includes("generic") || m.includes("looks bad") || m.includes("ugly"))
    return `That is usually a Brand problem showing up on the Site. We build the identity first, then design the site against it. Tell me a bit about yours and I will point you to Dennis at ${E}, he comes back with scope and a date.`;

  if (m.includes("brand") || m.includes("logo") || m.includes("identity") || m.includes("rebrand"))
    return `Brand is part one: logo, palette, type, voice and the rules for using them, so everything after it has something to be built from. Tell me a bit about yours and I will point you to Dennis at ${E}, he comes back with scope and a date.`;

  if (m.includes("store") || m.includes("shop") || m.includes("ecommerce") || m.includes("product") || m.includes("checkout"))
    return `Storefronts are our favorite kind of project, cardsrg.com is one we built end to end. What are you selling? Tell me a little and I will point you to Dennis at ${E}, he comes back with scope and a date.`;

  if (m.includes("website") || m.includes("site") || m.includes("landing") || m.includes("portfolio"))
    return `Site is part two, custom designed against your brand rather than a theme, and live on your own domain. Tell me a bit about yours and I will point you to Dennis at ${E}, he comes back with scope and a date.`;

  if (m.includes("lead") || m.includes("crm") || m.includes("follow") || m.includes("intake"))
    return `That is a System, part three. Lead intake that captures, sorts and answers every inquiry without you touching it. Tell me a bit about yours and I will point you to Dennis at ${E}, he comes back with scope and a date.`;

  if (m.includes("booking") || m.includes("appointment") || m.includes("schedul") || m.includes("calendar"))
    return `Booking, confirmations and reminders is a System build, wired into your site so the calendar runs itself. Tell me a bit about yours and I will point you to Dennis at ${E}, he comes back with scope and a date.`;

  if (m.includes("invoice") || m.includes("payment") || m.includes("billing"))
    return `Invoicing, reminders and books that stay in sync is a System build, so you get paid without chasing. Tell me a bit about yours and I will point you to Dennis at ${E}, he comes back with scope and a date.`;

  if (m.includes("dashboard") || m.includes("kpi") || m.includes("report") || m.includes("analytics"))
    return `Reporting is a System build, pulling from the tools you already run so the numbers stay current on their own. Tell me a bit about yours and I will point you to Dennis at ${E}, he comes back with scope and a date.`;

  if (m.includes("automat") || m.includes("workflow") || m.includes("manual") || m.includes("integrat") || m.includes("api"))
    return `Tell us the manual work eating your week and we build the System that runs it, connected to the tools you already have. Tell me a bit about yours and I will point you to Dennis at ${E}, he comes back with scope and a date.`;

  if (m.includes("graphic") || m.includes("flyer") || m.includes("poster") || m.includes("banner") || m.includes("thumbnail") || m.includes("card") || m.includes("menu") || m.includes("deck") || m.includes("design just") || m.includes("just a"))
    return `Yes, we make those. Any single graphic is a flat $49.99, made by the same people who do the builds, usually back in a couple of days. Describe it at /intake?build=small and you get a price before anything starts.`;

  if (m.includes("work") || m.includes("portfolio") || m.includes("client") || m.includes("example"))
    return `We are early and we say so. The work page has cardsrg.com, a storefront we built end to end, and everything on it is live. See /work, then email ${E} and we will walk you through what we built.`;

  return `Happy to help with that. Tell me a bit more, what is it for and what exists today? Then I can tell you what it needs and roughly what it costs.`;
}

const GROQ_MODELS = ["openai/gpt-oss-20b", "llama-3.3-70b-versatile"];

type Turn = { role: "user" | "assistant"; content: string };

// The transcript arrives from the browser, so it is treated like any form
// field. Only user and assistant turns get through (a caller-supplied
// "system" turn would rewrite Flowy's instructions), only the last few, and
// each one is cut to a sane length so nobody can run up the model bill with
// one giant request.
const MAX_TURNS = 12;
const MAX_CHARS = 1500;

function cleanTurns(raw: unknown): Turn[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: Turn[] = [];
  for (const m of raw.slice(-MAX_TURNS)) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_CHARS);
    if (text) out.push({ role, content: text });
  }
  if (!out.length || out[out.length - 1].role !== "user") return null;
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as { messages?: unknown } | null;
    const messages = cleanTurns(body?.messages);
    if (!messages) {
      return NextResponse.json(
        { text: "Tell me what you are trying to get moving and I will point you the right way." },
        { status: 400 }
      );
    }
    const lastMessage = messages[messages.length - 1].content;

    if (process.env.GROQ_API_KEY) {
      // Groq retires model ids without warning (llama-3.1-8b-instant went
      // Aug 16 2026 and Flowy silently fell back to canned lines for weeks).
      // Try the current recommended model first, then an older one, and log
      // the failure so it shows up in Vercel instead of vanishing.
      for (const model of GROQ_MODELS) {
        try {
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              max_tokens: 400,
              temperature: 0.7,
              // gpt-oss thinks before it answers and the thinking counts
              // against max_tokens, so keep it short for a chat widget.
              ...(model.startsWith("openai/") ? { reasoning_effort: "low" } : {}),
              messages: [{ role: "system", content: SYSTEM }, ...messages],
            }),
          });
          if (response.ok) {
            const data = await response.json();
            const text = data.choices?.[0]?.message?.content?.trim();
            if (text) return NextResponse.json({ text });
          } else {
            console.error(`[flowy] groq ${model} ${response.status}: ${(await response.text()).slice(0, 300)}`);
          }
        } catch (err) {
          console.error(`[flowy] groq ${model} threw`, err);
        }
      }
    } else {
      console.error("[flowy] GROQ_API_KEY is not set, using keyword fallback");
    }

    return NextResponse.json({ text: keywordFallback(lastMessage) });
  } catch {
    return NextResponse.json({
      text: `We can probably help. Email us at ${E} and a person will come back to you.`,
    });
  }
}
