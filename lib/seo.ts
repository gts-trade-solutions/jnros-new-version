import type { Metadata } from "next";
import { hero, type Img, type Offering, site } from "./data";

/** Social share image: the photo itself, at its own size. */
export function ogImage(image: Img) {
  return { url: image.src, width: image.width, height: image.height, alt: image.alt };
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
    openGraph: { type: "website", locale: "en_IN", siteName: site.name, url: path, title: `${title} | ${site.name}`, description, images },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description, images: images?.map((i) => i.url) },
  };
}

const abs = (path: string) => new URL(path, site.url).toString();

/** The Bangalore office as a LocalBusiness. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": abs("/#organization"),
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    logo: abs("/brand/jnros-badge.png"),
    image: abs(hero.slides[0].image.src),
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    sameAs: site.socials.map((s) => s.href),
  };
}

export function offeringJsonLd(o: Offering) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: o.title,
    description: o.short,
    serviceType: o.title,
    url: abs(o.href),
    image: abs(o.image.src),
    provider: { "@id": abs("/#organization") },
  };
}

export function breadcrumbJsonLd(trail: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: abs(c.href) })),
  };
}
