"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { aboutCounters, type aboutIntro } from "@/lib/data";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { gsap, MQ } from "@/lib/gsap";
import { DURATION, STAGGER } from "@/lib/motion";

type Props = { data: typeof aboutIntro };

/**
 * Split section.
 *
 * Left: the image column is pinned (CSS sticky, so there is no pin-spacer to re-measure) while the
 * copy scrolls past; a scrubbed clip-path "un-crops" the photo from inset(20%) to full frame as
 * the inner image eases back from 1.35x.
 *
 * Right: the first paragraph starts muted and each word darkens to full ink in reading order as
 * you scroll (opacity, scrubbed and staggered). The second paragraph and the counters rise in after.
 */
export function AboutIntro({ data }: Props) {
  const root = useRef<HTMLElement>(null);
  const [statement, ...rest] = data.paragraphs;
  const words = statement.split(" ");

  useIdleGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top 75%", end: "center center", scrub: true } })
          .fromTo("[data-uncrop]", { clipPath: "inset(20% 20% 20% 20%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, 0)
          .fromTo("[data-uncrop-img]", { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
          // Frame ticks sit at the edges, so they only arrive once the frame is nearly open.
          .from("[data-uncrop-meta]", { opacity: 0, y: 16, duration: 0.25, stagger: 0.02 }, 0.75);

        gsap.fromTo(
          "[data-hl-word]",
          { opacity: 0.45 },
          { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: "[data-hl]", start: "top 80%", end: "bottom 45%", scrub: true } },
        );

        gsap.from("[data-pillar]", {
          opacity: 0,
          y: 40,
          duration: DURATION.base,
          stagger: STAGGER.base,
          scrollTrigger: { trigger: "[data-pillars]", start: "top 85%", once: true },
        });
      });
      mm.add(MQ.reduce, () => {
        gsap.from("[data-pillar]", { opacity: 0, duration: DURATION.fast, scrollTrigger: { trigger: "[data-pillars]", start: "top 90%", once: true } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="about-heading" className="relative border-t border-border">
      <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="pt-24 lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:self-start lg:pt-0">
          <div data-uncrop className="relative aspect-[4/5] w-full overflow-hidden rounded-xs bg-surface-2 lg:aspect-auto lg:h-[78svh]">
            <div data-uncrop-img className="absolute inset-0">
              <Image src={data.image.src} alt={data.image.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            {/* Engineering-drawing corner ticks */}
            {["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((pos) => (
              <span key={pos} data-uncrop-meta aria-hidden="true" className={`absolute size-5 border-accent ${pos}`} />
            ))}
          </div>
        </div>

        <div className="pb-24 lg:py-[22svh]">
          <SectionLabel index="01">Jnros Logistics</SectionLabel>
          <SplitText id="about-heading" text={data.heading} className="mt-6 text-h2" />

          <p data-hl className="mt-12 text-[clamp(1.5rem,2.3vw,2.25rem)] font-medium leading-[1.3] tracking-[-0.01em]">
            {words.map((word, i) => (
              <span key={i}>
                <span data-hl-word>{word}</span>
                {i < words.length - 1 && " "}
              </span>
            ))}
          </p>

          <div data-pillars>
            {rest.map((p) => (
              <p key={p} data-pillar className="mt-10 text-lead text-muted">
                {p}
              </p>
            ))}
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xs border border-border bg-border">
              {aboutCounters.map((c) => (
                <div key={c.label} data-pillar className="flex flex-col bg-raised p-7 sm:p-8">
                  <dt className="order-2 mt-3 font-display text-xl font-bold uppercase tracking-[0.04em]">{c.label}</dt>
                  <dd className="order-1 font-display text-stat font-extrabold text-accent">
                    <Counter to={c.value} suffix={c.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <Button href="/about" variant="ghost" className="mt-12">
            Know More
          </Button>
        </div>
      </div>
    </section>
  );
}
