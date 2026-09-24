/* Search landing pages. One page per thing people actually type into
   Google or ask ChatGPT: "brand design studio", "startup branding",
   "logo design", "website design for startups", plus the local one.

   Rules for this file:
   - Every claim must be true today. Real work only (cardsrg.com, the
     studio pieces on /work). No invented client counts, no timelines we
     do not promise on /how-we-work.
   - Prices must match /pricing. Change them there, change them here.
   - No em dashes, no Oxford commas, American spelling, never sell AI.
   - Each page answers its question in the first two sentences. That is
     what search snippets and AI answer engines quote. */

export type Landing = {
  slug: string;
  /* <title>, before the "| FlowZone Studio" template. Keyword first. */
  title: string;
  description: string;
  label: string;
  h1: string;
  /* The direct answer. Quoted by snippets and answer engines. */
  answer: string;
  service: string;
  /* What you get. */
  get: string[];
  /* Who it is for. */
  forWho: { name: string; body: string }[];
  faqs: { q: string; a: string }[];
  related: string[];
  /* Overrides the build prices in the Service schema and the price line. */
  offers?: { name: string; price: string }[];
  priceLine?: string;
};

export const PRICE_LINE =
  "One Build is $500, The Full Build (brand, site and one working system) is $1,500 and The Storefront starts at $2,500. Small jobs like a single graphic or a new landing page start at $49.99. Every price is flat and agreed before you pay.";

export const LANDINGS: Landing[] = [
  {
    slug: "brand-design",
    title: "Brand Design Studio for Startups and Small Businesses",
    description:
      "FlowZone Studio is a brand design studio for startups, small businesses and personal brands. Logo, color, type, voice and the site that carries it, designed by one person at a flat price.",
    label: "Brand design",
    h1: "A brand design studio that also builds the thing.",
    answer:
      "FlowZone Studio designs brands for startups, small businesses and people building a name. You get the logo, the color and type system, the voice and a usage guide, and if you want it, the website and the system behind it too, all from one studio at one flat price.",
    service: "Brand identity design",
    get: [
      "Logo and wordmark, drawn for you",
      "Color palette and type system",
      "Voice, messaging and the lines you will repeat",
      "Social templates and graphics that match",
      "A usage guide you can hand to anyone",
      "Optional: the website and storefront, built on the same brand",
    ],
    forWho: [
      { name: "New companies", body: "You have a name and a reason to exist. You need it to look like a real company before you show it to anyone." },
      { name: "Businesses that outgrew the first logo", body: "The thing you made in a weekend got you here. It will not get you to the next room." },
      { name: "People building a name", body: "Founders, consultants, creators. A personal brand is the same work with your name on it." },
    ],
    faqs: [
      {
        q: "How much does brand design cost at FlowZone?",
        a: "A brand identity on its own is One Build at $500. Brand, website and one working system together is The Full Build at $1,500. The price is flat and agreed before you pay, with no hourly billing.",
      },
      {
        q: "What is included in a brand identity?",
        a: "The logo and wordmark, a color palette, a type system, the voice and messaging and a usage guide that explains how to use all of it. Graphics and social templates can be added so everything matches from day one.",
      },
      {
        q: "Do you use templates?",
        a: "No. Every mark, palette and layout is designed for you. A person makes every call.",
      },
      {
        q: "Can you design the website too?",
        a: "Yes, and that is the point of the studio. Brand, site and system are three parts of one piece of work, so the site is built against the brand instead of a theme.",
      },
    ],
    related: ["startup-branding", "logo-design", "website-design"],
  },
  {
    slug: "startup-branding",
    title: "Startup Branding: Logo, Identity and Launch Site",
    description:
      "Startup branding from FlowZone Studio. Name to logo to launch site, with the brand, website and signup system built together by one studio at a flat price.",
    label: "Startup branding",
    h1: "Startup branding, from the first logo to the launch page.",
    answer:
      "FlowZone Studio brands startups end to end: the logo and identity, the launch website and the signup, payment or waitlist system behind it. One studio builds all three so the brand, the site and the product page agree with each other on day one.",
    service: "Startup branding",
    get: [
      "Logo, wordmark and the full identity system",
      "Launch site or landing page on your domain",
      "Waitlist, signup or checkout wired in and tested",
      "Pitch deck and social graphics in the same brand",
      "Product animation or launch video if you want one",
      "You own the code, the domain and every account",
    ],
    forWho: [
      { name: "Pre launch founders", body: "You need to look real before the first investor meeting or the first customer email." },
      { name: "Seed stage teams", body: "The placeholder brand is starting to embarrass you in front of people who matter." },
      { name: "Solo founders", body: "You are the whole company. You need one person who can do brand, site and the plumbing." },
    ],
    faqs: [
      {
        q: "How much does startup branding cost?",
        a: "At FlowZone, The Full Build is $1,500 flat: the brand identity, the launch site and one working system like a waitlist, signup or checkout. A brand identity on its own is $500.",
      },
      {
        q: "What should a startup brand include?",
        a: "At minimum a logo, a color and type system and a clear line that says what you do. Most startups also need a landing page that converts and a way to capture signups or payments. FlowZone builds all of it together.",
      },
      {
        q: "Can you make a pitch deck or launch video too?",
        a: "Yes. Decks, social graphics, product animations and launch videos are built in the same brand. Examples are on the work page.",
      },
      {
        q: "Who owns the brand and the code?",
        a: "You do. The files, the code, the domain and every account are handed over at the end.",
      },
    ],
    related: ["brand-design", "website-design", "logo-design"],
  },
  {
    slug: "logo-design",
    title: "Logo Design and Brand Identity",
    description:
      "Custom logo and wordmark design from FlowZone Studio, delivered as a full identity: palette, type, usage guide and every file format you need. Flat price, no templates.",
    label: "Logo design",
    h1: "A logo is ten minutes. A logo that holds up is the job.",
    answer:
      "FlowZone Studio designs custom logos and wordmarks and delivers them as part of a full identity: the mark, the palette, the type and a guide for using them, in every file format you will need. No templates and no stock marks.",
    service: "Logo design",
    get: [
      "Custom logo and wordmark",
      "Icon and small size versions that stay legible",
      "Color palette and type pairing",
      "Every file format: SVG, PNG, favicon and social avatars",
      "Usage guide with the rules written down",
      "A full round of revisions",
    ],
    forWho: [
      { name: "Brand new businesses", body: "You need a mark that works on a sign, a phone screen and a tiny browser tab." },
      { name: "Rebrands", body: "You have a logo. It does not look like the business you run now." },
      { name: "Personal brands", body: "A monogram or wordmark for a name, built to sit on a site, a deck and a profile photo." },
    ],
    faqs: [
      {
        q: "How much does a logo cost at FlowZone?",
        a: "A logo is delivered as a full brand identity, which is One Build at $500 flat. That includes the mark, palette, type, usage guide and all the files.",
      },
      {
        q: "What files will I get?",
        a: "Vector SVG, high resolution PNG, a favicon and app icon set and sized versions for social avatars and headers.",
      },
      {
        q: "How many revisions are included?",
        a: "A full round of revisions is included. If the first direction is wrong, say so and it gets redone.",
      },
      {
        q: "Do you just design the logo, or the rest of the brand too?",
        a: "Both. A logo on its own rarely survives contact with a real website, so the identity around it is part of the build.",
      },
    ],
    related: ["brand-design", "startup-branding", "website-design"],
  },
  {
    slug: "website-design",
    title: "Website Design for Startups and Small Businesses",
    description:
      "Custom website design and development from FlowZone Studio. Marketing sites, portfolios and storefronts designed against your brand, built fast and mobile first on your own domain.",
    label: "Website design",
    h1: "Website design built against your brand, not a theme.",
    answer:
      "FlowZone Studio designs and builds custom websites for startups, small businesses and personal brands: marketing sites, portfolios and full storefronts. Every site is designed against your brand, written for you, mobile first and deployed on your own domain, and you own the code.",
    service: "Website design and development",
    get: [
      "Custom design, never a template",
      "Copy written for you",
      "Mobile first, fast loading and built for search",
      "Forms, booking and payments wired in",
      "Storefront with cart and checkout if you sell",
      "Deployed on your domain, handed over with the keys",
    ],
    forWho: [
      { name: "Small businesses", body: "Your site is the first place people decide whether to trust you. It should look like it." },
      { name: "Startups", body: "A launch page that explains the product in one screen and captures the signup." },
      { name: "Sellers", body: "A real shop with cart and checkout, like cardsrg.com, the storefront built here end to end." },
    ],
    faqs: [
      {
        q: "How much does a website cost at FlowZone?",
        a: "A site on its own is One Build at $500. A site with the brand and a working system is $1,500. A full storefront with cart and checkout starts at $2,500. Every price is flat and agreed before you pay.",
      },
      {
        q: "What do you build websites with?",
        a: "Next.js, deployed on Vercel. That means fast pages, good search performance and no page builder subscription.",
      },
      {
        q: "Can you build an online store?",
        a: "Yes. cardsrg.com is a full storefront built here end to end, with cart, checkout and money landing in the owner's account.",
      },
      {
        q: "Do I own the website?",
        a: "Yes. The code, the domain and the accounts are yours. Nothing is held hostage and there is no platform to stay subscribed to.",
      },
    ],
    related: ["brand-design", "startup-branding", "logo-design"],
  },
  {
    slug: "orange-county-brand-design",
    title: "Brand and Website Design Studio in Orange County and Los Angeles",
    description:
      "FlowZone Studio is a brand and website design studio serving Orange County and Los Angeles. Logo, identity, website and storefront for local businesses and startups, at a flat price.",
    label: "Orange County and LA",
    h1: "A brand and website studio in Orange County.",
    answer:
      "FlowZone Studio is a brand and website design studio based in Orange County, California, working with businesses and startups across Orange County and Los Angeles. Brand identity, websites and storefronts, designed by one person at a flat price, with remote clients welcome anywhere.",
    service: "Brand and website design",
    get: [
      "Logo and full brand identity",
      "Custom website on your domain",
      "Storefront, booking or lead intake wired in",
      "Graphics, social templates and video",
      "One person from first call to launch",
      "Flat price agreed before you pay",
    ],
    forWho: [
      { name: "Local service businesses", body: "Contractors, clinics, studios and shops that need to look as good online as they are in person." },
      { name: "OC and LA startups", body: "Brand and launch site from someone local who picks up the phone." },
      { name: "Anyone, anywhere", body: "Most work happens online. Clients outside Southern California are welcome." },
    ],
    faqs: [
      {
        q: "Where is FlowZone Studio based?",
        a: "Orange County, California. The studio serves Orange County and Los Angeles and works with clients anywhere remotely.",
      },
      {
        q: "Do you only work with local businesses?",
        a: "No. Most projects run over email and video, which keeps them fast, so clients anywhere are welcome. Orange County and Los Angeles are home.",
      },
      {
        q: "How much does it cost?",
        a: "One Build is $500, The Full Build is $1,500 and The Storefront starts at $2,500. Flat prices, agreed before you pay.",
      },
    ],
    related: ["brand-design", "website-design", "startup-branding"],
  },
  {
    slug: "motion-graphics",
    title: "Motion Graphics, Logo Animation and Brand Video",
    description:
      "Motion graphics from FlowZone Studio: logo animations, title sequences, product explainers, promo reels and ads, cut to work with the sound off. Promo reels from $74.99.",
    label: "Motion graphics",
    h1: "Motion graphics that make a brand move.",
    answer:
      "FlowZone Studio makes motion graphics for brands: logo and brand animations, title sequences, product explainer animations, promo reels and ads, cut for feeds where the sound is off. Every piece is built from your brand, so it looks like you and nobody else.",
    service: "Motion graphics and brand video",
    get: [
      "Logo and brand animations",
      "Title sequences for shows, podcasts and series",
      "Product explainer animations",
      "Promo reels cut for sound off feeds",
      "Ads and spec spots in vertical, square and wide",
      "Voiceover, captions and music if you want them",
    ],
    forWho: [
      { name: "Brands launching something", body: "A launch deserves more than a static post. Ten seconds of motion stops the scroll." },
      { name: "Shows and podcasts", body: "A title animation that makes episode one feel like a real series." },
      { name: "Products that are hard to picture", body: "If it takes a paragraph to explain, an animation can show it in five seconds." },
    ],
    faqs: [
      {
        q: "How much do motion graphics cost at FlowZone?",
        a: "A promo reel cut for sound off feeds is $74.99. Larger pieces like a brand animation, a title sequence or a product explainer are scoped and quoted flat before you pay.",
      },
      {
        q: "What kind of animation do you make?",
        a: "Logo and brand animations, title sequences, product explainers, promo reels and ads. Examples are on the work page, including a Mahj & Coffee welcome animation, the Powered by People title animation, a SlipFolio product animation and a spec ad for Profound.",
      },
      {
        q: "What formats will I get?",
        a: "MP4 in whatever shapes you need: vertical 9:16 for Reels, TikTok and Shorts, square for feeds and 16:9 for YouTube and your site, plus a web optimized version.",
      },
      {
        q: "Can you add a voiceover or captions?",
        a: "Yes. Captions are standard since most feeds play muted, and voiceover and music can be added.",
      },
    ],
    related: ["graphic-design", "brand-design", "startup-branding"],
    offers: [{ name: "Promo reel", price: "74.99" }],
    priceLine:
      "Promo reels cut for sound off feeds are $74.99. Brand animations, title sequences and product explainers are quoted flat before you pay. Brand, site and system builds start at $500.",
  },
  {
    slug: "graphic-design",
    title: "Graphic Design: Social Graphics, Flyers, Decks and Ads",
    description:
      "On brand graphic design from FlowZone Studio: social post packs, flyers, ad creative, presentation decks, one pagers, channel art and thumbnails. $49.99 each, flat.",
    label: "Graphic design",
    h1: "Graphic design, one flat price per piece.",
    answer:
      "FlowZone Studio designs single graphics for brands that already have a foundation: social post packs, flyers, story and ad creative, presentation decks, one pagers, channel art, thumbnails and email headers. Each one is $49.99, flat, and if it is a single graphic, it can be made.",
    service: "Graphic design",
    get: [
      "Social post pack, three graphics",
      "Flyer, poster or cover",
      "Story or ad creative",
      "Presentation or pitch deck",
      "One pager or sell sheet",
      "Channel art, thumbnails and email headers",
    ],
    forWho: [
      { name: "Brands with a look already", body: "You have the logo and colors. You need the next ten posts to match them." },
      { name: "Events and launches", body: "A flyer, a story set and an ad, all in one style, ready the same week." },
      { name: "Founders pitching", body: "A deck that looks like the company you are about to become." },
    ],
    faqs: [
      {
        q: "How much does a graphic cost?",
        a: "$49.99 per graphic or per pack, flat. That covers flyers, a three post social pack, ad creative, decks, one pagers, channel art, thumbnails and email headers.",
      },
      {
        q: "What if I do not have a brand yet?",
        a: "Then a $49.99 graphic will not fix it, and we will tell you so. A brand identity is One Build at $500, and after that every graphic has something to match.",
      },
      {
        q: "Can I get a free sample?",
        a: "Yes. There is a free sample graphic offer on the site so you can see the work before paying for anything.",
      },
    ],
    related: ["motion-graphics", "brand-design", "logo-design"],
    offers: [{ name: "Single graphic or pack", price: "49.99" }],
    priceLine:
      "Every single graphic or pack is $49.99, flat. Brand identities start at $500 and The Full Build (brand, site and one working system) is $1,500.",
  },
];

export const LANDING_NAV: Record<string, string> = {
  "brand-design": "Brand design",
  "startup-branding": "Startup branding",
  "logo-design": "Logo design",
  "website-design": "Website design",
  "motion-graphics": "Motion graphics",
  "graphic-design": "Graphic design",
  "orange-county-brand-design": "Orange County and LA",
  questions: "Questions",
};

export function getLanding(slug: string): Landing {
  const l = LANDINGS.find((x) => x.slug === slug);
  if (!l) throw new Error(`No landing page for ${slug}`);
  return l;
}
