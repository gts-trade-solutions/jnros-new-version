"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { jumpTo, refreshScroll, useLenis } from "./SmoothScroll";

const PageTransitionContext = createContext<{ onPageMount: () => void }>({ onPageMount: () => {} });
export const usePageTransition = () => useContext(PageTransitionContext);

/**
 * Route changes.
 *
 * Navigation is immediate: every page is static and <Link> prefetches it, so the new page swaps in
 * as soon as it is clicked and app/template.tsx fades it in. There is deliberately no covering
 * panel or loader in between: anything that hides the screen reads as loading time.
 *
 * The one thing handled here is the scroll reset under smooth scrolling. Next resets the scroll
 * natively, which Lenis would override if it is still easing from a wheel scroll, so while Lenis
 * is running:
 *   1. An internal link click is intercepted (capture phase, before <Link>) and pushed with
 *      { scroll: false }.
 *   2. app/template.tsx mounts the new page and calls onPageMount(): we jump to the top (or the
 *      #anchor) through Lenis and re-measure ScrollTriggers.
 * Without Lenis (touch, reduced motion) Next handles it natively and SmoothScroll re-measures.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const lenis = useLenis();
  const pending = useRef<{ hash: string } | null>(null);

  useEffect(() => {
    if (!lenis) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link || !link.href || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page (including #anchors and ?filters): Lenis/the page handles it.
      if (url.pathname === window.location.pathname) return;
      // Files served from /public or route handlers (sitemap.xml) aren't pages.
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return;

      // Runs before Next's <Link> handler, which skips navigation when the event is already prevented.
      e.preventDefault();
      pending.current = { hash: url.hash };
      router.push(url.pathname + url.search + url.hash, { scroll: false });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [lenis, router]);

  const onPageMount = useCallback(() => {
    const hash = pending.current?.hash;
    if (hash === undefined) return;
    pending.current = null;
    // Let the new page lay out and register its triggers before measuring.
    requestAnimationFrame(() => {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      jumpTo(lenis, target ?? 0);
      refreshScroll();
    });
  }, [lenis]);

  return <PageTransitionContext.Provider value={{ onPageMount }}>{children}</PageTransitionContext.Provider>;
}
