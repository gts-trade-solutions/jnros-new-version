import { Phone } from "lucide-react";
import { GridLines } from "@/components/ui/GridLines";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { PhotoTint } from "@/components/ui/PhotoTint";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { type Img, pageImages, site } from "@/lib/data";
import { telHref } from "@/lib/utils";

type Props = { title?: string; label?: string; image?: Img; accent?: string[]; cta?: { label: string; href: string } };

/** Closing call to action: hazard-striped top edge, parallax photo, magnetic quote button, phone. */
export function CtaBanner({
  title = "Ready to move\nsomething big?",
  label = "Start a project",
  image = pageImages.cta,
  accent = ["big?"],
  cta = { label: "Request a Quote", href: "/get-a-quote" },
}: Props) {
  return (
    <section aria-labelledby="cta-heading" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="hazard h-3 w-full" />
      <div className="relative">
        <ParallaxImage image={image} decorative amount={18} className="absolute inset-0 -z-10" />
        <PhotoTint className="-z-10" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/80 to-bg/25" />
        <GridLines className="-z-10" />

        <div className="container-x py-28 lg:py-44">
          <SectionLabel>{label}</SectionLabel>
          <SplitText id="cta-heading" text={title} accent={accent} className="mt-6 max-w-5xl text-h1" />
          <Reveal className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
            <div>
              <MagneticButton href={cta.href} size="lg">
                {cta.label}
              </MagneticButton>
            </div>
            <a href={telHref(site.phone)} className="group flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-xs border border-text/20 transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
                <Phone aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block font-mono text-label uppercase text-muted">Talk to an engineer, 24/7</span>
                <span className="block font-display text-3xl font-extrabold transition-colors group-hover:text-accent">{site.phone}</span>
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
