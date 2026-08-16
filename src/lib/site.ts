// Single source of truth for FlowZone's public identity.
// Change it here, it changes everywhere.

export const SITE = {
  name: "FlowZone",
  fullName: "FlowZone AI",

  // The one positioning line. Do not run a second one anywhere.
  line: "AI gives us the speed. Humans give it the taste.",

  // The one descriptor. Used in nav, footer, metadata and the chat.
  descriptor:
    "You imagine it. We get it moving. Arrive with an intention, leave with the running thing: brand, site and system, built for you.",

  // Displayed publicly. Swap to hello@flowzone.dev the day that mailbox exists.
  // This is the ONLY place it is written down, so it is a one line change.
  email: "flowzoneautomation@gmail.com",

  // Where lead notifications are delivered. Server side only.
  leadInbox: "flowzoneautomation@gmail.com",

  // LinkedIn is the only social the studio actually works. Keep it visible.
  linkedin: "https://www.linkedin.com/company/116623924/",
  linkedinFounder: "https://www.linkedin.com/in/dennisvaldesjr/",

  // Instant contact. E.164 for the sms: link, readable form for anything a
  // human looks at. Left empty, every Text us button quietly falls back to
  // email so nothing ever breaks.
  phone: "+17863337887",
  phoneDisplay: "(786) 333-7887",

  // Prefilled mailto used by every primary CTA
  mailto:
    "mailto:flowzoneautomation@gmail.com?subject=New%20project%20for%20FlowZone&body=Hi%20FlowZone%2C%0A%0AHere%20is%20what%20I%20want%20to%20get%20moving%3A%0A%0A%0AWhat%20I%20already%20have%20(brand%2C%20site%2C%20anything)%3A%0A%0A%0AWhen%20I%20want%20it%20live%3A%0A%0A%0AThanks%2C%0A",

  url: "https://flowzone.dev",
} as const;

export const PILLARS = [
  {
    num: "01",
    name: "Brand",
    // Colors come straight off the three dots in the mark. Left to right.
    color: "#4C7BE8",
    icon: "🎨",
    line: "What people recognize you by.",
    lead: true,
    body:
      "This is what the studio is best at. The mark, the palette, the type, the voice and the feel, decided properly so everything after it has something to be built from.",
    items: ["Logo and wordmark", "Color and type system", "Voice, copy and messaging", "Usage guide you can hand to anyone"],
  },
  {
    num: "02",
    name: "Site",
    color: "#5B9BF9",
    icon: "🌐",
    line: "Where people decide.",
    body:
      "A marketing site or a full storefront, designed against your brand rather than a theme. Fast, mobile first and deployed on your own domain.",
    items: ["Custom design, no templates", "Marketing site or storefront", "Copy written for you", "Payments and forms wired up"],
  },
  {
    num: "03",
    name: "System",
    color: "#C6E4F8",
    icon: "⚙️",
    line: "What keeps running after launch.",
    body:
      "The unglamorous part that decides whether the brand survives contact with real customers. Lead intake, booking, invoicing, reporting, built in and tested.",
    items: ["Lead intake and follow up", "Booking and reminders", "Invoicing and payments", "Reporting you actually read"],
  },
] as const;
