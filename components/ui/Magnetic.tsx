"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MQ } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Magnetic hover: the child leans toward the cursor and springs back when it leaves.
 * The wrapper adds an invisible 1rem "field" around the child (padding cancelled by a negative
 * margin, so layout is unchanged), which makes the pull start just before the pointer arrives.
 * Mouse only, and off for reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: React.ReactNode;
  /** Fraction of the pointer's offset from centre the element follows. */
  strength?: number;
  className?: string;
}) {
  const enabled = useMediaQuery(MQ.finePointer);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 170, damping: 14, mass: 0.4 };
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);

  const onPointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!enabled || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      className={cn("-m-4 inline-flex p-4", className)}
      style={{ x: springX, y: springY }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
