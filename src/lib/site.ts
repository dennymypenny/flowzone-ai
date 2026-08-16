// Single source of truth for FlowZone's public identity.
// Change it here, it changes everywhere.

export const SITE = {
  name: "FlowZone",
  fullName: "FlowZone AI",

  // The one positioning line. Do not run a second one anywhere.
  line: "AI gives us the speed. Humans give it the taste.",

  // The one descriptor. Used in nav, footer, metadata and the chat.
  descriptor:
    "A creative studio building brands, sites and the systems that run them.",

  // Displayed publicly. Must have a working mailbox before this ships.
  email: "hello@flowzone.dev",

  // Where lead notifications are actually delivered. Server side only.
  leadInbox: "flowzoneautomation@gmail.com",

  url: "https://flowzone.dev",
} as const;

export const PILLARS = [
  {
    num: "01",
    name: "Brand",
    line: "What people recognize you by.",
    body:
      "Name treatment, logo, palette, type and the rules for using them. Built so the site and everything after it has something to be built from.",
    items: ["Logo and wordmark", "Color and type system", "Voice and messaging", "Usage guide you can hand to anyone"],
  },
  {
    num: "02",
    name: "Site",
    line: "Where people decide.",
    body:
      "A marketing site or a full storefront, designed against your brand rather than a theme. Fast, mobile first and deployed on your own domain.",
    items: ["Custom design, no templates", "Marketing site or storefront", "Copy written for you", "Payments and forms wired up"],
  },
  {
    num: "03",
    name: "System",
    line: "What keeps running after launch.",
    body:
      "The unglamorous part that decides whether the brand survives contact with real customers. Lead intake, booking, invoicing, reporting, built in and tested.",
    items: ["Lead intake and follow up", "Booking and reminders", "Invoicing and payments", "Reporting you actually read"],
  },
] as const;
