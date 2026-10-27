import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { footerColumns, site } from "@/lib/data";
import { telHref } from "@/lib/utils";
import { FooterTransit } from "./FooterTransit";

/** Site footer. Columns rise in as it scrolls into view; links nudge right behind a green tick on hover. */
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      <div aria-hidden="true" className="hazard h-1.5 w-full" />

      <Reveal batch stagger={0.1} className="container-x grid gap-14 py-20 lg:grid-cols-12 lg:py-28">
        <div className="space-y-9 lg:col-span-4">
          <Link href="/" className="inline-block">
            <Logo className="text-[1.375rem]" />
          </Link>
          <p className="max-w-sm text-muted">{site.description}</p>

          <ul className="flex flex-wrap gap-3" aria-label="Social media">
            {site.socials.map((s) => (
              <li key={s.label}>
                <Magnetic strength={0.45}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${site.name} on ${s.label}`}
                    className="grid size-11 place-items-center rounded-xs border border-border text-text/80 transition-colors hover:border-accent hover:text-accent"
                  >
                    <SocialIcon name={s.icon} className="size-5" />
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="grid gap-12 sm:grid-cols-2 lg:col-span-5">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className="font-mono text-label font-normal text-muted">{col.title}</h2>
              <ul className="mt-6 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="group inline-block font-display text-lg font-semibold uppercase leading-tight tracking-[0.03em] transition-colors hover:text-accent">
                      <span className="relative inline-block transition-transform duration-500 ease-brand group-hover:translate-x-4">
                        <span aria-hidden="true" className="absolute -left-4 top-1/2 h-0.5 w-2.5 origin-left -translate-y-1/2 scale-x-0 bg-accent transition-transform duration-500 ease-brand group-hover:scale-x-100" />
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="lg:col-span-3">
          <h2 className="font-mono text-label font-normal text-muted">Our Location</h2>
          <ul className="mt-6 space-y-5">
            <li className="flex gap-3">
              <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-accent" />
              <address className="not-italic leading-relaxed text-text/80">
                {site.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </li>
            <li>
              <a href={telHref(site.phone)} className="flex items-center gap-3 font-display text-2xl font-extrabold transition-colors hover:text-accent">
                <Phone aria-hidden="true" className="size-4 shrink-0 text-accent" />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 break-all text-text/80 underline-offset-4 hover:text-accent hover:underline">
                <Mail aria-hidden="true" className="size-4 shrink-0 text-accent" />
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </Reveal>

      <FooterTransit />

      <div className="border-t border-border">
        <div className="container-x py-6 text-sm text-muted">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
