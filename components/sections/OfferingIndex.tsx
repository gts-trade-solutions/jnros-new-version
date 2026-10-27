import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import type { Img, Offering } from "@/lib/data";
import { cn } from "@/lib/utils";

type Props = {
  /** Singular, for the row labels: "Solution", "Service". */
  kind: string;
  title: string;
  path: string;
  image: Img;
  heading?: string;
  text: string;
  items: Offering[];
};

/** /solutions and /services: hero, the section intro from the home page, then one row per page (alternating sides). */
export function OfferingIndex({ kind, title, path, image, heading, text, items }: Props) {
  return (
    <>
      <PageHero label={`${items.length} ${kind}s`} title={title} image={image} crumbs={[{ label: title, href: path }]} size="md" />

      <section aria-label="Introduction" className="border-b border-border bg-surface py-20 lg:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          {heading && (
            <div className="lg:col-span-5">
              <SectionLabel index="01">{title}</SectionLabel>
              <SplitText text={heading} className="mt-6 text-h2" />
            </div>
          )}
          <Reveal className={cn(heading ? "lg:col-span-6 lg:col-start-7" : "lg:col-span-9")}>
            <p className="text-lead text-muted">{text}</p>
          </Reveal>
        </div>
      </section>

      <section aria-label={`All ${kind.toLowerCase()}s`} className="py-24 lg:py-36">
        <div className="container-x space-y-24 lg:space-y-36">
          {items.map((o, i) => (
            <article key={o.slug} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <Link href={o.href} data-cursor="view" tabIndex={-1} aria-hidden="true" className={cn("group block lg:col-span-7", i % 2 === 1 && "lg:order-2")}>
                <RevealImage
                  image={o.image}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  parallax
                  className="aspect-[16/10] rounded-xs"
                  imageClassName="transition-transform duration-[1.2s] ease-brand motion-safe:group-hover:scale-105"
                />
              </Link>
              <Reveal className={cn("lg:col-span-5", i % 2 === 1 && "lg:order-1")}>
                <p className="font-mono text-label uppercase text-accent">
                  {o.number} / {kind}
                </p>
                <h2 className="mt-5 font-display text-h2 font-extrabold uppercase">{o.title}</h2>
                <p className="mt-6 text-lead text-muted">{o.short}</p>
                <Link href={o.href} className="group mt-8 inline-flex items-center gap-3 font-display text-base font-bold uppercase tracking-[0.08em] hover:text-accent">
                  Know More
                  <span className="sr-only"> about {o.title}</span>
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-500 ease-brand group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </article>
          ))}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
