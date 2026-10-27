"use client";

import { useRef } from "react";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Row = { items: string[]; outline?: boolean; duration: number };

/**
 * A green band of the solution and service names in two rows travelling in opposite directions.
 *
 * Each track holds its list twice and loops by -50% (GSAP, transform only). Scrolling pushes the
 * rows faster in the scroll direction and leans them (skewX on the row) in proportion to the scroll
 * velocity; both settle back once scrolling stops. Hovering eases the rows to a stop. Paused while
 * the band is off-screen. Reduced motion: nothing moves and each list simply wraps.
 *
 * Decorative (the same names are links in the grids below), so it is hidden from assistive tech.
 */
export function KineticMarquee({ rows }: { rows: Row[] }) {
  const root = useRef<HTMLElement>(null);
  const loops = useRef<gsap.core.Tween[]>([]);

  useIdleGSAP(
    () => {
      gsap.matchMedia().add(MQ.motion, () => {
        const tracks = gsap.utils.toArray<HTMLElement>("[data-marquee-track]");
        const lanes = gsap.utils.toArray<HTMLElement>("[data-marquee-row]");
        // Odd rows run the other way: start shifted and travel back to zero.
        loops.current = tracks.map((track, i) =>
          gsap.fromTo(track, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: rows[i].duration, ease: "none", repeat: -1 }),
        );

        let direction = 1;
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => loops.current.forEach((loop) => (self.isActive ? loop.play() : loop.pause())),
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            direction = self.direction;
            const boost = 1 + Math.min(Math.abs(velocity) / 400, 5);
            loops.current.forEach((loop) =>
              gsap.to(loop, {
                timeScale: direction * boost,
                duration: 0.2,
                overwrite: true,
                onComplete: () => void gsap.to(loop, { timeScale: direction, duration: 1.2, ease: "power2.out" }),
              }),
            );
            gsap.to(lanes, {
              skewX: gsap.utils.clamp(-12, 12, -velocity / 220),
              duration: 0.3,
              overwrite: true,
              onComplete: () => void gsap.to(lanes, { skewX: 0, duration: 0.9, ease: "power3.out" }),
            });
          },
        });
      });
    },
    { scope: root },
  );

  const slow = (to: number) => loops.current.forEach((loop) => gsap.to(loop, { timeScale: to * Math.sign(loop.timeScale() || 1), duration: 0.6, overwrite: true }));

  return (
    <section
      ref={root}
      aria-hidden="true"
      onPointerEnter={() => slow(0)}
      onPointerLeave={() => slow(1)}
      className="relative overflow-hidden bg-accent py-10 text-bg lg:py-14"
    >
      {rows.map((row, i) => (
        <div key={i} data-marquee-row className="flex overflow-hidden py-1 will-change-transform">
          <div data-marquee-track className="flex w-max motion-reduce:w-full">
            {[0, 1].map((copy) => (
              <ul key={copy} className={cn("flex shrink-0 items-center motion-reduce:w-full motion-reduce:shrink motion-reduce:flex-wrap", copy === 1 && "motion-reduce:hidden")}>
                {row.items.map((item) => (
                  <li key={item} className="flex items-center gap-6 pl-6 sm:gap-10 sm:pl-10">
                    <span
                      className={cn(
                        "whitespace-nowrap font-display text-marquee font-extrabold uppercase",
                        row.outline && "text-transparent [-webkit-text-stroke:1.5px_var(--bg)]",
                      )}
                    >
                      {item}
                    </span>
                    {/* Hazard-yellow diamond between names. */}
                    <span className="size-3 shrink-0 rotate-45 bg-warning sm:size-4" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
