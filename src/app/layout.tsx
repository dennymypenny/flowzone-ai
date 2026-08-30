import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Flow from "@/components/Flow";
import ChatDock from "@/app/components/ChatDock";
import StructuredData from "@/components/StructuredData";
import { Analytics } from "@vercel/analytics/react";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "FlowZone Studio | Brand, Website and Storefront Design",
    template: "%s | FlowZone Studio",
  },
  applicationName: "FlowZone",
  // Saved to a phone home screen it is called FlowZone and wears the same
  // three-dot mark as the X avatar (apple-icon.png, manifest.ts, icon.svg).
  appleWebApp: { title: "FlowZone", capable: true, statusBarStyle: "black-translucent" },
  // No alternates here on purpose. App Router inherits alternates into every
  // child segment, so a canonical set at the root made every page claim to be
  // a duplicate of the homepage. Each page declares its own canonical instead.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  authors: [{ name: "Dennis Valdes", url: SITE.linkedinFounder }],
  creator: "FlowZone",
  publisher: "FlowZone",
  description: SITE.descriptor,
  metadataBase: new URL(SITE.url),
  // Fallback only, for any route that forgets to declare its own. Metadata
  // merging is shallow, so a page that sets openGraph replaces this whole
  // block. Every page below does exactly that.
  openGraph: {
    siteName: "FlowZone",
    type: "website",
    title: "FlowZone Studio, brand, website and storefront design",
    description: SITE.descriptor,
    url: SITE.url,
    locale: "en_US",
  },
  // No title or description here. X falls back to og:title and og:description
  // when the twitter tags are missing, so leaving them out lets every page
  // preview as itself instead of as the homepage.
  twitter: {
    card: "summary_large_image",
  },
  keywords: [
    "FlowZone",
    "flowzone.dev",
    "FlowZone studio",
    "creative studio",
    "brand identity studio",
    "website design and build",
    "ecommerce storefront design",
    "done for you brand and website",
  ],
};

export const viewport: Viewport = {
  themeColor: "#080D18",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <StructuredData />
      </head>
      <body className="antialiased bg-paper text-ink">
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-[#4C7BE8]" />
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
        <Flow />
        <ChatDock />
        <Analytics />
      </body>
    </html>
  );
}
