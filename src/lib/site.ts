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
