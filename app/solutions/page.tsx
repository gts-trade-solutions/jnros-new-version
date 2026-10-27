import type { Metadata } from "next";
import { OfferingIndex } from "@/components/sections/OfferingIndex";
import { pageImages, solutions, specialised } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Jnros Logistics Solution",
  description: "Delivering expert solutions in ODC, break bulk, Ro-Ro, and bulk carrier shipping, along with structured global air and sea freight management.",
  path: "/solutions",
  image: pageImages.solutions,
});

export default function SolutionsPage() {
  return (
    <OfferingIndex
      kind="Solution"
      title="Jnros Logistics Solution"
      path="/solutions"
      image={pageImages.solutions}
      heading={specialised.heading}
      text={specialised.text}
      items={solutions}
    />
  );
}
