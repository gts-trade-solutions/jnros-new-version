import Image from "next/image";

/**
 * The full Jnros Logistics lockup (emblem, wordmark and Psalm 121:8 line), exactly as supplied, on a
 * transparent background. It is drawn for white: over a dark photo, give it a white plate (see the
 * header). Size it with a height or width class and set the other side to auto.
 */
export function Logo({ className, sizes, loading = "eager" }: { className: string; sizes: string; loading?: "eager" | "lazy" }) {
  return <Image src="/brand/jnros-logo.png" alt="Jnros Logistics" width={2017} height={741} sizes={sizes} loading={loading} className={className} />;
}
