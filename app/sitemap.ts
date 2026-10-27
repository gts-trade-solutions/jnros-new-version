import type { MetadataRoute } from "next";
import { services, site, solutions } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    ...["/solutions", "/services", "/contact"].map((p) => ({ url: url(p), lastModified, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...["/about", "/gallery"].map((p) => ({ url: url(p), lastModified, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];

  return [...pages, ...[...solutions, ...services].map((o) => ({ url: url(o.href), lastModified, changeFrequency: "monthly" as const, priority: 0.8 }))];
}
