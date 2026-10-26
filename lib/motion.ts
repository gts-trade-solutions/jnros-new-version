/**
 * Shared motion constants. Every reveal on the site uses the same curve and the same ranges:
 *   easing    cubic-bezier(0.22, 1, 0.36, 1)  (GSAP: "brand", Motion: EASE, CSS: ease-brand)
 *   duration  0.6 – 1.2s
 *   stagger   0.06 – 0.12s (0.04s inside the mega menu, where items are small and many)
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = { fast: 0.6, base: 0.9, slow: 1.2 } as const;
export const STAGGER = { menu: 0.04, tight: 0.06, base: 0.08, loose: 0.12 } as const;

/** Media queries shared by gsap.matchMedia() and useMediaQuery(). */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  /** Full cinematic experience: big screen, no reduced-motion preference. */
  desktopMotion: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  /** Pointer effects (cursor, magnetic): a real mouse and motion allowed. */
  finePointer: "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
} as const;
