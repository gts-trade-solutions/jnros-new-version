import { cn } from "@/lib/utils";

/**
 * Small mono label that opens most sections: "01 / INDUSTRIAL SERVICES".
 * The tick before it is a two-tone hazard chip, the only place safety yellow appears in labels.
 */
export function SectionLabel({ index, children, className }: { index?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-3 font-mono text-label uppercase text-muted", className)}>
      <span aria-hidden="true" className="hazard inline-block h-2.5 w-4 rounded-[1px]" />
      {index && (
        <>
          <span className="text-accent">{index}</span>
          <span aria-hidden="true">/</span>
        </>
      )}
      <span>{children}</span>
    </p>
  );
}
