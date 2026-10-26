import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { LocationCard } from "@/components/sections/LocationCard";
import { toMapPins } from "@/components/sections/Locations";
import { LocationsMap } from "@/components/sections/LocationsMap";
import { MapReveal } from "@/components/sections/MapReveal";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { locations, pageImages } from "@/lib/data";
import { MAP_VIEWBOX } from "@/lib/map-data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Locations",
  description: "18 Jnros yards across the United States, Canada and Mexico, each with its own fleet, crews and engineers.",
  path: "/locations",
  image: pageImages.locations,
});

const countries = ["USA", "Canada", "Mexico"] as const;
const countryNames = { USA: "United States", Canada: "Canada", Mexico: "Mexico" };

export default function LocationsPage() {
  return (
    <>
      <PageHero
        label="18 locations · 3 countries"
        title="Wherever the work is."
        intro="Regional hubs anchor our network with heavy-lift engineering and large crane fleets; branches keep crews and equipment hours from your site."
        image={pageImages.locations}
        crumbs={[{ label: "Locations", href: "/locations" }]}
        size="md"
      />

      <section aria-labelledby="network-heading" className="py-24 lg:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <SectionLabel index="01">The network</SectionLabel>
            <SplitText id="network-heading" text="One fleet. Eighteen yards." className="mt-6 text-h2" />
            <Reveal as="dl" className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {countries.map((c) => (
                <div key={c} className="flex flex-col">
                  <dt className="order-2 mt-2 font-mono text-label uppercase text-muted">{countryNames[c]}</dt>
                  <dd className="order-1 font-display text-stat font-extrabold text-accent">{locations.filter((l) => l.country === c).length}</dd>
                </div>
              ))}
            </Reveal>
          </div>
          <MapReveal className="lg:col-span-8">
            <LocationsMap pins={toMapPins(locations)} viewBox={MAP_VIEWBOX} />
          </MapReveal>
        </div>
      </section>

      {countries.map((country, ci) => {
        const list = locations.filter((l) => l.country === country).sort((a, b) => Number(b.hub) - Number(a.hub) || a.city.localeCompare(b.city));
        return (
          <section key={country} aria-labelledby={`country-${country}`} className="border-t border-border py-20 lg:py-24">
            <div className="container-x">
              <div className="mb-10 flex items-end justify-between gap-6">
                <h2 id={`country-${country}`} className="font-display text-h3 font-extrabold uppercase">
                  <span className="mr-4 font-mono text-label font-normal text-accent">{`0${ci + 2}`}</span>
                  {countryNames[country]}
                </h2>
                <p className="font-mono text-label uppercase text-muted">{list.length} locations</p>
              </div>
              <Reveal as="ul" batch className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {list.map((l) => (
                  <li key={l.slug}>
                    <LocationCard location={l} />
                  </li>
                ))}
              </Reveal>
            </div>
          </section>
        );
      })}

      <CtaBanner />
    </>
  );
}
