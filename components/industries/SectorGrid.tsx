"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLenis } from "@/components/layout/SmoothScroll";
import { GridLines } from "@/components/ui/GridLines";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import type { industriesPage, Sector } from "@/lib/industries";
import { prefersReducedMotion } from "@/lib/inview";

type Props = typeof industriesPage.sectors & { sectors: Sector[] };

const linkClass =
  "group relative isolate flex h-full items-start gap-2.5 overflow-hidden px-3 py-3.5 font-display text-lg font-bold uppercase leading-tight tracking-[0.03em] text-forest-950 transition-colors duration-500 ease-brand hover:text-lime focus-visible:text-lime sm:text-xl " +
  // A forest fill rises from the bottom on hover/focus (pseudo-element, scaleY only).
  "before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:bg-forest-950 before:transition-transform before:duration-500 before:ease-brand before:content-[''] hover:before:scale-y-100 focus-visible:before:scale-y-100";

/**
 * "Moving industry forward, one job at a time": all 16 sectors as a link grid on a lime panel.
 * The panel wipes open (clip-path) and the links fade up in a quick stagger as it enters view.
 * Sectors with a row on this page smooth-scroll to it (Lenis); the rest open the service page
 * that covers them.
 */
export function SectorGrid({ heading, text, sectors }: Props) {
  const lenis = useLenis();

  /** Lenis scrollTo; the header offset comes from html scroll-padding-top. */
  const jumpTo = (slug: string) => (e: React.MouseEvent) => {
    const target = document.getElementById(`industry-${slug}`);
    if (!target) return;
    e.preventDefault();
    e.stopPropagation(); // otherwise Lenis's own anchor handler scrolls a second time
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <section id="sectors" aria-labelledby="sectors-heading" className="relative isolate bg-forest-900 py-24 lg:py-36">
      <GridLines className="-z-10" />
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionLabel index="02">Industries served</SectionLabel>
            <SplitText id="sectors-heading" text={heading} accent={["forward,"]} className="mt-6 text-h2" />
          </div>
          <p className="text-lead text-sage lg:col-span-4">{text}</p>
        </div>

        <Reveal effect="clip" className="mt-14">
          <div className="rounded-sm bg-lime p-3 sm:p-6 lg:p-8">
            <Reveal as="ul" stagger={0.03} className="grid sm:grid-cols-2 lg:grid-cols-4">
              {sectors.map((sector) => (
                <li key={sector.name} className="border-b border-forest-950/15">
                  {"featured" in sector ? (
                    <a href={`#industry-${sector.featured}`} onClick={jumpTo(sector.featured)} className={linkClass}>
                      <SectorChevron />
                      {sector.name}
                      <span className="sr-only"> (jump to the section below)</span>
                    </a>
                  ) : (
                    <Link href={`/services/${sector.service}`} className={linkClass}>
                      <SectorChevron />
                      {sector.name}
                    </Link>
                  )}
                </li>
              ))}
            </Reveal>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SectorChevron() {
  return (
    <ChevronRight
      aria-hidden="true"
      strokeWidth={3}
      className="mt-0.5 size-5 shrink-0 transition-transform duration-500 ease-brand group-hover:translate-x-1 group-focus-visible:translate-x-1"
    />
  );
}
