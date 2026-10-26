import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyCard } from "@/components/sections/CaseStudyCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Gallery } from "@/components/sections/Gallery";
import { PageHero } from "@/components/sections/PageHero";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { caseStudies, caseStudiesForService, getIndustry, getService, services } from "@/lib/data";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { pad2 } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return pageMetadata({ title: service.title, description: service.short, path: `/services/${service.slug}`, image: service.image });
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const index = services.indexOf(service);
  const next = services[(index + 1) % services.length];
  const related = caseStudiesForService(service.slug);
  const projects = (related.length ? related : caseStudies).slice(0, 3);

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
      <PageHero
        label={`${service.number} / Service`}
        title={service.title}
        intro={service.short}
        image={service.image}
        crumbs={[
          { label: "Services", href: "/services" },
          { label: service.title, href: `/services/${service.slug}` },
        ]}
      >
        <Reveal trigger="load" delay={0.6} className="mt-10 flex flex-wrap gap-4">
          <div>
            <MagneticButton href="/get-a-quote" size="lg">
              Get a Quote
            </MagneticButton>
          </div>
        </Reveal>
      </PageHero>

      {/* Overview */}
      <section aria-labelledby="overview-heading" className="py-24 lg:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="01">Overview</SectionLabel>
            <SplitText id="overview-heading" text="Built for the move nobody else will quote." className="mt-6 text-h2" />
            <Reveal className="mt-10 space-y-6">
              {service.intro.map((p) => (
                <p key={p} className="text-lead text-text/80">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal as="dl" className="border-t border-border">
              {service.stats.map((stat) => (
                <div key={stat.label} className="border-b border-border py-7">
                  <dt className="font-mono text-label uppercase text-muted">{stat.label}</dt>
                  <dd className="mt-2 font-display text-stat font-extrabold text-accent">{stat.value}</dd>
                </div>
              ))}
            </Reveal>
            <Reveal className="mt-10">
              <p className="font-mono text-label uppercase text-muted">Industries served</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {service.industries.map((slug) => {
                  const industry = getIndustry(slug);
                  return (
                    <li key={slug}>
                      <Link
                        href={`/case-studies?industry=${slug}`}
                        className="flex items-center gap-2 rounded-xs border border-border px-3 py-2 font-display text-base font-semibold uppercase tracking-[0.04em] transition-colors hover:border-accent hover:text-accent"
                      >
                        <Icon name={industry.icon} className="size-4 text-accent" />
                        {industry.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section aria-labelledby="capabilities-heading" className="border-y border-border bg-surface py-24 lg:py-32">
        <div className="container-x">
          <SectionLabel index="02">Capabilities</SectionLabel>
          <SplitText id="capabilities-heading" text="What we bring to site." className="mt-6 text-h2" />
          <Reveal as="ol" batch className="mt-16 grid gap-px overflow-hidden rounded-xs border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {service.capabilities.map((c, i) => (
              <li key={c.title} className="group relative bg-surface p-8 transition-colors duration-500 hover:bg-surface-2">
                <span className="font-mono text-label text-accent">{pad2(i + 1)}</span>
                <h3 className="mt-12 font-display text-h4 font-extrabold uppercase">{c.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{c.text}</p>
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-brand group-hover:scale-x-100" />
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Equipment gallery */}
      <section aria-labelledby="gallery-heading" className="py-24 lg:py-36">
        <div className="container-x">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel index="03">Equipment & crews</SectionLabel>
              <SplitText id="gallery-heading" text="On site, on spec." className="mt-6 text-h2" />
            </div>
            <p className="max-w-sm text-muted">Select any photo to view it full screen. Use the arrow keys or swipe to browse.</p>
          </div>
          <Gallery images={service.gallery} />
        </div>
      </section>

      {/* Related case studies */}
      <section aria-labelledby="related-heading" className="border-t border-border py-24 lg:py-32">
        <div className="container-x">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel index="04">Related case studies</SectionLabel>
              <SplitText id="related-heading" text="Proof on the record." className="mt-6 text-h2" />
            </div>
            <Link href="/case-studies" className="group flex items-center gap-2 font-display text-base font-bold uppercase tracking-[0.08em] hover:text-accent">
              All case studies
              <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-500 ease-brand group-hover:translate-x-1" />
            </Link>
          </div>
          <Reveal as="ul" effect="clip" batch className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((study) => (
              <li key={study.slug}>
                <CaseStudyCard study={study} />
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Next service */}
      <section aria-label="Next service" className="border-t border-border">
        <Link href={`/services/${next.slug}`} className="group container-x flex items-center justify-between gap-8 py-14 lg:py-20">
          <span>
            <span className="block font-mono text-label uppercase text-muted">Next service · {next.number}</span>
            <span className="mt-3 block font-display text-h2 font-extrabold uppercase transition-colors duration-500 group-hover:text-accent">{next.title}</span>
          </span>
          <span className="grid size-16 shrink-0 place-items-center rounded-xs border border-border transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-bg lg:size-20">
            <ArrowRight aria-hidden="true" className="size-6 transition-transform duration-500 ease-brand group-hover:translate-x-1" />
          </span>
        </Link>
      </section>

      <CtaBanner />
    </>
  );
}
