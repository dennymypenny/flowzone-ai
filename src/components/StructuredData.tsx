import { SITE } from "@/lib/site";

/**
 * Tells Google what FlowZone is, who runs it and where else it exists.
 * This is what lets a brand-name search show the studio with its own
 * sitelinks rather than a bare blue link.
 */
export default function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${SITE.url}/#organization`,
        name: "FlowZone",
        // Only real alternates. Repeating the name here says nothing.
        alternateName: ["FlowZone Studio", "FlowZone Dev", "flowzone.dev"],
        url: SITE.url,
        email: SITE.email,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            email: SITE.email,
            // Matches the areaServed on the organization below. The two used
            // to disagree, US here and Worldwide there.
            areaServed: "Worldwide",
            availableLanguage: "English",
          },
        ],
        slogan: "You imagine it. We get it moving.",
        description: SITE.descriptor,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE.url}/#logo`,
          url: `${SITE.url}/opengraph-image.jpg`,
          width: 1200,
          height: 630,
        },
        image: `${SITE.url}/opengraph-image.jpg`,
        foundingDate: "2026",
        sameAs: [SITE.linkedin, SITE.linkedinFounder, SITE.x],
        // The Person node is already in this graph. Point at it so Google
        // connects the studio to the person who runs it.
        founder: { "@id": `${SITE.url}/#founder` },
        areaServed: "Worldwide",
        priceRange: "$$",
        knowsAbout: [
          "Brand identity",
          "Logo and wordmark design",
          "Website design and development",
          "Ecommerce storefronts",
          "Business systems",
        ],
        // Prices track /pricing. If a tier changes there, change it here in
        // the same commit or the rich result starts quoting a stale number.
        makesOffer: [
          {
            "@type": "Offer",
            name: "Starter",
            price: "600",
            priceCurrency: "USD",
            url: `${SITE.url}/pricing`,
            description: "One part: Brand, Site or System, built and handed over finished.",
          },
          {
            "@type": "Offer",
            name: "Growth",
            price: "2497",
            priceCurrency: "USD",
            url: `${SITE.url}/pricing`,
            description: "Brand, site and one system wired together and handed over working.",
          },
          {
            "@type": "Offer",
            name: "Scale",
            url: `${SITE.url}/pricing`,
            description: "Multi brand, larger catalogs and custom integrations, quoted flat.",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: "FlowZone Studio",
        alternateName: "FlowZone",
        description: SITE.descriptor,
        publisher: { "@id": `${SITE.url}/#organization` },
        inLanguage: "en-US",
      },
      {
        "@type": "Person",
        "@id": `${SITE.url}/#founder`,
        name: "Dennis Valdes",
        jobTitle: "Founder",
        worksFor: { "@id": `${SITE.url}/#organization` },
        sameAs: [SITE.linkedinFounder, SITE.x],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
