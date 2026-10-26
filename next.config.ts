import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // The whole stylesheet is ~14 KB gzipped. Inlining it removes the only render-blocking request,
    // so the first frame (preloader / hero) paints without waiting on a network round trip.
    inlineCss: true,
    // The Industries quote form accepts up to 5 attachments of 10 MB each.
    serverActions: { bodySizeLimit: "52mb" },
  },
  images: {
    // Placeholder photography. Swap for your own CDN / local images before launch.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-**" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
