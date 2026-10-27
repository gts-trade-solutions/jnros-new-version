import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";
type Size = "md" | "lg";

type Common = {
  variant?: Variant;
  size?: Size;
  /** Show the sliding arrow. */
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
};
type AsLink = Common & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common | "href">;
type AsButton = Common & { href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof Common>;
export type ButtonProps = AsLink | AsButton;

const base =
  "group/btn relative isolate inline-flex shrink-0 items-center justify-center gap-3 overflow-hidden rounded-xs font-display font-bold uppercase tracking-[0.08em] transition-colors duration-500 ease-brand disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

/* Light text on the deep green (4.9:1); inside data-tone="dark" it is dark slate on lime (7.4:1). */
const variants: Record<Variant, string> = {
  solid: "bg-accent text-bg",
  outline: "border border-text/25 text-text hover:border-accent hover:text-bg",
  ghost: "!h-auto !px-0 text-text hover:text-accent",
};

/** The fill layer wipes in from the left on hover. Transform only, so it never triggers layout. */
const fills: Record<Variant, string> = {
  solid: "bg-accent-hover",
  outline: "bg-accent",
  ghost: "hidden",
};

/**
 * Primary button / link. Renders <Link> for internal hrefs, <a> for external, tel: and mailto:,
 * and <button> otherwise. Server-safe; wrap in <MagneticButton> for the magnetic hover.
 */
export function Button(props: ButtonProps) {
  const { variant = "solid", size = "md", arrow = true, className, children } = props;
  const cls = cn(base, sizes[size], variants[variant], className);

  const inner = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-500 ease-brand group-hover/btn:scale-x-100",
          fills[variant],
        )}
      />
      <span className="relative">{children}</span>
      {arrow && (
        // Two stacked arrows: the first slides out to the right as the second slides in.
        <span aria-hidden="true" className="relative grid size-4 overflow-hidden">
          <ArrowRight className="col-start-1 row-start-1 size-4 transition-transform duration-500 ease-brand group-hover/btn:translate-x-[150%]" />
          <ArrowRight className="col-start-1 row-start-1 size-4 -translate-x-[150%] transition-transform duration-500 ease-brand group-hover/btn:translate-x-0" />
        </span>
      )}
    </>
  );

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, arrow: _a, className: _c, children: _ch, ...anchorProps } = props;
    // Plain <a> for external links and in-page anchors (#quote): Lenis / native smooth scroll
    // handle those, and <Link> would add a second, instant scroll.
    if (/^(https?:|tel:|mailto:|#)/.test(href)) {
      const external = href.startsWith("http");
      return (
        <a href={href} className={cls} {...(external && { target: "_blank", rel: "noopener noreferrer" })} {...anchorProps}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...anchorProps}>
        {inner}
      </Link>
    );
  }

  const { href: _h, variant: _v, size: _s, arrow: _a, className: _c, children: _ch, type = "button", ...buttonProps } = props;
  return (
    <button type={type} className={cls} {...buttonProps}>
      {inner}
    </button>
  );
}
