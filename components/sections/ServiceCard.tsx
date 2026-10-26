import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/data";

/**
 * Tall service card. Hover (CSS only, transform/opacity):
 * - photo zooms to 1.08 and the dark overlay lightens
 * - title block slides up as the description fades in beneath it
 * - the arrow turns 45° and a lime line sweeps across the bottom edge
 * Touch devices have no hover, so they get the "open" state (description visible) by default;
 * keyboard focus opens it too.
 */
export function ServiceCard({ service, sizes }: { service: Service; sizes: string }) {
  return (
    <Link href={`/services/${service.slug}`} data-cursor="view" className="group relative block aspect-[3/4.2] overflow-hidden rounded-xs bg-surface-2">
      {/* [data-reveal-zoom] settles from 1.25x during the scroll reveal; the hover zoom is on the image itself. */}
      <div data-reveal-zoom className="absolute inset-0">
        <Image
          src={service.image.src}
          alt={service.image.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1.2s] ease-brand motion-safe:group-hover:scale-[1.08]"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/20 transition-opacity duration-700 ease-brand group-hover:opacity-60" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6">
        <span className="font-mono text-label text-accent">{service.number}</span>
        <span className="grid size-10 place-items-center rounded-xs border border-text/20 bg-bg/50 transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
          <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-500 ease-brand group-hover:rotate-45" />
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        {/* Pushed down by the description's height (4.5rem + 0.75rem gap) until hover. */}
        <div className="transition-transform duration-700 ease-brand can-hover:translate-y-[5.25rem] can-hover:group-hover:translate-y-0 can-hover:group-focus-visible:translate-y-0">
          <h3 className="font-display text-h3 font-extrabold uppercase">{service.title}</h3>
          <p className="mt-3 line-clamp-3 h-[4.5rem] text-sm leading-6 text-text/80 transition-opacity duration-500 can-hover:opacity-0 can-hover:group-hover:opacity-100 can-hover:group-hover:delay-100 can-hover:group-focus-visible:opacity-100">
            {service.short}
          </p>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-brand group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </Link>
  );
}
