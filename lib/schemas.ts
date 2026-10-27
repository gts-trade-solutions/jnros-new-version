import { z } from "zod";

/**
 * Form schemas, shared by the client (react-hook-form inline validation) and the server action
 * (which validates again; never trust the client).
 */

const required = (label: string) => z.string().trim().min(1, { error: `${label} is required` });
const phone = /^[+()\d\s.-]{7,20}$/;

/** The fields of the contact form on jnroslogistics.com/contact-us. */
export const contactSchema = z.object({
  firstName: required("First name"),
  lastName: z.string().trim().max(80).optional(),
  email: z.email({ error: "Enter a valid email address" }),
  jobTitle: required("Job title"),
  company: required("Company name"),
  country: required("Country"),
  phone: z.string().trim().regex(phone, { error: "Enter a valid phone number" }),
  altPhone: z
    .string()
    .trim()
    .regex(/^([+()\d\s.-]{7,20})?$/, { error: "Enter a valid phone number" })
    .optional(),
  /** Honeypot: hidden from people, filled in by bots. */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;

export type FormResult = { ok: true; reference: string } | { ok: false; message: string; fieldErrors?: Record<string, string[] | undefined> };
