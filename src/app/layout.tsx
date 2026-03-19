import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "FlowZone AI | Automate Your Business in 48 Hours",
    template: "%s | FlowZone AI",
  },
  description:
    "FlowZone AI builds done-for-you automations that save your team 10+ hours a week. Get a free AI audit and custom automation plan delivered in 24 hours.",
  metadataBase: new URL("https://flowzone.dev"),
  openGraph: {
    siteName: "FlowZone AI",
    type: "website",
    title: "FlowZone AI — Done-For-You Business Automation",
    description:
      "We build custom automations that eliminate manual work, reduce errors, and scale your operations. Free AI audit delivered in 24 hours.",
  },
  keywords: [
    "business automation",
    "AI automation",
    "workflow automation",
    "done-for-you automation",
    "no-code automation",
    "Zapier alternative",
    "Make automation",
    "HubSpot automation",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
