"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { EASE } from "@/lib/motion";
import { jumpTo, refreshScroll, useLenis } from "./SmoothScroll";

type Phase = "idle" | "covering" | "covered" | "revealing";

const PageTransitionContext = createContext<{ onPageMount: () => void }>({ onPageMount: () => {} });
export const usePageTransition = () => useContext(PageTransitionContext);

/** If the new page never reports in (error, very slow network), uncover anyway. */
const FAILSAFE_MS = 6000;

/**
 * Route transitions.
 *
 * The App Router swaps pages instantly, so an exit animation inside template.tsx would never be
 * seen. Instead this provider lives in the root layout (it persists across navigations):
 *
 *   1. An internal link is clicked → the click is intercepted (capture phase, before <Link>).
 *   2. A lime panel wipes across the screen from the left (AnimatePresence enter).
 *   3. Once covered, router.push() swaps the page underneath.
 *   4. app/template.tsx mounts the new page and calls onPageMount().
 *   5. We jump to the top, re-measure ScrollTriggers, and the panel wipes off to the right
 *      (AnimatePresence exit) while the template fades the new page in.
 *
 * Reduced motion: no panel, just the template's fade.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const lenis = useLenis();
  const [covered, setCovered] = useState(false);
  const phase = useRef<Phase>("idle");
  const pending = useRef<{ href: string; hash: string } | null>(null);
  const failsafe = useRef(0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link || !link.href || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page (including #anchors and ?filters): no transition; Lenis/the page handles it.
      if (url.pathname === window.location.pathname) return;
      // Files served from /public or route handlers (sitemap.xml) aren't pages.
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Runs before Next's <Link> handler, which skips navigation when the event is already prevented.
      e.preventDefault();
      if (phase.current !== "idle") return;
      phase.current = "covering";
      pending.current = { href: url.pathname + url.search + url.hash, hash: url.hash };
      lenis?.stop();
      setCovered(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [lenis]);

  const uncover = useCallback(() => {
    window.clearTimeout(failsafe.current);
    phase.current = "revealing";
    // Let the new page lay out and register its triggers before measuring.
    requestAnimationFrame(() => {
      lenis?.start();
      const hash = pending.current?.hash;
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      jumpTo(lenis, target ?? 0);
      refreshScroll();
      setCovered(false);
    });
  }, [lenis]);

  /** Panel finished covering the screen: swap the page underneath. */
  const onCovered = () => {
    if (phase.current !== "covering" || !pending.current) return;
    phase.current = "covered";
    router.push(pending.current.href, { scroll: false });
    failsafe.current = window.setTimeout(uncover, FAILSAFE_MS);
  };

  const onPageMount = useCallback(() => {
    if (phase.current === "covered") uncover();
  }, [uncover]);

  return (
    <PageTransitionContext.Provider value={{ onPageMount }}>
      {children}
      <AnimatePresence onExitComplete={() => (phase.current = "idle")}>
        {covered && (
          <motion.div
            key="page-wipe"
            aria-hidden="true"
            className="fixed inset-0 z-[150] flex items-center justify-center bg-accent text-bg"
            initial={{ x: "-100%" }}
            animate={{ x: "0%", transition: { duration: 0.7, ease: EASE } }}
            exit={{ x: "100%", transition: { duration: 0.8, ease: EASE, delay: 0.05 } }}
            onAnimationComplete={(definition) => {
              // Fires for both enter and exit; only the enter (x: 0%) means "covered".
              if ((definition as { x?: string }).x === "0%") onCovered();
            }}
          >
            {/* Leading edge: a thin hazard stripe so the wipe reads as a moving panel, not a flash. */}
            <span className="hazard absolute inset-y-0 right-0 w-2" />
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.25, duration: 0.5, ease: EASE } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <LogoMark className="size-24" />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}
