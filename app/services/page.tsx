import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { pageImages, processSteps, services } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { cn, pad2 } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Industrial Services",
  description:
    "Machinery moving, millwright, storage, heavy lift and rigging, metrology, crane services, specialized transportation and logistics from one accountable team.",
  path: "/services",
  image: pageImages.services,
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="Industrial services"
        title="Eight disciplines. One accountable team."
        intro="From the first route survey to the final laser-tracked setting, every service is delivered by Jnros crews, on Jnros equipment, under one plan."
        image={pageImages.services}
        crumbs={[{ label: "Services", href: "/services" }]}
      />

      {/* How we work */}
      <section aria-labelledby="process-heading" className="border-b border-border bg-surface py-24 lg:py-32">
        <div className="container-x">
          <SectionLabel index="01">How we work</SectionLabel>
          <SplitText id="process-heading" text="Survey. Engineer. Plan. Execute. Verify." className="mt-6 max-w-5xl text-h2" />
          <Reveal as="ol" className="mt-16 grid gap-px overflow-hidden rounded-xs border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <li key={step.title} className="flex flex-col bg-surface p-7">
                <span className="font-mono text-label text-accent">{pad2(i + 1)}</span>
                <h3 className="mt-10 font-display text-h4 font-extrabold uppercase">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{step.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Service rows, alternating sides */}
      <section aria-label="All services" className="py-24 lg:py-36">
        <div className="container-x space-y-24 lg:space-y-36">
          {services.map((s, i) => (
            <article key={s.slug} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <Link
                href={`/services/${s.slug}`}
                data-cursor="view"
                tabIndex={-1}
                aria-hidden="true"
                className={cn("group block lg:col-span-7", i % 2 === 1 && "lg:order-2")}
              >
                <RevealImage
                  image={s.image}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  parallax
                  className="aspect-[16/10] rounded-xs"
                  imageClassName="transition-transform duration-[1.2s] ease-brand motion-safe:group-hover:scale-105"
                />
              </Link>
              <Reveal className={cn("lg:col-span-5", i % 2 === 1 && "lg:order-1")}>
                <p className="font-mono text-label uppercase text-accent">{s.number} / Service</p>
                <h2 className="mt-5 font-display text-h2 font-extrabold uppercase">{s.title}</h2>
                <p className="mt-6 text-lead text-muted">{s.short}</p>
                <ul className="mt-8 border-t border-border">
                  {s.capabilities.slice(0, 4).map((c) => (
                    <li key={c.title} className="flex items-center gap-3 border-b border-border py-3 font-display text-lg font-semibold uppercase tracking-[0.03em]">
                      <span aria-hidden="true" className="size-1.5 bg-accent" />
                      {c.title}
                    </li>
                  ))}
                </ul>
                <Link href={`/services/${s.slug}`} className="group mt-8 inline-flex items-center gap-3 font-display text-base font-bold uppercase tracking-[0.08em] hover:text-accent">
                  Explore {s.title}
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
