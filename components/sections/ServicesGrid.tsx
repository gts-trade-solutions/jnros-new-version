import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { services } from "@/lib/data";
import { ServiceCard } from "./ServiceCard";

/** 4×2 grid of service cards. Rows wipe open (staggered clip-path) as they scroll into view. */
export function ServicesGrid() {
  return (
    <section id="services" aria-labelledby="services-heading" className="relative py-24 lg:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionLabel index="01">Industrial Services</SectionLabel>
            <SplitText id="services-heading" text={"Heavy capability.\nEngineered precision."} accent={["precision."]} className="mt-6 text-h2" />
          </div>
          <Reveal className="space-y-6 lg:col-span-4">
            <p className="text-lead text-muted">
              Eight disciplines under one roof, so your project has one plan, one schedule and one team from the first survey to the final set.
            </p>
            <Button href="/services" variant="ghost">
              Explore all services
            </Button>
          </Reveal>
        </div>

        <Reveal as="ul" effect="clip" batch stagger={0.1} className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <li key={service.slug}>
              <ServiceCard service={service} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
