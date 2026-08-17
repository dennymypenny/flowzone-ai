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
        alternateName: ["FlowZone", "FlowZone Studio", "flowzone.dev"],
        url: SITE.url,
        email: SITE.email,
        telephone: SITE.phone,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: SITE.phone,
            email: SITE.email,
            areaServed: "US",
            availableLanguage: "English",
          },
        ],
        slogan: "You imagine it. We get it moving.",
        description: SITE.descriptor,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE.url}/#logo`,
          url: `${SITE.url}/opengraph-image.png`,
          width: 1200,
          height: 630,
        },
        image: `${SITE.url}/opengraph-image.png`,
        foundingDate: "2026",
        sameAs: [SITE.linkedin, SITE.linkedinFounder],
        areaServed: "Worldwide",
        priceRange: "$$",
        knowsAbout: [
          "Brand identity",
          "Logo and wordmark design",
          "Website design and development",
          "Ecommerce storefronts",
          "Business systems",
        ],
        makesOffer: [
          {
            "@type": "Offer",
            name: "Starter",
            price: "600",
            priceCurrency: "USD",
            description: "One part: Brand, Site or System, built and handed over finished.",
          },
          {
            "@type": "Offer",
            name: "Growth",
            price: "2497",
            priceCurrency: "USD",
            description: "Brand, site and one system wired together and handed over working.",
          },
          {
            "@type": "Offer",
            name: "Scale",
            description: "Multi brand, larger catalogs and custom integrations, quoted flat.",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: "FlowZone",
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
        sameAs: [SITE.linkedinFounder],
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
