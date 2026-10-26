import { z } from "zod";

/**
 * Form schemas, shared by the client (react-hook-form inline validation) and the server actions
 * (which validate again; never trust the client).
 */

const required = (label: string) => z.string().trim().min(1, { error: `${label} is required` });

export const quoteSchema = z.object({
  // Step 1: project
  projectType: z.string().min(1, { error: "Choose the type of project" }),
  industry: z.string().optional(),
  timeline: z.enum(["asap", "1-3", "3-6", "planning"], { error: "Choose a timeline" }),
  // Step 2: load
  description: z.string().trim().min(10, { error: "Describe the load in a few words (10+ characters)" }).max(1000),
  weight: z.number({ error: "Enter an approximate weight" }).positive({ error: "Weight must be more than zero" }).max(100_000_000),
  weightUnit: z.enum(["lbs", "tons"]),
  dimensions: z.string().trim().max(120).optional(),
  quantity: z.number({ error: "Enter how many pieces" }).int({ error: "Use a whole number" }).min(1, { error: "At least one piece" }).max(10_000),
  // Step 3: route
  pickupCity: required("Pickup city"),
  pickupRegion: required("Pickup state / province"),
  deliveryCity: required("Delivery city"),
  deliveryRegion: required("Delivery state / province"),
  startDate: z.string().optional(),
  siteNotes: z.string().trim().max(1000).optional(),
  // Step 4: contact
  name: z.string().trim().min(2, { error: "Enter your name" }),
  company: z.string().trim().min(2, { error: "Enter your company" }),
  email: z.email({ error: "Enter a valid email address" }),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\d\s.-]{7,20}$/, { error: "Enter a valid phone number" }),
  preferred: z.enum(["email", "phone"]),
  consent: z.literal(true, { error: "Please confirm we may contact you about this request" }),
  /** Honeypot: hidden from people, filled in by bots. */
  website: z.string().max(0).optional(),
});

export type QuoteInput = z.input<typeof quoteSchema>;
export type QuoteValues = z.output<typeof quoteSchema>;

/** Fields validated before leaving each step. */
export const quoteSteps = [
  { title: "Project", fields: ["projectType", "industry", "timeline"] },
  { title: "Load", fields: ["description", "weight", "weightUnit", "dimensions", "quantity"] },
  { title: "Route", fields: ["pickupCity", "pickupRegion", "deliveryCity", "deliveryRegion", "startDate", "siteNotes"] },
  { title: "Contact", fields: ["name", "company", "email", "phone", "preferred", "consent"] },
] as const satisfies { title: string; fields: (keyof QuoteInput)[] }[];

export const contactSchema = z.object({
  name: z.string().trim().min(2, { error: "Enter your name" }),
  email: z.email({ error: "Enter a valid email address" }),
  phone: z
    .string()
    .trim()
    .regex(/^([+()\d\s.-]{7,20})?$/, { error: "Enter a valid phone number" })
    .optional(),
  company: z.string().trim().max(120).optional(),
  topic: z.enum(["project", "service", "careers", "media", "other"], { error: "Choose a topic" }),
  message: z.string().trim().min(20, { error: "Tell us a little more (20+ characters)" }).max(4000),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;

export type FormResult = { ok: true; reference: string } | { ok: false; message: string; fieldErrors?: Record<string, string[] | undefined> };
