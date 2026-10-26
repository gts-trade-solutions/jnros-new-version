"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import type { expertise as expertiseData, pillars as pillarsData } from "@/lib/data";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { gsap, MQ } from "@/lib/gsap";
import { DURATION, STAGGER } from "@/lib/motion";

type Props = { data: typeof expertiseData; pillars: typeof pillarsData };

/**
 * Split section.
 *
 * Left: the image column is pinned (CSS sticky, so there is no pin-spacer to re-measure) while the
 * copy scrolls past; a scrubbed clip-path "un-crops" the photo from inset(20%) to full frame as
 * the inner image eases back from 1.35x.
 *
 * Right: the statement starts muted and each word brightens to white in reading order as you
 * scroll (opacity, scrubbed and staggered). The four value pillars rise in after it.
 */
export function Expertise({ data, pillars }: Props) {
  const root = useRef<HTMLElement>(null);
  const words = data.statement.split(" ");

  useIdleGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top 75%", end: "center center", scrub: true } })
          .fromTo("[data-uncrop]", { clipPath: "inset(20% 20% 20% 20%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, 0)
          .fromTo("[data-uncrop-img]", { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
          // Frame ticks and the badge sit at the edges, so they only arrive once the frame is nearly open.
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
    <section ref={root} aria-labelledby="expertise-heading" className="relative border-t border-border">
      <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="pt-24 lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:self-start lg:pt-0">
          <div data-uncrop className="relative aspect-[4/5] w-full overflow-hidden rounded-xs bg-surface-2 lg:aspect-auto lg:h-[78svh]">
            <div data-uncrop-img className="absolute inset-0">
              <Image src={data.image.src} alt={data.image.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
            {/* Engineering-drawing corner ticks */}
            {["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((pos) => (
              <span key={pos} data-uncrop-meta aria-hidden="true" className={`absolute size-5 border-accent ${pos}`} />
            ))}
            <div data-uncrop-meta className="absolute bottom-8 left-8 right-8 flex items-end justify-between gap-6">
              <div>
                <p className="font-display text-5xl font-extrabold leading-none text-accent">{data.badge.value}</p>
                <p className="mt-2 font-mono text-label uppercase text-text/80">{data.badge.label}</p>
              </div>
              <p className="hidden font-mono text-label uppercase text-text/60 sm:block">Est. 1984</p>
            </div>
          </div>
        </div>

        <div className="pb-24 lg:py-[22svh]">
          <SectionLabel index="02">{data.label}</SectionLabel>
          <SplitText id="expertise-heading" text={data.heading} className="mt-6 text-h2" />

          <p data-hl className="mt-12 text-[clamp(1.5rem,2.3vw,2.25rem)] font-medium leading-[1.3] tracking-[-0.01em]">
            {words.map((word, i) => (
              <span key={i}>
                <span data-hl-word>{word}</span>
                {i < words.length - 1 && " "}
              </span>
            ))}
          </p>

          <ul data-pillars className="mt-20 grid gap-px overflow-hidden rounded-xs border border-border bg-border sm:grid-cols-2">
            {pillars.map((p) => (
              <li key={p.title} data-pillar className="bg-bg p-7 sm:p-8">
                <Icon name={p.icon} className="size-8 text-accent" />
                <h3 className="mt-8 font-display text-h4 font-extrabold uppercase">{p.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{p.text}</p>
              </li>
            ))}
          </ul>

          <Button href="/about" variant="ghost" className="mt-12">
            About Jnros
          </Button>
        </div>
      </div>
    </section>
  );
}
