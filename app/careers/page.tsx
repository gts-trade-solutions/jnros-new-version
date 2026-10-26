import { ArrowUpRight, MapPin, Plus } from "lucide-react";
import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { careers, pageImages, site } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description: "Crane operators, millwrights, rigging engineers and heavy-haul drivers: build a career moving the heaviest equipment in North America.",
  path: "/careers",
  image: pageImages.careers,
});

const applyHref = (title: string, location: string) =>
  `mailto:${site.careersEmail}?subject=${encodeURIComponent(`Application: ${title} (${location})`)}`;

export default function CareersPage() {
  return (
    <>
      <PageHero
        label="Careers"
        title="Build something heavy."
        intro="Join 3,400 operators, riggers, millwrights, drivers and engineers who do work most people only watch."
        image={pageImages.careers}
        crumbs={[{ label: "Careers", href: "/careers" }]}
      >
        <Reveal trigger="load" delay={0.6} className="mt-10">
          <div>
            <Button href="#positions" size="lg">
              See open positions
            </Button>
          </div>
        </Reveal>
      </PageHero>

      <section aria-labelledby="why-heading" className="py-24 lg:py-36">
        <div className="container-x">
          <SectionLabel index="01">Why Jnros</SectionLabel>
          <SplitText id="why-heading" text="Good work. Paid properly. Done safely." className="mt-6 max-w-5xl text-h2" />
          <Reveal as="ul" batch className="mt-16 grid gap-px overflow-hidden rounded-xs border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {careers.benefits.map((b) => (
              <li key={b.title} className="bg-bg p-8">
                <Icon name={b.icon} className="size-8 text-accent" />
                <h3 className="mt-10 font-display text-h4 font-extrabold uppercase">{b.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{b.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="positions" aria-labelledby="positions-heading" className="border-t border-border bg-surface py-24 lg:py-32">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel index="02">Open positions</SectionLabel>
              <SplitText id="positions-heading" text="Now hiring." className="mt-6 text-h2" />
            </div>
            <p className="font-mono text-label uppercase text-muted">{careers.jobs.length} roles across North America</p>
          </div>
          <Reveal as="ul" batch className="mt-14 border-t border-border">
            {careers.jobs.map((job) => (
              <li key={job.title} className="border-b border-border">
                {/* Native disclosure: keyboard and screen-reader friendly, works without JavaScript. */}
                <details className="group">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-8 gap-y-2 py-6 [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0 flex-1 font-display text-h4 font-extrabold uppercase transition-colors group-hover:text-accent group-open:text-accent">{job.title}</span>
                    <span className="flex items-center gap-2 font-mono text-label uppercase text-muted">
                      <MapPin aria-hidden="true" className="size-3.5 text-accent" />
                      {job.location}
                    </span>
                    <span className="hidden w-40 font-mono text-label uppercase text-muted md:block">{job.department}</span>
                    <span className="w-28 font-mono text-label uppercase text-muted">{job.type}</span>
                    <span className="grid size-10 place-items-center rounded-xs border border-border transition duration-500 ease-brand group-open:rotate-45 group-open:border-accent group-open:text-accent">
                      <Plus aria-hidden="true" className="size-4" />
                    </span>
                  </summary>
                  <div className="flex flex-wrap items-end justify-between gap-6 pb-8">
                    <p className="max-w-2xl text-text/80">{job.summary}</p>
                    <a
                      href={applyHref(job.title, job.location)}
                      className="flex items-center gap-2 font-display text-base font-bold uppercase tracking-[0.08em] text-accent hover:text-accent-hover"
                    >
                      Apply by email
                      <ArrowUpRight aria-hidden="true" className="size-4" />
                    </a>
                  </div>
                </details>
              </li>
            ))}
          </Reveal>
          <p className="mt-10 text-muted">
            Don&apos;t see your role? Send your résumé to{" "}
            <a href={`mailto:${site.careersEmail}`} className="text-text underline underline-offset-4 hover:text-accent">
              {site.careersEmail}
            </a>
            .
          </p>
        </div>
      </section>

      <section aria-labelledby="apprentice-heading" className="py-24 lg:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="grid grid-cols-5 gap-4 lg:col-span-6">
            <RevealImage image={pageImages.careersCrew[0]} sizes="(min-width: 1024px) 25vw, 60vw" className="col-span-3 aspect-[3/4] rounded-xs" />
            <RevealImage image={pageImages.careersCrew[1]} sizes="(min-width: 1024px) 20vw, 40vw" parallax className="col-span-2 mt-24 aspect-[3/4] rounded-xs" />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <SectionLabel index="03">Apprenticeship</SectionLabel>
            <SplitText id="apprentice-heading" text="Earn while you learn." className="mt-6 text-h2" />
            <Reveal className="mt-8 space-y-6">
              <p className="text-lead text-text/80">
                Our four-year millwright program pays from day one, rotates you through every part of the business and ends with a nationally recognized
                certification and a job on a Jnros crew.
              </p>
              <p className="text-muted">No experience required. Mechanical aptitude, a good attitude and a valid driver&apos;s license are.</p>
              <div>
                <Button href={applyHref("Millwright Apprentice", "Multiple locations")} variant="outline">
                  Apply for the 2027 intake
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBanner
        title={"Ready to join\nthe crew?"}
        accent={["crew?"]}
        label="Careers"
        image={pageImages.careers}
        cta={{ label: "Email your résumé", href: `mailto:${site.careersEmail}` }}
      />
    </>
  );
}
