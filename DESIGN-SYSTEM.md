# FlowZone Design System

Updated Sep 17, 2026. Paste this at the top of any Claude chat, then say what to build.
Everything here is what is live on www.flowzone.dev right now. If a rule here and the code disagree, the code in `site/rebrand-push` wins and this file gets fixed.

---

## 1. Who we are

**FlowZone** is a creative and business studio run by Dennis Valdes. Brand, site and system, one studio.

- Positioning line (the only one, `SITE.line`): **Brand, site and system. One studio.**
- Headline: **You imagine it. We get it moving.**
- Descriptor: *Arrive with an intention, leave with the running thing: brand, site and system, built for you.*
- The name works as a verb: to flowzone something is to take an intention and get it moving.
- Closing band: *Bring the imagination. We bring the running thing.*
- Every primary CTA goes to **/intake**. One CTA sitewide.
- Public email: hello@flowzone.dev. Socials: LinkedIn company page, x.com/flowzonedev.

**Name rule:** the company is **FlowZone**. Never "FlowZone AI", never "FLOWZONE AI", not in copy, alt text, legal pages, filenames or metadata.

**Nothing pretends:** every work sample carries a tag saying what it is (Client work, Studio sample, In-house). No invented stats, no fake testimonials, no fabricated proof.

## 2. The three parts

The three dots in the mark are the three parts of the work, left to right, in build order. Colors come straight off the mark.

| # | Part | Color | Emoji | Line |
|---|------|-------|-------|------|
| 01 | Brand | `#4C7BE8` | 🎨 | What people recognize you by. (Our strength) |
| 02 | Site | `#5B9BF9` | 🧭 | Where people decide. |
| 03 | System | `#C6E4F8` | ⚡ | What keeps running after launch. |

Defined once as `PILLARS` in `src/lib/site.ts`. Breadth is sold as end-to-end capability, never as a service menu. Do not revert to a laundry list of services.

## 3. The mark

Three connected dots on a line. Deep navy `#1E3A8A`, brand blue `#5B9BF9`, ice blue `#C6E4F8`, connectors `#DDEEFB`, soft glow. **No plate, no container, no background behind it.** Lives in `src/components/Wordmark.tsx`, exported as `MARK`. Avatar and header for socials: `brand/fz-avatar.png`, `brand/fz-header.png`.

## 4. Color

Tailwind tokens in `site/rebrand-push/tailwind.config.ts`.

**Dark canvas (default)**
| Token | Hex | Use |
|---|---|---|
| paper | `#0C1424` | page background |
| paper-deep | `#101A2E` | deeper sections |
| raised | `#172440` | panels, cards |
| rule | `#26355A` | hairlines, borders |
| ink | `#F1F3F7` | headline text |
| ink-soft | `#ABB8CF` | body text |
| ink-mute | `#93A2BC` | labels, captions |

**Brand blue family**
| Token | Hex |
|---|---|
| accent | `#5B8CFF` (UI accent, buttons, links) |
| accent-deep | `#3D6FE8` |
| accent-light | `#A8C4FF` |
| accent-pale | `#C6E4F8` |
| brand-navy | `#1E3A8A` |

Signature bar: 3px `#4C7BE8` pinned above the nav.

**Signal colors.** Each one always means the same thing, everywhere.
| Meaning | Token | Hex |
|---|---|---|
| speed / time | speed | `#FBBF24` amber |
| price | price | `#F0845F` ember |
| ownership | own | `#34D399` emerald |
| client effort | effort | `#2DD4BF` teal |
| what you get | accent | `#5B9BF9` blue |

**No violet, ever.** Not in gradients, not in starfields, not in the signal palette. Purple-to-blue is the look of every site nobody designed.

**Light bands.** `.band-light` in `globals.css` flips a section to blue-white (`#FDFBF6` to `#F4F7FC` warm paper on the hero) and inverts panels, chips, rules, buttons and every ink color with it. Homepage has four. The signal colors fail contrast on white (amber 1.67, emerald 1.92), so any inline color inside a light band must use its dark twin:
`#2B57C4`, `#155E9C`, `#B03A12`, `#0F6B4F`, `#0C6E80`, `#8A5100`, `#A8175E`, `#1E3A8A`.

## 5. Type

- **Body: Figtree** (300 body at 1.6 line-height, 500 labels uppercase at 0.16em tracking).
- **Display: Space Grotesk** 400 to 700, `.display` class at weight 500, tracking -0.028em.
- Loaded with the Google Fonts `<link>` in `layout.tsx`, never a CSS `@import`.
- Never Inter. Never Poppins or Geist (both retired). Never a third family.
- Reading measure: `max-w-reading` = 62ch.

## 6. Shape, surface, depth

- Panels radius 18px (`--radius-panel`), controls 11px (`--radius-control`). Framed video: 20px, warm border, deep shadow, 3px `#4C7BE8` top bar, video bg `#060B1F`.
- No pills or ovals on text elements. SVG is exempt, which is why the dots stay round.
- No bento grids with heavy rounding, no background patterns, no little boxes. Depth comes from `.aurora` and `.glow` radial washes, `.panel` (top-light gradient, `shadow-panel`), `.glassbar`, `.lightshaft`.
- Buttons: `.btn-primary` (accent, `shadow-glowbtn`), `.btn-ghost`, `.btn-onink` for light bands. Glow states are in `screenshots/glow-button-states.png`.
- Chips: `.chip`. Labels: `.label`. Lede: `.lede`.

## 7. Motion

The whole point: your idea has a jumpstart, everything travels left to right and settles forward.

- Easing `cubic-bezier(0.22, 1, 0.36, 1)`, 0.7 to 0.85s.
- Logo dots pulse in sequence, left to right.
- `.flowline` connector with a charging highlight runs across the three parts and the steps.
- Hero elements arrive staggered on load.
- Sections settle in on scroll with `src/components/Flow.tsx` (one IntersectionObserver, elements marked `data-flow`, no library).
- CTA arrows lean forward on hover. `.drift`, `.shine`, `.fz-float-*`, `.fz-bob` for ambient life.
- Space hero: SVG SMIL ship on a dotted bezier course with a loop-de-loop, 6s laps, no JS.
- Everything off under `prefers-reduced-motion`.

**Never ship CSS that sets content to `opacity: 0` and relies on something else to set it back.** Two live outages came from that. Content ships visible; JS may hide it only after proving it can show it again. Check class names against Tailwind's namespace (`start`, `end`, `size`, `order`, `container` are taken). Test the production build, not dev.

## 8. Emoji and icons

Emoji are allowed in exactly three homepage card rows, one per item, instead of a drawn icon and never next to one: the hero glance row (📦 🙌 ⚡ 💸 🔑), the three parts (🎨 🧭 ⚡) and the four levels (✍️ 👀 🔨 🚀). Everywhere else uses `<Icon />` and stays emoji-free. Never an emoji inside a sentence.

## 9. Voice

- Energetic over salesy or dry. Say it plainly with some heat. No gushing, no exclamation marks, nothing is "amazing".
- **No em dashes.** Comma, colon or full stop.
- **No Oxford commas.** "brand, site and system".
- **American spelling.** Grep before shipping: `recognis|colour|centre|enquir|organis|realis|analyse|favourite|licence|catalogue|behaviour`.
- **FlowZone does not sell AI.** Never credit AI for the speed, the drafts or the heavy lifting. The promise is that a person makes every call. Check `lib/site.ts`, `Footer.tsx` and `api/chat/route.ts` when changing any claim, then grep the built `.next` output.
- Never say "automation" or "automate" in public copy.
- No prices in LinkedIn posts. Prices live on the site only.
- Generic hero copy ("Transform your workflow") is banned.
- X voice (@flowzonedev): thinking out loud with the reader, witty, never lecturing.

## 10. Offers (src/lib/catalog.ts, the only price list)

- One Build $500. The Full Build $1,500. The Storefront from $2,500.
- The four builds: Identity, Site, Storefront, Engine.
- Simple graphics $49.99 flat, nine examples, "Not on the list? It is still yes."
- Quick jobs: form wired in $49.99, fix pass $49.99, promo reel $74.99, new page $99.99.
- Free sample: one free graphic, popup after ~15s or half scroll, once per visitor, corner tab (`FreeSample.tsx`, `/api/sample`, Resend Contacts).
- Website maintenance sold as a month-package retainer.
- Never move the price list back into a `"use client"` module.

## 11. Site map and stack

Next.js app router, Tailwind, Vercel, repo `github.com/dennymypenny/flowzone-ai` (public). Host is `www.flowzone.dev`, apex 307s to it.

Pages: `/` (ocean hero and facts strip, flowzone verb on the space sky, reel window, three parts, pitch, builds, How It Ships, Straight Answers FAQ, closing band with Dennis V. photo), `/work` (nothing pretends), `/services` (What We Build), `/pricing`, `/how-we-work`, `/about`, `/intake` (the one CTA), `/book` (quiet fallback), `/privacy`, `/terms`, `/thank-you`. `/ai-news`, `/scan`, `/start`, `/try` are retired or noindex.

Components: `Nav`, `Footer`, `Wordmark`, `Flow`, `Icon`, `FreeSample`, `Pulse` (own first-party analytics, `/api/track`, `/api/stats`, Upstash Redis), `MessageUs` (Flowy chat, llama-3.3-70b on Groq), `ContactForm`, `CookieChoice`, `SavePrompt`, `Testimonials` (invisible until a real quote exists), `StructuredData`.

## 12. Folder structure (FlowZone Automation)

```
DESIGN-SYSTEM.md        this file, paste it into Claude
README.md               one-screen map of the folder
site/
  rebrand-push/         THE shipping checkout of flowzone-ai (edits go here, nowhere else)
  ROADMAP.md            what the site gets next, update when planning or finishing site work
  ship/                 Ship TEMPLATE.command + the bundle Claude hands back
clients/                client builds (mahj-and-coffee, vanessa-abreu)
brand/                  avatar, header, logo exports
assets/                 work samples and stills used on the site and in portfolios
marketing/
  linkedin/             posts (.md) and their graphics (.png), sales pitch, free graphic copy
  video/                rotation/ (the 5-video Mon Wed Fri rotation), masters/, x-cuts/, canva/, ad finals
  x/                    the @flowzonedev desk: runbook, pillars, batches, queue logs, rampagetbe
  upwork/               portfolio pack for Upwork proposals
docs/                   content system, work lineup, site rundown
screenshots/            build screenshots (popup, glow states, hero motion sheet)
```

## 13. How work ships

1. Claude clones `flowzone-ai` from GitHub in its container (the folder copy drifts behind), edits, `npm ci && npx next build`, screenshots desktop and phone with Playwright.
2. Claude writes a bundle: `git bundle create <name>-<date>.bundle main ^<origin head>` and puts it in `site/ship/`. New content always gets a new filename, never overwrite a bundle.
3. Claude copies `Ship TEMPLATE.command` to `Ship <thing>.command`, sets `BUNDLE=`, and puts it beside the bundle.
4. Denny double-clicks the .command. It downloads the repo out of iCloud, syncs the folder to origin/main, applies the bundle, pushes. Vercel builds in about 90 seconds.
5. Claude verifies with `curl https://www.flowzone.dev/...?v=<timestamp>` for a string only the new build has, and checks `git log origin/main`.
6. After a ship, delete the bundle and its .command from `site/ship/` so the folder stays clean.

iCloud trap: files in this folder can show "Resource deadlock avoided" when read. That is eviction, not a broken mount. Staging the file from a Claude session hydrates it.

## 14. Channels that run

- Scheduled: X reply engine (hourly), Daily Prep (5am, cloud only), Upwork inbox watch (every 2h), Weekly scoreboard (Mon 6pm), Follow Engine (9am 3pm 9pm), FlowZone Pulse refresh (6am). Browser tasks fall back to the built-in browser when Chrome is offline.
- Video rotation: 5 videos, Mon Wed Fri on LinkedIn and X, boosted by @RampageTBE, aimed at /intake tickets. Claude drafts the LinkedIn note, Denny posts.
- Upwork is the client lane. Cold email is closed (250 sends, 0 replies). Do not build another cold email campaign.
- Site polish requests: ask about traffic first.

## 15. Hard rules, short list

1. FlowZone, never FlowZone AI.
2. No em dashes, no Oxford commas, American spelling.
3. No violet, no Inter, no purple-to-blue gradients, no bento grids, no background patterns.
4. Figtree body, Space Grotesk display, nothing else.
5. Signal colors keep their meanings. Dark twins inside light bands.
6. Never hide content with CSS opacity 0.
7. Never credit AI. Never say automation.
8. Nothing pretends on /work.
9. One CTA: /intake.
10. Edits go in `site/rebrand-push`. Ship by bundle plus .command, never overwrite a bundle.
