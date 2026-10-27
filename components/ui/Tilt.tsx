"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MQ } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * 3D hover tilt with a moving glare: the card leans toward the pointer (rotateX / rotateY on a
 * spring) and a soft highlight follows it across the surface (translate only). Mouse only, and
 * off for reduced motion; everywhere else it renders the children untouched.
 */
export function Tilt({ children, className, max = 7 }: { children: React.ReactNode; className?: string; max?: number }) {
  const enabled = useMediaQuery(MQ.finePointer);
  // Pointer position over the card, 0–1 on each axis (0.5 = centre).
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);
  const spring = { stiffness: 160, damping: 18, mass: 0.5 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const glareX = useTransform(px, [0, 1], ["-50%", "50%"]);
  const glareY = useTransform(py, [0, 1], ["-50%", "50%"]);
  const glare = useSpring(hover, { stiffness: 120, damping: 20 });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    hover.set(1);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
    hover.set(0);
  };

  return (
    <motion.div
      className={cn("relative", className)}
      style={enabled ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
      {enabled && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          <motion.span
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(255_255_255/0.28),transparent_55%)] mix-blend-overlay"
            style={{ x: glareX, y: glareY, opacity: glare }}
          />
        </span>
      )}
    </motion.div>
  );
}
