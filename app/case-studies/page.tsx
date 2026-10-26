import type { Metadata } from "next";
import { Suspense } from "react";
import { CaseStudyExplorer, CaseStudyExplorerFromUrl } from "@/components/sections/CaseStudyExplorer";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { caseStudies, industries, pageImages } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Case Studies",
  description: "Coke drums, press lines, nacelles and cyclotrons: see how Jnros engineers and executes heavy moves across seven industries.",
  path: "/case-studies",
  image: pageImages.caseStudies,
});

export default function CaseStudiesPage() {
  const sorted = [...caseStudies].sort((a, b) => b.year - a.year);
  return (
    <>
      <PageHero
        label="Case studies"
        title="Proof, by the pound."
        intro="Every project here was planned in-house, executed by our own crews and delivered without a recordable incident."
        image={pageImages.caseStudies}
        crumbs={[{ label: "Case Studies", href: "/case-studies" }]}
        size="md"
      />
      <section aria-label="Projects" className="py-20 lg:py-28">
        <div className="container-x">
          {/* The static HTML carries the full, unfiltered grid; the URL filter applies on the client. */}
          <Suspense fallback={<CaseStudyExplorer studies={sorted} industries={industries} />}>
            <CaseStudyExplorerFromUrl studies={sorted} industries={industries} />
          </Suspense>
        </div>
      </section>
      <CtaBanner title={"Your project\ncould be next."} accent={["next."]} />
    </>
  );
}
