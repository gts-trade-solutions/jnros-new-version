/**
 * IntersectionObserver helper for one-shot reveals. Unlike a ScrollTrigger it never reads layout
 * on the main thread, so dozens of reveals cost nothing at hydration.
 *
 * Calls `onEnter` with the targets that entered together (one row of a grid, typically) and stops
 * watching them. Returns a disconnect function.
 */
export function onceInView(targets: Element[], onEnter: (entered: Element[]) => void, rootMargin = "0px 0px -12% 0px") {
  const io = new IntersectionObserver(
    (entries) => {
      const entered = entries.filter((e) => e.isIntersecting).map((e) => e.target);
      if (!entered.length) return;
      entered.forEach((el) => io.unobserve(el));
      onEnter(entered);
    },
    { rootMargin },
  );
  targets.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
