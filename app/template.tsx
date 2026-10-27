"use client";

import { motion } from "motion/react";
import { useLayoutEffect, useState } from "react";
import { usePageTransition } from "@/components/layout/PageTransition";
import { EASE } from "@/lib/motion";

// Flipped after the first client mount (never on the server), so the initial HTML is never hidden.
let hydrated = false;

/**
 * Re-mounts on every navigation. Tells the transition layer the new page is in the DOM (so the
 * green panel can wipe away) and fades client-side navigations in.
 *
 * Opacity only: a transform on this wrapper would become the containing block for every
 * position: fixed descendant and break GSAP-pinned sections.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const { onPageMount } = usePageTransition();
  const [first] = useState(() => !hydrated);

  useLayoutEffect(() => {
    hydrated = true;
    onPageMount();
  }, [onPageMount]);

  return (
    <motion.div initial={first ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}>
      {children}
    </motion.div>
  );
}
