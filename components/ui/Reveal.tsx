"use client";

import { createElement, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { onceInView, prefersReducedMotion } from "@/lib/inview";
import { DURATION, STAGGER } from "@/lib/motion";

type Props = {
  children: React.ReactNode;
  as?: "div" | "section" | "ul" | "ol" | "dl" | "header" | "article";
  className?: string;
  /**
   * fade: rise 32px and fade in.
   * clip: wipe up from the bottom (clip-path), while any [data-reveal-zoom] inside settles from 1.25x.
   */
  effect?: "fade" | "clip";
  stagger?: number;
  delay?: number;
  /** Animate items row by row as each enters the viewport (long grids), instead of all at once. */
  batch?: boolean;
};

/** Animates direct children in from the hidden state set by CSS (see globals.css, "Reveals"). */
export function playReveal(items: Element[], effect: "fade" | "clip", { stagger = STAGGER.base, delay = 0 }: { stagger?: number; delay?: number } = {}) {
  const reduce = prefersReducedMotion();
  const clip = !reduce && effect === "clip";
  // CSS stops hiding these; the fromTo below sets the same start state in the same frame.
  items.forEach((el) => el.setAttribute("data-shown", ""));
  gsap.fromTo(
    items,
    reduce ? { opacity: 0 } : clip ? { clipPath: "inset(100% 0% 0% 0%)" } : { opacity: 0, y: 32 },
    {
      ...(reduce ? { opacity: 1 } : clip ? { clipPath: "inset(0% 0% 0% 0%)" } : { opacity: 1, y: 0 }),
      duration: reduce ? DURATION.fast : clip ? DURATION.slow : DURATION.base,
      stagger,
      delay,
      clearProps: "opacity,transform,clipPath",
    },
  );
  if (clip) {
    const zooms = items.flatMap((el) => Array.from(el.querySelectorAll("[data-reveal-zoom]")));
    gsap.fromTo(zooms, { scale: 1.25 }, { scale: 1, duration: DURATION.slow + 0.4, stagger, delay, clearProps: "transform" });
  }
}

/**
 * Staggered reveal for a group of elements.
 *
 * Children start hidden through CSS (html.js only, so no-JS visitors see everything) and an
 * IntersectionObserver plays them in. No ScrollTrigger and no layout reads, so many reveals on a
 * page cost nothing during hydration. Reduced motion: opacity only.
 *
 * Above-the-fold content doesn't use this: it animates in with CSS (.hero-fade) so it never waits
 * for JavaScript.
 */
export function Reveal({ children, as = "div", className, effect = "fade", stagger = STAGGER.base, delay = 0, batch = false }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.children);
    if (batch) return onceInView(items, (entered) => playReveal(entered, effect, { stagger }));
    return onceInView([el], () => playReveal(items, effect, { stagger, delay }));
  }, [batch, effect, stagger, delay]);

  return createElement(as, { ref, className, "data-reveal": effect }, children);
}
