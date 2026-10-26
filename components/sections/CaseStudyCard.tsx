import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type CaseStudy, getIndustry } from "@/lib/data";

/** Project card for grids: photo, industry tag, location, title and headline weight. */
export function CaseStudyCard({ study, sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" }: { study: CaseStudy; sizes?: string }) {
  return (
    <Link href={`/case-studies/${study.slug}`} data-cursor="view" className="group relative block aspect-[4/5] overflow-hidden rounded-xs bg-surface-2">
      <div data-reveal-zoom className="absolute inset-0">
        <Image
          src={study.image.src}
          alt={study.image.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1.2s] ease-brand motion-safe:group-hover:scale-[1.06]"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-bg/30 transition-opacity duration-700 group-hover:opacity-80" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6">
        <span className="rounded-xs bg-accent px-2.5 py-1 font-mono text-label uppercase text-bg">{getIndustry(study.industry).name}</span>
        <span className="font-mono text-label text-text/70">{study.year}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="flex items-center gap-2 font-mono text-label uppercase text-text/70">
          <MapPin aria-hidden="true" className="size-3.5 text-accent" />
          {study.location}
        </p>
        <h3 className="mt-3 font-display text-h3 font-extrabold uppercase">{study.title}</h3>
        <p className="mt-4 flex items-baseline justify-between gap-4 border-t border-text/15 pt-4">
          <span className="font-display text-2xl font-extrabold text-accent">{study.weight}</span>
          <span className="font-mono text-label uppercase text-text/60">{study.duration}</span>
        </p>
      </div>
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-brand group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </Link>
  );
}
