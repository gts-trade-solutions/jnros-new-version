import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { NewsCard } from "@/components/sections/NewsCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GridLines } from "@/components/ui/GridLines";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { getNewsPost, news } from "@/lib/data";
import { articleJsonLd, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => news.map((n) => ({ slug: n.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getNewsPost((await params).slug);
  if (!post) return {};
  const meta = pageMetadata({ title: post.title, description: post.excerpt, path: `/news/${post.slug}`, image: post.image });
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: post.date } };
}

export default async function NewsPostPage({ params }: Props) {
  const post = getNewsPost((await params).slug);
  if (!post) notFound();
  const more = news.filter((n) => n.slug !== post.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={articleJsonLd(post)} />
      <article>
        <header className="relative isolate pb-14 pt-[calc(var(--utility-h)+var(--nav-h)+4rem)]">
          <GridLines className="-z-10" />
          <div className="container-x">
            <Reveal trigger="load">
              <Breadcrumbs
                items={[
                  { label: "News", href: "/news" },
                  { label: post.title, href: `/news/${post.slug}` },
                ]}
              />
              <p className="mt-10 flex items-center gap-3 font-mono text-label uppercase text-muted">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true" className="h-px w-6 bg-border" />
                <span className="text-accent">{post.category}</span>
              </p>
            </Reveal>
            <SplitText as="h1" trigger="load" text={post.title} className="mt-6 max-w-6xl text-h1" />
            <Reveal trigger="load" delay={0.4}>
              <p className="mt-8 max-w-3xl text-lead text-text/80">{post.excerpt}</p>
            </Reveal>
          </div>
        </header>

        <div className="container-x">
          <RevealImage image={post.image} sizes="100vw" preload className="aspect-[16/9] rounded-xs lg:aspect-[21/9]" />
        </div>

        <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <aside className="lg:col-span-3">
            <SectionLabel>{post.category}</SectionLabel>
          </aside>
          <div className="prose-brand lg:col-span-7">
            {post.body.map((block, i) =>
              block.type === "h2" ? (
                <h2 key={i}>{block.text}</h2>
              ) : block.type === "ul" ? (
                <ul key={i}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p key={i}>{block.text}</p>
              ),
            )}
          </div>
        </div>
      </article>

      <section aria-labelledby="more-news-heading" className="border-t border-border py-24 lg:py-32">
        <div className="container-x">
          <h2 id="more-news-heading" className="mb-14 font-display text-h2 font-extrabold uppercase">
            More from the field
          </h2>
          <Reveal as="ul" batch className="grid gap-x-8 gap-y-16 md:grid-cols-3">
            {more.map((p) => (
              <li key={p.slug}>
                <NewsCard post={p} />
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
