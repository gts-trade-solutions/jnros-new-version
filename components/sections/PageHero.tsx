import { type Crumb, Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GridLines } from "@/components/ui/GridLines";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import type { Img, Video } from "@/lib/data";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  title: string;
  intro?: string;
  image: Img;
  /** Background loop in place of the photo; its poster is what paints first. */
  video?: Video;
  crumbs: Crumb[];
  size?: "lg" | "md";
  children?: React.ReactNode;
};

/**
 * Inner-page hero: parallax photo, breadcrumbs, label, split-text H1 and intro. Dark-toned (see
 * globals.css) so the white headline reads over any photo. The entrance is the CSS hero intro
 * (.hero-line / .hero-fade): headline words rise, then the crumbs, label and intro fade up, from
 * the first frame and without waiting for JavaScript.
 */
export function PageHero({ label, title, intro, image, video, crumbs, size = "lg", children }: Props) {
  return (
    <section data-hero="" data-tone="dark" className={cn("relative isolate flex items-end overflow-hidden bg-bg", size === "lg" ? "min-h-[86svh]" : "min-h-[62svh]")}>
      <ParallaxImage image={video?.poster ?? image} mode="hero" amount={20} preload className="absolute inset-0 -z-10">
        {video && <LoopVideo video={video} />}
      </ParallaxImage>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-bg/80 via-bg/40 to-bg" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-bg/80 via-bg/30 to-transparent" />
      <GridLines className="-z-10" />

      <div className="container-x w-full pb-16 pt-44 lg:pb-24">
        <div className="hero-fade" style={{ animationDelay: "0.2s" }}>
          <Breadcrumbs items={crumbs} />
          <SectionLabel className="mt-10">{label}</SectionLabel>
        </div>
        <SplitText as="h1" trigger="load" delay={0.1} text={title} className="mt-6 max-w-6xl text-h1" />
        {intro && (
          <p className="hero-fade mt-8 max-w-2xl text-lead text-text/80" style={{ animationDelay: "0.45s" }}>
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
