import type { Metadata } from "next";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Gallery } from "@/components/sections/Gallery";
import { PageHero } from "@/components/sections/PageHero";
import { pageImages, recentWorks, site } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Gallery",
  description: site.description,
  path: "/gallery",
  image: pageImages.gallery,
});

export default function GalleryPage() {
  return (
    <>
      <PageHero label="Our Recent Works" title="Gallery" image={pageImages.gallery} crumbs={[{ label: "Gallery", href: "/gallery" }]} size="md" />
      <section aria-label="Photos" className="py-24 lg:py-32">
        <div className="container-x">
          <Gallery images={recentWorks} />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
