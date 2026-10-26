import Image from "next/image";
import type { Img } from "@/lib/images";
import { cn } from "@/lib/utils";

type Props = { image: Img; sizes: string; imageClassName?: string; preload?: boolean };

/**
 * Photo with the green duotone treatment: a lime-deep hue layer (mix-blend-mode: color) over a
 * forest-800 multiply layer. Both fade out (opacity) when the nearest `group/duo` ancestor is
 * hovered or keyboard-focused, revealing the true colours. Fills its positioned parent.
 */
export function Duotone({ image, sizes, imageClassName, preload = false }: Props) {
  const fade = "transition-opacity duration-700 ease-brand group-hover/duo:opacity-0 group-focus-visible/duo:opacity-0";
  return (
    <>
      <Image src={image.src} alt={image.alt} fill sizes={sizes} preload={preload} fetchPriority={preload ? "high" : undefined} className={cn("object-cover", imageClassName)} />
      <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0 bg-lime-deep opacity-70 mix-blend-color", fade)} />
      <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0 bg-forest-800 opacity-50 mix-blend-multiply", fade)} />
    </>
  );
}
