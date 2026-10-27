"use server";

import { z } from "zod";
import { contactSchema, type FormResult } from "@/lib/schemas";

const reference = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

/**
 * Hands a submission to your CRM / inbox. Set FORMS_WEBHOOK_URL (Zapier, Make, a Slack or Teams
 * workflow, your own API...) to receive JSON. Without it, submissions are only acknowledged and a
 * PII-free line is logged, which is fine for local development but not for production.
 */
async function deliver(kind: "contact", ref: string, data: Record<string, unknown>) {
  const url = process.env.FORMS_WEBHOOK_URL;
  if (!url) {
    console.info(`[forms] ${kind} ${ref} received. Set FORMS_WEBHOOK_URL to forward submissions.`);
    return;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind, reference: ref, receivedAt: new Date().toISOString(), ...data }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Forms webhook responded ${res.status}`);
}

const failure = (message: string, error?: z.ZodError): FormResult => ({
  ok: false,
  message,
  fieldErrors: error ? z.flattenError(error).fieldErrors : undefined,
});

export async function submitContact(input: unknown): Promise<FormResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return failure("Some details need another look.", parsed.error);
  const { website, ...data } = parsed.data;
  const ref = reference("JC");
  // Bots fill the hidden field: pretend it worked, send nothing.
  if (website) return { ok: true, reference: ref };

  try {
    await deliver("contact", ref, data);
  } catch (error) {
    console.error("[forms] contact delivery failed", error);
    return failure("We couldn't send your details just now. Please try again, or call us.");
  }
  return { ok: true, reference: ref };
}
