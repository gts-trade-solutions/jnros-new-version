import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { hubLocations, locations, pageImages, site } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { telHref } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Talk to a Jnros project engineer: 24/7 dispatch, 18 locations across North America, one number.",
  path: "/contact",
  image: pageImages.contact,
});

export default function ContactPage() {
  const hq = locations.find((l) => l.hq)!;
  return (
    <>
      <PageHero
        label="Contact"
        title="Talk to an engineer."
        intro="Questions, projects, emergencies: one number reaches 24/7 dispatch, and every message is read by a person."
        image={pageImages.contact}
        crumbs={[{ label: "Contact", href: "/contact" }]}
        size="md"
      />

      <section aria-label="Contact options" className="py-24 lg:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="01">Send a message</SectionLabel>
            <div className="mt-10">
              <ContactForm />
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <Reveal className="space-y-10">
              <div>
                <p className="font-mono text-label uppercase text-muted">24/7 dispatch</p>
                <a href={telHref(site.phone)} className="mt-3 flex items-center gap-3 font-display text-[2.5rem] font-extrabold leading-none hover:text-accent">
                  <Phone aria-hidden="true" className="size-6 text-accent" />
                  {site.phone}
                </a>
              </div>
              <div>
                <p className="font-mono text-label uppercase text-muted">Email</p>
                <a href={`mailto:${site.email}`} className="mt-3 flex items-center gap-3 text-lg hover:text-accent">
                  <Mail aria-hidden="true" className="size-5 text-accent" />
                  {site.email}
                </a>
              </div>
              <div>
                <p className="font-mono text-label uppercase text-muted">Headquarters</p>
                <address className="mt-3 flex gap-3 text-lg not-italic">
                  <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-accent" />
                  <span>
                    {hq.street}
                    <br />
                    {hq.locality} {hq.postalCode}
                  </span>
                </address>
                <p className="mt-3 text-sm text-muted">{site.hours}</p>
              </div>
              <div className="rounded-xs border border-border p-6">
                <p className="font-display text-xl font-bold uppercase">Need a price?</p>
                <p className="mt-2 text-sm text-muted">The quote form takes two minutes and goes straight to a project engineer.</p>
                <Button href="/get-a-quote" className="mt-6">
                  Get a Quote
                </Button>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section aria-labelledby="hubs-heading" className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 id="hubs-heading" className="font-display text-h3 font-extrabold uppercase">
              Regional hubs
            </h2>
            <Link href="/locations" className="font-display font-bold uppercase tracking-[0.08em] hover:text-accent">
              All 18 locations →
            </Link>
          </div>
          <Reveal as="ul" batch className="grid gap-px overflow-hidden rounded-xs border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {hubLocations.map((l) => (
              <li key={l.slug} className="bg-surface p-6">
                <Link href={`/locations/${l.slug}`} className="font-display text-2xl font-extrabold uppercase hover:text-accent">
                  {l.city}, {l.regionCode}
                </Link>
                <a href={telHref(l.phone)} className="mt-2 block font-mono text-label uppercase text-muted hover:text-text">
                  {l.phone}
                </a>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
