"use client";

import { createElement, Fragment, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { onceInView, prefersReducedMotion } from "@/lib/inview";
import { useIntroDone } from "@/lib/intro";
import { DURATION, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  id?: string;
  /** "scroll": reveal when scrolled into view. "load": reveal on page load (after the preloader). */
  trigger?: "scroll" | "load";
  delay?: number;
  stagger?: number;
  /** Words (case-insensitive, punctuation ignored) rendered in the accent colour. */
  accent?: string[];
};

const clean = (word: string) => word.toLowerCase().replace(/[^a-z0-9']/g, "");

/**
 * Split-text heading. Each word is server-rendered inside its own overflow-hidden mask, so the
 * text is real, crawlable and readable without JavaScript.
 *
 * Animation: words rise out of their masks (yPercent 125 → 0), staggered. Scroll headings start
 * lowered via CSS ([data-split], html.js only) and play when an IntersectionObserver sees them;
 * load headings wait for the intro. Reduced motion gets a plain fade. "\n" forces a line break.
 */
export function SplitText({ text, as = "h2", className, id, trigger = "scroll", delay = 0, stagger = STAGGER.tight, accent = [] }: Props) {
  const ref = useRef<HTMLElement>(null);
  const introDone = useIntroDone(trigger === "load");
  const accentWords = new Set(accent.map(clean));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const play = () => {
      el.setAttribute("data-shown", "");
      gsap.set(el, { visibility: "visible" });
      if (prefersReducedMotion()) {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: DURATION.fast, delay, clearProps: "opacity" });
      } else {
        gsap.fromTo(el.querySelectorAll("[data-word]"), { yPercent: 125 }, { yPercent: 0, duration: DURATION.slow, stagger, delay, clearProps: "transform" });
      }
    };
    if (trigger === "load") {
      if (introDone) play();
      return;
    }
    return onceInView([el], play, "0px 0px -8% 0px");
  }, [trigger, trigger === "load" && introDone, delay, stagger]);

  const lines = text.split("\n");

  return createElement(
    as,
    { ref, id, className, ...(trigger === "load" ? { "data-pre": "" } : { "data-split": "" }) },
    lines.map((line, li) => (
      <Fragment key={li}>
        {li > 0 && <br />}
        {line.split(" ").map((word, wi, words) => (
          <Fragment key={wi}>
            {/* Vertical padding (cancelled by negative margin) keeps tall glyphs from being clipped. */}
            <span className="-my-[0.14em] inline-block overflow-hidden py-[0.14em] align-top">
              <span data-word className={cn("inline-block", accentWords.has(clean(word)) && "text-accent")}>
                {word}
              </span>
            </span>
            {wi < words.length - 1 && " "}
          </Fragment>
        ))}
      </Fragment>
    )),
  );
}
