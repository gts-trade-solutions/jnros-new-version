import { Plane, Ship, Truck } from "lucide-react";
import { PauseOffscreen } from "@/components/ui/PauseOffscreen";
import { spaces } from "@/lib/data";

/** One wave period is 40 SVG units wide; the strip holds 30 of them (1200 units). */
const WAVE = `M0 12 ${Array.from({ length: 30 }, (_, i) => `Q${i * 40 + 10} 4 ${i * 40 + 20} 12 T${i * 40 + 40} 12`).join(" ")}`;

/**
 * Closing band of the footer: Sea, Air & Land in motion. A plane crosses the sky trailing a
 * contrail, a ship rocks across rolling waves, and a truck drives along the road. Pure CSS
 * keyframes on transform (globals.css: cross-right, cross-left, waves, rock, hover), so it all runs
 * on the compositor; negative delays spread the vehicles out. Paused while off-screen. Reduced
 * motion: everything stands still at fixed positions.
 */
export function FooterTransit() {
  return (
    <PauseOffscreen className="relative h-48 overflow-hidden border-t border-border sm:h-60" aria-hidden="true">
      <p className="container-x pt-6 font-mono text-label uppercase text-muted">{spaces.subheading}</p>

      {/* Air */}
      <div
        data-loop
        className="absolute left-0 top-[22%] animate-cross-right motion-reduce:left-[58%] motion-reduce:animate-none [--cross-duration:24s]"
        style={{ animationDelay: "-9s" }}
      >
        <div data-loop className="flex animate-hover items-center motion-reduce:animate-none">
          <span className="h-px w-32 bg-gradient-to-r from-transparent to-text/25 sm:w-48" />
          <Plane className="size-6 rotate-45 text-text/60 sm:size-8" strokeWidth={1.5} />
        </div>
      </div>

      {/* Sea */}
      <div className="absolute inset-x-0 top-[58%] h-6 overflow-hidden">
        <div data-loop className="flex w-[200%] animate-waves motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <svg key={copy} viewBox="0 0 1200 24" preserveAspectRatio="none" className="h-6 w-1/2 shrink-0">
              <path d={WAVE} fill="none" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="1.5" />
            </svg>
          ))}
        </div>
      </div>
      <div
        data-loop
        className="absolute left-0 top-[calc(58%-1.6rem)] animate-cross-left motion-reduce:left-[22%] motion-reduce:animate-none [--cross-duration:46s]"
        style={{ animationDelay: "-14s" }}
      >
        <div className="flex items-end">
          <div data-loop className="origin-bottom animate-rock motion-reduce:animate-none">
            <Ship className="size-9 text-accent sm:size-11" strokeWidth={1.5} />
          </div>
          <span className="mb-1 h-px w-20 bg-gradient-to-l from-transparent to-accent/50" />
        </div>
      </div>

      {/* Land */}
      <div className="absolute inset-x-0 bottom-8 h-px bg-border" />
      <div className="absolute inset-x-0 bottom-[1.3rem] h-0.5 bg-[repeating-linear-gradient(90deg,var(--muted)_0_24px,transparent_24px_64px)] opacity-30" />
      <div
        data-loop
        className="absolute bottom-8 left-0 animate-cross-right motion-reduce:left-[78%] motion-reduce:animate-none [--cross-duration:15s]"
        style={{ animationDelay: "-4s" }}
      >
        <Truck className="size-8 text-text/70 sm:size-10" strokeWidth={1.5} />
      </div>
    </PauseOffscreen>
  );
}
