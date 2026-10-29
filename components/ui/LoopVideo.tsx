"use client";

import { useEffect, useRef, useState } from "react";
import type { Video } from "@/lib/data";
import { whenIdle } from "@/lib/idle";
import { MQ } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Connection = { saveData?: boolean; effectiveType?: string };

type Props = {
  video: Video;
  className?: string;
  /**
   * Slideshows: plays only while true, and from the start each time it comes back, so the slide
   * opens on the frame its poster shows. Leave it out to play whenever the clip is on screen.
   */
  active?: boolean;
};

/**
 * Muted background loop, laid over its poster (put it inside a ParallaxImage or next to an Image of
 * video.poster, so the first paint is a photo and never waits on video).
 *
 * Nothing downloads until the clip is near the viewport, active and the page is idle. It fades in
 * once frames are actually playing, so a slow start shows the poster instead of a blank or a
 * spinner, and pauses off-screen. Phones get the 720p file, larger screens 1080p. Reduced motion,
 * Save-Data and 2G connections keep the poster only.
 */
export function LoopVideo({ video, className, active = true }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const wasActive = useRef(active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    if (window.matchMedia(MQ.reduce).matches || connection?.saveData || /2g/.test(connection?.effectiveType ?? "")) return;

    // React sets `muted` as a property only, and browsers allow autoplay only for muted video.
    el.muted = true;
    setAllowed(true);
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !allowed) return;
    if (active && !wasActive.current) el.currentTime = 0;
    wasActive.current = active;
    if (!visible || !active) {
      el.pause();
      return;
    }
    return whenIdle(() => el.play().catch(() => {}));
  }, [allowed, visible, active]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      disablePictureInPicture
      preload="none"
      aria-hidden="true"
      onPlaying={() => setPlaying(true)}
      className={cn("pointer-events-none absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-1000", playing && "opacity-100", className)}
    >
      <source src={`/videos/${video.name}-720.mp4`} type="video/mp4" media="(max-width: 767px)" />
      <source src={`/videos/${video.name}-1080.mp4`} type="video/mp4" />
    </video>
  );
}
