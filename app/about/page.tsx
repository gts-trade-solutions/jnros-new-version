import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { Partners } from "@/components/sections/Partners";
import { Stats } from "@/components/sections/Stats";
import { Timeline } from "@/components/sections/Timeline";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { pageImages, pillars, timeline } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "Founded in Houston in 1984, Jnros Logistics has grown into an 18-location group moving the heaviest equipment in North America.",
  path: "/about",
  image: pageImages.about,
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About Jnros · Since 1984"
        title="Built by people who lift."
        intro="Four decades, 3,400 field employees and one standard: plan it properly, do it safely, hand it back exactly where it belongs."
        image={pageImages.about}
        crumbs={[{ label: "About", href: "/about" }]}
      />

      <section aria-labelledby="story-heading" className="py-24 lg:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionLabel index="01">Our story</SectionLabel>
            <SplitText id="story-heading" text="Two trucks, one crane and a promise." className="mt-6 text-h2" />
            <Reveal className="mt-10 space-y-6 text-lead text-text/80">
              <p>
                Jnros started on the Houston Ship Channel in 1984 with two tractors, a lowboy and a 40-ton crane. The promise was simple: if we quote it, we move it,
                and nobody gets hurt doing it.
              </p>
              <p>
                That promise built a reputation with refiners, then manufacturers, then the aerospace, medical and technology companies that now trust us with their
                most valuable equipment. Today Jnros is a group of five companies, 18 locations and more than 1,200 fleet units across three countries.
              </p>
              <p>We are still family-led, still engineering-first and still answering the phone at 3 a.m.</p>
            </Reveal>
          </div>
          <div className="relative grid grid-cols-5 gap-4 lg:col-span-6">
            <RevealImage image={pageImages.aboutStory[0]} sizes="(min-width: 1024px) 25vw, 40vw" className="col-span-3 aspect-[3/4] rounded-xs" />
            <RevealImage image={pageImages.aboutStory[1]} sizes="(min-width: 1024px) 20vw, 40vw" parallax className="col-span-2 mt-24 aspect-[3/4] rounded-xs" />
          </div>
        </div>
      </section>

      <Stats />

      <section aria-labelledby="values-heading" className="py-24 lg:py-36">
        <div className="container-x">
          <SectionLabel index="02">Our values</SectionLabel>
          <SplitText id="values-heading" text="What we won't compromise." className="mt-6 text-h2" />
          <Reveal as="ul" className="mt-16 grid gap-px overflow-hidden rounded-xs border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <li key={p.title} className="flex flex-col bg-bg p-8">
                <span className="flex items-center justify-between">
                  <Icon name={p.icon} className="size-9 text-accent" />
                  <span className="font-mono text-label text-muted">0{i + 1}</span>
                </span>
                <h3 className="mt-16 font-display text-h3 font-extrabold uppercase">{p.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{p.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="milestones-heading" className="border-t border-border bg-surface py-24 lg:py-36">
        <div className="container-x">
          <SectionLabel index="03">Milestones</SectionLabel>
          <SplitText id="milestones-heading" text="Four decades of heavy." className="mb-20 mt-6 text-h2" />
          <Timeline items={timeline} />
        </div>
      </section>

      <Partners />
      <CtaBanner title={"Work with\nthe heavy hitters."} accent={["hitters."]} />
    </>
  );
}
