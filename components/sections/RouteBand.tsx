"use client";

import Link from "next/link";
import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import type { routeModes } from "@/lib/data";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** The route in SVG units (viewBox 1200×220): sea at the left, air at the crest, land at the right. */
const ROUTE = "M40 170 C300 170 330 50 600 50 C870 50 900 170 1160 170";
const STOPS = [
  { x: 40, y: 170, align: "start" },
  { x: 600, y: 50, align: "center" },
  { x: 1160, y: 170, align: "end" },
] as const;

/**
 * "Sea, Air & Land": a curved route joining the three transport modes, each a link to its service.
 *
 * Scrolling draws the green line along the dashed track (scrubbed stroke-dashoffset on one SVG
 * path) and pops each stop in as the line reaches it. A glowing marker travels the route on a loop
 * (GSAP MotionPath, transform only), paused while off-screen. Reduced motion: the route is drawn
 * and the marker hidden.
 */
export function RouteBand({ heading, modes }: { heading: string; modes: typeof routeModes }) {
  const root = useRef<HTMLDivElement>(null);

  useIdleGSAP(
    () => {
      gsap.matchMedia().add(MQ.motion, () => {
        const line = root.current?.querySelector<SVGPathElement>("[data-route-line]");
        if (!line) return;
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });

        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 55%", scrub: 1 } })
          .to(line, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0)
          .from("[data-route-stop]", { scale: 0.3, opacity: 0, duration: 0.12, stagger: 0.44, ease: "back.out(2.2)" }, 0);

        const marker = gsap.to("[data-route-marker]", {
          motionPath: { path: line, align: line, alignOrigin: [0.5, 0.5] },
          duration: 7,
          ease: "power1.inOut",
          repeat: -1,
          paused: true,
        });
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? marker.play() : marker.pause()),
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="pb-28 pt-6 sm:pb-32">
      <p className="text-center font-mono text-label uppercase text-accent">{heading}</p>
      <div className="relative mx-auto mt-10 aspect-[1200/220] w-full">
        <svg viewBox="0 0 1200 220" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
          <path d={ROUTE} fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round" />
          <path data-route-line d={ROUTE} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
          <g data-route-marker transform="translate(40 170)" className="motion-reduce:hidden">
            <circle r="18" fill="var(--accent)" opacity="0.15" />
            <circle r="9" fill="var(--accent)" opacity="0.3" />
            <circle r="5" fill="var(--warning)" />
          </g>
        </svg>

        {modes.map((m, i) => {
          const stop = STOPS[i];
          return (
            <div key={m.mode} className="absolute size-0" style={{ left: `${(stop.x / 1200) * 100}%`, top: `${(stop.y / 220) * 100}%` }}>
              <Link href={m.service.href} className="group absolute left-0 top-0 block -translate-x-1/2 -translate-y-1/2">
                <span data-route-stop className="relative grid size-12 place-items-center rounded-full border-2 border-accent bg-raised text-accent shadow-[0_10px_30px_-10px_var(--shadow-color)] transition-colors duration-500 group-hover:bg-accent group-hover:text-bg sm:size-16">
                  <span aria-hidden="true" className="absolute inset-0 rounded-full border border-accent motion-safe:animate-ping" />
                  <Icon name={m.icon} className="size-5 sm:size-7" />
                </span>
                <span className="sr-only">
                  {m.mode}: {m.service.title}
                </span>
              </Link>
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-10 w-max sm:top-14",
                  stop.align === "start" && "-left-6 text-left sm:-left-8",
                  stop.align === "center" && "left-0 -translate-x-1/2 text-center",
                  stop.align === "end" && "-right-6 text-right sm:-right-8",
                )}
              >
                <span className="block font-display text-3xl font-extrabold uppercase leading-none sm:text-h3">{m.mode}</span>
                <span className="mt-2 hidden font-mono text-label uppercase text-muted sm:block">{m.service.title}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
