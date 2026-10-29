"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Offering } from "@/lib/data";
import { EASE } from "@/lib/motion";
import { cn, pad2 } from "@/lib/utils";

/** How long each item stays on the stage before the next one comes in. */
const DWELL = "6s";

/**
 * Solutions showcase: a framed photo stage beside a numbered list.
 *
 * - The stage shows the active item. Switching wipes the next photo up over the current one
 *   (clip-path) while it settles from a slight zoom, and the number and title rise in over it.
 * - The photo on stage pushes in slowly (Ken Burns). An item with a video plays it over the photo
 *   while it is on stage (LoopVideo), so only the clip on stage downloads. It cycles on its own while on screen. A green timer bar along the stage shows the dwell; its
 *   animationend advances to the next item (CSS keyframes, like the hero), so hovering simply
 *   pauses the bar.
 * - Hovering or focusing a list item switches to it straight away; clicking opens its page.
 * Reduced motion: no autocycle, and photos swap with a plain fade.
 */
export function OffersShowcase({ items, total }: { items: Offering[]; total: number }) {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.35 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const playing = inView && !paused && !reduced;
  const item = items[active];

  const show = (index: number) => {
    if (index === active) return;
    setPrevious(active);
    setActive(index);
  };

  return (
    <div ref={root} className="grid gap-10 lg:grid-cols-12 lg:gap-14" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      {/* Stage */}
      <div data-tone="dark" className="relative aspect-[4/3] overflow-hidden rounded-xs bg-bg lg:col-span-7 lg:aspect-auto lg:min-h-[34rem]">
        {items.map((s, i) => {
          const state = i === active ? "active" : i === previous ? "previous" : "hidden";
          return (
            <motion.div
              key={s.slug}
              aria-hidden={i !== active}
              className="absolute inset-0"
              // Stacking is set, not animated: the incoming photo is on top for its whole wipe.
              style={{ zIndex: state === "active" ? 2 : state === "previous" ? 1 : 0 }}
              initial={false}
              animate={reduced ? { opacity: state === "active" ? 1 : 0 } : { clipPath: state === "hidden" ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 0% 0%)" }}
              transition={reduced ? { duration: 0.5 } : { duration: state === "active" ? 1.1 : 0, ease: EASE }}
            >
              {/* Hidden photos wait zoomed in, so each one settles as it is revealed; the outgoing one holds still. */}
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{ scale: state === "hidden" && !reduced ? 1.15 : 1 }}
                transition={{ duration: state === "active" ? 1.6 : 0, ease: EASE }}
              >
                {/* A slow push-in while the photo is on stage (hero Ken Burns keyframes), paused with the timer.
                    The outgoing photo keeps it until it is fully covered, so it never snaps back mid-wipe. */}
                <div
                  className={cn("absolute inset-0", state !== "hidden" && "motion-safe:animate-kenburns")}
                  style={{ animationPlayState: playing ? "running" : "paused" }}
                >
                  <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
                  {s.video && <LoopVideo video={s.video} active={i === active} />}
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        <div aria-hidden="true" className="absolute inset-0 z-[3] bg-gradient-to-t from-bg via-bg/55 to-transparent" />
        {/* Engineering-drawing corner ticks */}
        {["left-5 top-5 border-l border-t", "right-5 top-5 border-r border-t", "bottom-5 left-5 border-b border-l", "bottom-5 right-5 border-b border-r"].map((pos) => (
          <span key={pos} aria-hidden="true" className={`absolute z-[4] size-6 border-accent ${pos}`} />
        ))}

        <div className="absolute inset-x-0 bottom-0 z-[4] p-7 sm:p-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={item.slug} exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}>
              <span className="block overflow-hidden">
                <motion.span
                  className="inline-block rounded-xs bg-bg/70 px-2.5 py-1.5 font-mono text-label uppercase text-accent backdrop-blur-sm"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
                >
                  {item.number} / {pad2(total)} · Jnros Logistics Solution
                </motion.span>
              </span>
              <span className="mt-3 block overflow-hidden">
                <motion.span
                  className="block max-w-xl font-display text-[clamp(2.25rem,3.8vw,3.75rem)] font-extrabold uppercase leading-[0.92]"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
                >
                  {item.title}
                </motion.span>
              </span>
              <motion.span className="mt-6 inline-block" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.6 }}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-3 font-display text-base font-bold uppercase tracking-[0.08em] text-text transition-colors hover:text-accent"
                >
                  Know More
                  <span className="sr-only"> about {item.title}</span>
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-500 ease-brand group-hover:translate-x-1" />
                </Link>
              </motion.span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dwell timer: when the bar fills, the next item comes in. */}
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[5] h-[3px] bg-text/15">
          {!reduced && (
            <span
              key={active}
              className="absolute inset-0 origin-left animate-progress bg-accent"
              style={{ "--progress-duration": DWELL, animationPlayState: playing ? "running" : "paused" } as React.CSSProperties}
              onAnimationEnd={() => show((active + 1) % items.length)}
            />
          )}
        </span>
      </div>

      {/* List */}
      <Reveal as="ul" batch className="flex flex-col gap-3 lg:col-span-5">
        {items.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.slug}>
              <Link
                href={s.href}
                onPointerEnter={() => show(i)}
                onFocus={() => show(i)}
                className={cn(
                  "group relative flex items-start gap-5 overflow-hidden rounded-xs border p-6 transition-[background-color,border-color,box-shadow] duration-500 sm:p-7",
                  on ? "border-border bg-raised shadow-[0_24px_50px_-28px_var(--shadow-color)]" : "border-transparent hover:bg-raised/60",
                )}
              >
                {/* Active edge: a green bar that grows down the left side. */}
                <span
                  aria-hidden="true"
                  className={cn("absolute inset-y-0 left-0 w-1 origin-top bg-accent transition-transform duration-700 ease-brand", on ? "scale-y-100" : "scale-y-0")}
                />
                <span className={cn("mt-1 font-mono text-label transition-colors duration-500", on ? "text-accent" : "text-muted")}>{s.number}</span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block font-display text-h4 font-extrabold uppercase transition-colors duration-500", on ? "text-accent" : "text-text")}>{s.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-muted">{s.short}</span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className={cn("mt-1 size-5 shrink-0 transition duration-500 ease-brand", on ? "rotate-45 text-accent" : "text-muted group-hover:text-accent")}
                />
              </Link>
            </li>
          );
        })}
      </Reveal>
    </div>
  );
}
