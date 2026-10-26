import { useSyncExternalStore } from "react";

/**
 * "Intro done" signal: false while the first-visit preloader is on screen, true otherwise.
 * Hero headlines wait for it so their reveal plays as the preloader lifts, not behind it.
 *
 * The inline boot script in app/layout.tsx adds html.preload on a first visit (once per session),
 * so returning visitors start with the intro already done.
 */
export { INTRO_STORAGE_KEY } from "./storage";

let done = false;
const listeners = new Set<() => void>();

export function isIntroDone() {
  return done || !document.documentElement.classList.contains("preload");
}

export function markIntroDone() {
  if (done) return;
  done = true;
  // Starts the CSS-driven home hero intro (see .hero-line in globals.css) if it was held.
  if (document.documentElement.classList.contains("preload")) document.documentElement.classList.add("intro");
  listeners.forEach((listener) => listener());
}

export function subscribeIntro(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const noSubscribe = () => () => {};
const never = () => false;

/**
 * Server render (and hydration) always reports false; the client then reads the real state.
 * Pass `enabled = false` from components that don't care (e.g. scroll-triggered headings) so they
 * don't all re-render when the intro finishes.
 */
export function useIntroDone(enabled = true) {
  return useSyncExternalStore(enabled ? subscribeIntro : noSubscribe, enabled ? isIntroDone : never, never);
}
