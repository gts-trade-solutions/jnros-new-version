"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Giant outlined "Jnros" that slides sideways as the footer scrolls into view
 * (Motion useScroll on the footer, mapped to translateX). Static for reduced motion.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["12%", "-6%"]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
      <motion.p
        style={reduced ? undefined : { x }}
        className="whitespace-nowrap pl-[var(--gutter)] font-display text-wordmark font-extrabold uppercase text-outline"
      >
        Jnros
      </motion.p>
    </div>
  );
}
