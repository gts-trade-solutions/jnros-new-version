"use client";

import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import { useLenis } from "./SmoothScroll";

/**
 * Back-to-top button: appears once the page has scrolled a screen or so, with a ring that fills as
 * you read down the page, and glides back to the top (Lenis, or native smooth scroll without it).
 */
export function BackToTop() {
  const lenis = useLenis();
  const { scrollY, scrollYProgress } = useScroll();
  const [shown, setShown] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShown(y > 600));

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {shown && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          className="group pointer-events-auto relative grid size-12 place-items-center rounded-full border border-border bg-raised/90 text-text shadow-[0_10px_30px_-12px_var(--shadow-color)] backdrop-blur-md transition-colors hover:text-accent"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <svg aria-hidden="true" viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90">
            <motion.circle cx="24" cy="24" r="22.5" fill="none" strokeWidth="2" className="stroke-accent" style={{ pathLength: scrollYProgress }} />
          </svg>
          <ArrowUp aria-hidden="true" className="size-4 transition-transform duration-300 ease-brand group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
