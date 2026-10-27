"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { submitContact } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/lib/motion";
import { type ContactInput, contactSchema, type FormResult } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { describedBy, Field, inputClass } from "./Field";

type TextField = Exclude<keyof ContactInput, "website">;

/** The fields of the live contact form, in its order. */
const fields: { id: TextField; label: string; type: string; autoComplete: string; optional?: boolean }[] = [
  { id: "firstName", label: "First Name", type: "text", autoComplete: "given-name" },
  { id: "lastName", label: "Last Name", type: "text", autoComplete: "family-name", optional: true },
  { id: "email", label: "Email Address", type: "email", autoComplete: "email" },
  { id: "jobTitle", label: "Job Title", type: "text", autoComplete: "organization-title" },
  { id: "company", label: "Company Name", type: "text", autoComplete: "organization" },
  { id: "country", label: "Country", type: "text", autoComplete: "country-name" },
  { id: "phone", label: "Mobile No / Landline No", type: "tel", autoComplete: "tel" },
  { id: "altPhone", label: "Alternate No", type: "tel", autoComplete: "off", optional: true },
];

/** Contact form: inline zod validation, server action submit, animated confirmation. */
export function ContactForm() {
  const [result, setResult] = useState<FormResult | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput, unknown, z.output<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { firstName: "", lastName: "", email: "", jobTitle: "", company: "", country: "", phone: "", altPhone: "", website: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const res = await submitContact(values);
    if (!res.ok && res.fieldErrors) {
      for (const [field, messages] of Object.entries(res.fieldErrors)) {
        if (messages?.[0]) setError(field as keyof ContactInput, { message: messages[0] });
      }
    }
    if (res.ok) reset();
    setResult(res);
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {result?.ok ? (
        <motion.div
          key="done"
          role="status"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rounded-xs border border-border bg-surface p-8 sm:p-10"
        >
          <span className="grid size-14 place-items-center rounded-xs bg-accent text-bg">
            <Check aria-hidden="true" className="size-7" />
          </span>
          <h2 className="mt-8 font-display text-h3 font-extrabold uppercase">Thank you.</h2>
          <p className="mt-3 text-muted">
            Your details have been sent to Jnros Logistics. Reference <span className="font-mono text-accent">{result.reference}</span>
          </p>
          <button type="button" onClick={() => setResult(null)} className="mt-8 font-display font-bold uppercase tracking-[0.08em] text-muted hover:text-text">
            Send another
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: EASE }} className="space-y-6">
          <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {fields.map(({ id, label, type, autoComplete, optional }) => (
              <Field key={id} id={id} label={label} error={errors[id]?.message} optional={optional}>
                <input
                  id={id}
                  type={type}
                  autoComplete={autoComplete}
                  className={cn(inputClass, "h-12")}
                  aria-required={!optional}
                  aria-invalid={!!errors[id]}
                  aria-describedby={describedBy(id, errors[id])}
                  {...register(id)}
                />
              </Field>
            ))}
          </div>
          {result && !result.ok && !result.fieldErrors && (
            <p role="alert" className="rounded-xs border border-red-600/40 bg-red-600/10 p-4 text-sm text-red-700">
              {result.message}
            </p>
          )}
          <div className="flex justify-end pt-2">
            <Button type="submit" size="lg" disabled={isSubmitting} arrow={!isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                  Sending…
                </span>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
