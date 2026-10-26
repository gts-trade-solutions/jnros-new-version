"use client";

import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE } from "@/lib/motion";

export type SubmitStatus = "idle" | "sending" | "done" | "error";

/**
 * Submit button that morphs: a lime label button → a circle with a spinner while sending → a lime
 * check circle when done, with a burst of small lime squares. The size change is a Motion layout
 * animation (transform-based), and border-radius is animated alongside so the corners stay true.
 */
export function SubmitButton({ status, label }: { status: SubmitStatus; label: string }) {
  const round = status === "sending" || status === "done";
  return (
    <div className="relative inline-flex">
      <motion.button
        layout
        type="submit"
        disabled={round}
        aria-label={status === "sending" ? "Sending your request" : status === "done" ? "Request sent" : undefined}
        className={
          round
            ? "relative grid size-14 place-items-center overflow-hidden bg-lime text-forest-950"
            : "relative flex h-14 items-center gap-3 overflow-hidden bg-lime px-8 font-display text-base font-bold uppercase tracking-[0.08em] text-forest-950 transition-colors hover:bg-lime-bright"
        }
        style={{ borderRadius: round ? 999 : 2 }}
        transition={{ layout: { duration: 0.55, ease: EASE } }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {status === "sending" ? (
            <motion.span key="spin" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
              <LoaderCircle aria-hidden="true" className="size-6 animate-spin" />
            </motion.span>
          ) : status === "done" ? (
            <motion.span key="done" initial={{ opacity: 0, scale: 0, rotate: -90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 420, damping: 18 }}>
              <Check aria-hidden="true" className="size-7" strokeWidth={3} />
            </motion.span>
          ) : (
            <motion.span key="label" layout="position" className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {label}
              <ArrowRight aria-hidden="true" className="size-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      {status === "done" && <Confetti />}
    </div>
  );
}

/** ~30 small squares fly out from the button, arc down and fade. Skipped for reduced motion. */
function Confetti() {
  const reduced = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const angle = (i / 30) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 70 + Math.random() * 120;
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 50,
          rotate: Math.random() * 540 - 270,
          size: 5 + Math.random() * 6,
          color: ["bg-lime", "bg-lime-bright", "bg-mint"][i % 3],
          delay: Math.random() * 0.08,
        };
      }),
    [],
  );
  if (reduced) return null;
  return (
    <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-10">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className={`absolute rounded-[1px] ${p.color}`}
          style={{ width: p.size, height: p.size, left: -p.size / 2, top: -p.size / 2 }}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 110], scale: [0, 1, 0.9], rotate: p.rotate, opacity: [1, 1, 0] }}
          transition={{ duration: 1.4, delay: p.delay, ease: EASE, times: [0, 0.45, 1] }}
        />
      ))}
    </span>
  );
}
