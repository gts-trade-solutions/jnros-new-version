import { Suspense } from "react";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Hero } from "@/components/sections/Hero";
import { KineticMarquee } from "@/components/sections/KineticMarquee";
import { OffersShowcase } from "@/components/sections/OffersShowcase";
import { RouteBand } from "@/components/sections/RouteBand";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Stats } from "@/components/sections/Stats";
import { VideoBand } from "@/components/sections/VideoBand";
import { WorksScroller } from "@/components/sections/WorksScroller";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { aboutIntro, hero, odcFilm, offers, recentWorks, routeModes, services, servicesIntro, solutions, spaces, specialised, whyChooseUs } from "@/lib/data";

/*
 * Section order follows jnroslogistics.com. Everything after the hero sits in its own Suspense
 * boundary. Nothing suspends (the HTML is complete), but React hydrates each boundary as a separate
 * unit and yields between them, so hydrating the page never becomes one long main-thread task on
 * slower phones.
 */
export default function HomePage() {
  return (
    <>
      <Hero {...hero} />
      <Suspense>
        <Stats />
      </Suspense>
      <Suspense>
        <AboutIntro data={aboutIntro} />
      </Suspense>
      <Suspense>
        <ServicesGrid
          id="solutions"
          index="02"
          label="Jnros Logistics Solution"
          heading={specialised.heading}
          text={specialised.text}
          items={solutions.slice(0, 4)}
          more={{ label: "All solutions", href: "/solutions" }}
          className="border-t border-border"
        />
      </Suspense>
      <Suspense>
        <VideoBand {...odcFilm} />
      </Suspense>
      <Suspense>
        <Offers />
      </Suspense>
      <Suspense>
        <KineticMarquee
          rows={[
            { items: solutions.map((s) => s.title), duration: 60 },
            { items: services.map((s) => s.title), outline: true, duration: 70 },
          ]}
        />
      </Suspense>
      <Suspense>
        <ServicesGrid
          id="services"
          index="04"
          label="Our Services"
          heading={servicesIntro.heading}
          text={servicesIntro.text}
          items={services}
          more={{ label: "All services", href: "/services" }}
        />
      </Suspense>
      <Suspense>
        <WhyChooseUs />
      </Suspense>
      <Suspense>
        <WorksScroller images={recentWorks} />
      </Suspense>
      <Suspense>
        <CtaBanner />
      </Suspense>
    </>
  );
}

/** "Jnros Logistics Offers": the intro above a photo showcase of the four project-logistics solutions. */
function Offers() {
  return (
    <section aria-labelledby="offers-heading" className="border-y border-border bg-surface py-24 lg:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <SectionLabel index="03">Project logistics</SectionLabel>
            <SplitText id="offers-heading" text={offers.heading} className="mt-6 text-h2" />
          </div>
          <Reveal className="grid gap-6 text-muted sm:grid-cols-2 lg:col-span-7">
            {offers.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
        </div>
        <div className="mt-16 lg:mt-20">
          <OffersShowcase items={solutions.slice(4)} total={solutions.length} />
        </div>
      </div>
    </section>
  );
}

/** "Why Choose Us" beside "About Our Spaces" and its three strengths, then the Sea, Air & Land route. */
function WhyChooseUs() {
  return (
    <section aria-labelledby="why-heading" className="border-t border-border bg-surface py-24 lg:py-36">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionLabel index="05">Jnros Logistics</SectionLabel>
          <SplitText id="why-heading" text={whyChooseUs.heading} className="mt-6 text-h2" />
          <Reveal className="mt-10 space-y-6">
            {whyChooseUs.paragraphs.map((p) => (
              <p key={p} className="text-lead text-muted">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal>
            <h3 className="font-display text-h3 font-extrabold uppercase">{spaces.heading}</h3>
          </Reveal>
          <Reveal as="ul" batch className="mt-10 grid gap-px overflow-hidden rounded-xs border border-border bg-border">
            {spaces.items.map((item) => (
              <li key={item.title} className="flex gap-6 bg-raised p-7">
                <Icon name={item.icon} className="size-8 shrink-0 text-accent" />
                <div>
                  <h4 className="font-display text-h4 font-extrabold uppercase">{item.title}</h4>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
      <div className="container-x mt-24 lg:mt-32">
        <RouteBand heading={spaces.subheading} modes={routeModes} />
      </div>
    </section>
  );
}
