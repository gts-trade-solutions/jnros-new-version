"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * next/image loader for the pre-built static WebP files (scripts/optimize-images.mjs):
 * /images/odc-cargo-shipping.jpeg at 960w → /img/images/odc-cargo-shipping-960.webp.
 * Any other src is used as-is.
 */
export default function imageLoader({ src, width }: ImageLoaderProps) {
  const match = /^\/(images|brand)\/(.+)\.[a-z0-9]+$/i.exec(src);
  return match ? `/img/${match[1]}/${match[2]}-${width}.webp` : src;
}
