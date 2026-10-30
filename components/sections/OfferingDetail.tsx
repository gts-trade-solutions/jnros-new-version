import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";
import { type Offering, site } from "@/lib/data";
import { breadcrumbJsonLd, offeringJsonLd } from "@/lib/seo";
import { cn, telHref, textCase } from "@/lib/utils";

type Props = {
  item: Offering;
  /** Every page of this kind, for the sibling list and the "next" link. */
  all: Offering[];
  /** Singular label ("Solution") and the index page it belongs to. */
  kind: string;
  parent: { label: string; href: string };
};

/** A solution or service page: hero, the page's own text beside its photo, the sibling pages, the next one. */
export function OfferingDetail({ item, all, kind, parent }: Props) {
  const next = all[(all.indexOf(item) + 1) % all.length];
  const crumbs = [parent, { label: item.title, href: item.href }];

  return (
    <>
      <JsonLd data={offeringJsonLd(item)} />
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, ...crumbs])} />
      <PageHero label={`${item.number} / ${kind}`} title={item.title} image={item.image} video={item.video} crumbs={crumbs} size="md" />

      <section aria-label={item.title} className="py-24 lg:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal className="space-y-6">
              {item.body.map((p, i) => (
                <p key={p} className={cn("text-lead", i === 0 ? "text-text" : "text-muted")}>
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal className="mt-12 flex flex-wrap gap-4">
              <div>
                <MagneticButton href={telHref(site.phone)} size="lg" arrow={false}>
                  <span className="flex items-center gap-3">
                    <Phone aria-hidden="true" className="size-4" />
                    Call Now
                  </span>
                </MagneticButton>
              </div>
              <Button href="/contact" variant="outline" size="lg" arrow={false}>
                Contact Us
              </Button>
            </Reveal>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <RevealImage image={item.image} sizes="(min-width: 1024px) 33vw, 100vw" className="aspect-[4/3] rounded-xs" />
            <nav aria-label={parent.label} className="mt-10">
              <p className={cn("font-mono text-label text-muted", textCase(parent.label))}>{parent.label}</p>
              <ul className="mt-4 border-t border-border">
                {all.map((o) => (
                  <li key={o.slug} className="border-b border-border">
                    <Link
                      href={o.href}
                      aria-current={o === item ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-4 py-3 font-display text-lg font-semibold uppercase leading-tight tracking-[0.03em] transition-colors hover:text-accent",
                        o === item && "text-accent",
                      )}
                    >
                      <span className="font-mono text-label font-normal text-muted">{o.number}</span>
                      {o.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>

      {/* Next page */}
      <section aria-label={`Next ${kind.toLowerCase()}`} className="border-t border-border">
        <Link href={next.href} className="group container-x flex items-center justify-between gap-8 py-14 lg:py-20">
          <span>
            <span className="block font-mono text-label uppercase text-muted">
              Next {kind.toLowerCase()} · {next.number}
            </span>
            <span className="mt-3 block font-display text-h2 font-extrabold uppercase transition-colors duration-500 group-hover:text-accent">{next.title}</span>
          </span>
          <span className="grid size-16 shrink-0 place-items-center rounded-xs border border-border transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-bg lg:size-20">
            <ArrowRight aria-hidden="true" className="size-6 transition-transform duration-500 ease-brand group-hover:translate-x-1" />
          </span>
        </Link>
      </section>

      <CtaBanner />
    </>
  );
}
