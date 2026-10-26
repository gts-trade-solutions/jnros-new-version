"use client";

import { ChevronDown, CircleAlert } from "lucide-react";
import { useAnimate } from "motion/react";
import { useEffect, useRef } from "react";
import { get, type Path, type RegisterOptions, useFormContext } from "react-hook-form";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { IndustryQuoteInput } from "@/lib/industry-quote";
import { cn } from "@/lib/utils";

type Props = {
  name: Path<IndustryQuoteInput>;
  label: string;
  required?: boolean;
  as?: "input" | "textarea" | "select";
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  /** Real placeholder (textarea); shown only while focused so it never overlaps the label. */
  placeholder?: string;
  options?: { value: string; label: string }[];
  rules?: RegisterOptions<IndustryQuoteInput>;
  /** Bumped by the form on every failed Continue/Submit, so fields still in error shake again. */
  attempt: number;
  className?: string;
};

const controlClass =
  "peer block w-full rounded-none border-0 border-b border-line bg-transparent px-0 pb-2.5 pt-2 text-base text-cream outline-none [color-scheme:dark] focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-lime-bright/60";

/** Label sits inside the field, then floats up (transform only) on focus or once there's a value. */
const labelFloat =
  "peer-focus:-translate-y-7 peer-focus:scale-90 peer-focus:text-lime peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-90";

/**
 * Floating-label field for the Industries quote form (react-hook-form via context).
 * - The label floats on focus / when filled, and a lime underline grows from the centre (scaleX).
 * - When the field has an error it shakes gently (x: 0 → -6 → 6 → -4 → 4 → 0) and the message is
 *   announced (role="alert", linked with aria-describedby).
 * Selects and dates always show a value, so their label is always floated.
 */
export function FloatingField({ name, label, required, as = "input", type = "text", autoComplete, inputMode, placeholder, options, rules, attempt, className }: Props) {
  const {
    register,
    trigger,
    getFieldState,
    formState: { errors },
  } = useFormContext<IndustryQuoteInput>();
  const error = (get(errors, name) as { message?: string } | undefined)?.message;
  const id = `iq-${name.replace(/\./g, "-")}`;
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduced = useReducedMotion();
  const mounted = useRef(false);

  useEffect(() => {
    // Skip the first run so revisiting a step doesn't shake fields that were already flagged.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (error && !reduced && scope.current) animate(scope.current, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.45, ease: "easeInOut" });
  }, [error, attempt, reduced, animate, scope]);

  const floated = as === "select" || type === "date";
  const a11y = {
    id,
    "aria-invalid": !!error,
    "aria-required": required || undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    ...register(name, {
      ...rules,
      // A field flagged on submit re-checks as you type, so its message clears while you fix it.
      // Waiting for blur would clear it on the mousedown of the next click, shifting the layout
      // under the pointer and swallowing that click. (Touched fields already re-check on change.)
      // Destination fields re-check the whole address: it's only required once any part is filled
      // in, so emptying it again clears every destination error at once.
      onChange: (event) => {
        rules?.onChange?.(event);
        if (name.startsWith("destination.")) {
          if (getFieldState("destination").invalid) void trigger("destination");
          return;
        }
        const state = getFieldState(name);
        if (state.error && !state.isTouched) void trigger(name);
      },
    }),
  };

  return (
    <div ref={scope} className={className}>
      <div className="relative pt-5">
        {as === "textarea" ? (
          <textarea {...a11y} rows={4} placeholder={placeholder ?? " "} className={cn(controlClass, "min-h-28 resize-y placeholder:text-transparent focus:placeholder:text-sage")} />
        ) : as === "select" ? (
          <>
            <select {...a11y} className={cn(controlClass, "appearance-none pr-8")}>
              {options?.map((o) => (
                <option key={o.value} value={o.value} className="bg-forest-900">
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute bottom-3 right-0 size-4 text-sage" />
          </>
        ) : (
          <input {...a11y} type={type} placeholder=" " autoComplete={autoComplete} inputMode={inputMode} className={controlClass} />
        )}
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-0 top-[1.95rem] origin-left font-mono text-label uppercase text-sage transition-transform duration-300 ease-brand",
            floated ? "-translate-y-7 scale-90" : labelFloat,
          )}
        >
          {label}
          {required && <span aria-hidden="true" className="text-lime"> *</span>}
        </label>
        {/* Focus underline: grows from the centre. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-center scale-x-0 bg-lime transition-transform duration-500 ease-brand peer-focus:scale-x-100" />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-lime-bright">
          <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
