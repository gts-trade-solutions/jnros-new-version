import { z } from "zod";

/**
 * "Let's get your project rolling" form (Industries page). Shared by the client (react-hook-form
 * inline validation) and the server action, which validates everything again.
 */

export const MAX_FILES = 5;
export const MAX_FILE_MB = 10;
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
/** File picker filter. XLSX is accepted alongside XLS, since most spreadsheets are XLSX today. */
export const ACCEPT = ".jpg,.jpeg,.png,.gif,.pdf,.xls,.xlsx";
const ACCEPTED_EXTENSION = /\.(jpe?g|png|gif|pdf|xlsx?)$/i;

/** Returns a readable problem for a file that can't be attached, or null if it's fine. */
export function checkFile(file: { name: string; size: number }): string | null {
  if (!ACCEPTED_EXTENSION.test(file.name)) return `${file.name}: use JPG, PNG, GIF, PDF or XLS`;
  if (file.size > MAX_FILE_BYTES) return `${file.name}: larger than ${MAX_FILE_MB} MB`;
  return null;
}

const required = (label: string) => z.string().trim().min(1, { error: `${label} is required` });

export const addressSchema = z.object({
  street: required("Street address"),
  line2: z.string().trim().max(120).optional(),
  city: required("City"),
  region: required("State / region"),
  zip: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/, { error: "Enter a valid ZIP / postal code" }),
  country: required("Country"),
});

/** Destination is optional ("if different from origin"); the refinement below checks it once any part is filled in. */
const optionalAddressSchema = z.object({
  street: z.string().optional(),
  line2: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

const isFile = (value: unknown): value is File => typeof File !== "undefined" && value instanceof File;

/** True once the visitor has typed anything into the destination address (country has a default, so it doesn't count). */
export const hasDestination = (d: z.input<typeof optionalAddressSchema> | undefined) => [d?.street, d?.line2, d?.city, d?.region, d?.zip].some((v) => v?.trim());

export const industryQuoteSchema = z
  .object({
    firstName: required("First name"),
    lastName: required("Last name"),
    email: z.email({ error: "Enter a valid email address" }),
    phone: z
      .string()
      .trim()
      .regex(/^[+()\d\s.-]{7,20}$/, { error: "Enter a valid phone number" }),
    company: z.string().trim().max(120).optional(),
    scope: z
      .string()
      .trim()
      .min(20, { error: "Add a little more detail: weights, dimensions, access (20+ characters)" })
      .max(4000),
    origin: addressSchema,
    destination: optionalAddressSchema,
    files: z
      .array(z.custom<File>(isFile, { error: "Invalid file" }))
      .max(MAX_FILES, { error: `Attach up to ${MAX_FILES} files` })
      .refine((files) => files.every((f) => !checkFile(f)), { error: `Files must be JPG, PNG, GIF, PDF or XLS, up to ${MAX_FILE_MB} MB each` }),
    /** Honeypot: hidden from people, filled in by bots. */
    website: z.string().max(0).optional(),
  })
  .superRefine((value, ctx) => {
    // A destination that has been started must be complete. Issues land on destination.*, so the
    // form flags the right fields and the server action returns them the same way. (Zod 4 still
    // runs this when other fields have failed checks, so all errors arrive together.)
    if (!hasDestination(value.destination)) return;
    const destination = addressSchema.safeParse(value.destination);
    if (destination.success) return;
    for (const issue of destination.error.issues) ctx.addIssue({ code: "custom", message: issue.message, path: ["destination", ...issue.path] });
  });

export type IndustryQuoteInput = z.input<typeof industryQuoteSchema>;
export type IndustryQuoteValues = z.output<typeof industryQuoteSchema>;

export type IndustryQuoteResult = { ok: true; reference: string } | { ok: false; message: string; fieldErrors?: Record<string, string> };
