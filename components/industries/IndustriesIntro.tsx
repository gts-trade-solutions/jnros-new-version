"use client";

import { Fragment, useRef } from "react";
import { GridLines } from "@/components/ui/GridLines";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { useIdleGSAP } from "@/hooks/useIdleGSAP";
import { gsap, MQ } from "@/lib/gsap";
import type { industriesPage } from "@/lib/industries";

type Props = typeof industriesPage.intro;

/**
 * "Expert engineers and advanced equipment…": heading, then two large paragraphs.
 *
 * Word-by-word highlight: every word is rendered in sage with an identical cream copy stacked on
 * top (aria-hidden). Scrolling scrubs the cream copies' opacity in reading order (GSAP, staggered),
 * so each word turns from sage to cream using opacity alone, never an animated colour. With reduced
 * motion the cream copy is simply shown (globals.css).
 */
export function IndustriesIntro({ heading, paragraphs }: Props) {
  const root = useRef<HTMLElement>(null);

  useIdleGSAP(
    () => {
      gsap.matchMedia().add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-scrub-paragraph]").forEach((p) => {
          gsap.fromTo(
            p.querySelectorAll("[data-word-on]"),
            { opacity: 0 },
            { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: p, start: "top 82%", end: "bottom 48%", scrub: true } },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="who-we-serve" aria-labelledby="intro-heading" className="relative isolate bg-forest-950 py-24 lg:py-36">
      <GridLines className="-z-10" />
      <div className="container-x">
        <div className="max-w-5xl">
          <SectionLabel index="01">Who we serve</SectionLabel>
          <SplitText id="intro-heading" text={heading} accent={["seamless"]} className="mt-6 text-h2" />
        </div>

        <div className="mt-14 space-y-10 lg:ml-[33.333%] lg:mt-20">
          {paragraphs.map((text) => (
            <p key={text} data-scrub-paragraph className="text-[clamp(1.375rem,2.2vw,2.125rem)] font-medium leading-[1.35] tracking-[-0.01em] text-sage">
              {text.split(" ").map((word, i, words) => (
                <Fragment key={i}>
                  {/* nowrap: a word that broke at its hyphen would leave the absolutely positioned
                      overlay unbroken and spilling past the viewport. */}
                  <span className="relative whitespace-nowrap">
                    {word}
                    <span data-word-on aria-hidden="true" className="pointer-events-none absolute inset-0 select-none text-cream opacity-0">
                      {word}
                    </span>
                  </span>
                  {i < words.length - 1 && " "}
                </Fragment>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
