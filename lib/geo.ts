/**
 * Albers equal-area conic projection tuned for North America (the projection USGS and most
 * atlases use for the continent). Shared by the build-time map generator (scripts/generate-map.ts)
 * and the runtime pin placement, so dots and pins always line up.
 *
 * Kept dependency-free on purpose: the generator imports this file directly with Node's
 * type stripping, so it must not import anything else.
 */

const RAD = Math.PI / 180;

export const ALBERS = {
  /** Standard parallels. */
  parallels: [20, 60] as const,
  /** Central meridian. */
  centralMeridian: -100,
  /** Latitude of origin. */
  originLatitude: 45,
};

const sin1 = Math.sin(ALBERS.parallels[0] * RAD);
const n = (sin1 + Math.sin(ALBERS.parallels[1] * RAD)) / 2;
const c = 1 + sin1 * (2 * n - sin1);
const rho0 = Math.sqrt(c - 2 * n * Math.sin(ALBERS.originLatitude * RAD)) / n;

/** Projects a lng/lat pair to unit-sphere Albers coordinates (y grows downward, like SVG). */
export function albers(lng: number, lat: number): [number, number] {
  const rho = Math.sqrt(c - 2 * n * Math.sin(lat * RAD)) / n;
  const theta = n * (lng - ALBERS.centralMeridian) * RAD;
  return [rho * Math.sin(theta), -(rho0 - rho * Math.cos(theta))];
}

/** Inverse of {@link albers}: unit-sphere coordinates back to [lng, lat]. */
export function albersInvert(x: number, y: number): [number, number] {
  const ry = rho0 + y; // y was flipped in albers()
  const rho = Math.sign(n) * Math.sqrt(x * x + ry * ry);
  const theta = Math.atan2(x, ry);
  const lng = ALBERS.centralMeridian + theta / n / RAD;
  const lat = Math.asin(Math.max(-1, Math.min(1, (c - rho * rho * n * n) / (2 * n)))) / RAD;
  return [lng, lat];
}

export type MapTransform = { k: number; tx: number; ty: number };

/** Projects lng/lat into a generated map's SVG coordinate space. */
export function projectToMap(t: MapTransform, lng: number, lat: number): [number, number] {
  const [x, y] = albers(lng, lat);
  return [t.tx + t.k * x, t.ty + t.k * y];
}
