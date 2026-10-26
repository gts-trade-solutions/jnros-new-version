import { PartnerMark } from "@/components/ui/PartnerLogo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { partners } from "@/lib/data";

/**
 * Group companies. Each logo is drawn twice, a grey copy and a brand-colour copy stacked on top;
 * hover crossfades between them (opacity only, no filter animation).
 */
export function Partners() {
  return (
    <section aria-labelledby="partners-heading" className="relative py-24 lg:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel index="06">Group of Companies</SectionLabel>
          <SplitText id="partners-heading" text={"One group.\nEvery capability."} className="mt-6 text-h2" />
          <p className="mt-8 max-w-sm text-muted">
            Four specialist companies, one safety standard and one contract. Bring in any of them through a single Jnros project manager.
          </p>
        </div>

        <Reveal as="ul" className="grid border-l border-t border-border sm:grid-cols-2 lg:col-span-8">
          {partners.map((p) => (
            <li key={p.name} className="group relative flex min-h-56 flex-col justify-between gap-10 border-b border-r border-border p-8 transition-colors duration-500 hover:bg-surface">
              <div className="flex items-center gap-5">
                <span className="relative size-14 shrink-0">
                  <PartnerMark logo={p.logo} color="currentColor" className="absolute inset-0 size-14 text-muted/70 transition-opacity duration-500 group-hover:opacity-0" />
                  <PartnerMark logo={p.logo} color={p.color} className="absolute inset-0 size-14 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <span className="font-display text-[1.75rem] font-extrabold uppercase leading-[0.95] text-muted transition-colors duration-500 group-hover:text-text">
                  {p.name}
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-label uppercase text-muted">
                <span>{p.role}</span>
                <span className="opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ color: p.color }}>
                  A Jnros company
                </span>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
