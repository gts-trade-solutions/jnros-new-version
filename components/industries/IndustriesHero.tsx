import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GridLines } from "@/components/ui/GridLines";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { PhotoTint } from "@/components/ui/PhotoTint";
import type { industriesPage } from "@/lib/industries";

type Props = typeof industriesPage.hero;

/**
 * Full-bleed hero: a green-toned photo that drifts on scroll, with the title block on the right and
 * a lime rule between the headline and the subline.
 *
 * The intro is pure CSS (.hero-line, .hero-rule, .hero-fade in globals.css): the headline rises out
 * of its masks, the rule draws from the left (scaleX), then the subline fades up. It starts on the
 * first frame without waiting for JavaScript, and waits behind the first-visit preloader.
 */
export function IndustriesHero({ lines, subline, image }: Props) {
  return (
    <section aria-labelledby="industries-title" className="relative isolate flex min-h-[82svh] items-end overflow-hidden lg:min-h-[88svh] lg:items-center">
      <ParallaxImage image={image} mode="hero" amount={18} preload className="absolute inset-0 -z-10" />
      <PhotoTint className="-z-10" />
      {/* Legibility: darken toward the text (bottom on mobile, right on desktop). */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950 via-forest-950/60 to-forest-950/30" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-gradient-to-l from-forest-950/90 via-forest-950/45 to-transparent lg:block" />
      <GridLines className="-z-10" />

      <div className="container-x w-full pb-16 pt-40 lg:py-40">
        <div className="lg:ml-auto lg:w-1/2">
          <div className="hero-fade" style={{ "--i": 0 } as React.CSSProperties}>
            <Breadcrumbs items={[{ label: "Industries", href: "/industries" }]} />
          </div>
          <h1
            id="industries-title"
            className="mt-8 font-display text-h1 font-extrabold uppercase"
            style={{ "--hero-duration": "0.9s", "--hero-stagger": "0.13s" } as React.CSSProperties}
          >
            {lines.map((line, i) => (
              <span key={line} className="-my-[0.08em] block overflow-hidden py-[0.08em]">
                <span className={i === 1 ? "hero-line block text-lime" : "hero-line block"} style={{ "--i": i } as React.CSSProperties}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <span aria-hidden="true" className="hero-rule mt-8 block h-0.5 w-full origin-left bg-lime/80" />
          <p className="hero-fade mt-6 max-w-lg text-[clamp(1.25rem,1.9vw,1.75rem)] leading-snug text-mint" style={{ "--i": 1 } as React.CSSProperties}>
            {subline}
          </p>
        </div>
      </div>
    </section>
  );
}
