import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { Counter } from "@/components/ui/Counter";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { about, aboutCounters, pageImages } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { cn, pad2 } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description: about.intro[0],
  path: "/about",
  image: pageImages.about,
});

export default function AboutPage() {
  return (
    <>
      <PageHero label="About Us" title={about.title} image={pageImages.about} crumbs={[{ label: "About Us", href: "/about" }]} />

      {/* Introduction and counters */}
      <section aria-label="Introduction" className="py-24 lg:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <Reveal className="space-y-6 lg:col-span-7">
            {about.intro.map((p, i) => (
              <p key={p} className={cn("text-lead", i === 0 ? "text-text" : "text-muted")}>
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal as="dl" className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-xs border border-border bg-border lg:col-span-4 lg:col-start-9">
            {aboutCounters.map((c) => (
              <div key={c.label} className="flex flex-col bg-raised p-7">
                <dt className="order-2 mt-3 font-display text-xl font-bold uppercase tracking-[0.04em]">{c.label}</dt>
                <dd className="order-1 font-display text-[clamp(3rem,4.4vw,4.5rem)] font-extrabold leading-[0.85] text-accent">
                  <Counter to={c.value} suffix={c.suffix} />
                </dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Capabilities: alternating text and photo */}
      <section aria-label="Capabilities" className="border-y border-border bg-surface py-24 lg:py-36">
        <div className="container-x space-y-24 lg:space-y-36">
          {about.sections.map((s, i) => (
            <article key={s.heading} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <div className={cn("lg:col-span-6", i % 2 === 1 && "lg:order-2 lg:col-start-7")}>
                <RevealImage image={s.image} sizes="(min-width: 1024px) 50vw, 100vw" parallax className="aspect-[16/11] rounded-xs" />
              </div>
              <div className={cn("lg:col-span-5", i % 2 === 1 ? "lg:order-1" : "lg:col-start-8")}>
                <SectionLabel index={pad2(i + 1)}>About Us</SectionLabel>
                <SplitText text={s.heading} className="mt-6 text-h3" />
                <Reveal className="mt-8 space-y-5">
                  {s.paragraphs.map((p) => (
                    <p key={p} className="text-muted">
                      {p}
                    </p>
                  ))}
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Three strengths */}
      <section aria-label="Our strengths" className="py-24 lg:py-32">
        <div className="container-x">
          <Reveal as="ul" batch className="grid gap-px overflow-hidden rounded-xs border border-border bg-border lg:grid-cols-3">
            {about.features.map((f) => (
              <li key={f.title} className="bg-raised p-8 sm:p-10">
                <Icon name={f.icon} className="size-9 text-accent" />
                <h3 className="mt-10 font-display text-h4 font-extrabold uppercase">{f.title}</h3>
                <p className="mt-4 text-sm leading-6 text-muted">{f.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Commitment, mission and vision */}
      <section aria-labelledby="commitment-heading" className="border-t border-border bg-surface py-24 lg:py-36">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SplitText id="commitment-heading" text={about.commitment.heading} className="text-h2" />
            </div>
            <Reveal className="space-y-6 lg:col-span-6 lg:col-start-7">
              {about.commitment.paragraphs.map((p) => (
                <p key={p} className="text-lead text-muted">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>

          <Reveal batch className="mt-20 grid gap-4 md:grid-cols-2">
            {[
              { title: "Mission", paragraphs: about.mission },
              { title: "Vision", paragraphs: about.vision },
            ].map((block) => (
              <article key={block.title} className="relative overflow-hidden rounded-xs border border-border bg-raised p-8 sm:p-10">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-accent" />
                <h3 className="font-display text-h3 font-extrabold uppercase">{block.title}</h3>
                <div className="mt-6 space-y-4">
                  {block.paragraphs.map((p) => (
                    <p key={p} className="text-muted">
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Why choose us */}
      <section aria-labelledby="why-heading" className="py-24 lg:py-36">
        <div className="container-x">
          <SectionLabel>Jnros Logistics</SectionLabel>
          <SplitText id="why-heading" text={about.whyChooseUs.heading} className="mt-6 text-h2" />
          <Reveal as="ul" batch className="mt-16 grid gap-px overflow-hidden rounded-xs border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {about.whyChooseUs.items.map((item, i) => (
              <li key={item.title} className="flex flex-col bg-raised p-7 sm:p-8">
                <div className="flex items-start justify-between">
                  <Icon name={item.icon} className="size-8 text-accent" />
                  <span className="font-mono text-label text-muted">{pad2(i + 1)}</span>
                </div>
                <h3 className="mt-10 font-display text-h4 font-extrabold uppercase">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{item.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
