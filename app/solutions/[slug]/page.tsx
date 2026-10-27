import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OfferingDetail } from "@/components/sections/OfferingDetail";
import { getSolution, solutions } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => solutions.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const solution = getSolution((await params).slug);
  if (!solution) return {};
  return pageMetadata({ title: solution.title, description: solution.short, path: solution.href, image: solution.image });
}

export default async function SolutionPage({ params }: Props) {
  const solution = getSolution((await params).slug);
  if (!solution) notFound();
  return <OfferingDetail item={solution} all={solutions} kind="Solution" parent={{ label: "Jnros Logistics Solution", href: "/solutions" }} />;
}
