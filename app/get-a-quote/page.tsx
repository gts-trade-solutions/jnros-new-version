import { Clock, Phone, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { type Crumb, Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GridLines } from "@/components/ui/GridLines";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { industries, pageImages, services, site } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { telHref } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Get a Quote",
  description: "Request a quote for machinery moving, heavy lift, crane services, transportation or storage. A project engineer replies within one business day.",
  path: "/get-a-quote",
  image: pageImages.quote,
});

const crumbs: Crumb[] = [{ label: "Get a Quote", href: "/get-a-quote" }];

const promises = [
  { icon: Clock, title: "One business day", text: "A project engineer, not a call center, reviews every request." },
  { icon: ShieldCheck, title: "Engineered pricing", text: "Quotes are built from a real lift and transport plan." },
];

export default function QuotePage() {
  const projectTypes = [
    ...services.map((s) => ({ value: s.slug, label: s.title, number: s.number })),
    { value: "other", label: "Something else", number: "09" },
  ];
  const industryOptions = industries.map((i) => ({ value: i.slug, label: i.name }));

  return (
    <section className="relative isolate overflow-hidden pb-24 pt-[calc(var(--utility-h)+var(--nav-h)+4rem)] lg:pb-36">
      <GridLines className="-z-10" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[60svh] bg-gradient-to-b from-surface to-transparent" />

      <div className="container-x grid gap-16 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal trigger="load">
              <Breadcrumbs items={crumbs} />
              <SectionLabel className="mt-10">Request a quote</SectionLabel>
            </Reveal>
            <SplitText as="h1" trigger="load" text={"Let's move\nsomething big."} accent={["big."]} className="mt-6 text-h2" />
            <Reveal trigger="load" delay={0.4} className="mt-8 space-y-8">
              <p className="text-lead text-muted">Four quick steps. The more you tell us, the sharper the number.</p>
              <ul className="space-y-6 border-t border-border pt-8">
                {promises.map(({ icon: IconComponent, title, text }) => (
                  <li key={title} className="flex gap-4">
                    <IconComponent aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.5} />
                    <div>
                      <p className="font-display text-lg font-bold uppercase">{title}</p>
                      <p className="mt-1 text-sm text-muted">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <a href={telHref(site.phone)} className="group flex items-center gap-4 rounded-xs border border-border p-5 transition-colors hover:border-accent">
                <Phone aria-hidden="true" className="size-5 text-accent" />
                <span>
                  <span className="block font-mono text-label uppercase text-muted">Emergency or tight deadline?</span>
                  <span className="block font-display text-2xl font-extrabold group-hover:text-accent">{site.phone}</span>
                </span>
              </a>
            </Reveal>
          </div>
        </aside>

        <Reveal trigger="load" delay={0.3} className="lg:col-span-8">
          <div className="rounded-xs border border-border bg-bg/60 p-6 backdrop-blur-sm sm:p-10">
            <QuoteForm projectTypes={projectTypes} industries={industryOptions} phone={site.phone} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
