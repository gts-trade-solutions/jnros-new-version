import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyCard } from "@/components/sections/CaseStudyCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Gallery } from "@/components/sections/Gallery";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { caseStudies, getCaseStudy, getIndustry, getService } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => caseStudies.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  return pageMetadata({ title: study.title, description: study.summary, path: `/case-studies/${study.slug}`, image: study.image });
}

export default async function CaseStudyPage({ params }: Props) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();

  const industry = getIndustry(study.industry);
  const index = caseStudies.indexOf(study);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const related = [
    ...caseStudies.filter((c) => c.slug !== study.slug && c.industry === study.industry),
    ...caseStudies.filter((c) => c.slug !== study.slug && c.industry !== study.industry),
  ].slice(0, 3);

  const facts = [
    { label: "Load weight", value: study.weight },
    { label: "Location", value: study.location },
    { label: "Duration", value: study.duration },
    { label: "Industry", value: industry.name },
  ];

  return (
    <>
      <PageHero
        label={`Case study · ${study.year}`}
        title={study.title}
        intro={study.summary}
        image={study.image}
        crumbs={[
          { label: "Case Studies", href: "/case-studies" },
          { label: study.title, href: `/case-studies/${study.slug}` },
        ]}
      />

      {/* Fact strip */}
      <section aria-label="Project facts" className="border-y border-border bg-surface">
        <Reveal as="dl" className="container-x grid grid-cols-2 lg:grid-cols-4">
          {facts.map((f, i) => (
            <div key={f.label} className={`py-8 lg:py-10 ${i % 2 === 1 ? "border-l border-border pl-6" : ""} ${i >= 2 ? "border-t border-border lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:pl-6" : ""}`}>
              <dt className="font-mono text-label uppercase text-muted">{f.label}</dt>
              <dd className="mt-2 font-display text-[clamp(1.5rem,2.6vw,2.5rem)] font-extrabold uppercase leading-none">{f.value}</dd>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Story */}
      <section aria-label="Project story" className="py-24 lg:py-36">
        <div className="container-x space-y-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionLabel index="01">The challenge</SectionLabel>
              <p className="mt-6 font-mono text-label uppercase text-muted">Client · {study.client}</p>
            </div>
            <Reveal className="lg:col-span-8">
              <p className="text-[clamp(1.375rem,2.2vw,2rem)] font-medium leading-[1.35]">{study.challenge}</p>
            </Reveal>
          </div>

          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionLabel index="02">Our solution</SectionLabel>
              <ul className="mt-6 flex flex-wrap gap-2">
                {study.services.map((slug) => {
                  const service = getService(slug);
                  return service ? (
                    <li key={slug}>
                      <Link
                        href={`/services/${slug}`}
                        className="block rounded-xs border border-border px-3 py-1.5 font-display text-sm font-semibold uppercase tracking-[0.04em] transition-colors hover:border-accent hover:text-accent"
                      >
                        {service.title}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
            <Reveal className="space-y-6 lg:col-span-8">
              {study.solution.map((p) => (
                <p key={p} className="text-lead text-text/80">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>

          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionLabel index="03">The result</SectionLabel>
            </div>
            <div className="lg:col-span-8">
              <Reveal as="ul" className="border-t border-border">
                {study.results.map((r) => (
                  <li key={r} className="flex items-start gap-5 border-b border-border py-6">
                    <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-xs bg-accent text-bg">
                      <Check aria-hidden="true" className="size-4" />
                    </span>
                    <span className="font-display text-h4 font-bold uppercase">{r}</span>
                  </li>
                ))}
              </Reveal>
              <Reveal as="dl" className="mt-12 grid grid-cols-3 gap-6">
                {study.stats.map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <dt className="order-2 mt-2 font-mono text-label uppercase text-muted">{s.label}</dt>
                    <dd className="order-1 font-display text-[clamp(1.75rem,3.4vw,3.5rem)] font-extrabold leading-none text-accent">{s.value}</dd>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section aria-labelledby="site-heading" className="border-t border-border py-24 lg:py-32">
        <div className="container-x">
          <SectionLabel index="04">On site</SectionLabel>
          <SplitText id="site-heading" text="From the job site." className="mb-14 mt-6 text-h2" />
          <Gallery images={[study.image, ...study.gallery]} />
        </div>
      </section>

      {/* Related */}
      <section aria-labelledby="more-heading" className="border-t border-border bg-surface py-24 lg:py-32">
        <div className="container-x">
          <SectionLabel index="05">More projects</SectionLabel>
          <SplitText id="more-heading" text={`More from ${industry.name}.`} className="mb-14 mt-6 text-h2" />
          <Reveal as="ul" effect="clip" batch className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <li key={c.slug}>
                <CaseStudyCard study={c} />
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-label="Next project" className="border-t border-border">
        <Link href={`/case-studies/${next.slug}`} className="group container-x flex items-center justify-between gap-8 py-14 lg:py-20">
          <span>
            <span className="block font-mono text-label uppercase text-muted">Next project · {next.weight}</span>
            <span className="mt-3 block font-display text-h2 font-extrabold uppercase transition-colors duration-500 group-hover:text-accent">{next.title}</span>
          </span>
          <span className="grid size-16 shrink-0 place-items-center rounded-xs border border-border transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-bg lg:size-20">
            <ArrowRight aria-hidden="true" className="size-6 transition-transform duration-500 ease-brand group-hover:translate-x-1" />
          </span>
        </Link>
      </section>

      <CtaBanner title={"Have a move\nlike this?"} accent={["this?"]} />
    </>
  );
}
