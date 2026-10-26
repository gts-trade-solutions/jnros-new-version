import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { NewsCard } from "@/components/sections/NewsCard";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";
import { news, pageImages } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "News & Insights",
  description: "Fleet additions, project stories, safety milestones and practical advice from the Jnros team.",
  path: "/news",
  image: pageImages.news,
});

export default function NewsPage() {
  const [featured, ...rest] = [...news].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero label="News & insights" title="From the field." image={pageImages.news} crumbs={[{ label: "News", href: "/news" }]} size="md" />

      <section aria-label="Latest story" className="py-24 lg:py-32">
        <article className="group container-x relative grid gap-10 lg:grid-cols-12 lg:items-center">
          <RevealImage
            image={featured.image}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="aspect-[16/10] rounded-xs lg:col-span-7"
            imageClassName="transition-transform duration-[1.2s] ease-brand motion-safe:group-hover:scale-105"
          />
          <Reveal className="lg:col-span-5">
            <p className="flex items-center gap-3 font-mono text-label uppercase text-muted">
              <span className="rounded-xs bg-accent px-2 py-1 text-bg">Latest</span>
              <time dateTime={featured.date}>{formatDate(featured.date)}</time>
              <span className="text-accent">{featured.category}</span>
            </p>
            <h2 className="mt-6 font-display text-h2 font-extrabold uppercase">
              <Link href={`/news/${featured.slug}`} className="after:absolute after:inset-0">
                <span className="bg-[linear-gradient(var(--accent),var(--accent))] bg-[length:0%_3px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-700 ease-brand group-hover:bg-[length:100%_3px]">
                  {featured.title}
                </span>
              </Link>
            </h2>
            <p className="mt-6 text-lead text-muted">{featured.excerpt}</p>
            <span aria-hidden="true" className="mt-8 flex items-center gap-2 font-display font-bold uppercase tracking-[0.1em] group-hover:text-accent">
              Read the story
              <ArrowRight className="size-4 transition-transform duration-500 ease-brand group-hover:translate-x-1" />
            </span>
          </Reveal>
        </article>
      </section>

      <section aria-label="More stories" className="border-t border-border py-24 lg:py-32">
        <Reveal as="ul" batch className="container-x grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <li key={post.slug}>
              <NewsCard post={post} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
            </li>
          ))}
        </Reveal>
      </section>

      <CtaBanner />
    </>
  );
}
