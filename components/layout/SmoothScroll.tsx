"use client";

import type Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { isIntroDone, subscribeIntro } from "@/lib/intro";
import { MQ } from "@/lib/motion";

const LenisContext = createContext<Lenis | null>(null);

/** The Lenis instance, or null when smooth scrolling is off (touch, reduced motion) or still loading. */
export const useLenis = () => useContext(LenisContext);

/** Re-measures every ScrollTrigger in page order. Call after anything changes layout. */
export function refreshScroll() {
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}

/** Jumps to the top (or an element), through Lenis when it is running. */
export function jumpTo(lenis: Lenis | null, target: number | HTMLElement = 0) {
  if (lenis) {
    lenis.scrollTo(target, { immediate: true, force: true });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "instant" });
  else target.scrollIntoView({ behavior: "instant" });
}

/**
 * Smooth scrolling with Lenis, driven by GSAP's ticker so ScrollTrigger reads the same scroll
 * position on the same frame (no jitter on pinned or scrubbed sections).
 *
 * - Mouse/trackpad only: touch devices keep native momentum scrolling and never download Lenis.
 * - Off for prefers-reduced-motion.
 * - Paused while the first-visit preloader is on screen.
 * - Re-measures triggers after fonts and late images change the page height, and on navigation.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const firstRoute = useRef(true);

  // Tells the boot script's safety net that components now own the pre-hidden elements. A JS flag,
  // not a class on <html>: changing that would restyle the whole document.
  useEffect(() => {
    (window as Window & { __siteHydrated?: boolean }).__siteHydrated = true;
  }, []);

  useEffect(() => {
    if (!window.matchMedia(MQ.finePointer).matches) return;

    let instance: Lenis | null = null;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    const tick = (time: number) => instance?.raf(time * 1000);

    import("lenis").then(({ default: LenisClass }) => {
      if (cancelled) return;
      // anchors: Lenis honours html scroll-padding-top (header height) and target scroll-margin itself.
      instance = new LenisClass({ lerp: 0.1, autoRaf: false, anchors: true });
      instance.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      if (!isIntroDone()) {
        instance.stop();
        unsubscribe = subscribeIntro(() => instance?.start());
      }
      setLenis(instance);
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
      gsap.ticker.remove(tick);
      instance?.destroy();
      setLenis(null);
    };
  }, []);

  // ScrollTrigger refreshes itself on window load. After that, refresh when a web font swap or a
  // late-loading image actually changes the page height (cheap check, debounced).
  useEffect(() => {
    let lastHeight = document.documentElement.scrollHeight;
    let timer = 0;
    const check = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const height = document.documentElement.scrollHeight;
        if (height !== lastHeight) {
          lastHeight = height;
          refreshScroll();
        }
      }, 200);
    };
    const onLoad = (e: Event) => {
      if ((e.target as Element | null)?.tagName === "IMG") check();
    };
    document.addEventListener("load", onLoad, true);
    document.fonts?.ready.then(check);
    return () => {
      document.removeEventListener("load", onLoad, true);
      window.clearTimeout(timer);
    };
  }, []);

  // Back/forward navigations skip the page transition; re-measure the new page's triggers.
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    const id = requestAnimationFrame(refreshScroll);
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
