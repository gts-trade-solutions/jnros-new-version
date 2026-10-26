"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, LoaderCircle, Phone } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useRef, useState } from "react";
import { type FieldErrors, useForm, type UseFormRegister } from "react-hook-form";
import { submitQuote } from "@/app/actions";
import { useLenis } from "@/components/layout/SmoothScroll";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/lib/motion";
import { type FormResult, type QuoteInput, quoteSchema, quoteSteps, type QuoteValues } from "@/lib/schemas";
import { cn, telHref } from "@/lib/utils";
import { describedBy, Field, inputClass } from "./Field";

type Option = { value: string; label: string; number?: string };
type Props = { projectTypes: Option[]; industries: Option[]; phone: string };

const timelines: Option[] = [
  { value: "asap", label: "ASAP / emergency" },
  { value: "1-3", label: "1–3 months" },
  { value: "3-6", label: "3–6 months" },
  { value: "planning", label: "Planning / budgeting" },
];

/** Steps slide in from the side you're heading towards and out the other. */
const slide: Variants = {
  enter: (direction: number) => ({ x: direction * 56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -56, opacity: 0 }),
};

/**
 * Four-step quote request (Project → Load → Route → Contact).
 *
 * - react-hook-form + zod: fields validate inline once touched; "Continue" validates only the
 *   current step's fields and focuses the first error.
 * - The step indicator fills as you progress; steps slide horizontally in the direction of travel.
 * - Values persist across steps (fields stay registered while their step is unmounted).
 * - Submits to a server action that validates again; server-side field errors jump back to the
 *   step that contains them.
 */
export function QuoteForm({ projectTypes, industries, phone }: Props) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [result, setResult] = useState<FormResult | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const last = quoteSteps.length - 1;

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput, unknown, QuoteValues>({
    resolver: zodResolver(quoteSchema),
    mode: "onTouched",
    defaultValues: {
      projectType: "",
      industry: "",
      description: "",
      weightUnit: "lbs",
      quantity: 1,
      dimensions: "",
      pickupCity: "",
      pickupRegion: "",
      deliveryCity: "",
      deliveryRegion: "",
      startDate: "",
      siteNotes: "",
      name: "",
      company: "",
      email: "",
      phone: "",
      preferred: "email",
      website: "",
    },
  });

  /** Bring the top of the form back into view if a step change left it above the viewport. */
  const revealTop = () => {
    const el = top.current;
    if (!el || el.getBoundingClientRect().top > 0) return;
    if (lenis) lenis.scrollTo(el, { offset: -24 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // True while a step is sliding out/in. Its fields aren't mounted yet, so "Continue" must wait.
  const transitioning = useRef(false);

  const goTo = (target: number) => {
    transitioning.current = true;
    setDirection(target > step ? 1 : -1);
    setStep(target);
    revealTop();
  };

  const next = async () => {
    if (transitioning.current) return;
    const valid = await trigger([...quoteSteps[step].fields], { shouldFocus: true });
    if (valid) goTo(step + 1);
  };

  const submit = handleSubmit(async (values) => {
    setResult(null);
    const res = await submitQuote(values);
    if (!res.ok && res.fieldErrors) {
      for (const [field, messages] of Object.entries(res.fieldErrors)) {
        if (messages?.[0]) setError(field as keyof QuoteInput, { message: messages[0] });
      }
      const firstBad = quoteSteps.findIndex((s) => s.fields.some((f) => res.fieldErrors?.[f]));
      if (firstBad >= 0 && firstBad !== step) goTo(firstBad);
    }
    setResult(res);
    if (res.ok) revealTop();
  });

  if (result?.ok) return <Success reference={result.reference} phone={phone} />;

  return (
    <div ref={top}>
      {/* Step indicator */}
      <ol className="grid grid-cols-4 gap-2 sm:gap-3">
        {quoteSteps.map((s, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={s.title} aria-current={current ? "step" : undefined}>
              <div className="h-1 overflow-hidden bg-border">
                <motion.div
                  className="h-full origin-left bg-accent"
                  initial={false}
                  animate={{ scaleX: done ? 1 : current ? 0.5 : 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                />
              </div>
              <button
                type="button"
                onClick={() => done && goTo(i)}
                disabled={!done}
                className="mt-3 flex items-center gap-2 text-left disabled:cursor-default"
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-xs border font-mono text-[0.7rem] transition-colors duration-500",
                    done ? "border-accent bg-accent text-bg" : current ? "border-accent text-accent" : "border-border text-muted",
                  )}
                >
                  {done ? <Check aria-hidden="true" className="size-3.5" /> : i + 1}
                </span>
                <span className={cn("hidden font-display text-base font-bold uppercase tracking-[0.06em] sm:block", current || done ? "text-text" : "text-muted")}>
                  {s.title}
                  {done && <span className="sr-only"> (completed, select to edit)</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p aria-live="polite" className="sr-only">
        Step {step + 1} of {quoteSteps.length}: {quoteSteps[step].title}
      </p>

      <form
        noValidate
        className="mt-10"
        onSubmit={(e) => {
          // Enter on an intermediate step means "continue", not "submit everything".
          if (step < last) {
            e.preventDefault();
            void next();
            return;
          }
          void submit(e);
        }}
      >
        {/* Honeypot: off-screen, not focusable, ignored by people and assistive tech. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.fieldset
              key={step}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: EASE }}
              onAnimationComplete={(definition) => {
                if (definition === "center") transitioning.current = false;
              }}
              className="space-y-8"
            >
              <legend className="mb-8 font-display text-h3 font-extrabold uppercase">
                <span className="mr-3 font-mono text-label font-normal text-accent">0{step + 1}</span>
                {["What are we moving for you?", "Tell us about the load.", "From where, to where?", "How do we reach you?"][step]}
              </legend>
              {step === 0 && <StepProject register={register} errors={errors} projectTypes={projectTypes} industries={industries} />}
              {step === 1 && <StepLoad register={register} errors={errors} />}
              {step === 2 && <StepRoute register={register} errors={errors} />}
              {step === 3 && <StepContact register={register} errors={errors} />}
            </motion.fieldset>
          </AnimatePresence>
        </div>

        {result && !result.ok && !result.fieldErrors && (
          <p role="alert" className="mt-8 rounded-xs border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200">
            {result.message}
          </p>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} className="flex items-center gap-2 font-display text-base font-bold uppercase tracking-[0.08em] text-muted transition-colors hover:text-text">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back
            </button>
          ) : (
            <span className="font-mono text-label uppercase text-muted">Takes about 2 minutes</span>
          )}
          {step < last ? (
            <Button type="submit" size="lg">
              Continue
            </Button>
          ) : (
            <Button type="submit" size="lg" disabled={isSubmitting} arrow={!isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                  Sending…
                </span>
              ) : (
                "Request my quote"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

type StepProps = { register: UseFormRegister<QuoteInput>; errors: FieldErrors<QuoteInput> };

function StepProject({ register, errors, projectTypes, industries }: StepProps & { projectTypes: Option[]; industries: Option[] }) {
  return (
    <>
      <fieldset>
        <legend className="mb-3 font-mono text-label uppercase text-muted">Project type</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" aria-describedby={errors.projectType ? "projectType-error" : undefined}>
          {projectTypes.map((o) => (
            <label key={o.value} className="relative block cursor-pointer">
              <input type="radio" value={o.value} {...register("projectType")} className="peer sr-only" />
              <span className="flex h-full items-center gap-3 rounded-xs border border-border bg-surface p-4 transition-colors duration-300 hover:border-text/30 peer-checked:border-accent peer-checked:bg-accent/10 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                {o.number && <span className="font-mono text-label text-accent">{o.number}</span>}
                <span className="font-display text-lg font-bold uppercase leading-tight">{o.label}</span>
              </span>
              <Check aria-hidden="true" className="pointer-events-none absolute right-3 top-3 size-4 text-accent opacity-0 transition-opacity peer-checked:opacity-100" />
            </label>
          ))}
        </div>
        {errors.projectType && (
          <p id="projectType-error" role="alert" className="mt-2 text-sm text-red-300">
            {errors.projectType.message}
          </p>
        )}
      </fieldset>

      <div className="grid gap-6 md:grid-cols-2">
        <Field id="industry" label="Industry" optional>
          <select id="industry" className={cn(inputClass, "h-12")} {...register("industry")}>
            <option value="">Select an industry</option>
            {industries.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
        </Field>

        <fieldset>
          <legend className="mb-2 font-mono text-label uppercase text-muted">Timeline</legend>
          <div className="flex flex-wrap gap-2" aria-describedby={errors.timeline ? "timeline-error" : undefined}>
            {timelines.map((o) => (
              <label key={o.value} className="cursor-pointer">
                <input type="radio" value={o.value} {...register("timeline")} className="peer sr-only" />
                <span className="block rounded-xs border border-border px-3 py-2.5 text-sm transition-colors hover:border-text/30 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-bg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                  {o.label}
                </span>
              </label>
            ))}
          </div>
          {errors.timeline && (
            <p id="timeline-error" role="alert" className="mt-2 text-sm text-red-300">
              {errors.timeline.message}
            </p>
          )}
        </fieldset>
      </div>
    </>
  );
}

function StepLoad({ register, errors }: StepProps) {
  return (
    <>
      <Field id="description" label="What needs moving?" error={errors.description?.message} hint="Equipment type, make/model, crated or uncrated, anything unusual.">
        <textarea
          id="description"
          rows={4}
          className={cn(inputClass, "py-3")}
          aria-invalid={!!errors.description}
          aria-describedby={describedBy("description", errors.description, "hint")}
          placeholder="e.g. Two 40-ton injection molding machines and auxiliary equipment"
          {...register("description")}
        />
      </Field>
      <div className="grid gap-6 md:grid-cols-3">
        <Field id="weight" label="Approx. weight (each)" error={errors.weight?.message} className="md:col-span-2">
          <div className="flex gap-2">
            <div className="min-w-0 flex-1">
              <input
                id="weight"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                className={cn(inputClass, "h-12")}
                aria-invalid={!!errors.weight}
                aria-describedby={describedBy("weight", errors.weight)}
                placeholder="80000"
                {...register("weight", { valueAsNumber: true })}
              />
            </div>
            <div className="w-28 shrink-0">
              <select aria-label="Weight unit" className={cn(inputClass, "h-12")} {...register("weightUnit")}>
                <option value="lbs">lbs</option>
                <option value="tons">tons</option>
              </select>
            </div>
          </div>
        </Field>
        <Field id="quantity" label="Pieces" error={errors.quantity?.message}>
          <input
            id="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            className={cn(inputClass, "h-12")}
            aria-invalid={!!errors.quantity}
            aria-describedby={describedBy("quantity", errors.quantity)}
            {...register("quantity", { valueAsNumber: true })}
          />
        </Field>
      </div>
      <Field id="dimensions" label="Dimensions (L × W × H)" optional hint="Feet or meters, whatever you have." error={errors.dimensions?.message}>
        <input id="dimensions" type="text" className={cn(inputClass, "h-12")} aria-describedby={describedBy("dimensions", errors.dimensions, "hint")} placeholder="42 × 12 × 14 ft" {...register("dimensions")} />
      </Field>
    </>
  );
}

function StepRoute({ register, errors }: StepProps) {
  const text = (id: "pickupCity" | "pickupRegion" | "deliveryCity" | "deliveryRegion", label: string, autoComplete: string) => (
    <Field id={id} label={label} error={errors[id]?.message}>
      <input
        id={id}
        type="text"
        autoComplete={autoComplete}
        className={cn(inputClass, "h-12")}
        aria-invalid={!!errors[id]}
        aria-describedby={describedBy(id, errors[id])}
        {...register(id)}
      />
    </Field>
  );
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {text("pickupCity", "Pickup city", "off")}
        {text("pickupRegion", "Pickup state / province", "off")}
        {text("deliveryCity", "Delivery city", "off")}
        {text("deliveryRegion", "Delivery state / province", "off")}
      </div>
      <p className="-mt-2 text-sm text-muted">Moving within one facility? Enter the same city twice.</p>
      <div className="grid gap-6 md:grid-cols-3">
        <Field id="startDate" label="Target start date" optional>
          <input id="startDate" type="date" className={cn(inputClass, "h-12 [color-scheme:dark]")} {...register("startDate")} />
        </Field>
        <Field id="siteNotes" label="Site notes" optional className="md:col-span-2" error={errors.siteNotes?.message}>
          <textarea
            id="siteNotes"
            rows={3}
            className={cn(inputClass, "py-3")}
            placeholder="Access, headroom, floor loading, working hours, union site…"
            {...register("siteNotes")}
          />
        </Field>
      </div>
    </>
  );
}

function StepContact({ register, errors }: StepProps) {
  const text = (id: "name" | "company" | "email" | "phone", label: string, type: string, autoComplete: string) => (
    <Field id={id} label={label} error={errors[id]?.message}>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        className={cn(inputClass, "h-12")}
        aria-invalid={!!errors[id]}
        aria-describedby={describedBy(id, errors[id])}
        {...register(id)}
      />
    </Field>
  );
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {text("name", "Full name", "text", "name")}
        {text("company", "Company", "text", "organization")}
        {text("email", "Work email", "email", "email")}
        {text("phone", "Phone", "tel", "tel")}
      </div>
      <fieldset>
        <legend className="mb-2 font-mono text-label uppercase text-muted">Preferred contact</legend>
        <div className="flex gap-2">
          {(["email", "phone"] as const).map((v) => (
            <label key={v} className="cursor-pointer">
              <input type="radio" value={v} {...register("preferred")} className="peer sr-only" />
              <span className="block rounded-xs border border-border px-4 py-2.5 text-sm capitalize transition-colors hover:border-text/30 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-bg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                {v}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-text/80">
          <input
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 accent-[var(--accent)]"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            {...register("consent")}
          />
          Jnros may contact me about this request. We never share your details.
        </label>
        {errors.consent && (
          <p id="consent-error" role="alert" className="mt-2 text-sm text-red-300">
            {errors.consent.message}
          </p>
        )}
      </div>
    </>
  );
}

function Success({ reference, phone }: { reference: string; phone: string }) {
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="rounded-xs border border-border bg-surface p-8 sm:p-12"
    >
      <motion.span
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
        className="grid size-16 place-items-center rounded-xs bg-accent text-bg"
      >
        <Check aria-hidden="true" className="size-8" />
      </motion.span>
      <h2 className="mt-8 font-display text-h2 font-extrabold uppercase">Request received.</h2>
      <p className="mt-4 max-w-xl text-lead text-muted">
        A project engineer will review your details and get back to you within one business day, usually sooner.
      </p>
      <p className="mt-8 font-mono text-label uppercase text-muted">
        Reference <span className="ml-2 text-accent">{reference}</span>
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Button href="/case-studies" variant="outline">
          Browse case studies
        </Button>
        <a href={telHref(phone)} className="flex items-center gap-2 font-display text-lg font-bold hover:text-accent">
          <Phone aria-hidden="true" className="size-4" />
          Urgent? {phone}
        </a>
      </div>
    </motion.div>
  );
}
