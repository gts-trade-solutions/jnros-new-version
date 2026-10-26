"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { CaseStudy, Industry, IndustrySlug } from "@/lib/data";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { CaseStudyCard } from "./CaseStudyCard";

type Filter = IndustrySlug | "all";
type Props = { studies: CaseStudy[]; industries: Industry[]; initialFilter?: Filter };

/**
 * Filterable case-study grid.
 *
 * Changing the filter animates the grid with Motion layout animations: remaining cards glide to
 * their new cells (FLIP, transform only), removed cards shrink and fade out, new ones grow in.
 * The active pill is a shared layoutId that slides between buttons. The filter is mirrored to
 * ?industry= so filtered views can be linked (the mega menu does).
 */
export function CaseStudyExplorer({ studies, industries, initialFilter = "all" }: Props) {
  const pathname = usePathname();
  const [filter, setFilter] = useState<Filter>(initialFilter);

  // Follow the URL when it changes underneath us (e.g. picking another industry in the mega menu).
  useEffect(() => setFilter(initialFilter), [initialFilter]);

  const select = (next: Filter) => {
    setFilter(next);
    window.history.replaceState(null, "", next === "all" ? pathname : `${pathname}?industry=${next}`);
  };

  const visible = filter === "all" ? studies : studies.filter((s) => s.industry === filter);
  const options: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All projects", count: studies.length },
    ...industries.map((i) => ({ value: i.slug, label: i.name, count: studies.filter((s) => s.industry === i.slug).length })),
  ];

  return (
    <LayoutGroup>
      <div role="group" aria-label="Filter by industry" className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = filter === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => select(o.value)}
              aria-pressed={active}
              disabled={o.count === 0}
              className={cn(
                "relative isolate flex h-11 items-center gap-2 rounded-xs border px-4 font-display text-base font-bold uppercase tracking-[0.06em] transition-colors duration-300 disabled:opacity-40",
                active ? "border-accent text-bg" : "border-border text-text/80 hover:border-text/40 hover:text-text",
              )}
            >
              {active && <motion.span layoutId="filter-pill" className="absolute inset-0 -z-10 bg-accent" transition={{ duration: 0.5, ease: EASE }} />}
              {o.label}
              <span className={cn("font-mono text-label", active ? "text-bg/70" : "text-muted")}>{o.count}</span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-8 font-mono text-label uppercase text-muted">
        Showing {visible.length} of {studies.length} projects
      </p>

      <motion.ul layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((study) => (
            <motion.li
              key={study.slug}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <CaseStudyCard study={study} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  );
}

/** Reads ?industry= (needs a Suspense boundary on a static page; the fallback is the unfiltered grid). */
export function CaseStudyExplorerFromUrl(props: Omit<Props, "initialFilter">) {
  const param = useSearchParams().get("industry");
  const initialFilter = props.industries.some((i) => i.slug === param) ? (param as IndustrySlug) : "all";
  return <CaseStudyExplorer {...props} initialFilter={initialFilter} />;
}
