"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = { to: number; from?: number; prefix?: string; suffix?: string; duration?: number; className?: string };

/**
 * Number that counts up (or down) when scrolled into view.
 * The server renders the final value, so the real number is in the HTML for crawlers and no-JS
 * visitors; after hydration it is reset to `from` and animated once in view. Text is written
 * straight to the DOM node, so counting never re-renders React. Reduced motion: final value only.
 */
export function Counter({ to, from = 0, prefix = "", suffix = "", duration = 2, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const format = (n: number) => `${prefix}${Math.round(n).toLocaleString("en-US")}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.textContent = format(to);
      return;
    }
    // Armed: hold the start value until the number scrolls into view.
    if (!inView) {
      el.textContent = format(from);
      return;
    }
    const controls = animate(from, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduced]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(to)}
    </span>
  );
}
