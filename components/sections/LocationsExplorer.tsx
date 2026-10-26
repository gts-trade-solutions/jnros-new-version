"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { playReveal } from "@/components/ui/Reveal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Img } from "@/lib/data";
import { onceInView } from "@/lib/inview";
import { EASE, MQ, STAGGER } from "@/lib/motion";
import { cn, pad2 } from "@/lib/utils";
import { LocationsMap, type MapPin } from "./LocationsMap";
import { MapReveal } from "./MapReveal";

type Props = {
  pins: MapPin[];
  previews: Record<string, Img>;
  viewBox: { width: number; height: number };
};

/**
 * Map + hub list. Pins pop in with a staggered back-out scale when the map scrolls into view.
 * Hovering (or focusing) a city highlights its pin, dims the rest of the list and shows a small
 * photo that follows the cursor on a spring (fine pointers only).
 */
export function LocationsExplorer({ pins, previews, viewBox }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const finePointer = useMediaQuery(MQ.finePointer);
  const hubs = pins.filter((p) => p.hub);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 220, damping: 26, mass: 0.5 });
  const y = useSpring(py, { stiffness: 220, damping: 26, mass: 0.5 });
  const onPointerMove = (e: React.PointerEvent) => {
    const r = root.current?.getBoundingClientRect();
    if (!r) return;
    px.set(e.clientX - r.left);
    py.set(e.clientY - r.top);
  };

  // City rows rise in when the list scrolls into view (start state from CSS [data-reveal]).
  const cities = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const list = cities.current;
    if (!list) return;
    return onceInView([list], () => playReveal(Array.from(list.children), "fade", { stagger: STAGGER.tight }));
  }, []);

  const activePin = pins.find((p) => p.slug === active);

  return (
    <div ref={root} onPointerMove={onPointerMove} className="relative mt-16 grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
      <MapReveal className="lg:col-span-7">
        <LocationsMap pins={pins} viewBox={viewBox} active={active} />
      </MapReveal>

      <div className="lg:col-span-5">
        <ul ref={cities} data-reveal="fade" className="border-t border-border" onPointerLeave={() => setActive(null)}>
          {hubs.map((pin, i) => (
            <li key={pin.slug} className="border-b border-border">
              <Link
                href={`/locations/${pin.slug}`}
                onPointerEnter={() => setActive(pin.slug)}
                onFocus={() => setActive(pin.slug)}
                onBlur={() => setActive(null)}
                className={cn("group flex items-center justify-between gap-4 py-3 transition-opacity duration-500", active && active !== pin.slug && "opacity-35")}
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-label text-muted">{pad2(i + 1)}</span>
                  <span className="font-display text-[clamp(2.25rem,3.8vw,3.75rem)] font-extrabold uppercase leading-[0.95] transition-[color,translate] duration-500 ease-brand group-hover:translate-x-2 group-hover:text-accent group-focus-visible:text-accent">
                    {pin.city}
                  </span>
                </span>
                <span className="flex items-center gap-3 font-mono text-label uppercase text-muted">
                  {pin.regionCode}
                  <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-500 ease-brand group-hover:rotate-45 group-hover:text-accent" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Button href="/locations" variant="ghost" className="mt-8">
          All 18 locations
        </Button>
      </div>

      {/* Cursor-following preview. Every hub photo is stacked so switching cities is instant. */}
      {finePointer && (
        <motion.div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 hidden lg:block" style={{ x, y }}>
          <AnimatePresence>
            {activePin && (
              <motion.div
                className="absolute -left-36 bottom-6 h-48 w-72 overflow-hidden rounded-xs border border-text/10 bg-surface-2 shadow-[0_30px_60px_-15px_rgb(0_0_0/0.8)]"
                initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.85, rotate: 3 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {hubs.map((pin) => (
                  <motion.div
                    key={pin.slug}
                    className="absolute inset-0"
                    initial={false}
                    animate={{ opacity: pin.slug === active ? 1 : 0, scale: pin.slug === active ? 1 : 1.12 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <Image src={previews[pin.slug].src} alt="" fill sizes="288px" className="object-cover" />
                  </motion.div>
                ))}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/90 to-transparent p-3 pt-10 font-mono text-label uppercase">
                  {activePin.locality}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
