import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import type { Teaser } from "@/components/layout/MegaMenu";
import { PageTransition } from "@/components/layout/PageTransition";
import { Preloader } from "@/components/layout/Preloader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { JsonLd } from "@/components/ui/JsonLd";
import { caseStudies, hero, nav, site } from "@/lib/data";
import { INTRO_STORAGE_KEY } from "@/lib/storage";
import { ogImage, organizationJsonLd } from "@/lib/seo";
import "./globals.css";

const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-barlow", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: "400", variable: "--font-jetbrains", display: "swap" });

const defaultTitle = `${site.name} | Machinery Moving, Heavy Lift, Cranes & Transport`;
const shareImage = ogImage(hero.slides[0].image);

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ["machinery moving", "heavy lift", "rigging", "crane services", "specialized transportation", "millwright", "industrial metrology", "heavy haul"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    url: "/",
    title: defaultTitle,
    description: site.description,
    images: [shareImage],
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: site.description, images: [shareImage.url] },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0B0D0E",
  colorScheme: "dark",
};

/*
 * Runs before first paint:
 * - html.js lets CSS pre-hide elements that animate in on load (no flash of their final state).
 * - html.preload shows the preloader on the first visit of a session, unless reduced motion is on.
 * - Safety net: if the app hasn't hydrated within 5s (blocked or failed bundle), both classes are
 *   removed so every pre-hidden element and the page behind the preloader become visible.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!sessionStorage.getItem('${INTRO_STORAGE_KEY}')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('preload')}catch(e){}setTimeout(function(){if(!window.__siteHydrated)d.classList.remove('js','preload')},5000)})();`;

/** Compact case-study data for the mega menu teasers. */
const teasers: Record<string, Teaser> = Object.fromEntries(
  caseStudies.map((c) => [c.slug, { slug: c.slug, title: c.title, location: c.location, weight: c.weight, image: c.image }]),
);

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:rounded-xs focus:bg-accent focus:px-4 focus:py-2 focus:font-display focus:font-bold focus:uppercase focus:text-bg"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <PageTransition>
            <Preloader />
            <Cursor />
            <Header nav={nav} teasers={teasers} phone={site.phone} storeUrl={site.storeUrl} socials={site.socials} />
            <main id="main">{children}</main>
            {/* Own hydration unit: the footer is never needed on the first frame. */}
            <Suspense>
              <Footer />
            </Suspense>
          </PageTransition>
        </SmoothScroll>
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
