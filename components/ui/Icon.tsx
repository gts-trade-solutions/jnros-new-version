import {
  Award,
  BadgeCheck,
  ClipboardCheck,
  Clock,
  Cpu,
  Factory,
  Gauge,
  GraduationCap,
  Handshake,
  HardHat,
  HeartPulse,
  type LucideProps,
  Plane,
  Server,
  ShieldCheck,
  Siren,
  Stethoscope,
  TrendingUp,
  Users,
  Wallet,
  Weight,
  Wind,
  Zap,
} from "lucide-react";
import type { IconName } from "@/lib/data";

/** Icons referenced by name from lib/data.ts, so the data file stays plain (no React imports). */
const icons = {
  Award,
  BadgeCheck,
  ClipboardCheck,
  Clock,
  Cpu,
  Factory,
  Gauge,
  GraduationCap,
  Handshake,
  HardHat,
  HeartPulse,
  Plane,
  Server,
  ShieldCheck,
  Siren,
  Stethoscope,
  TrendingUp,
  Users,
  Wallet,
  Weight,
  Wind,
  Zap,
} satisfies Record<IconName, React.ComponentType<LucideProps>>;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name];
  return <Component aria-hidden="true" strokeWidth={1.5} {...props} />;
}
