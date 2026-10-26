"use server";

import { industryQuoteSchema, type IndustryQuoteResult } from "@/lib/industry-quote";

const reference = () => `TI-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

/**
 * Industries quote request. The client sends the fields as JSON ("payload") plus up to five
 * attachments ("files") in one multipart FormData. Everything is validated again here.
 *
 * Delivery: if FORMS_WEBHOOK_URL is set, the request is forwarded there as multipart/form-data
 * (fields as JSON plus the original files). Without it, only a PII-free line is logged.
 * Note: next.config.ts raises the server action body limit to 52 MB; some hosts cap request bodies
 * lower (e.g. ~4.5 MB on Vercel functions), in which case upload attachments directly to storage.
 */
export async function submitIndustryQuote(formData: FormData): Promise<IndustryQuoteResult> {
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(String(formData.get("payload") ?? "{}"));
  } catch {
    return { ok: false, message: "We couldn't read your request. Please try again." };
  }
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

  const parsed = industryQuoteSchema.safeParse({ ...payload, files });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join(".")] ??= issue.message;
    return { ok: false, message: "Some details need another look.", fieldErrors };
  }

  const { website, files: attachments, ...data } = parsed.data;
  const ref = reference();
  if (website) return { ok: true, reference: ref }; // honeypot: pretend it worked

  const url = process.env.FORMS_WEBHOOK_URL;
  if (!url) {
    console.info(`[forms] industry quote ${ref} received with ${attachments.length} attachment(s). Set FORMS_WEBHOOK_URL to forward submissions.`);
    return { ok: true, reference: ref };
  }

  try {
    const body = new FormData();
    body.append("kind", "industry-quote");
    body.append("reference", ref);
    body.append("receivedAt", new Date().toISOString());
    body.append("payload", JSON.stringify(data));
    for (const file of attachments) body.append("files", file, file.name);
    const res = await fetch(url, { method: "POST", body, signal: AbortSignal.timeout(20_000) });
    if (!res.ok) throw new Error(`Forms webhook responded ${res.status}`);
  } catch (error) {
    console.error("[forms] industry quote delivery failed", error);
    return { ok: false, message: "We couldn't send your request just now. Please try again, or call us any time." };
  }
  return { ok: true, reference: ref };
}
