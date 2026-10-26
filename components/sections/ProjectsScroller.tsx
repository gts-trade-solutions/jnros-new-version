"use client";

import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { useDragScroll } from "@/hooks/useDragScroll";
import { type CaseStudy, getIndustry } from "@/lib/data";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { gsap, MQ } from "@/lib/gsap";
import { pad2 } from "@/lib/utils";

/**
 * Featured projects.
 *
 * Desktop (motion allowed): the section pins and vertical scroll drives the card track sideways
 * (scrubbed x tween). Each photo also drifts inside its frame via containerAnimation, and a
 * progress bar plus "01 / 06" counter track position.
 *
 * Mobile, tablet and reduced motion: a native swipeable carousel with scroll-snap (mouse users
 * can drag it), and the progress bar follows its scroll position.
 */
export function ProjectsScroller({ projects }: { projects: CaseStudy[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  useDragScroll(track);

  useIdleGSAP(
    () => {
      const el = track.current;
      if (!el) return;
      const setProgress = (p: number) => {
        gsap.set(bar.current, { scaleX: p });
        if (counter.current) counter.current.textContent = pad2(Math.round(p * (projects.length - 1)) + 1);
      };

      const mm = gsap.matchMedia();
      mm.add(MQ.desktopMotion, () => {
        // Distance to travel: from the first card at the gutter to the last card's right edge at the gutter.
        const distance = () => {
          const last = el.lastElementChild as HTMLElement;
          const gutter = parseFloat(getComputedStyle(el).paddingLeft);
          return Math.max(0, last.offsetLeft + last.offsetWidth + gutter - el.clientWidth);
        };

        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => setProgress(self.progress),
          },
        });

        // Photos drift against the direction of travel inside their frames.
        gsap.utils.toArray<HTMLElement>("[data-card-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -7 },
            { xPercent: 7, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
          );
        });
      });

      mm.add(`not all and ${MQ.desktopMotion}`, () => {
        const onScroll = () => {
          const max = el.scrollWidth - el.clientWidth;
          setProgress(max > 0 ? el.scrollLeft / max : 0);
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
      });
    },
    // Highest idle priority: the pin adds scroll distance that every later trigger must measure.
    { scope: root, priority: 10 },
  );

  return (
    <section ref={root} aria-labelledby="projects-heading" className="relative overflow-hidden bg-surface py-24 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-0">
      <div className="container-x flex flex-wrap items-end justify-between gap-8 lg:pt-[calc(var(--nav-h)+1rem)]">
        <div>
          <SectionLabel index="03">Featured Projects</SectionLabel>
          <SplitText id="projects-heading" text="Proof, by the pound." accent={["pound."]} className="mt-6 text-h2" />
        </div>
        <div className="flex items-center gap-8">
          <p className="font-mono text-label tabular-nums text-muted">
            <span ref={counter} className="text-text">
              01
            </span>{" "}
            / {pad2(projects.length)}
          </p>
          <Link href="/case-studies" className="group flex items-center gap-2 font-display text-base font-bold uppercase tracking-[0.08em] hover:text-accent">
            All case studies
            <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-500 ease-brand group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div
        ref={track}
        data-cursor="drag"
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] [scroll-padding-inline:var(--gutter)] lg:mt-10 lg:snap-none lg:gap-8 lg:overflow-visible"
      >
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/case-studies/${p.slug}`}
            data-cursor="view"
            className="group relative aspect-[4/5] w-[82vw] shrink-0 snap-start overflow-hidden rounded-xs bg-surface-2 sm:aspect-[4/3] sm:w-[62vw] lg:aspect-[5/4] lg:h-[56svh] lg:w-auto"
          >
            <div data-card-img className="absolute inset-y-0 -inset-x-[9%]">
              <Image
                src={p.image.src}
                alt={p.image.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 82vw"
                className="object-cover transition-transform duration-[1.2s] ease-brand motion-safe:group-hover:scale-105"
              />
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-bg/40" />

            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-7">
              <span className="rounded-xs bg-accent px-2.5 py-1 font-mono text-label uppercase text-bg">{getIndustry(p.industry).name}</span>
              <span className="font-mono text-label text-text/70">{p.year}</span>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 p-5 sm:p-7">
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-mono text-label uppercase text-text/70">
                  <MapPin aria-hidden="true" className="size-3.5 text-accent" />
                  {p.location}
                </p>
                <h3 className="mt-3 font-display text-h3 font-extrabold uppercase">{p.title}</h3>
              </div>
              <div className="text-right">
                <p className="font-display text-[clamp(1.75rem,3vw,3rem)] font-extrabold leading-none text-accent">{p.weight}</p>
                <p className="mt-1 font-mono text-label uppercase text-text/60">Load weight</p>
              </div>
            </div>
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-brand group-hover:scale-x-100"
            />
          </Link>
        ))}

        <Link
          href="/case-studies"
          data-cursor=""
          className="group relative flex aspect-[4/5] w-[60vw] shrink-0 snap-start flex-col justify-between rounded-xs border border-border p-7 transition-colors hover:border-accent sm:aspect-[3/4] sm:w-[36vw] lg:aspect-auto lg:h-[56svh] lg:w-[22vw]"
        >
          <span className="font-mono text-label uppercase text-muted">More projects</span>
          <span className="font-display text-h3 font-extrabold uppercase">
            See every
            <br />
            case study
          </span>
          <span className="grid size-14 place-items-center rounded-xs bg-accent text-bg transition-transform duration-500 ease-brand group-hover:translate-x-2">
            <ArrowRight aria-hidden="true" className="size-6" />
          </span>
        </Link>
      </div>

      <div className="container-x mt-10 lg:mt-12">
        <div className="h-px w-full bg-border">
          <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-accent" />
        </div>
      </div>
    </section>
  );
}
