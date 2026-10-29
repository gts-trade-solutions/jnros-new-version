/**
 * The chat assistant's answers (components/layout/ChatAssistant.tsx). Scripted, not AI: a question
 * is matched by keywords to a solution or service, the contact details, a quote request or the
 * lists of offerings, and answered with the site's own words from lib/data.ts. Anything it can't
 * place goes to the team on WhatsApp, with the visitor's question already typed in.
 */
import { type Offering, services, site, solutions } from "./data";
import { telHref } from "./utils";

export type ChatLink = { label: string; href: string };
export type ChatReply = { text: string; links?: ChatLink[] };

export const quickReplies = ["ODC cargo", "Our solutions", "Our services", "Get a quote", "Contact details"];

const whatsapp = site.socials[0].href;
export const whatsappLink = (text: string) => `${whatsapp}?text=${encodeURIComponent(text)}`;

export const greeting: ChatReply = {
  text: `Hi, welcome to ${site.name}. Ask me about our solutions and services, a quote, or how to reach the team.`,
};

/** Words people use for each offering besides its title. */
const aliases: Record<string, string[]> = {
  "odc-cargo-shipping": ["odc", "over dimensional", "overdimensional", "oversize", "oversized", "out of gauge", "oog", "wide load"],
  "break-bulk-shipping": ["break bulk", "breakbulk", "non containerized", "non containerised"],
  "ro-ro-shipping": ["ro ro", "roro", "roll on", "vehicles", "cars"],
  "bulk-carrier-shipping": ["bulk carrier", "bulk cargo", "coal", "grain", "ore"],
  "ship-brokering": ["broker", "brokering", "vessel charter", "charter a vessel", "charter a ship"],
  "heavy-lift-chartering-industrial-movers": ["heavy lift", "heavylift", "industrial movers", "relocation", "plant shifting"],
  "heavy-cargo-loadout-operations": ["loadout", "load out", "barge"],
  "heavy-lifting-transportation": ["crane", "lifting", "heavy transport", "hydraulic trailer", "transformer"],
  "international-air-freight": ["air freight", "airfreight", "air cargo", "by air"],
  "global-air-charter-operations": ["air charter", "charter flight", "aircraft charter"],
  "international-ocean-freight": ["ocean freight", "sea freight", "by sea", "container", "fcl", "lcl"],
  "overland-transport": ["overland", "road", "truck", "trucking", "inland", "cross border"],
  "warehousing-and-distribution": ["warehouse", "warehousing", "storage", "distribution"],
  "dangerous-goods-handling": ["dangerous", "hazardous", "dg cargo", "chemicals"],
  "customs-clearance": ["customs", "clearance", "duty"],
  "project-and-heavy-cargo": ["project cargo", "project logistics", "epc", "turbine", "plant machinery"],
};

const normalise = (text: string) => ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `;
const has = (text: string, words: string[]) => words.some((w) => text.includes(` ${w} `));

/** The offering a question is about: the most (and longest) matching phrases win. */
function matchOffering(text: string): Offering | undefined {
  let best: Offering | undefined;
  let bestScore = 0;
  for (const o of [...solutions, ...services]) {
    const phrases = [normalise(o.title).trim(), ...(aliases[o.slug] ?? [])];
    const score = phrases.reduce((sum, p) => (text.includes(` ${p} `) ? sum + p.split(" ").length : sum), 0);
    if (score > bestScore) [best, bestScore] = [o, score];
  }
  return best;
}

const contactLinks: ChatLink[] = [
  { label: "WhatsApp", href: whatsapp },
  { label: `Call ${site.phone}`, href: telHref(site.phone) },
  { label: "Email us", href: `mailto:${site.email}` },
];

export function answer(question: string): ChatReply {
  const text = normalise(question);
  const offering = matchOffering(text);

  if (has(text, ["quote", "quotation", "price", "pricing", "rate", "rates", "cost", "enquiry", "inquiry", "book"])) {
    const subject = offering ? offering.title : "your cargo";
    return {
      text: `For a quote on ${subject}, send the team your cargo details (dimensions, weight, origin and destination) and they will get back to you.`,
      links: [
        { label: "Request on WhatsApp", href: whatsappLink(`Hi, I'd like a quote for ${subject}.`) },
        { label: "Contact form", href: "/contact" },
        { label: `Call ${site.phone}`, href: telHref(site.phone) },
      ],
    };
  }
  if (has(text, ["contact", "phone", "call", "number", "email", "mail", "address", "office", "location", "located", "where are you", "reach you", "whatsapp"])) {
    return { text: `Call ${site.phone}, email ${site.email}, or visit us at ${site.address.lines.join(", ")}.`, links: contactLinks };
  }
  if (offering) {
    return {
      text: `${offering.title}: ${offering.short}`,
      links: [
        { label: "Read more", href: offering.href },
        { label: "Get a quote", href: whatsappLink(`Hi, I'd like a quote for ${offering.title}.`) },
      ],
    };
  }
  if (has(text, ["solution", "solutions"])) {
    return { text: `We offer ${solutions.length} solutions:`, links: solutions.map((s) => ({ label: s.title, href: s.href })) };
  }
  if (has(text, ["service", "services", "offer", "do you do", "what do you"])) {
    return { text: `Our ${services.length} services:`, links: services.map((s) => ({ label: s.title, href: s.href })) };
  }
  if (has(text, ["thanks", "thank you", "thank", "great", "ok", "okay"])) {
    return { text: "You're welcome. Anything else I can help with?" };
  }
  if (has(text, ["about", "who", "company", "jnros", "experience"])) {
    return { text: site.description, links: [{ label: "About us", href: "/about" }] };
  }
  if (has(text, ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "namaste"])) {
    return greeting;
  }
  return {
    text: "I'm not sure about that one, but the team can answer it directly.",
    links: [{ label: "Ask on WhatsApp", href: whatsappLink(question) }, contactLinks[1]],
  };
}
