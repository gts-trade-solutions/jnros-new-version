import { Button } from "@/components/ui/Button";
import { GridLines } from "@/components/ui/GridLines";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import type { Video } from "@/lib/data";

type Props = {
  label: string;
  title: string;
  accent?: string[];
  text: string;
  points: string[];
  cta: { label: string; href: string };
  video: Video;
};

/**
 * Full-bleed film band: a background loop (parallax, dark-toned) behind a headline, a paragraph,
 * a row of key points and a link. The clip is decorative; the text carries the meaning.
 */
export function VideoBand({ label, title, accent, text, points, cta, video }: Props) {
  return (
    <section aria-labelledby="film-heading" data-tone="dark" className="relative isolate overflow-hidden bg-bg">
      <ParallaxImage image={video.poster} decorative amount={18} className="absolute inset-0 -z-10">
        <LoopVideo video={video} />
      </ParallaxImage>
      {/* Legibility: a wash behind the copy on the left, and a darker floor under it. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-bg/90 via-bg/55 to-bg/5" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-bg/85 via-transparent to-bg/30" />
      <GridLines className="-z-10" />

      <div className="container-x flex min-h-[85svh] flex-col justify-end py-24 lg:py-32">
        <SectionLabel>{label}</SectionLabel>
        <SplitText id="film-heading" text={title} accent={accent} className="mt-6 max-w-5xl text-h1" />
        <Reveal>
          <p className="mt-8 max-w-2xl text-lead text-text/85">{text}</p>
        </Reveal>
        <Reveal as="ul" batch stagger={0.06} className="mt-10 flex flex-wrap gap-2.5">
          {points.map((point) => (
            <li key={point} className="rounded-xs border border-text/20 bg-bg/40 px-4 py-2.5 font-mono text-label uppercase backdrop-blur-sm">
              {point}
            </li>
          ))}
        </Reveal>
        <Reveal className="mt-12">
          <Button href={cta.href} size="lg">
            {cta.label}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
