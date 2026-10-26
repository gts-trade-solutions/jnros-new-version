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

const topics = [
  { value: "project", label: "A new project" },
  { value: "service", label: "An existing job" },
  { value: "careers", label: "Careers" },
  { value: "media", label: "Media & press" },
  { value: "other", label: "Something else" },
];

/** General enquiry form: inline zod validation, server action submit, animated confirmation. */
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
    defaultValues: { name: "", email: "", phone: "", company: "", topic: "project", message: "", website: "" },
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

  const text = (id: "name" | "email" | "phone" | "company", label: string, type: string, autoComplete: string, optional = false) => (
    <Field id={id} label={label} error={errors[id]?.message} optional={optional}>
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
          <h2 className="mt-8 font-display text-h3 font-extrabold uppercase">Message sent.</h2>
          <p className="mt-3 text-muted">
            Thanks. We'll reply within one business day. Reference <span className="font-mono text-accent">{result.reference}</span>
          </p>
          <button type="button" onClick={() => setResult(null)} className="mt-8 font-display font-bold uppercase tracking-[0.08em] text-muted hover:text-text">
            Send another message
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: EASE }} className="space-y-6">
          <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {text("name", "Full name", "text", "name")}
            {text("email", "Email", "email", "email")}
            {text("phone", "Phone", "tel", "tel", true)}
            {text("company", "Company", "text", "organization", true)}
          </div>
          <Field id="topic" label="What's it about?" error={errors.topic?.message}>
            <select id="topic" className={cn(inputClass, "h-12")} {...register("topic")}>
              {topics.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field id="message" label="Message" error={errors.message?.message}>
            <textarea
              id="message"
              rows={6}
              className={cn(inputClass, "py-3")}
              aria-invalid={!!errors.message}
              aria-describedby={describedBy("message", errors.message)}
              {...register("message")}
            />
          </Field>
          {result && !result.ok && !result.fieldErrors && (
            <p role="alert" className="rounded-xs border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200">
              {result.message}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="max-w-xs text-sm text-muted">Need a price? The quote form gets you a faster, more accurate answer.</p>
            <Button type="submit" size="lg" disabled={isSubmitting} arrow={!isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                  Sending…
                </span>
              ) : (
                "Send message"
              )}
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
