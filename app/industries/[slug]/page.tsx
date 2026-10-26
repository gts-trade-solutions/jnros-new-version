import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Duotone } from "@/components/industries/Duotone";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { GridLines } from "@/components/ui/GridLines";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { getCaseStudy, getIndustry, getService, type Service } from "@/lib/data";
import { featuredIndustries, getFeaturedIndustry, serviceForTag } from "@/lib/industries";
import { industryJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => featuredIndustries.map((i) => ({ slug: i.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const industry = getFeaturedIndustry((await params).slug);
  if (!industry) return {};
  return pageMetadata({
    title: `${industry.name} | Industries`,
    description: `${industry.subtitle}. ${industry.overview[0]}`.slice(0, 300),
    path: `/industries/${industry.slug}`,
    image: industry.heroImage,
  });
}

/**
 * Industry detail template: hero, overview (what we handle + numbers), the services that do the
 * work, a related case study, neighbouring industries and a closing CTA.
 */
export default async function IndustryPage({ params }: Props) {
  const industry = getFeaturedIndustry((await params).slug);
  if (!industry) notFound();

  const index = featuredIndustries.indexOf(industry);
  const prev = featuredIndustries[(index - 1 + featuredIndustries.length) % featuredIndustries.length];
  const next = featuredIndustries[(index + 1) % featuredIndustries.length];
  // Tags map onto service pages; "Rigging" and "Heavy lift" share one, so de-duplicate.
  const services = [...new Set(industry.tags.map((t) => serviceForTag[t]))].map(getService).filter((s): s is Service => !!s);
  const study = getCaseStudy(industry.caseStudy);

  return (
    <>
      <JsonLd data={industryJsonLd(industry)} />
      <PageHero
        label={`${industry.number} / Industry`}
        title={industry.name}
        intro={industry.subtitle}
        image={industry.heroImage}
        crumbs={[
          { label: "Industries", href: "/industries" },
          { label: industry.name, href: `/industries/${industry.slug}` },
        ]}
      >
        <Reveal trigger="load" delay={0.6} as="ul" className="mt-10 flex flex-wrap gap-2">
          {industry.tags.map((tag) => (
            <li key={tag} className="rounded-xs border border-line bg-forest-950/60 px-3 py-1.5 font-mono text-label uppercase text-mint">
              {tag}
            </li>
          ))}
        </Reveal>
      </PageHero>

      {/* Overview */}
      <section aria-labelledby="overview-heading" className="relative isolate bg-forest-900 py-24 lg:py-32">
        <GridLines className="-z-10" />
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="01">Overview</SectionLabel>
            <SplitText id="overview-heading" text="Built around your equipment." accent={["equipment."]} className="mt-6 text-h2" />
            <Reveal className="mt-10 space-y-6">
              {industry.overview.map((p) => (
                <p key={p} className="text-lead text-cream/85">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="font-mono text-label uppercase text-sage">What we handle</p>
            <Reveal as="ul" className="mt-5 border-t border-line">
              {industry.scope.map((item) => (
                <li key={item} className="flex items-start gap-4 border-b border-line py-4">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-xs bg-lime text-forest-950">
                    <Check aria-hidden="true" className="size-4" strokeWidth={3} />
                  </span>
                  <span className="font-display text-xl font-bold uppercase leading-tight">{item}</span>
                </li>
              ))}
            </Reveal>
            <Reveal as="dl" className="mt-10 grid gap-3">
              {industry.stats.map((s) => (
                <div key={s.label} className="flex flex-col rounded-sm border border-line bg-forest-800 p-5">
                  <dt className="order-2 mt-2 font-mono text-label uppercase text-sage">{s.label}</dt>
                  <dd className="order-1 font-display text-4xl font-extrabold leading-none text-lime">{s.value}</dd>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section aria-labelledby="services-heading" className="relative isolate bg-forest-950 py-24 lg:py-32">
        <GridLines className="-z-10" />
        <div className="container-x">
          <SectionLabel index="02">Services</SectionLabel>
          <SplitText id="services-heading" text="The teams on your job." className="mb-14 mt-6 text-h2" />
          <Reveal as="ul" effect="clip" batch className="grid gap-4 md:grid-cols-3">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} data-cursor="view" className="group/duo block overflow-hidden rounded-sm border border-line bg-forest-800 transition-colors hover:border-lime/50">
                  <div data-reveal-zoom className="relative aspect-[4/3] overflow-hidden">
                    <Duotone image={service.image} sizes="(min-width: 768px) 33vw, 100vw" imageClassName="transition-transform duration-[1.2s] ease-brand motion-safe:group-hover/duo:scale-105" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between font-mono text-label text-lime">
                      {service.number}
                      <ArrowUpRight aria-hidden="true" className="size-4 text-sage transition-transform duration-500 ease-brand group-hover/duo:rotate-45 group-hover/duo:text-lime" />
                    </div>
                    <h3 className="mt-6 font-display text-h3 font-extrabold uppercase">{service.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-sage">{service.short}</p>
                  </div>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Case study teaser */}
      {study && (
        <section aria-labelledby="study-heading" className="relative isolate bg-forest-900 py-24 lg:py-32">
          <GridLines className="-z-10" />
          <div className="container-x">
            <SectionLabel index="03">Case study</SectionLabel>
            <Link
              href={`/case-studies/${study.slug}`}
              data-cursor="view"
              className="group/duo mt-10 grid overflow-hidden rounded-sm border border-line bg-forest-800 transition-colors hover:border-lime/50 lg:grid-cols-[55fr_45fr]"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[28rem]">
                <Duotone image={study.image} sizes="(min-width: 1024px) 55vw, 100vw" imageClassName="transition-transform duration-[1.2s] ease-brand motion-safe:group-hover/duo:scale-105" />
              </div>
              <div className="flex flex-col justify-between gap-10 p-7 sm:p-10 lg:p-12">
                <div>
                  <p className="font-mono text-label uppercase text-sage">
                    {getIndustry(study.industry).name} · {study.location}
                  </p>
                  <h2 id="study-heading" className="mt-5 font-display text-h2 font-extrabold uppercase">
                    {study.title}
                  </h2>
                  <p className="mt-5 text-lead text-cream/85">{study.summary}</p>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
                  <div>
                    <p className="font-display text-4xl font-extrabold leading-none text-lime">{study.weight}</p>
                    <p className="mt-2 font-mono text-label uppercase text-sage">Load weight</p>
                  </div>
                  <span className="flex items-center gap-2 font-display font-bold uppercase tracking-[0.08em] group-hover/duo:text-lime">
                    Read the case study
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-500 ease-brand group-hover/duo:translate-x-2" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Neighbouring industries */}
      <nav aria-label="More industries" className="grid border-t border-line bg-forest-950 sm:grid-cols-2">
        <Link href={`/industries/${prev.slug}`} className="group container-x flex items-center gap-6 py-12 sm:border-r sm:border-line lg:py-16">
          <ArrowLeft aria-hidden="true" className="size-6 shrink-0 text-lime transition-transform duration-500 ease-brand group-hover:-translate-x-2" />
          <span>
            <span className="block font-mono text-label uppercase text-sage">Previous · {prev.number}</span>
            <span className="mt-2 block font-display text-h3 font-extrabold uppercase transition-colors group-hover:text-lime">{prev.name}</span>
          </span>
        </Link>
        <Link href={`/industries/${next.slug}`} className="group container-x flex items-center justify-end gap-6 border-t border-line py-12 text-right sm:border-t-0 lg:py-16">
          <span>
            <span className="block font-mono text-label uppercase text-sage">Next · {next.number}</span>
            <span className="mt-2 block font-display text-h3 font-extrabold uppercase transition-colors group-hover:text-lime">{next.name}</span>
          </span>
          <ArrowRight aria-hidden="true" className="size-6 shrink-0 text-lime transition-transform duration-500 ease-brand group-hover:translate-x-2" />
        </Link>
      </nav>

      <CtaBanner
        title={"Ready to move\nyour next project?"}
        accent={["project?"]}
        label={industry.name}
        image={industry.image}
        cta={{ label: "Request a quote", href: "/industries#quote" }}
      />
    </>
  );
}
