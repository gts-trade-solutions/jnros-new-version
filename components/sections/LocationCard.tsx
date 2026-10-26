import { ArrowUpRight, Phone } from "lucide-react";
import Link from "next/link";
import type { Location } from "@/lib/data";
import { telHref } from "@/lib/utils";

/** Branch summary card. The city name links to the location page (stretched over the card); the phone stays its own link. */
export function LocationCard({ location }: { location: Location }) {
  const badge = location.hq ? "Headquarters" : location.hub ? "Regional hub" : "Branch";
  return (
    <article className="group relative flex h-full flex-col rounded-xs border border-border bg-bg p-6 transition-colors duration-500 hover:border-accent/60">
      <div className="flex items-center justify-between gap-4">
        <span className={`font-mono text-label uppercase ${location.hub ? "text-accent" : "text-muted"}`}>{badge}</span>
        <ArrowUpRight aria-hidden="true" className="size-4 text-muted transition duration-500 ease-brand group-hover:rotate-45 group-hover:text-accent" />
      </div>
      <h3 className="mt-8 font-display text-h3 font-extrabold uppercase">
        <Link href={`/locations/${location.slug}`} className="after:absolute after:inset-0 group-hover:text-accent">
          {location.city}
          <span className="text-muted">, {location.regionCode}</span>
        </Link>
      </h3>
      <address className="mt-4 text-sm not-italic leading-6 text-muted">
        {location.street}
        <br />
        {location.locality} {location.postalCode}
      </address>
      <div className="mt-auto flex items-center justify-between gap-4 pt-6 font-mono text-label uppercase">
        <a href={telHref(location.phone)} className="relative z-10 flex items-center gap-2 text-text transition-colors hover:text-accent">
          <Phone aria-hidden="true" className="size-3.5" />
          {location.phone}
        </a>
        <span className="text-muted">{location.yard}</span>
      </div>
    </article>
  );
}
