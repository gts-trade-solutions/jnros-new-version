import { cn } from "@/lib/utils";

/**
 * Green duotone for full-bleed photos (page heroes, CTA banners), matching the industry cards
 * (components/industries/Duotone): a lime-deep hue layer (mix-blend-mode: color) over a forest-800
 * multiply layer. Hidden outside the forest theme (`forest:` variant, see globals.css), so the rest
 * of the site keeps its natural photos. Place it right after the photo, in the same stacking context.
 */
export function PhotoTint({ className }: { className?: string }) {
  const layer = "pointer-events-none absolute inset-0 hidden forest:block";
  return (
    <>
      <span aria-hidden="true" className={cn(layer, "bg-lime-deep opacity-70 mix-blend-color", className)} />
      <span aria-hidden="true" className={cn(layer, "bg-forest-800 opacity-50 mix-blend-multiply", className)} />
    </>
  );
}
