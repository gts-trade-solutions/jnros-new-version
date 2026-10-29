"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { GridLines } from "@/components/ui/GridLines";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import type { hero as heroData } from "@/lib/data";
import { gsap, MQ } from "@/lib/gsap";
import { whenIdle } from "@/lib/idle";
import { EASE } from "@/lib/motion";
import { cn, pad2 } from "@/lib/utils";

type Props = typeof heroData;

/**
 * Full-viewport hero.
 *
 * Slideshow: slides crossfade (1.6s, Motion) while the active one slowly zooms 1 → 1.1 over 8s
 * (Ken Burns). A slide with a video plays it (LoopVideo) over its poster while it is the active one,
 * from the start each time, so only the clip on screen downloads. The zoom and the 7s timer bar are CSS keyframes, so they run on the compositor
 * with no per-frame JavaScript; the bar's animationend advances to the next slide, so pausing the
 * bar (hero off-screen) pauses the slideshow too. An outgoing slide keeps its zoom while it fades.
 *
 * Intro: the headline lines rise out of overflow-hidden masks, staggered; the eyebrow, intro,
 * buttons and bottom bar fade up after them. Pure CSS (.hero-line / .hero-fade in globals.css),
 * so it plays from the first frame without waiting for JavaScript.
 *
 * Scroll: the photo parallaxes slower than the page and the headline block fades, lifts and
 * scales down slightly (scrubbed). Reduced motion keeps the crossfade, drops everything else.
 */
export function Hero({ eyebrow, lines, intro, slides }: Props) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const inView = useInView(root, { amount: 0.05 });
  const playState = { animationPlayState: inView ? "running" : "paused" } as const;

  // Photos load one slide ahead: only the first is needed for the first paint, the second loads
  // once the page is idle, and each later one when the slide before it comes in (7s before it is
  // shown). The first seconds of a visit don't spend bandwidth on photos that aren't on screen.
  const [loadedUpTo, setLoadedUpTo] = useState(0);
  useEffect(() => whenIdle(() => setLoadedUpTo((n) => Math.max(n, 1))), []);

  const show = (index: number) => {
    if (index === active) return;
    setPrevious(active);
    setActive(index);
    setLoadedUpTo((n) => Math.max(n, index + 1));
  };

  // Scroll parallax: set up in an idle task (ScrollTriggers measure layout).
  useIdleGSAP(
    () => {
      gsap.matchMedia().add(MQ.motion, () => {
        const scrollTrigger = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        // Photo moves down 30% while the page moves up 100%: it appears to scroll slower.
        gsap.to(media.current, { yPercent: 30, ease: "none", scrollTrigger });
        gsap.to(content.current, {
          yPercent: -12,
          scale: 0.92,
          opacity: 0,
          transformOrigin: "0% 100%",
          ease: "none",
          scrollTrigger: { ...scrollTrigger, end: "bottom 20%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="Introduction"
      data-hero=""
      data-tone="dark"
      className="relative isolate flex min-h-[max(100svh,40rem)] flex-col overflow-hidden bg-bg"
    >
      {/* Slides */}
      <div ref={media} className="absolute inset-0 -z-10">
        {slides.map((slide, i) => (
          <motion.div
            key={slide.image.src}
            className="absolute inset-0"
            initial={{ opacity: i === 0 ? 1 : 0 }}
            animate={{ opacity: i === active ? 1 : 0 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          >
            {/* Zoom runs while active and keeps going while fading out; removed (reset) once hidden. */}
            <div
              className={cn("absolute inset-0 will-change-transform", (i === active || i === previous) && "motion-safe:animate-kenburns")}
              style={playState}
            >
              {i <= loadedUpTo && (
                <>
                  <Image
                    src={slide.image.src}
                    alt={slide.image.alt}
                    fill
                    sizes="100vw"
                    preload={i === 0}
                    fetchPriority={i === 0 ? "high" : "low"}
                    className="object-cover"
                  />
                  {slide.video && <LoopVideo video={slide.video} active={i === active} />}
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legibility: darken top (header) and bottom (copy), plus a left wash behind the headline. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-bg/75 via-bg/15 to-bg/95" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-bg/70 via-bg/20 to-transparent" />
      <GridLines className="-z-10" />

      {/* flex-1 rather than h-full: on short windows the hero grows to fit, instead of the headline
          block overflowing upward behind the fixed header. */}
      <div ref={content} className="container-x flex flex-1 flex-col justify-end pb-32 pt-40 sm:pb-36">
        <p className="hero-fade mb-6 flex items-center gap-3 font-mono text-label uppercase text-text/80">
          <span aria-hidden="true" className="hazard inline-block h-2.5 w-4 rounded-[1px]" />
          {eyebrow}
        </p>

        <h1 className="font-display text-display font-extrabold uppercase">
          {lines.map((line, i) => (
            // Each line rises out of its own mask. Padding (cancelled by negative margin) avoids clipping glyphs.
            <span key={line} className="-my-[0.08em] block overflow-hidden py-[0.08em]">
              <span className={cn("hero-line block", i === lines.length - 1 && "text-accent")} style={{ "--i": i } as React.CSSProperties}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="hero-fade max-w-2xl text-lead text-text/85" style={{ "--i": 1 } as React.CSSProperties}>
            {intro}
          </p>
          <div className="hero-fade flex shrink-0 flex-wrap gap-4" style={{ "--i": 2 } as React.CSSProperties}>
            <MagneticButton href="/contact" size="lg">
              Contact Us
            </MagneticButton>
            <Button href="/services" variant="outline" size="lg" arrow={false}>
              Our Services
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom bar: scroll cue, slide caption, slide counter + progress */}
      <div className="hero-fade absolute inset-x-0 bottom-0 border-t border-text/10" style={{ "--i": 3 } as React.CSSProperties}>
        <div className="container-x flex h-20 items-center justify-between gap-6">
          <a href="#stats" className="flex items-center gap-4 font-mono text-label uppercase text-text/70 transition-colors hover:text-text">
            <span aria-hidden="true" className="relative h-10 w-px overflow-hidden bg-text/20">
              <span className="absolute inset-x-0 top-0 h-1/3 bg-accent motion-safe:animate-scroll-cue" />
            </span>
            Scroll to explore
          </a>

          <p className="hidden min-w-0 flex-1 justify-center font-mono text-label uppercase text-text/70 md:flex">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={active}
                className="truncate"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {slides[active].caption}
              </motion.span>
            </AnimatePresence>
          </p>

          {/* mr-16 keeps the slide controls clear of the floating chat button in the corner. */}
          <div className="mr-16 flex items-center gap-4">
            <span className="hidden font-mono text-label tabular-nums text-text/60 sm:block">
              <span className="text-text">{pad2(active + 1)}</span> / {pad2(slides.length)}
            </span>
            <div className="flex gap-1.5">
              {slides.map((slide, i) => (
                <button
                  key={slide.image.src}
                  type="button"
                  onClick={() => show(i)}
                  aria-label={`Show slide ${i + 1}: ${slide.caption}`}
                  aria-current={i === active}
                  className="relative h-8 w-8 sm:w-12"
                >
                  <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden bg-text/20">
                    {i < active && <span className="absolute inset-0 bg-accent/60" />}
                    {i === active && (
                      // The slide timer: when this 7s bar finishes, the next slide comes in.
                      <span
                        key={active}
                        className="absolute inset-0 origin-left animate-progress bg-accent"
                        style={playState}
                        onAnimationEnd={() => show((active + 1) % slides.length)}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
