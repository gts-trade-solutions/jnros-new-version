import { cn } from "@/lib/utils";

/**
 * Thin 1px vertical grid lines aligned to the page container: the blueprint motif behind heroes
 * and dark sections. Purely decorative.
 */
export function GridLines({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <div className="container-x grid h-full grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={cn("h-full border-l border-[color:var(--grid-line)] last:border-r", i > 1 && "hidden md:block")} />
        ))}
      </div>
    </div>
  );
}
