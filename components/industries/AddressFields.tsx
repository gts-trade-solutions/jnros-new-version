"use client";

import { FloatingField } from "./FloatingField";

const countries = [
  { value: "United States", label: "United States" },
  { value: "Canada", label: "Canada" },
  { value: "Mexico", label: "Mexico" },
  { value: "Other", label: "Other" },
];

/** Street, line 2, city, state / region, ZIP and country for the origin or destination address. */
export function AddressFields({ prefix, required, attempt }: { prefix: "origin" | "destination"; required: boolean; attempt: number }) {
  return (
    <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
      <FloatingField name={`${prefix}.street`} label="Street address" required={required} autoComplete={`section-${prefix} address-line1`} attempt={attempt} className="sm:col-span-2" />
      <FloatingField name={`${prefix}.line2`} label="Address line 2" autoComplete={`section-${prefix} address-line2`} attempt={attempt} className="sm:col-span-2" />
      <FloatingField name={`${prefix}.city`} label="City" required={required} autoComplete={`section-${prefix} address-level2`} attempt={attempt} />
      <FloatingField name={`${prefix}.region`} label="State / province / region" required={required} autoComplete={`section-${prefix} address-level1`} attempt={attempt} />
      <FloatingField name={`${prefix}.zip`} label="ZIP / postal code" required={required} autoComplete={`section-${prefix} postal-code`} attempt={attempt} />
      <FloatingField name={`${prefix}.country`} label="Country" as="select" required={required} options={countries} attempt={attempt} />
    </div>
  );
}
