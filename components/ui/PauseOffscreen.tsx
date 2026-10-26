"use client";

import { useEffect, useRef } from "react";

/**
 * Marks its wrapper [data-offscreen] while it is outside the viewport, which pauses the looping
 * CSS animations inside it (see globals.css). Saves battery and main-thread time on long pages.
 */
export function PauseOffscreen({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => el.toggleAttribute("data-offscreen", !entry.isIntersecting), { rootMargin: "100px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-offscreen="" className={className}>
      {children}
    </div>
  );
}
