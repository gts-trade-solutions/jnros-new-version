import type { Metadata } from "next";
import { Suspense } from "react";
import { IndustriesHero } from "@/components/industries/IndustriesHero";
import { IndustriesIntro } from "@/components/industries/IndustriesIntro";
import { IndustryRows } from "@/components/industries/IndustryRows";
import { QuoteForm } from "@/components/industries/QuoteForm";
import { SectorGrid } from "@/components/industries/SectorGrid";
import { GridLines } from "@/components/ui/GridLines";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { site } from "@/lib/data";
import { featuredIndustries, industriesPage, sectors } from "@/lib/industries";
import { industriesJsonLd, pageMetadata } from "@/lib/seo";
import { telHref } from "@/lib/utils";

const description =
  "Machinery moving, heavy lift, rigging, cranes, transport, metrology and storage for 16 industries, from machine tools and semiconductors to data centers, wind farms, mines and ports.";

export const metadata: Metadata = pageMetadata({ title: "Industries We Serve", description, path: "/industries", image: industriesPage.hero.image });

/*
 * Hero → intro → sector link grid → ten industry rows → quote form. Bands alternate forest-950 /
 * forest-900. Everything after the hero sits in its own Suspense boundary so React hydrates it in
 * separate chunks (nothing actually suspends).
 */
export default function IndustriesPage() {
  const { quote } = industriesPage;
  return (
    <>
      <JsonLd data={industriesJsonLd(featuredIndustries, description)} />

      <IndustriesHero {...industriesPage.hero} />

      <Suspense>
        <IndustriesIntro {...industriesPage.intro} />
      </Suspense>

      <Suspense>
        <SectorGrid {...industriesPage.sectors} sectors={sectors} />
      </Suspense>

      <Suspense>
        <IndustryRows industries={featuredIndustries} />
      </Suspense>

      <section id="quote" aria-labelledby="quote-heading" className="relative isolate bg-forest-950 py-24 lg:py-36">
        <GridLines className="-z-10" />
        <div className="container-x">
          <div className="mx-auto max-w-5xl">
            <SectionLabel index="03">Get a quote</SectionLabel>
            <SplitText id="quote-heading" text={quote.heading} accent={["rolling"]} className="mt-6 text-h2" />
            <p className="mt-8 max-w-2xl text-lead text-sage">
              {quote.text} Prefer to talk?{" "}
              <a href={telHref(site.phone)} className="whitespace-nowrap font-semibold text-cream underline decoration-lime decoration-1 underline-offset-4 transition-colors hover:text-lime">
                {site.phone}
              </a>
            </p>
            <div className="mt-14">
              <Suspense>
                <QuoteForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
