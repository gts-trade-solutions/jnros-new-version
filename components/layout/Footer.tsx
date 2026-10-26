import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Magnetic } from "@/components/ui/Magnetic";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { footerColumns, site } from "@/lib/data";
import { telHref } from "@/lib/utils";
import { FooterWordmark } from "./FooterWordmark";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-bg">
      <div aria-hidden="true" className="hazard h-1.5 w-full" />

      <div className="container-x grid gap-14 py-20 lg:grid-cols-12 lg:py-28">
        <div className="space-y-9 lg:col-span-4">
          <Link href="/" className="inline-block">
            <Logo className="text-[1.375rem]" />
          </Link>
          <p className="max-w-sm text-muted">{site.description}</p>

          <div>
            <p className="font-mono text-label uppercase text-muted">24/7 dispatch</p>
            <a href={telHref(site.phone)} className="mt-2 block font-display text-[2.5rem] font-extrabold leading-none transition-colors hover:text-accent">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="mt-3 inline-block text-text/80 underline-offset-4 hover:text-accent hover:underline">
              {site.email}
            </a>
          </div>

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
                    <SocialIcon name={s.icon} />
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="grid gap-12 sm:grid-cols-3 lg:col-span-8">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className="font-mono text-label font-normal text-muted">{col.title}</h2>
              <ul className="mt-6 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-display text-lg font-semibold uppercase tracking-[0.03em] transition-colors hover:text-accent">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <FooterWordmark />

      <div className="border-t border-border">
        <div className="container-x flex flex-col gap-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/privacy" className="hover:text-text">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-text">
                Terms
              </Link>
            </li>
            <li>
              <a href="/sitemap.xml" className="hover:text-text">
                Sitemap
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
