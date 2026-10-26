import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { news } from "@/lib/data";
import { NewsCard } from "./NewsCard";

export function News() {
  return (
    <section aria-labelledby="news-heading" className="relative border-t border-border py-24 lg:py-36">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel index="07">News & Insights</SectionLabel>
            <SplitText id="news-heading" text="From the field." className="mt-6 text-h2" />
          </div>
          <Button href="/news" variant="ghost">
            All news
          </Button>
        </div>
        <Reveal as="ul" batch className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
          {news.slice(0, 3).map((post) => (
            <li key={post.slug}>
              <NewsCard post={post} />
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
