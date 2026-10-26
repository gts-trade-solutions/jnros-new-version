import { cn } from "@/lib/utils";

/** Shared input styling: dark surface, hairline border, lime focus. */
export const inputClass =
  "block w-full rounded-xs border border-border bg-surface px-4 text-base text-text placeholder:text-muted transition-colors duration-300 hover:border-text/25 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 focus-visible:outline-none aria-[invalid=true]:border-red-400/70";

type Props = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Label + control + hint/error. The control should set aria-invalid and
 * aria-describedby={describedBy(id, …)} so screen readers announce the message.
 */
export function Field({ id, label, error, hint, optional, className, children }: Props) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-4 font-mono text-label uppercase text-muted">
        {label}
        {optional && <span className="normal-case tracking-normal text-muted">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-300">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-sm text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export const describedBy = (id: string, error?: unknown, hint?: string) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);
