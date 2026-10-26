import { ArrowUpRight, Clock, MapPin, Phone, Warehouse } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyCard } from "@/components/sections/CaseStudyCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { LocationCard } from "@/components/sections/LocationCard";
import { toMapPins } from "@/components/sections/Locations";
import { LocationsMap } from "@/components/sections/LocationsMap";
import { MapReveal } from "@/components/sections/MapReveal";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { caseStudiesNear, getLocation, getService, locations, locationsNear, site } from "@/lib/data";
import { MAP_VIEWBOX } from "@/lib/map-data";
import { locationJsonLd, pageMetadata } from "@/lib/seo";
import { pad2, telHref } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => locations.map((l) => ({ slug: l.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const location = getLocation((await params).slug);
  if (!location) return {};
  return pageMetadata({
    title: `${location.city}, ${location.regionCode}`,
    description: `${site.name} ${location.city}: ${location.description}`,
    path: `/locations/${location.slug}`,
    image: location.image,
  });
}

export default async function LocationPage({ params }: Props) {
  const location = getLocation((await params).slug);
  if (!location) notFound();

  const kind = location.hq ? "Headquarters" : location.hub ? "Regional hub" : "Branch";
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.street}, ${location.locality} ${location.postalCode}`)}`;
  const details = [
    { icon: MapPin, label: "Address", value: `${location.street}, ${location.locality} ${location.postalCode}` },
    { icon: Phone, label: "Phone", value: location.phone, href: telHref(location.phone) },
    { icon: Clock, label: "Hours", value: site.hours },
    { icon: Warehouse, label: "Facility", value: location.yard },
  ];

  return (
    <>
      <JsonLd data={locationJsonLd(location)} />
      <PageHero
        label={`${kind} · ${location.region}`}
        title={location.city}
        intro={location.description}
        image={location.image}
        crumbs={[
          { label: "Locations", href: "/locations" },
          { label: location.city, href: `/locations/${location.slug}` },
        ]}
        size="md"
      />

      <section aria-labelledby="contact-heading" className="py-24 lg:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionLabel index="01">Visit & contact</SectionLabel>
            <SplitText id="contact-heading" text={`Jnros ${location.city}`} className="mt-6 text-h2" />
            <Reveal as="dl" className="mt-10 border-t border-border">
              {details.map(({ icon: IconComponent, label, value, href }) => (
                <div key={label} className="border-b border-border py-5">
                  <dt className="flex items-center gap-3 font-mono text-label uppercase text-muted">
                    <IconComponent aria-hidden="true" className="size-4 shrink-0 text-accent" strokeWidth={1.5} />
                    {label}
                  </dt>
                  <dd className="mt-1.5 pl-7 text-lg">
                    {href ? (
                      <a href={href} className="hover:text-accent">
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </Reveal>
            <Reveal className="mt-10 flex flex-wrap items-center gap-6">
              <div>
                <MagneticButton href="/get-a-quote" size="lg">
                  Get a Quote
                </MagneticButton>
              </div>
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 font-display text-base font-bold uppercase tracking-[0.08em] hover:text-accent">
                Get directions
                <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-500 group-hover:rotate-45" />
                <span className="sr-only">(opens Google Maps in a new tab)</span>
              </a>
            </Reveal>
          </div>
          <MapReveal className="lg:col-span-7">
            <LocationsMap
              pins={toMapPins(locations)}
              viewBox={MAP_VIEWBOX}
              active={location.slug}
              label={`Map showing Jnros ${location.city} among Jnros' North American locations`}
            />
          </MapReveal>
        </div>
      </section>

      <section aria-labelledby="services-here-heading" className="border-y border-border bg-surface py-24 lg:py-32">
        <div className="container-x">
          <SectionLabel index="02">Services from this yard</SectionLabel>
          <SplitText id="services-here-heading" text="What we run from here." className="mt-6 text-h2" />
          {/* Per-cell borders (not a gap-px background) because the number of services varies by yard. */}
          <Reveal as="ul" batch className="mt-14 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
            {location.services.map((slug, i) => {
              const service = getService(slug);
              if (!service) return null;
              return (
                <li key={slug} className="border-b border-r border-border bg-surface">
                  <Link href={`/services/${slug}`} className="group flex h-full flex-col justify-between gap-10 p-7 transition-colors duration-500 hover:bg-surface-2">
                    <span className="flex items-center justify-between font-mono text-label text-accent">
                      {pad2(i + 1)}
                      <ArrowUpRight aria-hidden="true" className="size-4 text-muted transition duration-500 group-hover:rotate-45 group-hover:text-accent" />
                    </span>
                    <span className="font-display text-h4 font-extrabold uppercase transition-colors group-hover:text-accent">{service.title}</span>
                  </Link>
                </li>
              );
            })}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="projects-near-heading" className="py-24 lg:py-32">
        <div className="container-x">
          <SectionLabel index="03">Projects in the region</SectionLabel>
          <SplitText id="projects-near-heading" text="Close to home." className="mb-14 mt-6 text-h2" />
          <Reveal as="ul" effect="clip" batch className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudiesNear(location).map((c) => (
              <li key={c.slug}>
                <CaseStudyCard study={c} />
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="nearby-heading" className="border-t border-border py-24 lg:py-32">
        <div className="container-x">
          <SectionLabel index="04">Nearby locations</SectionLabel>
          <SplitText id="nearby-heading" text="Backup, close by." className="mb-14 mt-6 text-h2" />
          <Reveal as="ul" batch className="grid gap-4 md:grid-cols-3">
            {locationsNear(location).map((l) => (
              <li key={l.slug}>
                <LocationCard location={l} />
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
