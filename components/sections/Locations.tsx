import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { type Location, locations } from "@/lib/data";
import { projectToMap } from "@/lib/geo";
import { MAP_TRANSFORM, MAP_VIEWBOX } from "@/lib/map-data";
import { LocationsExplorer } from "./LocationsExplorer";
import type { MapPin } from "./LocationsMap";

/** Pin positions are projected on the server with the same Albers projection as the dot map. */
export function toMapPins(list: Location[]): MapPin[] {
  return list.map((l) => {
    const [x, y] = projectToMap(MAP_TRANSFORM, l.lng, l.lat);
    return { slug: l.slug, city: l.city, regionCode: l.regionCode, locality: l.locality, hub: l.hub, x, y };
  });
}

export function Locations() {
  const previews = Object.fromEntries(locations.filter((l) => l.hub).map((l) => [l.slug, l.image]));
  return (
    <section aria-labelledby="locations-heading" className="clip-angle-top relative -mt-[4.5vw] bg-surface pb-24 pt-[calc(4.5vw+6rem)] lg:pb-36 lg:pt-[calc(4.5vw+9rem)]">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="05">Locations</SectionLabel>
            <SplitText id="locations-heading" text="Wherever the work is." className="mt-6 text-h2" />
          </div>
          <p className="text-lead text-muted lg:col-span-5">
            18 yards across the US, Canada and Mexico, each with its own fleet, crews and engineers, so help is hours away, not days.
          </p>
        </div>
        <LocationsExplorer pins={toMapPins(locations)} previews={previews} viewBox={MAP_VIEWBOX} />
      </div>
    </section>
  );
}
