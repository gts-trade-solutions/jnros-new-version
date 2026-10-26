"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { onceInView, prefersReducedMotion } from "@/lib/inview";

/**
 * When the map scrolls into view, the dot field fades up and the pins pop in with a staggered
 * back-out scale. Start states come from CSS ([data-pins]:not([data-shown])). Pulses pause off-screen.
 */
export function MapReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const map = root.current?.querySelector<HTMLElement>("[data-pins]");
    if (!map) return;
    // Pin pulses only run while the map is on screen.
    const visibility = new IntersectionObserver(([entry]) => map.toggleAttribute("data-offscreen", !entry.isIntersecting));
    visibility.observe(map);
    const stopReveal = onceInView(
      [map],
      () => {
        map.setAttribute("data-shown", "");
        if (prefersReducedMotion()) return;
        gsap.fromTo(map.querySelectorAll("[data-map-dots]"), { opacity: 0 }, { opacity: 1, duration: 1.4, ease: "power1.out", clearProps: "opacity" });
        gsap.fromTo(
          map.querySelectorAll("[data-pin]"),
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(2.4)", stagger: 0.05, delay: 0.3, clearProps: "transform,opacity" },
        );
      },
      "0px 0px -20% 0px",
    );
    return () => {
      visibility.disconnect();
      stopReveal();
    };
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
