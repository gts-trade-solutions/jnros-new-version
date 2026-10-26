"use client";

import { useRef } from "react";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { gsap, MQ } from "@/lib/gsap";
import { DURATION } from "@/lib/motion";

type Item = { year: string; title: string; text: string };

/**
 * Vertical milestones. A lime rail fills (scaleY, scrubbed) as you scroll through the list, and each
 * milestone's node lights up as the fill passes it.
 */
export function Timeline({ items }: { items: Item[] }) {
  const root = useRef<HTMLOListElement>(null);

  useIdleGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-rail]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 60%", end: "bottom 60%", scrub: true } },
        );
        gsap.utils.toArray<HTMLElement>("[data-milestone]").forEach((el) => {
          gsap.from(el.querySelectorAll("[data-fade]"), { opacity: 0, y: 30, duration: DURATION.base, stagger: 0.08, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
          // Node lights up as the rail reaches it: lime fill fades and scales in over the grey base.
          gsap.fromTo(
            el.querySelector("[data-node-fill]"),
            { opacity: 0, scale: 0.4 },
            { opacity: 1, scale: 1, duration: 0.4, scrollTrigger: { trigger: el, start: "top 60%", toggleActions: "play none none reverse" } },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="relative">
      <span aria-hidden="true" className="absolute bottom-0 left-[0.6875rem] top-0 w-px bg-border lg:left-[calc(16rem+0.6875rem)]" />
      <span aria-hidden="true" data-rail className="absolute bottom-0 left-[0.6875rem] top-0 w-px origin-top bg-accent lg:left-[calc(16rem+0.6875rem)]" />
      {items.map((item) => (
        <li key={item.year} data-milestone className="relative grid gap-3 pb-16 pl-12 last:pb-0 lg:grid-cols-[16rem_1fr] lg:gap-0 lg:pl-0">
          <p data-fade className="font-display text-[clamp(3rem,6vw,5.5rem)] font-extrabold leading-[0.85] text-text/90 lg:pr-10 lg:text-right">
            {item.year}
          </p>
          <span aria-hidden="true" className="absolute left-0 top-2 size-6 rounded-xs border-4 border-surface bg-surface-2 lg:left-64">
            <span data-node-fill className="absolute inset-0 bg-accent" />
          </span>
          <div className="lg:pl-14">
            <h3 data-fade className="font-display text-h3 font-extrabold uppercase">
              {item.title}
            </h3>
            <p data-fade className="mt-3 max-w-xl text-muted">
              {item.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
