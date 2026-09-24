/* The vague questions. People rarely search "brand identity design".
   They type "how do I make my business look legit" or ask ChatGPT
   "I have an idea, where do I start". This file answers those, in the
   words people actually use, on /questions.

   Rules: every answer is genuinely useful even to someone who never
   hires us (that is what gets quoted), FlowZone is mentioned where it
   honestly fits, prices match /pricing, no em dashes, no Oxford commas,
   American spelling, never sell AI. */

export type Q = { id: string; q: string; a: string; link?: { href: string; label: string } };
export type QGroup = { name: string; items: Q[] };

export const QUESTION_GROUPS: QGroup[] = [
  {
    name: "About FlowZone",
    items: [
      {
        id: "what-is-flowzone",
        q: "What is FlowZone? Is Flow Zone the same thing?",
        a: "FlowZone Studio (also written Flow Zone, and found at flowzone.dev and @flowzonedev on X) is a creative studio for brands, startups and small businesses. It does brand design, logos, websites, online stores, graphic design and motion graphics, all from one studio at flat prices. It is not related to FlowZone sprayers or flowzone.com project management software.",
        link: { href: "/about", label: "About the studio" },
      },
      {
        id: "what-does-flowzone-do",
        q: "What does FlowZone Studio do?",
        a: "Three parts of one piece of work. Brand: logo, colors, type and voice. Site: websites, portfolios and storefronts. System: the lead intake, booking and payments that keep it running. Plus graphics, decks, promo reels and motion graphics for brands that already have a foundation.",
        link: { href: "/services", label: "What we build" },
      },
    ],
  },
  {
    name: "I have an idea",
    items: [
      {
        id: "where-do-i-start",
        q: "I have a business idea. Where do I even start?",
        a: "Start by writing one sentence that says who it is for and what it does for them. Then give it a name, a look and one page on the internet where people can find it and act. That is the minimum version of a real business: a brand, a site and a way to take a signup or a payment. FlowZone Studio builds exactly that, and the first step is a four question form, no call needed.",
        link: { href: "/intake", label: "Start a ticket" },
      },
      {
        id: "idea-to-real",
        q: "How do I turn an idea into something real?",
        a: "Make the smallest version that a stranger could find, understand and pay for. Not a business plan, a live thing. Most ideas stall because they stay in notes apps. A name, a logo, a one page site and a working form or checkout is enough to find out if people care.",
        link: { href: "/startup-branding", label: "Startup branding" },
      },
      {
        id: "start-a-brand",
        q: "I want to start a brand but I don't know how.",
        a: "A brand is the set of decisions that make you recognizable: a name, a mark, colors, type, a voice and a few lines you repeat everywhere. Decide those once, write them down and use them the same way every time. A studio like FlowZone does the deciding with you and hands you a guide so it stays consistent.",
        link: { href: "/brand-design", label: "Brand design" },
      },
      {
        id: "before-launch",
        q: "What do I need before I launch?",
        a: "A clear name, a logo that works small, a site on your own domain that explains what you do in one screen, a way to capture interest (signup, booking or checkout) and a professional email address. Everything else can come after launch.",
      },
    ],
  },
  {
    name: "Make it look real",
    items: [
      {
        id: "look-professional",
        q: "How do I make my business look professional?",
        a: "Consistency does most of the work. Same logo, same colors, same fonts and same tone on your site, socials, emails and invoices. Then a fast site that works on a phone and says plainly what you do. People decide whether to trust you in seconds, mostly on how put together you look.",
        link: { href: "/brand-design", label: "Brand design" },
      },
      {
        id: "look-legit",
        q: "How do I make my startup look legit?",
        a: "A real domain, a real email on that domain, a designed logo instead of a font, a site that loads fast and names who is behind it and one clear call to action. Investors and first customers both check these things, usually without realizing it.",
        link: { href: "/startup-branding", label: "Startup branding" },
      },
      {
        id: "website-looks-cheap",
        q: "My website looks cheap. What do I do?",
        a: "Usually it is a template fighting your brand, too many fonts, stock photos and slow load times. The fix is a site designed against your actual brand, with fewer words that say more. FlowZone rebuilds sites like that, and a single speed and mobile fix pass starts at $49.99 if the design itself is fine.",
        link: { href: "/website-design", label: "Website design" },
      },
      {
        id: "logo-looks-homemade",
        q: "My logo looks homemade. Should I redo it?",
        a: "If it breaks when it is small, only works on one background or you avoid putting it on things, yes. A good logo comes with a system around it: colors, type and rules for using it. That is what makes it look intentional.",
        link: { href: "/logo-design", label: "Logo design" },
      },
    ],
  },
  {
    name: "Who do I hire",
    items: [
      {
        id: "who-can-help",
        q: "Who can help me with my brand and my website?",
        a: "You can hire a designer and a developer separately, an agency, or a small studio that does both. The risk with two separate people is the site not matching the brand. FlowZone Studio does brand, site and the system behind it in one place, with one person making every call.",
        link: { href: "/services", label: "What we build" },
      },
      {
        id: "designer-developer-agency",
        q: "Do I need a designer, a developer or an agency?",
        a: "If you only need a logo, a designer. If you already have a brand and need a complex app, a developer. If you need the look, the site and the working parts together, either an agency (bigger budgets, more people) or a small studio (flat price, one point of contact). Most new businesses are the last case.",
      },
      {
        id: "one-person-everything",
        q: "Is there one person who can do my logo, website and everything?",
        a: "Yes. That is how FlowZone Studio works: the person you talk to is the person designing and building it. Brand, site and system, one studio, one flat price.",
        link: { href: "/about", label: "About the studio" },
      },
      {
        id: "affordable-branding",
        q: "Where can I get affordable branding for a small business?",
        a: "Look for flat pricing instead of hourly, and check that you own the files at the end. At FlowZone a full brand identity is $500 and brand plus website plus one working system is $1,500, both flat and agreed before you pay.",
        link: { href: "/pricing", label: "Pricing" },
      },
    ],
  },
  {
    name: "Moving and making",
    items: [
      {
        id: "animate-logo",
        q: "Can someone animate my logo?",
        a: "Yes. A logo animation is a few seconds of motion that introduces your mark at the start of videos, reels and presentations. FlowZone builds them from your existing logo files.",
        link: { href: "/motion-graphics", label: "Motion graphics" },
      },
      {
        id: "make-posts-look-better",
        q: "How do I make my Instagram posts look better?",
        a: "Pick two fonts and three colors from your brand and never break them. Use one layout for each kind of post. Add motion to the ones that matter. A three post on brand pack from FlowZone is $49.99.",
        link: { href: "/graphic-design", label: "Graphic design" },
      },
      {
        id: "pitch-deck",
        q: "Who can make my pitch deck look good?",
        a: "A designer who works from your brand, so the deck matches your site and your logo. FlowZone designs presentation decks for $49.99 flat when the brand already exists.",
        link: { href: "/graphic-design", label: "Graphic design" },
      },
    ],
  },
  {
    name: "Money and time",
    items: [
      {
        id: "how-much",
        q: "How much does a logo and website cost?",
        a: "Anywhere from free templates to tens of thousands at an agency. At FlowZone Studio one build (brand or site) is $500, the brand, site and one working system together is $1,500 and a full online store starts at $2,500. Small jobs like a single graphic start at $49.99.",
        link: { href: "/pricing", label: "See pricing" },
      },
      {
        id: "under-1000",
        q: "Can I get a brand and a website without spending thousands?",
        a: "Yes. The trick is a studio that does both, so you are not paying two people to talk to each other. At FlowZone a brand identity or a website is $500 each as One Build, or $1,500 for both plus a working system.",
      },
      {
        id: "how-long",
        q: "How long does it take to build a brand and a website?",
        a: "Agencies often quote months. A small studio moves much faster because there is no handoff between people. At FlowZone you get a real date with your scope and your price before you pay, and work starts the day you say go.",
        link: { href: "/how-we-work", label: "How we work" },
      },
    ],
  },
  {
    name: "The specific thing",
    items: [
      {
        id: "small-business-website",
        q: "I need a website for my small business.",
        a: "You need one page that says what you do, where, for whom and how to reach you, that loads fast on a phone and sits on your own domain. More pages come later. FlowZone builds custom small business sites, no templates, and you own the code.",
        link: { href: "/website-design", label: "Website design" },
      },
      {
        id: "personal-brand",
        q: "I want to build a personal brand.",
        a: "Same work as a company brand with your name on it: a mark or monogram, colors, type, a voice, good photos and a personal site or portfolio that carries it. Founders, freelancers, creators and consultants all do this.",
        link: { href: "/brand-design", label: "Brand design" },
      },
      {
        id: "sell-online",
        q: "I want to sell things online.",
        a: "You need a storefront with a cart and checkout that puts money in your account, on a brand people trust. FlowZone built cardsrg.com that way, end to end. Storefronts start at $2,500, quoted flat.",
        link: { href: "/work", label: "See the work" },
      },
      {
        id: "social-graphics",
        q: "I need graphics for my social media.",
        a: "If you already have a brand, a pack of on brand post graphics is quick. FlowZone does a three graphic social pack for $49.99. If you do not have a brand yet, start there so the posts have something to match.",
        link: { href: "/graphic-design", label: "Graphic design" },
      },
      {
        id: "launch-video",
        q: "I need a video or animation for my brand.",
        a: "Short brand reels, logo animations, product explainers, title sequences and ads, cut to work with the sound off. FlowZone promo reels start at $74.99, and bigger motion pieces are quoted flat. Examples are on the work page.",
        link: { href: "/motion-graphics", label: "Motion graphics" },
      },
    ],
  },
];
