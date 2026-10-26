import { Icon } from "@/components/ui/Icon";
import { PauseOffscreen } from "@/components/ui/PauseOffscreen";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { industries } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Two infinite rows of industries scrolling in opposite directions (pure CSS keyframes on
 * transform, so they run on the compositor). The list is rendered twice and the track translates
 * by -50% for a seamless loop; the copy is hidden from assistive tech. Hovering a row pauses it.
 * Paused while off-screen. Reduced motion: no movement, the list simply wraps.
 */
export function Marquee() {
  return (
    <section aria-labelledby="industries-heading" className="relative overflow-hidden border-y border-border py-20 lg:py-28">
      <div className="container-x mb-12 flex items-center justify-between gap-6">
        <SectionLabel index="04">
          <span id="industries-heading">Industries we serve</span>
        </SectionLabel>
        <p className="hidden font-mono text-label uppercase text-muted sm:block">Hover to pause</p>
      </div>
      <PauseOffscreen>
        <Row direction="left" />
        <div className="motion-reduce:hidden">
          <Row direction="right" outline />
        </div>
      </PauseOffscreen>
    </section>
  );
}

function Row({ direction, outline = false }: { direction: "left" | "right"; outline?: boolean }) {
  return (
    <div className="marquee flex overflow-hidden py-2">
      <div
        className={cn(
          "marquee-track flex w-max motion-reduce:w-full",
          direction === "left" ? "motion-safe:animate-marquee-left" : "motion-safe:animate-marquee-right",
        )}
        style={{ "--marquee-duration": direction === "left" ? "52s" : "60s" } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className={cn("flex shrink-0 items-center motion-reduce:w-full motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:gap-y-6", copy === 1 && "motion-reduce:hidden")}
          >
            {industries.map((industry) => (
              <li key={industry.slug} className="flex items-center gap-6 px-6 sm:gap-8 sm:px-8">
                <Icon name={industry.icon} className={cn("size-9 shrink-0 sm:size-12", outline ? "text-muted" : "text-accent")} />
                <span className={cn("whitespace-nowrap font-display text-marquee font-extrabold uppercase", outline && "text-outline")}>{industry.name}</span>
                <span aria-hidden="true" className="ml-2 font-display text-marquee font-extrabold text-accent/70 sm:ml-4">
                  /
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
