/**
 * Photography helper for lib/data.ts. Every photo is Jnros' own, taken from jnroslogistics.com and
 * served from /public/images; width and height are the file's real pixel size, so next/image
 * always knows the aspect ratio.
 */

export type Img = { src: string; alt: string; width: number; height: number };

export function photo(file: string, alt: string, width: number, height: number): Img {
  return { src: `/images/${file}`, alt, width, height };
}

/**
 * A muted background loop (components/ui/LoopVideo.tsx). scripts/encode-video.mjs writes it to
 * /public/videos as <name>-1080.mp4 and <name>-720.mp4, and its first frame to
 * /public/images/<name>-poster.jpg, which shows at once and stays wherever the video doesn't play.
 */
export type Video = { name: string; poster: Img };

export function clip(name: string, alt: string): Video {
  return { name, poster: photo(`${name}-poster.jpg`, alt, 1920, 1080) };
}
