import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { Tilt } from "@/components/ui/Tilt";
import type { Offering } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ServiceCard } from "./ServiceCard";

type Props = {
  id: string;
  index: string;
  label: string;
  heading: string;
  text: string;
  items: Offering[];
  more: { label: string; href: string };
  className?: string;
};

/**
 * Grid of solution / service cards, four to a row. Rows wipe open (staggered clip-path) as they
 * scroll into view; each card tilts toward the pointer (see <Tilt>).
 */
export function ServicesGrid({ id, index, label, heading, text, items, more, className }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("relative py-24 lg:py-36", className)}>
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <SectionLabel index={index}>{label}</SectionLabel>
            <SplitText id={`${id}-heading`} text={heading} className="mt-6 text-h2" />
          </div>
          <Reveal className="space-y-6 lg:col-span-6">
            <p className="text-muted">{text}</p>
            <Button href={more.href} variant="ghost">
              {more.label}
            </Button>
          </Reveal>
        </div>

        <Reveal as="ul" effect="clip" batch stagger={0.1} className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.slug}>
              <Tilt className="rounded-xs">
                <ServiceCard service={item} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
              </Tilt>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
