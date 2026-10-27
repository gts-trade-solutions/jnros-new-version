import Image from "next/image";
import { cn } from "@/lib/utils";
import emblem from "@/public/brand/jnros-emblem.png";
import wordmark from "@/public/brand/jnros-wordmark.png";

/** The Jnros emblem: the badge illustration in a white disc. Decorative: always sits next to or inside labelled UI. */
export function LogoMark({ className }: { className?: string }) {
  // Eager so the hidden preloader warms the cache for the page-transition wipe, which mounts on demand.
  return <Image src={emblem} alt="" sizes="96px" loading="eager" className={className} />;
}

/**
 * Emblem + wordmark, for light and dark tones alike. The logo's own "Jnros" lettering is a mask filled with
 * currentColor; "Logistics" is live text so it stays legible at header size.
 * Sized in em: change the font size to scale the whole lockup.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-[0.7em]", className ?? "text-base")}>
      <span className="sr-only">Jnros Logistics</span>
      <LogoMark className="size-[3em] shrink-0" />
      <span aria-hidden="true" className="flex flex-col gap-[0.4em]">
        <span
          className="block h-[1.65em] bg-current"
          style={{ aspectRatio: `${wordmark.width} / ${wordmark.height}`, mask: `url(${wordmark.src}) center / contain no-repeat` }}
        />
        <span className="flex items-center gap-[0.5em] font-sans text-[0.56em] font-medium uppercase leading-none text-muted">
          <span className="h-px flex-1 bg-current" />
          {/* Negative margin cancels the tracking after the last letter, so the rules stay even. */}
          <span className="-mr-[0.42em] tracking-[0.42em]">Logistics</span>
          <span className="h-px flex-1 bg-current" />
        </span>
      </span>
    </span>
  );
}
