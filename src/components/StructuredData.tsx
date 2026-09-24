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
        alternateName: [
          "FlowZone Studio",
          "Flow Zone",
          "Flow Zone Studio",
          "FlowZone Design",
          "FlowZone Creative Studio",
          "FlowZone Dev",
          "flowzonedev",
          "flowzone.dev",
        ],
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
        description: SITE.seo,
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
        areaServed: [
          { "@type": "AdministrativeArea", name: "Orange County, California" },
          { "@type": "AdministrativeArea", name: "Los Angeles County, California" },
          "Worldwide",
        ],
        priceRange: "$$",
        knowsAbout: [
          "Brand design",
          "Brand identity",
          "Startup branding",
          "Personal branding",
          "Logo and wordmark design",
          "Graphic design",
          "Website design and development",
          "Landing page design",
          "Ecommerce storefronts",
          "Motion graphics",
          "Logo animation",
          "Brand video",
          "Title sequences",
          "Social media graphics",
          "Pitch deck design",
          "Business systems",
        ],
        telephone: "+1-786-333-7887",
        address: {
          "@type": "PostalAddress",
          addressRegion: "CA",
          addressCountry: "US",
        },
        // Prices track /pricing. If a tier changes there, change it here in
        // the same commit or the rich result starts quoting a stale number.
        makesOffer: [
          {
            "@type": "Offer",
            name: "One Build",
            price: "500",
            priceCurrency: "USD",
            url: `${SITE.url}/pricing`,
            description: "One build: brand identity, website or the system that runs things, finished and handed over.",
          },
          {
            "@type": "Offer",
            name: "The Full Build",
            price: "1500",
            priceCurrency: "USD",
            url: `${SITE.url}/pricing`,
            description: "Brand identity, website and one working system wired together and handed over.",
          },
          {
            "@type": "Offer",
            name: "The Storefront",
            priceSpecification: { "@type": "PriceSpecification", minPrice: "2500", priceCurrency: "USD" },
            url: `${SITE.url}/pricing`,
            description: "A full online store with cart and checkout, quoted flat.",
          },
          {
            "@type": "Offer",
            name: "Small jobs",
            price: "49.99",
            priceCurrency: "USD",
            url: `${SITE.url}/pricing`,
            description: "A single graphic, social post pack or speed and mobile fix for brands that already have a foundation.",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: "FlowZone Studio",
        alternateName: ["FlowZone", "Flow Zone", "Flow Zone Studio", "flowzone.dev"],
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
