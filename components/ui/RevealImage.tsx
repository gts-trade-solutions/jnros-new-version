"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import type { Img } from "@/lib/data";
import { gsap, MQ } from "@/lib/gsap";
import { onceInView, prefersReducedMotion } from "@/lib/inview";
import { DURATION } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  image: Img;
  sizes: string;
  className?: string;
  imageClassName?: string;
  /** Drift the image vertically while it crosses the viewport (desktop, motion allowed). */
  parallax?: boolean;
  preload?: boolean;
};

/**
 * Image that wipes open from the bottom (clip-path inset 100% → 0) as it scrolls into view, while
 * the photo inside settles from 1.25x to 1x. The start state comes from CSS ([data-reveal-image]),
 * an IntersectionObserver plays it. The wrapper must be sized by the parent (aspect-ratio or
 * explicit height); the image fills it.
 */
export function RevealImage({ image, sizes, className, imageClassName, parallax = false, preload = false }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return onceInView([el], () => {
      el.setAttribute("data-shown", "");
      if (prefersReducedMotion()) {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: DURATION.fast, clearProps: "opacity" });
        return;
      }
      gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: DURATION.slow, clearProps: "clipPath" });
      gsap.fromTo(inner.current, { scale: 1.25 }, { scale: 1, duration: DURATION.slow + 0.4, clearProps: "transform" });
    });
  }, []);

  useIdleGSAP(
    () => {
      if (!parallax) return;
      gsap.matchMedia().add(MQ.desktopMotion, () => {
        gsap.fromTo(
          inner.current?.firstElementChild ?? null,
          { yPercent: -6 },
          { yPercent: 6, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} data-reveal-image="" className={cn("relative overflow-hidden bg-surface-2", className)}>
      <div ref={inner} data-reveal-zoom="" className="absolute inset-0">
        <div className={cn("absolute inset-x-0", parallax ? "-inset-y-[8%]" : "inset-y-0")}>
          <Image src={image.src} alt={image.alt} fill sizes={sizes} preload={preload} className={cn("object-cover", imageClassName)} />
        </div>
      </div>
    </div>
  );
}
