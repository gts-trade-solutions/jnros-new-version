import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GridLines } from "@/components/ui/GridLines";
import { SplitText } from "@/components/ui/SplitText";

type Props = { title: string; path: string; updated: string; children: React.ReactNode };

/** Plain long-form layout for legal pages. */
export function LegalPage({ title, path, updated, children }: Props) {
  return (
    <article className="relative isolate pb-28 pt-[calc(var(--utility-h)+var(--nav-h)+4rem)]">
      <GridLines className="-z-10" />
      <div className="container-x">
        <Breadcrumbs items={[{ label: title, href: path }]} />
        <SplitText as="h1" trigger="load" text={title} className="mt-10 text-h1" />
        <p className="mt-6 font-mono text-label uppercase text-muted">Last updated {updated}</p>
        <div className="prose-brand mt-16 max-w-3xl">{children}</div>
      </div>
    </article>
  );
}
