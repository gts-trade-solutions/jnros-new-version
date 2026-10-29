"use client";

import Image from "next/image";
import { useRef } from "react";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { gsap, MQ } from "@/lib/gsap";
import type { Img } from "@/lib/data";
import { cn } from "@/lib/utils";

type Props = {
  image: Img;
  sizes?: string;
  className?: string;
  /** Hero images start at the top of the page and only drift down; section images drift through. */
  mode?: "hero" | "section";
  /** Travel, as a percentage of the image height. */
  amount?: number;
  /** Above-the-fold (LCP) image: preloaded and fetched at high priority. */
  preload?: boolean;
  /** Decorative backgrounds pass alt="" (the section text carries the meaning). */
  decorative?: boolean;
  /** Laid over the photo and moving with it, e.g. a LoopVideo of which the photo is the poster. */
  children?: React.ReactNode;
};

/**
 * Background photo that moves slower than the page (scrubbed ScrollTrigger on yPercent).
 * The image is oversized by the travel distance so its edges never show. Static for reduced motion.
 */
export function ParallaxImage({ image, sizes = "100vw", className, mode = "section", amount = 12, preload = false, decorative = false, children }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useIdleGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // yPercent is relative to the oversized image, so convert the container-relative travel.
        const travel = amount / (1 + amount / 100);
        const scrollTrigger =
          mode === "hero"
            ? { trigger: root.current, start: "top top", end: "bottom top", scrub: true }
            : { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo(
          inner.current,
          { yPercent: mode === "hero" ? 0 : -travel / 2 },
          { yPercent: mode === "hero" ? travel : travel / 2, ease: "none", scrollTrigger },
        );
      });
    },
    { scope: root },
  );

  // Oversize: hero needs room below only, section needs room on both sides.
  const oversize = mode === "hero" ? { top: "0%", height: `${100 + amount}%` } : { top: `-${amount / 2}%`, height: `${100 + amount}%` };

  return (
    <div ref={root} className={cn("overflow-hidden", className)}>
      <div ref={inner} className="absolute inset-x-0" style={oversize}>
        <Image src={image.src} alt={decorative ? "" : image.alt} fill sizes={sizes} preload={preload} fetchPriority={preload ? "high" : undefined} className="object-cover" />
        {children}
      </div>
    </div>
  );
}
