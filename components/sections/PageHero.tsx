import { type Crumb, Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GridLines } from "@/components/ui/GridLines";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { PhotoTint } from "@/components/ui/PhotoTint";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import type { Img } from "@/lib/data";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  title: string;
  intro?: string;
  image: Img;
  crumbs: Crumb[];
  size?: "lg" | "md";
  children?: React.ReactNode;
};

/**
 * Inner-page hero: parallax photo, breadcrumbs, label, split-text H1 and intro. Everything above
 * the fold plays on load (after the preloader on a first visit) rather than on scroll.
 */
export function PageHero({ label, title, intro, image, crumbs, size = "lg", children }: Props) {
  return (
    <section className={cn("relative isolate flex items-end overflow-hidden", size === "lg" ? "min-h-[86svh]" : "min-h-[62svh]")}>
      <ParallaxImage image={image} mode="hero" amount={20} preload className="absolute inset-0 -z-10" />
      <PhotoTint className="-z-10" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-bg/80 via-bg/40 to-bg" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-bg/80 via-bg/30 to-transparent" />
      <GridLines className="-z-10" />

      <div className="container-x w-full pb-16 pt-44 lg:pb-24">
        <Reveal trigger="load" stagger={0.1}>
          <Breadcrumbs items={crumbs} />
          <SectionLabel className="mt-10">{label}</SectionLabel>
        </Reveal>
        <SplitText as="h1" trigger="load" delay={0.1} text={title} className="mt-6 max-w-6xl text-h1" />
        {intro && (
          <Reveal trigger="load" delay={0.45}>
            <p className="mt-8 max-w-2xl text-lead text-text/80">{intro}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
