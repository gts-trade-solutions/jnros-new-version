import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { RevealImage } from "@/components/ui/RevealImage";
import type { NewsPost } from "@/lib/data";
import { formatDate } from "@/lib/utils";

/**
 * News card. The image wipes open on scroll (RevealImage); hovering anywhere on the card draws an
 * underline under every line of the title (background-size on an inline span, so it wraps).
 * The whole card is clickable through the title link's stretched ::after.
 */
export function NewsCard({ post, sizes = "(min-width: 768px) 33vw, 100vw" }: { post: NewsPost; sizes?: string }) {
  return (
    <article className="group relative flex h-full flex-col">
      <RevealImage
        image={post.image}
        sizes={sizes}
        className="aspect-[4/3] rounded-xs"
        imageClassName="transition-transform duration-[1.2s] ease-brand motion-safe:group-hover:scale-105"
      />
      <div className="mt-6 flex items-center gap-3 font-mono text-label uppercase text-muted">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true" className="h-px w-6 bg-border" />
        <span className="text-accent">{post.category}</span>
      </div>
      <h3 className="mt-4 font-display text-h4 font-bold uppercase">
        <Link href={`/news/${post.slug}`} className="after:absolute after:inset-0">
          <span className="bg-[linear-gradient(var(--accent),var(--accent))] bg-[length:0%_2px] bg-[position:0_100%] bg-no-repeat pb-0.5 transition-[background-size] duration-700 ease-brand group-hover:bg-[length:100%_2px]">
            {post.title}
          </span>
        </Link>
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{post.excerpt}</p>
      <span aria-hidden="true" className="mt-auto flex items-center gap-2 pt-6 font-display text-sm font-bold uppercase tracking-[0.1em] transition-colors group-hover:text-accent">
        Learn more
        <ArrowRight className="size-4 transition-transform duration-500 ease-brand group-hover:translate-x-1" />
      </span>
    </article>
  );
}
