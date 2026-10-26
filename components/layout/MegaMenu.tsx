"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, stagger, type Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Img, NavItem } from "@/lib/data";
import { EASE, STAGGER } from "@/lib/motion";
import { cn, pad2 } from "@/lib/utils";

export type Teaser = { slug: string; title: string; location: string; weight: string; image: Img };

/** Items rise in at 40ms intervals once the panel has started opening. */
const list: Variants = {
  hidden: {},
  show: { transition: { delayChildren: stagger(STAGGER.menu, { startDelay: 0.18 }) } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/**
 * Full-width desktop mega menu panel.
 * Opens with a clip-path reveal from the top edge down; switching between menus crossfades the
 * content inside the open panel.
 */
export function MegaMenu({ item: navItem, teasers }: { item: NavItem | null; teasers: Record<string, Teaser> }) {
  const mega = navItem?.mega;
  return (
    <AnimatePresence>
      {mega && (
        <motion.div
          id="mega-panel"
          key="mega-panel"
          className="absolute inset-x-0 top-full hidden lg:block"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <div className="border-b border-border bg-surface/95 shadow-[0_40px_80px_-20px_rgb(0_0_0/0.7)] backdrop-blur-xl">
            <AnimatePresence mode="wait" initial={false}>
              <MegaContent key={navItem.label} mega={mega} teasers={teasers} />
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MegaContent({ mega, teasers }: { mega: NonNullable<NavItem["mega"]>; teasers: Record<string, Teaser> }) {
  const [active, setActive] = useState<number | null>(null);
  const link = active === null ? null : mega.links[active];
  // Layer 0 is the menu's own featured image; layer i + 1 belongs to link i.
  const layers = [mega.image, ...mega.links.map((l) => l.image)];
  const visibleLayer = active === null ? 0 : active + 1;
  const teaserSlug = link?.teaser ?? mega.links.find((l) => l.teaser)?.teaser;
  const teaser = teaserSlug ? teasers[teaserSlug] : undefined;
  const two = mega.links.length > 5;

  return (
    <motion.div
      className="container-x grid grid-cols-12 gap-10 py-10"
      variants={list}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      {/* Featured image: every link's image is stacked and preloaded; hovering crossfades to it. */}
      <motion.div variants={item} className="relative col-span-5 aspect-[5/4] overflow-hidden rounded-xs bg-surface-2">
        {layers.map((img, i) => (
          <motion.div
            key={`${img.src}-${i}`}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === visibleLayer ? 1 : 0, scale: i === visibleLayer ? 1 : 1.06 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Image src={img.src} alt="" fill sizes="40vw" className="object-cover" />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={link?.label ?? "default"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <p className="font-mono text-label uppercase text-accent">{link ? `${pad2((active ?? 0) + 1)} / ${mega.eyebrow}` : mega.eyebrow}</p>
              <p className="mt-3 font-display text-h3 font-extrabold uppercase">{link?.label ?? mega.headline}</p>
              <p className="mt-3 max-w-md text-sm text-text/75">{link?.description ?? mega.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="col-span-7 flex flex-col">
        <ul className={cn("grid gap-x-8 border-t border-border", two && "grid-cols-2")} onPointerLeave={() => setActive(null)}>
          {mega.links.map((l, i) => (
            <motion.li key={l.href} variants={item} className="border-b border-border">
              <Link
                href={l.href}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group flex items-center gap-4 py-3.5"
              >
                <span className={cn("font-mono text-label transition-colors", active === i ? "text-accent" : "text-muted")}>{pad2(i + 1)}</span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block font-display text-xl font-bold uppercase leading-tight transition-colors", active === i && "text-accent")}>{l.label}</span>
                  <span className="block truncate text-sm text-muted">{l.description}</span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className={cn(
                    "size-4 shrink-0 transition duration-500 ease-brand",
                    active === i ? "translate-x-0 rotate-45 text-accent opacity-100" : "-translate-x-2 opacity-0",
                  )}
                />
              </Link>
            </motion.li>
          ))}
        </ul>

        <motion.div variants={item} className="mt-auto flex items-end justify-between gap-6 pt-8">
          <div className="min-h-[5.5rem] flex-1">
            <AnimatePresence mode="wait" initial={false}>
              {teaser && (
                <motion.div
                  key={teaser.slug}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <Link
                    href={`/case-studies/${teaser.slug}`}
                    className="group flex items-center gap-5 rounded-xs border border-border bg-bg/50 p-2.5 pr-6 transition-colors hover:border-accent/60"
                  >
                    <span className="relative h-[4.25rem] w-24 shrink-0 overflow-hidden rounded-[2px]">
                      <Image src={teaser.image.src} alt="" fill sizes="96px" className="object-cover transition-transform duration-700 ease-brand group-hover:scale-110" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-label uppercase text-muted">Case study · {teaser.location}</span>
                      <span className="mt-1 block truncate font-display text-lg font-bold uppercase">{teaser.title}</span>
                    </span>
                    <span className="shrink-0 font-display text-2xl font-extrabold text-accent">{teaser.weight}</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link href={mega.cta.href} className="group flex shrink-0 items-center gap-2 font-display text-base font-bold uppercase tracking-[0.08em] hover:text-accent">
            {mega.cta.label}
            <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-500 ease-brand group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
