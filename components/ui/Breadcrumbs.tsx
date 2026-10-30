import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn, textCase } from "@/lib/utils";
import { JsonLd } from "./JsonLd";

export type Crumb = { label: string; href: string };

/** Mono breadcrumb trail plus matching BreadcrumbList structured data. The last crumb is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-label text-muted">
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={crumb.href} className={cn("flex items-center gap-2", textCase(crumb.label))}>
                {last ? (
                  <span aria-current="page" className="text-text">
                    {crumb.label}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.href} className="transition-colors hover:text-accent">
                      {crumb.label}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  );
}
