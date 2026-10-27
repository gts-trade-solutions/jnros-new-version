import { Award, Globe, Handshake, Layers, type LucideProps, Network, Plane, Route, ShieldCheck, Ship, SlidersHorizontal, Truck } from "lucide-react";
import type { IconName } from "@/lib/data";

/** Icons referenced by name from lib/data.ts, so the data file stays plain (no React imports). */
const icons = {
  Award,
  Globe,
  Handshake,
  Layers,
  Network,
  Plane,
  Route,
  ShieldCheck,
  Ship,
  SlidersHorizontal,
  Truck,
} satisfies Record<IconName, React.ComponentType<LucideProps>>;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name];
  return <Component aria-hidden="true" strokeWidth={1.5} {...props} />;
}
