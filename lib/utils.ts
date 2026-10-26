/** Joins class names, skipping falsy values. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** "01", "02" … for numbered labels. */
export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" });

/** ISO date → "Oct 08, 2026" (UTC, so server and client render the same string). */
export function formatDate(iso: string) {
  return dateFormat.format(new Date(iso));
}

/** "+1 800 555 0187" style display number → tel: href. */
export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
