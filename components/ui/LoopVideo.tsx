"use client";

import { useEffect, useRef, useState } from "react";
import type { Video } from "@/lib/data";
import { whenIdle } from "@/lib/idle";
import { MQ } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * Muted background loop, laid over its poster (put it inside a ParallaxImage of video.poster, so
 * the first paint is a photo and never waits on video).
 *
 * Nothing downloads until the clip is near the viewport and the page is idle. It fades in once
 * frames are actually playing, so a slow start shows the poster instead of a blank or a spinner,
 * and pauses off-screen. Phones get the 720p file, larger screens 1080p. Reduced motion, Save-Data
 * and 2G connections keep the poster only.
 */
export function LoopVideo({ video, className }: { video: Video; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    if (window.matchMedia(MQ.reduce).matches || connection?.saveData || /2g/.test(connection?.effectiveType ?? "")) return;

    // React sets `muted` as a property only, and browsers allow autoplay only for muted video.
    el.muted = true;
    let cancel: (() => void) | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        cancel?.();
        if (entry.isIntersecting) cancel = whenIdle(() => el.play().catch(() => {}));
        else el.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancel?.();
    };
  }, []);

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
