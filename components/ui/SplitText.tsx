"use client";

import { createElement, Fragment, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { onceInView, prefersReducedMotion } from "@/lib/inview";
import { DURATION, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  id?: string;
  /** "scroll": reveal when scrolled into view. "load": reveal on page load (above-the-fold headings). */
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
 * lowered via CSS ([data-split], html.js only) and play when an IntersectionObserver sees them.
 * Load headings use the CSS hero intro (.hero-line in globals.css): they animate from the first
 * frame without waiting for JavaScript. Reduced motion gets a plain fade. "\n" forces a line break.
 */
export function SplitText({ text, as = "h2", className, id, trigger = "scroll", delay = 0, stagger = STAGGER.tight, accent = [] }: Props) {
  const ref = useRef<HTMLElement>(null);
  const accentWords = new Set(accent.map(clean));
  const load = trigger === "load";

  useEffect(() => {
    const el = ref.current;
    if (!el || load) return;
    return onceInView([el], () => {
      el.setAttribute("data-shown", "");
      if (prefersReducedMotion()) {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: DURATION.fast, delay, clearProps: "opacity" });
      } else {
        gsap.fromTo(el.querySelectorAll("[data-word]"), { yPercent: 125 }, { yPercent: 0, duration: DURATION.slow, stagger, delay, clearProps: "transform" });
      }
    }, "0px 0px -8% 0px");
  }, [load, delay, stagger]);

  const lines = text.split("\n");
  let index = 0; // word position across lines, for the CSS stagger

  return createElement(
    as,
    {
      ref,
      id,
      className,
      ...(load ? { style: { "--hero-delay": `${delay}s`, "--hero-stagger": `${stagger}s` } as React.CSSProperties } : { "data-split": "" }),
    },
    lines.map((line, li) => (
      <Fragment key={li}>
        {li > 0 && <br />}
        {line.split(" ").map((word, wi, words) => (
          <Fragment key={wi}>
            {/* Vertical padding (cancelled by negative margin) keeps tall glyphs from being clipped. */}
            <span className="-my-[0.14em] inline-block overflow-hidden py-[0.14em] align-top">
              <span
                data-word
                className={cn("inline-block", load && "hero-line", accentWords.has(clean(word)) && "text-accent")}
                style={load ? ({ "--i": index++ } as React.CSSProperties) : undefined}
              >
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
