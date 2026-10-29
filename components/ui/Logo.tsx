import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className: string;
  sizes: string;
  loading?: "eager" | "lazy";
  /**
   * Also renders the white version (jnros-logo-light.png, a knockout of the colour logo) and shows
   * it instead while the header is over a dark hero ([data-over-hero], globals.css).
   */
  adaptive?: boolean;
};

/**
 * The full Jnros Logistics lockup (emblem, wordmark and Psalm 121:8 line), exactly as supplied, on a
 * transparent background. Size it with a height or width class and set the other side to auto.
 */
export function Logo({ className, sizes, loading = "eager", adaptive = false }: Props) {
  const colour = <Image data-logo="colour" src="/brand/jnros-logo.png" alt="Jnros Logistics" width={2017} height={741} sizes={sizes} loading={loading} className={className} />;
  if (!adaptive) return colour;
  return (
    <span className="relative block">
      {colour}
      <Image
        data-logo="light"
        src="/brand/jnros-logo-light.png"
        alt=""
        width={2017}
        height={741}
        sizes={sizes}
        loading={loading}
        className={cn(className, "absolute inset-0")}
      />
    </span>
  );
}
