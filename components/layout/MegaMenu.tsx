"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, stagger, type Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { NavItem } from "@/lib/data";
import { EASE, STAGGER } from "@/lib/motion";
import { cn, pad2, textCase } from "@/lib/utils";

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
 * Desktop mega menu: a floating card aligned with the header island, just below it.
 * Opens with a clip-path reveal from the top edge down; switching between menus crossfades the
 * content inside the open card.
 */
export function MegaMenu({ item: navItem }: { item: NavItem | null }) {
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
          <div className="container-x">
            <div className="-mx-6 overflow-hidden rounded-sm border border-border bg-raised/95 shadow-[0_40px_80px_-30px_var(--shadow-color)] backdrop-blur-xl">
              <AnimatePresence mode="wait" initial={false}>
                <MegaContent key={navItem.label} mega={mega} />
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MegaContent({ mega }: { mega: NonNullable<NavItem["mega"]> }) {
  const [active, setActive] = useState<number | null>(null);
  const link = active === null ? null : mega.links[active];
  // Layer 0 is the menu's own featured image; layer i + 1 belongs to link i.
  const layers = [mega.image, ...mega.links.map((l) => l.image)];
  const visibleLayer = active === null ? 0 : active + 1;
  const two = mega.links.length > 5;

  return (
    <motion.div
      className="grid grid-cols-12 gap-10 p-8"
      variants={list}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      {/* Featured image: every link's image is stacked and preloaded; hovering crossfades to it. */}
      <motion.div variants={item} data-tone="dark" className="relative col-span-5 aspect-[5/4] overflow-hidden rounded-xs bg-surface-2">
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
              <p className={cn("font-mono text-label text-accent", textCase(mega.eyebrow))}>{link ?`${pad2((active ?? 0) + 1)} / ${mega.eyebrow}` : mega.eyebrow}</p>
              <p className="mt-3 font-display text-h3 font-extrabold uppercase">{link?.label ?? mega.headline}</p>
              <p className="mt-3 line-clamp-3 max-w-md text-sm text-text/75">{link?.description ?? mega.description}</p>
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

        <motion.div variants={item} className="mt-auto flex justify-end pt-8">
          <Link href={mega.cta.href} className="group flex shrink-0 items-center gap-2 font-display text-base font-bold uppercase tracking-[0.08em] hover:text-accent">
            {mega.cta.label}
            <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-500 ease-brand group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
