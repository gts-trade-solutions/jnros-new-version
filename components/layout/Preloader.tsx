"use client";

import { useRef } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { gsap, useGSAP } from "@/lib/gsap";
import { INTRO_STORAGE_KEY, markIntroDone } from "@/lib/intro";

/**
 * First-visit preloader (~1.6s): a 000→100 counter and a green progress bar, then the panel splits
 * down the middle and both halves wipe upward, staggered, to reveal the hero.
 *
 * The markup is always server-rendered but only displayed when the inline boot script has added
 * html.preload (first visit this session, motion allowed), so returning visitors never see a
 * flash of it. The hero's intro is released (markIntroDone) as the halves lift, so the headline
 * animates in while the panel is still leaving.
 */
/** One odometer strip: 0–9 plus a trailing 0, so rolling from 9 back to 0 is seamless. */
const STRIP = "01234567890".split("");

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (!html.classList.contains("preload")) {
        markIntroDone();
        return;
      }

      // Lock scroll while the panel is up (Lenis is paused separately until intro is done).
      html.style.overflow = "hidden";
      const count = { value: 0 };

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          html.classList.remove("preload");
          html.style.overflow = "";
          try {
            sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
          } catch {
            // Storage blocked (private mode): the preloader simply shows again next visit.
          }
        },
      });

      // The counter is three digit strips rolled with transforms (an odometer) rather than changing
      // text: no relayout per frame, and the number isn't re-reported as a new paint every frame.
      const [hundreds, tens, ones] = gsap.utils.toArray<HTMLElement>("[data-pl-strip]");
      const roll = (el: HTMLElement, digit: number) => (el.style.transform = `translateY(${-digit}em)`);
      tl.to(count, {
        value: 100,
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = count.value;
          roll(hundreds, v / 100);
          roll(tens, (v / 10) % 10);
          roll(ones, v % 10);
        },
      })
        .to("[data-pl-bar]", { scaleX: 1, duration: 1, ease: "power2.inOut" }, 0)
        .to("[data-pl-content]", { yPercent: -30, opacity: 0, duration: 0.4, ease: "power2.in" }, 1)
        .add(markIntroDone, 1.15)
        .to("[data-pl-half]", { yPercent: -100, duration: 0.75, ease: "power4.inOut", stagger: 0.08 }, 1.05);
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="preloader fixed inset-0 z-[200]">
      {/* The two halves that split and wipe upward. */}
      <div data-pl-half className="absolute inset-y-0 left-0 w-1/2 bg-surface" />
      <div data-pl-half className="absolute inset-y-0 right-0 w-1/2 border-l border-border bg-surface" />

      <div data-pl-content className="container-x relative flex h-full flex-col justify-between py-8 sm:py-12">
        <div className="flex items-center font-mono text-label uppercase text-muted">
          <span className="flex items-center gap-3">
            <LogoMark className="size-8" />
            Jnros Logistics
          </span>
        </div>

        <div>
          <div className="flex items-end justify-between gap-6">
            <span className="flex font-display text-[clamp(6rem,24vw,20rem)] font-extrabold leading-none tabular-nums">
              {[0, 1, 2].map((column) => (
                <span key={column} className="block h-[1em] overflow-hidden">
                  <span data-pl-strip className="block will-change-transform">
                    {STRIP.map((digit, i) => (
                      <span key={i} className="block h-[1em]">
                        {digit}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </span>
            <span className="mb-3 hidden font-mono text-label uppercase text-muted sm:block">Loading</span>
          </div>
          <div className="mt-6 h-[3px] w-full bg-border">
            <div data-pl-bar className="h-full w-full origin-left scale-x-0 bg-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}
