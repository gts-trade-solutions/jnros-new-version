/**
 * Photography helper for lib/data.ts. Every photo is Jnros' own, taken from jnroslogistics.com and
 * served from /public/images; width and height are the file's real pixel size, so next/image
 * always knows the aspect ratio.
 */

export type Img = { src: string; alt: string; width: number; height: number };

export function photo(file: string, alt: string, width: number, height: number): Img {
  return { src: `/images/${file}`, alt, width, height };
}
