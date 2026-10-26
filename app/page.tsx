import { Suspense } from "react";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Expertise } from "@/components/sections/Expertise";
import { Hero } from "@/components/sections/Hero";
import { Locations } from "@/components/sections/Locations";
import { Marquee } from "@/components/sections/Marquee";
import { News } from "@/components/sections/News";
import { Partners } from "@/components/sections/Partners";
import { ProjectsScroller } from "@/components/sections/ProjectsScroller";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Stats } from "@/components/sections/Stats";
import { expertise, featuredCaseStudies, hero, pillars } from "@/lib/data";

/*
 * Everything after the hero sits in its own Suspense boundary. Nothing suspends (the HTML is
 * complete), but React hydrates each boundary as a separate unit and yields between them, so
 * hydrating the page never becomes one long main-thread task on slower phones.
 */
export default function HomePage() {
  return (
    <>
      <Hero {...hero} />
      <Suspense>
        <Stats />
      </Suspense>
      <Suspense>
        <ServicesGrid />
      </Suspense>
      <Suspense>
        <Expertise data={expertise} pillars={pillars} />
      </Suspense>
      <Suspense>
        <ProjectsScroller projects={featuredCaseStudies} />
      </Suspense>
      <Suspense>
        <Marquee />
      </Suspense>
      <Suspense>
        <Locations />
      </Suspense>
      <Suspense>
        <Partners />
      </Suspense>
      <Suspense>
        <News />
      </Suspense>
      <Suspense>
        <CtaBanner />
      </Suspense>
    </>
  );
}
