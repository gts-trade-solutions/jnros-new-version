import type { NextConfig } from "next";
import { services, solutions } from "./lib/data";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // The whole stylesheet is ~14 KB gzipped. Inlining it removes the only render-blocking request,
    // so the first frame (preloader / hero) paints without waiting on a network round trip.
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The previous WordPress site served every page from the root (/about-us/, /odc-cargo-shipping/…).
  // Send those URLs to their new homes so existing links and search results keep working.
  async redirects() {
    return [
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      ...[...solutions, ...services].map((o) => ({ source: `/${o.slug}`, destination: o.href, permanent: true })),
    ];
  },
};

export default nextConfig;
