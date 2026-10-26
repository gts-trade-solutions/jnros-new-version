import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { FeaturedIndustry } from "@/lib/industries";
import { cn } from "@/lib/utils";
import { Duotone } from "./Duotone";

/**
 * The ten featured industries as full-width bands, photo and text alternating sides and the band
 * colour alternating forest-950 / forest-900.
 *
 * - The photo wipes open from the bottom while it settles from 1.25x (Reveal "clip"), then the
 *   number, name, subtitle and button fade up in a stagger.
 * - Photos carry the green duotone; hovering (or focusing) the photo clears it to true colour and
 *   zooms slightly, with the cursor showing "VIEW".
 * - Each band is the scroll target for its link in the sector grid (#industry-<slug>).
 */
export function IndustryRows({ industries }: { industries: FeaturedIndustry[] }) {
  return (
    <section aria-labelledby="rows-heading">
      <h2 id="rows-heading" className="sr-only">
        Featured industries
      </h2>
      {industries.map((industry, i) => {
        const flip = i % 2 === 1;
        const href = `/industries/${industry.slug}`;
        return (
          <article
            key={industry.slug}
            id={`industry-${industry.slug}`}
            aria-labelledby={`row-${industry.slug}`}
            className={cn("py-16 lg:py-24", flip ? "bg-forest-900" : "bg-forest-950")}
          >
            <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <Reveal effect="clip" className={cn(flip && "lg:order-2")}>
                <Link
                  href={href}
                  tabIndex={-1}
                  aria-hidden="true"
                  data-cursor="view"
                  className="group/duo relative block aspect-[4/3] overflow-hidden rounded-sm border border-line bg-forest-800"
                >
                  <div data-reveal-zoom className="absolute inset-0">
                    <Duotone
                      image={industry.image}
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      imageClassName="transition-transform duration-[1.2s] ease-brand motion-safe:group-hover/duo:scale-105"
                    />
                  </div>
                </Link>
              </Reveal>

              <Reveal stagger={0.08}>
                <p className="font-mono text-label uppercase text-lime">
                  {industry.number} <span className="text-sage">/ {String(industries.length).padStart(2, "0")}</span>
                </p>
                <h3 id={`row-${industry.slug}`} className="mt-5 font-display text-h2 font-extrabold uppercase">
                  {industry.name}
                </h3>
                <p className="mt-5 max-w-md font-display text-xl font-bold uppercase leading-snug tracking-[0.03em] text-mint">{industry.subtitle}</p>
                <div className="mt-9">
                  <Button href={href} size="lg">
                    Learn more<span className="sr-only"> about {industry.name}</span>
                  </Button>
                </div>
              </Reveal>
            </div>
          </article>
        );
      })}
    </section>
  );
}
