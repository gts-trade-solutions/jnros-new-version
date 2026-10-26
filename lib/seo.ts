import type { Metadata } from "next";
import { type Img, type Location, locations, type NewsPost, type Service, site } from "./data";
import type { FeaturedIndustry } from "./industries";

/** Social share crop (1200×630) of any Unsplash placeholder. */
export function ogImage(image: Img) {
  return { url: image.src.replace(/w=\d+&h=\d+/, "w=1200&h=630"), width: 1200, height: 630, alt: image.alt };
}

/**
 * Per-page metadata with canonical URL, Open Graph and Twitter cards. Paths are relative and
 * resolved against metadataBase (app/layout.tsx).
 */
export function pageMetadata({ title, description, path, image }: { title: string; description: string; path: string; image?: Img }): Metadata {
  const images = image ? [ogImage(image)] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "en_US", siteName: site.name, url: path, title: `${title} | ${site.name}`, description, images },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description, images: images?.map((i) => i.url) },
  };
}

const abs = (path: string) => new URL(path, site.url).toString();

function postalAddress(l: Location) {
  return {
    "@type": "PostalAddress",
    streetAddress: l.street,
    addressLocality: l.locality.split(",")[0],
    addressRegion: l.regionCode,
    postalCode: l.postalCode,
    addressCountry: l.country === "USA" ? "US" : l.country === "Canada" ? "CA" : "MX",
  };
}

/** Headquarters as a LocalBusiness, with every branch listed as a department. */
export function organizationJsonLd() {
  const hq = locations.find((l) => l.hq)!;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": abs("/#organization"),
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    logo: abs("/brand/jnros-badge.png"),
    image: hq.image.src,
    telephone: site.phone,
    email: site.email,
    foundingDate: String(site.founded),
    priceRange: "$$$",
    address: postalAddress(hq),
    geo: { "@type": "GeoCoordinates", latitude: hq.lat, longitude: hq.lng },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "06:00",
      closes: "18:00",
    },
    areaServed: ["United States", "Canada", "Mexico"],
    sameAs: site.socials.map((s) => s.href),
    department: locations.filter((l) => !l.hq).map((l) => ({
      "@type": "LocalBusiness",
      name: `${site.name} ${l.city}`,
      url: abs(`/locations/${l.slug}`),
      telephone: l.phone,
      address: postalAddress(l),
    })),
  };
}

export function locationJsonLd(l: Location) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": abs(`/locations/${l.slug}#branch`),
    name: `${site.name} ${l.city}`,
    description: l.description,
    url: abs(`/locations/${l.slug}`),
    image: l.image.src,
    telephone: l.phone,
    address: postalAddress(l),
    geo: { "@type": "GeoCoordinates", latitude: l.lat, longitude: l.lng },
    parentOrganization: { "@id": abs("/#organization") },
  };
}

export function serviceJsonLd(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.short,
    serviceType: s.title,
    url: abs(`/services/${s.slug}`),
    image: s.image.src,
    areaServed: ["United States", "Canada", "Mexico"],
    provider: { "@id": abs("/#organization") },
  };
}

/** /industries: a collection page listing every featured industry. */
export function industriesJsonLd(industries: FeaturedIndustry[], description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Industries We Serve",
    description,
    url: abs("/industries"),
    publisher: { "@id": abs("/#organization") },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: industries.length,
      itemListElement: industries.map((industry, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: industry.name,
        url: abs(`/industries/${industry.slug}`),
      })),
    },
  };
}

/** /industries/[slug]: Jnros' services for that industry, as a Service with a business audience. */
export function industryJsonLd(industry: FeaturedIndustry) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${industry.name} services`,
    description: industry.subtitle,
    url: abs(`/industries/${industry.slug}`),
    image: industry.heroImage.src,
    serviceType: industry.tags,
    audience: { "@type": "BusinessAudience", audienceType: industry.name },
    areaServed: ["United States", "Canada", "Mexico"],
    provider: { "@id": abs("/#organization") },
  };
}

export function articleJsonLd(post: NewsPost) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    image: [post.image.src],
    datePublished: post.date,
    dateModified: post.date,
    url: abs(`/news/${post.slug}`),
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@id": abs("/#organization") },
  };
}

export function breadcrumbJsonLd(trail: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: abs(c.href) })),
  };
}
