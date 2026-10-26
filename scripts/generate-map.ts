/**
 * Generates the dot-matrix North America for the Locations section: public/map/north-america.svg
 * (the artwork) and lib/map-data.ts (its viewBox and the projection transform for placing pins).
 *
 *   npm run generate:map
 *
 * Land comes from Natural Earth (via world-atlas). Dots sit on an offset (hex) grid in SVG space;
 * each grid point is un-projected with the same Albers projection the site uses at runtime
 * (lib/geo.ts) and kept if it falls on land. The output is a single SVG path of zero-length
 * round-capped segments, so thousands of dots cost one DOM node.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { geoBounds, geoContains } from "d3-geo";
import { feature, mesh } from "topojson-client";
import { albers, albersInvert } from "../lib/geo.ts";

const WIDTH = 1000;
const PAD = 12;
const SPACING = 10; // distance between dot centres, in viewBox units
const REGION = { west: -166, east: -51, south: 13, north: 72 };

const atlas = (name: string) => JSON.parse(readFileSync(new URL(`../node_modules/world-atlas/${name}`, import.meta.url), "utf8"));

const landTopo = atlas("land-50m.json");
const land = feature(landTopo, landTopo.objects.land) as unknown as GeoJSON.FeatureCollection | GeoJSON.Feature;

// Split the world MultiPolygon into polygons and keep the ones that touch the region,
// so each point-in-polygon test only walks nearby coastlines.
type Poly = { feature: GeoJSON.Feature<GeoJSON.Polygon>; w: number; s: number; e: number; n: number };
const polygons: Poly[] = [];
const landFeatures = "features" in land ? land.features : [land];
for (const f of landFeatures) {
  const g = f.geometry;
  const rings = g.type === "MultiPolygon" ? g.coordinates : g.type === "Polygon" ? [g.coordinates] : [];
  for (const coordinates of rings) {
    const feature: GeoJSON.Feature<GeoJSON.Polygon> = { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates } };
    const [[w, s], [e, n]] = geoBounds(feature);
    if (e < REGION.west || w > REGION.east || n < REGION.south || s > REGION.north) continue;
    polygons.push({ feature, w, s, e, n });
  }
}
// Cheap bounding-box test first; geoContains walks every vertex of the coastline.
const onLand = (lng: number, lat: number) =>
  polygons.some((p) => lng >= p.w && lng <= p.e && lat >= p.s && lat <= p.n && geoContains(p.feature, [lng, lat]));
// Hawaii sits far outside the continental frame; leaving it in would shrink the continent.
const inRegion = (lng: number, lat: number) =>
  lng >= REGION.west && lng <= REGION.east && lat >= REGION.south && lat <= REGION.north && !(lng < -140 && lat < 45);

// Fit: projected bounds of every land sample inside the region.
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
for (let lat = REGION.south; lat <= REGION.north; lat += 0.5) {
  for (let lng = REGION.west; lng <= REGION.east; lng += 0.5) {
    if (!inRegion(lng, lat) || !onLand(lng, lat)) continue;
    const [x, y] = albers(lng, lat);
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
}
const k = (WIDTH - PAD * 2) / (maxX - minX);
const HEIGHT = Math.ceil((maxY - minY) * k + PAD * 2);
const tx = PAD - minX * k;
const ty = PAD - minY * k;
const round = (v: number) => Math.round(v * 10) / 10;

// Dots on an offset grid. Relative moves ("m dx dy") keep the path roughly a third smaller.
const rowH = SPACING * Math.sqrt(3) / 2;
const dots: string[] = [];
let last: [number, number] | null = null;
for (let row = 0, y = PAD; y <= HEIGHT - PAD; row++, y += rowH) {
  for (let x = PAD + (row % 2 ? SPACING / 2 : 0); x <= WIDTH - PAD; x += SPACING) {
    const [lng, lat] = albersInvert((x - tx) / k, (y - ty) / k);
    if (!inRegion(lng, lat) || !onLand(lng, lat)) continue;
    const [px, py] = [round(x), round(y)];
    dots.push(last ? `m${round(px - last[0])} ${round(py - last[1])}h0` : `M${px} ${py}h0`);
    last = [px, py];
  }
}

// Country borders (US/Canada/Mexico and neighbours), clipped to the view.
const countriesTopo = atlas("countries-50m.json");
const borders = mesh(countriesTopo, countriesTopo.objects.countries, (a, b) => a !== b) as GeoJSON.MultiLineString;
const borderSegments: string[] = [];
for (const line of borders.coordinates) {
  let current: string[] = [];
  const flush = () => {
    if (current.length > 1) borderSegments.push("M" + current.join("L"));
    current = [];
  };
  for (const [lng, lat] of line) {
    if (!inRegion(lng, lat)) { flush(); continue; }
    const [x, y] = albers(lng, lat);
    current.push(`${round(tx + k * x)} ${round(ty + k * y)}`);
  }
  flush();
}

// The artwork is a static file: cached by the browser, loaded lazily below the fold, and kept out
// of the page HTML and React payload. Colours match the design tokens (--muted, --accent).
const MAP_FILE = "/map/north-america.svg";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}"><path d="${borderSegments.join("")}" fill="none" stroke="#7AC143" stroke-opacity=".25" stroke-width="1.25"/><path d="${dots.join("")}" fill="none" stroke="#9AA3A8" stroke-opacity=".6" stroke-width="3.6" stroke-linecap="round"/></svg>\n`;
mkdirSync(new URL("../public/map/", import.meta.url), { recursive: true });
writeFileSync(new URL(`../public${MAP_FILE}`, import.meta.url), svg);

const out = `// Generated by scripts/generate-map.ts (Natural Earth land via world-atlas, Albers projection
// from lib/geo.ts). Do not edit by hand: change the script and run \`npm run generate:map\`.
import type { MapTransform } from "@/lib/geo";

/** Dot-matrix artwork: ${dots.length} land dots plus country borders. */
export const MAP_SRC = "${MAP_FILE}";

export const MAP_VIEWBOX = { width: ${WIDTH}, height: ${HEIGHT} } as const;

/** Albers unit coordinates -> viewBox coordinates. Use with projectToMap() from lib/geo. */
export const MAP_TRANSFORM: MapTransform = { k: ${k.toFixed(4)}, tx: ${tx.toFixed(3)}, ty: ${ty.toFixed(3)} };
`;

writeFileSync(new URL("../lib/map-data.ts", import.meta.url), out);
console.log(`public${MAP_FILE}: ${dots.length} dots, viewBox ${WIDTH}x${HEIGHT}, ${(svg.length / 1024).toFixed(1)} KB`);
