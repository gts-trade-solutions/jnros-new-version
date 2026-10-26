import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { pageImages, safety } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Safety",
  description: "EMR 0.58, TRIR 0.42 and 2.1 million hours without a lost-time incident. How Jnros plans, trains and leads for zero harm.",
  path: "/safety",
  image: pageImages.safety,
});

export default function SafetyPage() {
  return (
    <>
      <PageHero
        label="Safety"
        title="Nobody gets hurt. Nothing gets dropped."
        intro="Safety isn't a department at Jnros. It's how we plan, how we hire, how we train and how we decide when to stop."
        image={pageImages.safety}
        crumbs={[{ label: "Safety", href: "/safety" }]}
      />

      <section aria-label="Safety record" className="relative border-b border-border bg-surface">
        <div aria-hidden="true" className="hazard h-1.5 w-full" />
        <Reveal as="dl" className="container-x grid grid-cols-2 lg:grid-cols-4">
          {safety.stats.map((s, i) => (
            <div key={s.label} className={cn("flex flex-col border-border py-12 lg:py-16", i % 2 === 1 && "border-l pl-6 sm:pl-10", i >= 2 && "border-t lg:border-t-0", i === 2 && "lg:border-l lg:pl-10", i === 3 && "lg:pl-10")}>
              <dt className="order-2 mt-3 font-mono text-label uppercase text-muted">{s.label}</dt>
              <dd className="order-1 font-display text-stat font-extrabold text-accent">{s.value}</dd>
            </div>
          ))}
        </Reveal>
      </section>

      <section aria-labelledby="planning-heading" className="py-24 lg:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionLabel index="01">Our approach</SectionLabel>
            <SplitText id="planning-heading" text="Planning is a safety tool." className="mt-6 text-h2" />
            <Reveal className="mt-10 space-y-6 text-lead text-text/80">
              <p>Most incidents in heavy industry start long before anyone touches a shackle: a rushed plan, a missing measurement, an assumption about the ground.</p>
              <p>
                So we engineer every critical lift, survey every route and brief every shift. Our crews are certified, our equipment is inspected to manufacturer
                standards, and every person on site, including our clients' people, has the authority to stop work.
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-5 gap-4 lg:col-span-6">
            <RevealImage image={pageImages.safetyGallery[1]} sizes="(min-width: 1024px) 20vw, 40vw" className="col-span-2 mt-20 aspect-[3/4] rounded-xs" />
            <RevealImage image={safety.image} sizes="(min-width: 1024px) 30vw, 60vw" parallax className="col-span-3 aspect-[4/5] rounded-xs" />
          </div>
        </div>
      </section>

      <section aria-labelledby="programs-heading" className="border-t border-border py-24 lg:py-32">
        <div className="container-x">
          <SectionLabel index="02">Programs</SectionLabel>
          <SplitText id="programs-heading" text="How we keep the record." className="mt-6 text-h2" />
          <Reveal as="ul" batch className="mt-16 grid gap-px overflow-hidden rounded-xs border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {safety.programs.map((p) => (
              <li key={p.title} className="bg-bg p-8">
                <Icon name={p.icon} className="size-8 text-accent" />
                <h3 className="mt-10 font-display text-h4 font-extrabold uppercase">{p.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{p.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="certs-heading" className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <SectionLabel index="03">Certifications</SectionLabel>
            <h2 id="certs-heading" className="mt-6 font-display text-h3 font-extrabold uppercase">
              Audited, accredited, on file.
            </h2>
          </div>
          <Reveal as="ul" className="flex flex-wrap gap-2 lg:col-span-8">
            {safety.certifications.map((c) => (
              <li key={c} className="rounded-xs border border-border bg-bg px-4 py-3 font-display text-lg font-bold uppercase tracking-[0.04em]">
                {c}
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBanner title={"Safe is the only\nschedule we keep."} accent={["schedule"]} label="Plan it properly" />
    </>
  );
}
