"use client";

import { ArrowUpRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { NavItem } from "@/lib/data";
import { EASE } from "@/lib/motion";
import { cn, telHref } from "@/lib/utils";
import { MegaMenu, type Teaser } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { useLenis } from "./SmoothScroll";

type Props = {
  nav: NavItem[];
  teasers: Record<string, Teaser>;
  phone: string;
  storeUrl: string;
  socials: readonly { label: string; href: string; icon: string }[];
};

/** Utility bar height in px; the header slides up by this much once the page is scrolled. */
const UTILITY_H = 40;

/**
 * Fixed site header.
 *
 * - Transparent over the hero. Once scrolled it "shrinks": the utility bar slides away, the logo
 *   scales down and a blurred dark backdrop fades in (transform + opacity only).
 * - Hides on scroll down, reveals on scroll up (Motion useScroll, direction from the previous value).
 * - Desktop mega menus open on hover (with a short close delay so diagonal mouse paths don't drop
 *   them) or from the chevron buttons for keyboard users; Escape closes.
 */
export function Header({ nav, teasers, phone, storeUrl, socials }: Props) {
  const pathname = usePathname();
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef(0);
  const headerRef = useRef<HTMLElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? y;
    setScrolled(y > 24);
    if (mega || mobileOpen) return setHidden(false);
    if (Math.abs(y - prev) < 4) return;
    setHidden(y > prev && y > 320);
  });

  // Close everything on navigation.
  useEffect(() => {
    setMega(null);
    setMobileOpen(false);
  }, [pathname]);

  // Mobile menu: freeze page scroll underneath.
  useEffect(() => {
    if (!mobileOpen) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen, lenis]);

  // Escape closes the mega menu and returns focus to its trigger.
  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      headerRef.current?.querySelector<HTMLButtonElement>(`[data-mega-trigger="${mega}"]`)?.focus();
      setMega(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mega]);

  const open = useCallback((label: string) => {
    window.clearTimeout(closeTimer.current);
    setMega(label);
  }, []);
  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(null), 180);
  }, []);

  const activeItem = nav.find((item) => item.label === mega) ?? null;
  const solid = scrolled || !!mega;

  return (
    <>
      <motion.header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50"
        initial={false}
        animate={{ y: hidden ? "-100%" : scrolled && !mobileOpen ? -UTILITY_H : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        onPointerEnter={() => window.clearTimeout(closeTimer.current)}
        onPointerLeave={scheduleClose}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMega(null);
        }}
      >
        {/* Utility bar */}
        <div className="h-10 border-b border-text/[0.06] text-sm" style={{ height: UTILITY_H }}>
          <div className="container-x flex h-full items-center justify-between gap-6">
            <p className="hidden items-center gap-2.5 font-mono text-label uppercase text-muted sm:flex">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full rounded-full bg-accent opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              24/7 emergency dispatch
            </p>
            <ul className="ml-auto flex items-center gap-5 font-mono text-label uppercase">
              <li>
                <a href={telHref(phone)} className="flex items-center gap-2 text-text transition-colors hover:text-accent">
                  <Phone aria-hidden="true" className="size-3.5" />
                  {phone}
                </a>
              </li>
              <li>
                <Link href="/careers" className="text-muted transition-colors hover:text-text">
                  Careers
                </Link>
              </li>
              <li>
                <a href={storeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-muted transition-colors hover:text-text">
                  Store
                  <ArrowUpRight aria-hidden="true" className="size-3" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Main bar */}
        <div className="relative h-[var(--nav-h)]">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 border-b border-border bg-bg/80 backdrop-blur-xl"
            initial={false}
            animate={{ opacity: solid && !mobileOpen ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          />
          <div className="container-x relative flex h-full items-center justify-between gap-6">
            <Link href="/" className="shrink-0">
              <motion.span className="block origin-left" initial={false} animate={{ scale: scrolled ? 0.88 : 1 }} transition={{ duration: 0.5, ease: EASE }}>
                <Logo />
              </motion.span>
            </Link>

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {nav.map((item) => {
                  const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const expanded = mega === item.label;
                  return (
                    <li key={item.label} className="flex items-center" onPointerEnter={() => (item.mega ? open(item.label) : setMega(null))}>
                      <Link
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        className={cn("group relative py-2 pl-3 font-display text-[1.05rem] font-semibold uppercase tracking-[0.06em]", item.mega ? "pr-1" : "pr-3")}
                      >
                        <span className={cn("transition-colors", (expanded || current) && "text-accent")}>{item.label}</span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute bottom-1 left-3 h-px origin-left bg-accent transition-transform duration-500 ease-brand",
                            item.mega ? "right-1" : "right-3",
                            current || expanded ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                          )}
                        />
                      </Link>
                      {item.mega && (
                        <button
                          type="button"
                          data-mega-trigger={item.label}
                          aria-expanded={expanded}
                          aria-controls="mega-panel"
                          aria-label={`${item.label} menu`}
                          onClick={() => setMega(expanded ? null : item.label)}
                          className="grid size-7 place-items-center text-muted transition-colors hover:text-text"
                        >
                          <ChevronDown aria-hidden="true" className={cn("size-3.5 transition-transform duration-300", expanded && "rotate-180")} />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              {/* Hidden on phones, where the menu carries the quote button. */}
              <div className="hidden sm:block">
                <MagneticButton href="/get-a-quote" size="md" arrow={false}>
                  Get a Quote
                </MagneticButton>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="grid size-12 place-items-center rounded-xs border border-text/15 lg:hidden"
              >
                {mobileOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
              </button>
            </div>
          </div>
        </div>

        <MegaMenu item={activeItem} teasers={teasers} />
      </motion.header>

      <MobileMenu open={mobileOpen} nav={nav} phone={phone} socials={socials} onClose={() => setMobileOpen(false)} />
    </>
  );
}
