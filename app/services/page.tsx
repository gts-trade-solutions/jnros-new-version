import type { Metadata } from "next";
import { OfferingIndex } from "@/components/sections/OfferingIndex";
import { pageImages, services, servicesIntro } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Services",
  description: "Jnros Logistics provides comprehensive logistics solutions designed to meet diverse global transportation needs.",
  path: "/services",
  image: pageImages.services,
});

export default function ServicesPage() {
  return <OfferingIndex kind="Service" title={servicesIntro.heading} path="/services" image={pageImages.services} text={servicesIntro.text} items={services} />;
}
