"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { EASE, MQ } from "@/lib/motion";

type Mode = { type: "default" | "link" | "label" | "hidden"; label?: string };

/**
 * Custom cursor (desktop, mouse, motion allowed): a dot that tracks the pointer exactly and a ring
 * that trails it on a spring. Over [data-cursor="view"|"drag"] the ring grows into a lime disc
 * with the label; over links and buttons it expands slightly; over form fields it hides so the
 * native text cursor takes over.
 */
export function Cursor() {
  const enabled = useMediaQuery(`${MQ.finePointer} and (min-width: 1024px)`);
  return enabled ? <CursorInner /> : null;
}

function CursorInner() {
  const [mode, setMode] = useState<Mode>({ type: "hidden" });
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // The ring lags behind on a soft spring; the dot uses the raw values.
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      if (target.closest("input, textarea, select, iframe, [contenteditable='true']")) return setMode({ type: "hidden" });
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      if (labelled?.dataset.cursor) return setMode({ type: "label", label: labelled.dataset.cursor });
      if (target.closest("a, button, [role='button'], label, summary")) return setMode({ type: "link" });
      setMode({ type: "default" });
    };

    const onLeave = () => setMode({ type: "hidden" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    html.addEventListener("pointerleave", onLeave);
    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      html.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  const visible = mode.type !== "hidden";
  const ringScale = mode.type === "label" ? 2.2 : mode.type === "link" ? 1.45 : 1;
  const transition = { duration: 0.45, ease: EASE };

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[300]">
      {/* Ring (+ label). Outline and filled disc are separate layers that crossfade (opacity only),
          coloured by the theme's accent token. */}
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="absolute -left-5 -top-5 size-10"
          initial={false}
          animate={{ scale: visible ? ringScale : 0.4, opacity: visible ? 1 : 0 }}
          transition={transition}
        >
          <motion.span
            className="absolute inset-0 rounded-full border border-accent"
            initial={false}
            animate={{ opacity: mode.type === "label" ? 0 : 0.85 }}
            transition={transition}
          />
          <motion.span
            className="absolute inset-0 rounded-full bg-accent"
            initial={false}
            animate={{ opacity: mode.type === "label" ? 1 : 0 }}
            transition={transition}
          />
        </motion.div>
        <AnimatePresence>
          {mode.type === "label" && (
            <motion.span
              key={mode.label}
              className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 font-display text-sm font-bold uppercase tracking-[0.12em] text-bg"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {mode.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dot */}
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.div
          className="absolute -left-[3px] -top-[3px] size-1.5 rounded-full bg-accent"
          initial={false}
          animate={{ scale: visible && mode.type !== "label" ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />
      </motion.div>
    </div>
  );
}
