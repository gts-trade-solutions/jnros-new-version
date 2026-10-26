import type { MetadataRoute } from "next";
import { caseStudies, locations, news, services, site } from "@/lib/data";
import { featuredIndustries } from "@/lib/industries";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    ...["/services", "/industries", "/case-studies", "/locations", "/get-a-quote", "/contact"].map((p) => ({ url: url(p), lastModified, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...["/about", "/safety", "/careers", "/news"].map((p) => ({ url: url(p), lastModified, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...["/privacy", "/terms"].map((p) => ({ url: url(p), lastModified, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];

  return [
    ...pages,
    ...services.map((s) => ({ url: url(`/services/${s.slug}`), lastModified, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...featuredIndustries.map((i) => ({ url: url(`/industries/${i.slug}`), lastModified, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...caseStudies.map((c) => ({ url: url(`/case-studies/${c.slug}`), lastModified, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...locations.map((l) => ({ url: url(`/locations/${l.slug}`), lastModified, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...news.map((n) => ({ url: url(`/news/${n.slug}`), lastModified: new Date(n.date), changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
