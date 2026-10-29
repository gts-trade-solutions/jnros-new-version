import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/layout/PageTransition";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { JsonLd } from "@/components/ui/JsonLd";
import { hero, nav, site } from "@/lib/data";
import { ogImage, organizationJsonLd } from "@/lib/seo";
import "./globals.css";

const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-barlow", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: "400", variable: "--font-jetbrains", display: "swap" });

const defaultTitle = `${site.name} | Engineered Logistics for Complex Cargo`;
const shareImage = ogImage(hero.slides[0].image);

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ["project cargo", "breakbulk", "ODC cargo", "heavy lift", "ro-ro shipping", "bulk carrier", "air freight", "ocean freight", "customs clearance", "Bangalore"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
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
  themeColor: "#F5F7F9",
  colorScheme: "light",
};

/*
 * Runs before first paint:
 * - html.js lets CSS pre-hide elements that reveal on scroll (no flash of their final state).
 * - Safety net: if the app hasn't hydrated within 5s (blocked or failed bundle), the class is
 *   removed so every pre-hidden element becomes visible.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__siteHydrated)d.classList.remove('js')},5000)})();`;

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
            <ScrollProgress />
            <Header nav={nav} phone={site.phone} email={site.email} location={site.address.lines[2]} socials={site.socials} />
            <main id="main">{children}</main>
            {/* Own hydration unit: the footer is never needed on the first frame. */}
            <Suspense>
              <Footer />
            </Suspense>
          </PageTransition>
          <FloatingActions />
        </SmoothScroll>
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
