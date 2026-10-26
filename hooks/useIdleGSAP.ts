"use client";

import { type RefObject, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { whenIdle } from "@/lib/idle";

type Options = { scope?: RefObject<Element | null>; dependencies?: unknown[]; priority?: number };

/**
 * Like useGSAP, but the setup runs in an idle task after hydration (see lib/idle.ts). Use it for
 * scroll-driven effects on content that isn't animating on the first frame. Everything created
 * inside is collected in a gsap.context (selectors scoped to `scope`) and reverted on unmount.
 */
export function useIdleGSAP(setup: () => void, { scope, dependencies = [], priority = 0 }: Options = {}) {
  useEffect(() => {
    let ctx: gsap.Context | undefined;
    const cancel = whenIdle(() => {
      ctx = gsap.context(setup, scope?.current ?? undefined);
    }, priority);
    return () => {
      cancel();
      ctx?.revert();
    };
    // Like useGSAP: re-runs only when the listed dependencies change.
  }, dependencies);
}
