import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { contact, pageImages, site } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { telHref } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description: contact.intro,
  path: "/contact",
  image: pageImages.contact,
});

export default function ContactPage() {
  return (
    <>
      <PageHero label="Contact Us" title={contact.title} intro={contact.intro} image={pageImages.contact} crumbs={[{ label: "Contact Us", href: "/contact" }]} size="md" />

      <section aria-label="Contact options" className="py-24 lg:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="01">Send your details</SectionLabel>
            <div className="mt-10">
              <ContactForm />
            </div>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <Reveal className="space-y-10">
              <div>
                <p className="font-mono text-label uppercase text-muted">Call Us</p>
                <a href={telHref(site.phone)} className="mt-3 flex items-center gap-3 font-display text-[2.5rem] font-extrabold leading-none hover:text-accent">
                  <Phone aria-hidden="true" className="size-6 shrink-0 text-accent" />
                  {site.phone}
                </a>
              </div>
              <div>
                <p className="font-mono text-label uppercase text-muted">Email</p>
                <a href={`mailto:${site.email}`} className="mt-3 flex items-center gap-3 break-all text-lg hover:text-accent">
                  <Mail aria-hidden="true" className="size-5 shrink-0 text-accent" />
                  {site.email}
                </a>
              </div>
              <div>
                <p className="font-mono text-label uppercase text-muted">Location</p>
                <address className="mt-3 flex gap-3 text-lg not-italic">
                  <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-accent" />
                  <span>
                    {site.address.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </address>
              </div>
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xs border border-border bg-raised p-5 font-display text-xl font-bold uppercase transition-colors hover:border-accent hover:text-accent"
                >
                  <SocialIcon name={s.icon} className="size-6 text-accent" />
                  {s.label}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ))}
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
