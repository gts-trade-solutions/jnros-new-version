"use client";

import { Expand } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { useDragScroll } from "@/hooks/useDragScroll";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import type { Img } from "@/lib/data";
import { gsap, MQ } from "@/lib/gsap";
import { pad2 } from "@/lib/utils";
import { Lightbox } from "./Gallery";

/**
 * "Our Recent Works" as a horizontal film strip. Every photo opens the lightbox.
 *
 * Desktop (motion allowed): the section pins and vertical scroll drives the strip sideways
 * (scrubbed x tween). Each photo drifts inside its frame against the direction of travel
 * (containerAnimation), and a progress bar plus "01 / 09" counter track position.
 *
 * Mobile, tablet and reduced motion: a native swipeable strip with scroll-snap (mouse users can
 * drag it), and the progress bar follows its scroll position.
 *
 * The lightbox is portalled to <body>: while pinned, ScrollTrigger may give the section a transform,
 * which would make it the containing block for the lightbox's position: fixed.
 */
export function WorksScroller({ images }: { images: Img[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useDragScroll(track);

  useIdleGSAP(
    () => {
      const el = track.current;
      if (!el) return;
      const setProgress = (p: number) => {
        gsap.set(bar.current, { scaleX: p });
        if (counter.current) counter.current.textContent = pad2(Math.round(p * (images.length - 1)) + 1);
      };

      const mm = gsap.matchMedia();
      mm.add(MQ.desktopMotion, () => {
        // Distance to travel: from the first photo at the gutter to the last photo's right edge at the gutter.
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

        gsap.utils.toArray<HTMLElement>("[data-work-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -6 },
            { xPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
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
    <section ref={root} aria-labelledby="works-heading" className="relative overflow-hidden py-24 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-0">
      <div className="container-x flex flex-wrap items-end justify-between gap-8 lg:pt-[calc(var(--nav-h)+1rem)]">
        <div>
          <SectionLabel index="06">Gallery</SectionLabel>
          <SplitText id="works-heading" text="Our Recent Works" className="mt-6 text-h2" />
        </div>
        <div className="flex items-center gap-8">
          <p className="font-mono text-label tabular-nums text-muted">
            <span ref={counter} className="text-text">
              01
            </span>{" "}
            / {pad2(images.length)}
          </p>
          <Button href="/contact" variant="outline">
            Contact Us
          </Button>
        </div>
      </div>

      <div
        ref={track}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] lg:mt-14 lg:snap-none lg:overflow-visible lg:will-change-transform"
      >
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            data-tone="dark"
            aria-label={`View larger: ${img.alt}`}
            onClick={(e) => {
              opener.current = e.currentTarget;
              setIndex(i);
            }}
            className="group relative h-[46svh] shrink-0 snap-start overflow-hidden rounded-xs bg-surface-2 lg:h-[56svh]"
            style={{ aspectRatio: `${img.width} / ${img.height}` }}
          >
            <span data-work-img className="absolute -inset-x-[8%] inset-y-0">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 80vw"
                className="object-cover transition-transform duration-[1.2s] ease-brand motion-safe:group-hover:scale-105"
              />
            </span>
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span aria-hidden="true" className="absolute bottom-5 left-5 font-mono text-label text-text">
              {pad2(i + 1)}
            </span>
            <span
              aria-hidden="true"
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-xs bg-accent text-bg opacity-0 transition duration-500 ease-brand group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              <Expand className="size-4" />
            </span>
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-brand group-hover:scale-x-100"
            />
          </button>
        ))}
      </div>

      <div className="container-x mt-10">
        <div className="h-px w-full bg-border">
          <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-accent" />
        </div>
      </div>

      {mounted &&
        createPortal(
          <Lightbox
            images={images}
            index={index}
            onIndex={setIndex}
            onClose={() => {
              setIndex(null);
              opener.current?.focus();
            }}
          />,
          document.body,
        )}
    </section>
  );
}
