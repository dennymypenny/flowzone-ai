import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Flow from "@/components/Flow";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "FlowZone AI | Creative Studio",
    template: "%s | FlowZone AI",
  },
  description: `${SITE.line} ${SITE.descriptor}`,
  metadataBase: new URL(SITE.url),
  openGraph: {
    siteName: "FlowZone AI",
    type: "website",
    title: "FlowZone AI, a creative studio",
    description: `${SITE.line} ${SITE.descriptor}`,
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowZone AI, a creative studio",
    description: `${SITE.line} ${SITE.descriptor}`,
  },
  keywords: [
    "creative studio",
    "brand identity studio",
    "website design and build",
    "ecommerce storefront design",
    "brand and site studio",
    "small studio",
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
      </head>
      <body className="antialiased bg-paper text-ink">
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-[#4C7BE8]" />
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
        <Flow />
      </body>
    </html>
  );
}
