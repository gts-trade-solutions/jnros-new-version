/**
 * Photography helpers. Shared by lib/data.ts and lib/industries.ts (kept in its own module so the
 * two content files never import each other at runtime).
 *
 * Images are Unsplash placeholders (see next.config.ts remotePatterns), requested with a fixed
 * server-side crop so next/image always knows the aspect ratio.
 */

export type Img = { src: string; alt: string; width: number; height: number };

export function photo(id: string, alt: string, width = 2000, height = 1333): Img {
  return {
    src: `https://images.unsplash.com/photo-${id}?fit=crop&crop=entropy&w=${width}&h=${height}&q=80&fm=jpg`,
    alt,
    width,
    height,
  };
}

export const portrait = (id: string, alt: string) => photo(id, alt, 1200, 1600);
export const square = (id: string, alt: string) => photo(id, alt, 1400, 1400);
