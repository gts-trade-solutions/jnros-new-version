"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Reading progress: a thin bar along the top edge that fills as the page scrolls (scaleX from
 * Motion's useScroll, smoothed on a spring; the raw value for reduced motion).
 */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 32, mass: 0.3 });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-accent via-[#7ac143] to-warning"
      style={{ scaleX: reduced ? scrollYProgress : smooth }}
    />
  );
}
