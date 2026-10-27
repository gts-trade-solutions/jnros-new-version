"use client";

import { ArrowRight, Plus } from "lucide-react";
import { AnimatePresence, motion, stagger, type Variants } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SocialIcon } from "@/components/ui/SocialIcon";
import type { NavItem, SocialIcon as SocialIconName } from "@/lib/data";
import { EASE, STAGGER } from "@/lib/motion";
import { cn, telHref } from "@/lib/utils";

const list: Variants = {
  hidden: {},
  show: { transition: { delayChildren: stagger(STAGGER.base, { startDelay: 0.25 }) } },
};
/** Each link rises out of its own overflow-hidden mask. */
const rise: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.8, ease: EASE } },
};
const fade: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.55 } },
};

type Props = {
  open: boolean;
  nav: NavItem[];
  phone: string;
  socials: readonly { label: string; href: string; icon: SocialIconName }[];
  onClose: () => void;
};

/**
 * Full-screen mobile menu. The overlay wipes down (clip-path), links rise in with a stagger, and
 * sections with sub-pages expand as accordions; rows below slide out of the way with Motion's
 * layout animation (transforms, not height).
 */
export function MobileMenu({ open, nav, phone, socials, onClose }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setExpanded(null);
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // Move focus into the dialog.
    const id = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("a, button")?.focus(), 50);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-40 bg-bg lg:hidden"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.5, ease: EASE } }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div aria-hidden="true" className="hazard absolute inset-x-0 bottom-0 h-1.5" />
          <div data-lenis-prevent className="flex h-full flex-col overflow-y-auto pb-10 pt-[calc(var(--utility-h)+var(--nav-h)+1rem)]">
            <motion.ul className="container-x" variants={list} initial="hidden" animate="show">
              {nav.map((item, i) => {
                const isOpen = expanded === item.label;
                const current = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <motion.li key={item.label} layout="position" transition={{ layout: { duration: 0.5, ease: EASE } }} className="border-b border-border">
                    <div className="flex items-center justify-between gap-4">
                      <span className="block overflow-hidden py-3">
                        <motion.span variants={rise} className="block">
                          <Link
                            href={item.href}
                            onClick={onClose}
                            aria-current={current ? "page" : undefined}
                            className={cn("flex items-baseline gap-3 font-display text-[2.6rem] font-extrabold uppercase leading-none", current && "text-accent")}
                          >
                            <span className="font-mono text-label font-normal text-accent">{String(i + 1).padStart(2, "0")}</span>
                            {item.label}
                          </Link>
                        </motion.span>
                      </span>
                      {item.mega && (
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : item.label)}
                          aria-expanded={isOpen}
                          aria-controls={`mobile-sub-${i}`}
                          aria-label={`${isOpen ? "Hide" : "Show"} ${item.label} pages`}
                          className="grid size-11 shrink-0 place-items-center rounded-xs border border-border"
                        >
                          <Plus aria-hidden="true" className={cn("size-5 transition-transform duration-500 ease-brand", isOpen && "rotate-45 text-accent")} />
                        </button>
                      )}
                    </div>
                    <AnimatePresence initial={false}>
                      {item.mega && isOpen && (
                        <motion.ul
                          id={`mobile-sub-${i}`}
                          className="grid gap-1 pb-5 sm:grid-cols-2"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, transition: { duration: 0.15 } }}
                          transition={{ duration: 0.45, ease: EASE }}
                        >
                          {item.mega.links.map((l) => (
                            <li key={l.href}>
                              <Link href={l.href} onClick={onClose} className="group flex items-center justify-between gap-3 py-2 text-lg text-text/80 hover:text-accent">
                                {l.label}
                                <ArrowRight aria-hidden="true" className="size-4 text-muted group-hover:text-accent" />
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </motion.ul>

            <motion.div className="container-x mt-auto space-y-6 pt-10" variants={fade} initial="hidden" animate="show">
              <Button href="/contact" size="lg" className="w-full" onClick={onClose}>
                Contact Us
              </Button>
              <div className="flex items-center justify-between gap-4">
                <a href={telHref(phone)} className="font-display text-2xl font-bold">
                  {phone}
                </a>
                <ul className="flex gap-2">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid size-10 place-items-center rounded-xs border border-border">
                        <SocialIcon name={s.icon} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
