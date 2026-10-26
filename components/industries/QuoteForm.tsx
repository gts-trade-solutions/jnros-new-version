"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FormProvider, type Path, useForm, useWatch } from "react-hook-form";
import { submitIndustryQuote } from "@/app/industries/actions";
import { Reveal } from "@/components/ui/Reveal";
import { hasDestination, type IndustryQuoteInput, industryQuoteSchema, type IndustryQuoteValues } from "@/lib/industry-quote";
import { EASE } from "@/lib/motion";
import { AddressFields } from "./AddressFields";
import { Attachments } from "./Attachments";
import { FloatingField } from "./FloatingField";
import { type SubmitStatus, SubmitButton } from "./SubmitButton";

const emptyAddress = { street: "", line2: "", city: "", region: "", zip: "", country: "United States" };
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * "Let's get your project rolling": one-page quote request in five groups (contact, scope of work,
 * origin, destination if different, attachments), inside a lime-edged panel with moving hazard tape.
 *
 * - react-hook-form + zod: fields validate once touched; Submit validates everything, focuses the
 *   first problem and shakes every field still in error. The server validates again.
 * - The destination address is optional, but once any part of it is filled in it must be complete
 *   (its fields then show as required).
 * - Groups fade up as they scroll into view.
 * - Submit: the button morphs to a spinner, then a lime check with confetti, and the confirmation
 *   message appears.
 */
export function QuoteForm() {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const form = useForm<IndustryQuoteInput, unknown, IndustryQuoteValues>({
    resolver: zodResolver(industryQuoteSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      scope: "",
      origin: emptyAddress,
      destination: emptyAddress,
      files: [],
      website: "",
    },
  });
  const { control, handleSubmit, register, setError, setFocus } = form;
  const destinationStarted = hasDestination(useWatch({ control, name: "destination" }));

  const submit = handleSubmit(
    async (values) => {
      setStatus("sending");
      setServerMessage(null);
      const { files, ...fields } = values;
      const body = new FormData();
      body.append("payload", JSON.stringify(fields));
      for (const file of files) body.append("files", file);
      // Keep the spinner on screen long enough to read as a state, not a flicker.
      const [result] = await Promise.all([submitIndustryQuote(body), wait(900)]);

      if (result.ok) return setStatus("done");
      setStatus("error");
      setServerMessage(result.message);
      if (result.fieldErrors) {
        const paths = Object.keys(result.fieldErrors) as Path<IndustryQuoteInput>[];
        for (const path of paths) setError(path, { message: result.fieldErrors[path] });
        setAttempt((a) => a + 1);
        if (paths[0] && paths[0] !== "files") setFocus(paths[0]);
      }
    },
    // react-hook-form has already focused the first invalid field; this makes the rest shake.
    () => setAttempt((a) => a + 1),
  );

  const done = status === "done";

  return (
    <div className="relative overflow-hidden rounded-sm border border-lime/60 bg-forest-900">
      {/* Hazard tape along the top edge: a 32px diagonal tile sliding one tile per loop. */}
      <div aria-hidden="true" className="relative h-3 overflow-hidden border-b border-lime/40">
        <div
          className="absolute inset-y-0 left-0 w-[calc(100%+32px)] motion-safe:animate-tape"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--color-lime) 25%, var(--color-forest-900) 25%, var(--color-forest-900) 50%, var(--color-lime) 50%, var(--color-lime) 75%, var(--color-forest-900) 75%)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <FormProvider {...form}>
        <form noValidate onSubmit={submit} className="p-6 sm:p-10 lg:p-14">
          {/* Honeypot: off-screen and unfocusable; people never fill it in. */}
          <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
            <label htmlFor="iq-website">Website</label>
            <input id="iq-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </div>

          <fieldset disabled={status === "sending" || done}>
            <Reveal batch className="space-y-16">
              <Group index="01" title="Contact">
                <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
                  <FloatingField name="firstName" label="First name" required autoComplete="given-name" attempt={attempt} />
                  <FloatingField name="lastName" label="Last name" required autoComplete="family-name" attempt={attempt} />
                  <FloatingField name="email" label="Email" type="email" required autoComplete="email" inputMode="email" attempt={attempt} />
                  <FloatingField name="phone" label="Phone" type="tel" required autoComplete="tel" inputMode="tel" attempt={attempt} />
                  <FloatingField name="company" label="Company name" autoComplete="organization" attempt={attempt} className="sm:col-span-2" />
                </div>
              </Group>

              <Group index="02" title="Scope of work">
                <FloatingField
                  name="scope"
                  label="Tell us about the scope of work"
                  as="textarea"
                  required
                  placeholder="Include weights, dimensions and anything else we should know"
                  attempt={attempt}
                />
              </Group>

              <Group index="03" title="Origin address">
                <AddressFields prefix="origin" required attempt={attempt} />
              </Group>

              <Group index="04" title="Destination address" hint="If different from the origin">
                <AddressFields prefix="destination" required={destinationStarted} attempt={attempt} />
              </Group>

              <Group index="05" title="Attachments" hint="Drawings, photos, specs">
                <Attachments />
              </Group>
            </Reveal>
          </fieldset>

          {status === "error" && serverMessage && (
            <p role="alert" className="mt-10 rounded-sm border border-lime-bright/40 bg-forest-800 p-4 text-sm text-lime-bright">
              {serverMessage}
            </p>
          )}

          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
            <span className="font-mono text-label uppercase text-sage">
              {done ? (
                "Thank you"
              ) : (
                <>
                  <span className="text-lime">*</span> Required
                </>
              )}
            </span>
            <div className="flex flex-wrap items-center justify-end gap-6">
              <AnimatePresence>
                {done && (
                  <motion.p
                    role="status"
                    className="max-w-xs font-display text-xl font-bold uppercase leading-tight text-mint"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
                  >
                    Request received. Our team will reply shortly.
                  </motion.p>
                )}
              </AnimatePresence>
              <SubmitButton status={status} label="Submit request" />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

/** One numbered group of fields (a fieldset with a large legend). */
function Group({ index, title, hint, children }: { index: string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-label text-lime">{index}</span>
        <span className="font-display text-h3 font-extrabold uppercase">{title}</span>
        {hint && <span className="font-mono text-label uppercase text-sage">({hint})</span>}
      </legend>
      {children}
    </fieldset>
  );
}
