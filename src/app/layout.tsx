import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Flow from "@/components/Flow";
import StructuredData from "@/components/StructuredData";
import { Analytics } from "@vercel/analytics/react";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "FlowZone AI | Brand, Site and Systems Studio",
    template: "%s | FlowZone AI",
  },
  applicationName: "FlowZone AI",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  authors: [{ name: "Dennis Valdes", url: SITE.linkedinFounder }],
  creator: "FlowZone AI",
  publisher: "FlowZone AI",
  description: SITE.descriptor,
  metadataBase: new URL(SITE.url),
  openGraph: {
    siteName: "FlowZone AI",
    type: "website",
    title: "FlowZone AI, a creative studio",
    description: SITE.descriptor,
    url: SITE.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowZone AI, a creative studio",
    description: SITE.descriptor,
  },
  keywords: [
    "FlowZone",
    "FlowZone AI",
    "flowzone.dev",
    "FlowZone studio",
    "creative studio",
    "brand identity studio",
    "website design and build",
    "ecommerce storefront design",
    "done for you brand and website",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
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
        <Analytics />
      </body>
    </html>
  );
}
