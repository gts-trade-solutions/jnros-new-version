# Jnros Logistics — marketing site

Multi-page marketing site for a heavy-industry services company (machinery moving, rigging, cranes, heavy transport). Industrial, dark, cinematic.

- **Next.js 16** (App Router, TypeScript, Turbopack), **Tailwind CSS v4**
- **Motion** (`motion/react`) for component, layout and page-transition animation
- **GSAP + ScrollTrigger** (`@gsap/react`) for pinned and scrubbed scroll sequences
- **Lenis** smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync
- **react-hook-form + zod** forms, submitted through server actions
- `next/image`, `next/font` (Barlow Condensed, Inter, JetBrains Mono), `lucide-react`

All 71 routes are statically generated.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run typecheck
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` and `FORMS_WEBHOOK_URL` (see [Forms](#forms)).

## Structure

```
app/                      routes (server components), template.tsx, actions.ts, sitemap.ts, robots.ts
  services/[slug]  case-studies/[slug]  locations/[slug]  news/[slug]
  about  safety  careers  contact  get-a-quote  privacy  terms
  industries/             green-theme page + [slug] template, layout.tsx (data-theme="forest"), actions.ts
components/
  industries/             IndustriesHero, IndustriesIntro, SectorGrid, IndustryRows, QuoteForm
                          (AddressFields, Attachments, FloatingField, SubmitButton), Duotone
  layout/                 Header, MegaMenu, MobileMenu, Footer, Preloader, PageTransition, SmoothScroll, Cursor
  sections/               Hero, Stats, ServicesGrid, Expertise, ProjectsScroller, Marquee, Locations,
                          Partners, News, CtaBanner, PageHero, Gallery (masonry + lightbox), CaseStudyExplorer, …
  ui/                     Button, MagneticButton, Magnetic, SplitText, Reveal, RevealImage, ParallaxImage,
                          Counter, SectionLabel, GridLines, Breadcrumbs, JsonLd, Logo, Icon, …
  forms/                  QuoteForm (4 steps), ContactForm, Field
hooks/                    useMediaQuery, useReducedMotion, useIdleGSAP, useDragScroll
lib/
  data.ts                 ALL content: services, case studies, locations, news, jobs, nav, site details
  industries.ts           Industries page content: hero, intro, 16 sectors, 10 featured industries
  industry-quote.ts       Industries quote schema and file rules (shared with the server action)
  images.ts               Unsplash photo helpers (photo / portrait / square)
  seo.ts                  metadata builder + JSON-LD (LocalBusiness, Service, NewsArticle, BreadcrumbList)
  schemas.ts              zod schemas shared by the forms and the server actions
  gsap.ts  motion.ts      animation setup and the shared easing / duration / media-query constants
  geo.ts  map-data.ts     Albers projection + generated map metadata
scripts/generate-map.ts   builds public/map/north-america.svg from Natural Earth data
```

Pages are server components. Anything interactive or animated is a `"use client"` leaf component, so all text is in the server-rendered HTML.

## Editing content

Everything lives in **`lib/data.ts`**: services, case studies, locations (with lat/lng), news, jobs, the mega menu and footer columns, and the site's phone, email and socials. Pages, the sitemap and the JSON-LD all read from it.

**Placeholders to replace before launch:**
- domain, phone numbers, emails and social URLs in `site`
- the store URL
- the locations' street addresses
- the partner logos in `components/ui/PartnerLogo.tsx`
- the legal copy in `app/privacy` and `app/terms`

**Photography** is Unsplash placeholder imagery (`images.unsplash.com`, allowed in `next.config.ts`). Each image is requested with a fixed crop, so `next/image` always knows its aspect ratio. Swap in real project photography by changing the `photo(...)` calls, or point `src` at your own CDN and update `remotePatterns`.

**Map:** after changing the map region or projection, run `npm run generate:map`. Pins are projected at runtime from each location's lat/lng with the same projection (`lib/geo.ts`), so adding a location needs no regeneration.

## Animation system

| What | Tool | Where |
|---|---|---|
| Preloader (first visit per session): counter, bar, split wipe | GSAP timeline | `layout/Preloader.tsx` |
| Page transition: lime panel wipe, then fade | Motion `AnimatePresence` + `template.tsx` | `layout/PageTransition.tsx` |
| Header hide/show and shrink, mega menu, mobile menu | Motion | `layout/Header.tsx`, `MegaMenu.tsx`, `MobileMenu.tsx` |
| Hero intro, Ken Burns, slide timer | CSS keyframes (compositor) | `globals.css` (`.hero-line`, `animate-kenburns`) |
| Scroll reveals (split text, fade/clip groups, image wipes, map pins) | CSS start state + IntersectionObserver + GSAP tween | `ui/Reveal.tsx`, `ui/SplitText.tsx`, `ui/RevealImage.tsx`, `sections/MapReveal.tsx` |
| Pinned / scrubbed (hero parallax, un-crop, word highlight, horizontal projects, timeline rail) | GSAP ScrollTrigger | set up in idle tasks via `useIdleGSAP` |
| Filter layout transitions, lightbox, quote-form steps | Motion `layout`, `AnimatePresence` | `CaseStudyExplorer.tsx`, `Gallery.tsx`, `QuoteForm.tsx` |
| Cursor, magnetic buttons, footer wordmark | Motion springs / `useScroll` | `layout/Cursor.tsx`, `ui/Magnetic.tsx`, `layout/FooterWordmark.tsx` |

**Conventions**
- One easing everywhere: `cubic-bezier(0.22, 1, 0.36, 1)`. It is `"brand"` in GSAP, `EASE` in Motion and `ease-brand` in CSS.
- Durations are 0.6–1.2s. Staggers are 0.06–0.12s, or 0.04s inside the mega menu.
- Only `transform`, `opacity` and `clip-path` animate.

**Reduced motion.** Lenis, the cursor, magnetic pulls, pinning, parallax, the Ken Burns zoom, the marquees, the form's moving hazard tape and the preloader are all off. Reveals become plain fades.

**No JavaScript.** Every pre-hidden state is gated on `html.js`, which an inline boot script sets. A safety net removes that class if the app hasn't hydrated within 5s, so content can never stay invisible.

**Performance notes**
- **Reveals have no setup cost.** Start states come from CSS and an IntersectionObserver plays them, so hydration never reads layout.
- **ScrollTriggers wait for idle.** They're created in idle tasks (`lib/idle.ts`), pinned section first, then re-measured once.
- **Off-screen loops pause.** The marquee and map pulses stop while out of view.
- **Hydration is split.** Home sections sit in Suspense boundaries so React hydrates them in separate chunks.
- **CSS is inlined.** It's about 14 KB gzipped, which removes the only render-blocking request.
- **The map is a static file.** It's a lazily loaded SVG (about 5 KB gzipped); pins are HTML layered over it.

## Industries page (green theme)

`/industries` and `/industries/[slug]` use a full green theme. The tokens are in `app/globals.css` (`@theme`): `forest-950…600`, `lime`, `lime-bright`, `lime-deep`, `mint`, `cream`, `sage`, `line`.

**How the theme is scoped.** `app/industries/layout.tsx` wraps those routes in `<div data-theme="forest">`. The rule `:root:has([data-theme="forest"])` re-maps the site tokens, so the shared header, footer, cursor, page-transition panel and buttons all turn green on those routes only.
- Use `forest:` (a custom variant) for styles that should apply only under the theme. `PhotoTint` uses it to give page heroes and CTA banners the duotone.
- To make the whole site green, put `data-theme="forest"` on `<body>`.

**Sections** (same order as the reference "Industries Served" layout)
- **Hero:** a full-bleed photo with the duotone and scroll parallax, and the title block on the right. A CSS intro raises the headline from its masks, draws a lime rule, then fades in the subline.
- **Intro:** heading plus two large paragraphs whose words scrub from sage to cream as you scroll.
- **Sector grid:** "Moving industry forward, one job at a time", with all 16 sectors as links on a lime panel.
  - The panel wipes open and the links stagger in.
  - On hover, a forest fill rises behind the link.
  - Sectors with a row below Lenis-scroll to it; the rest open the service page that covers them.
- **Industry rows:** ten alternating photo/text bands with "Learn more" links to `/industries/[slug]`.
  - Each photo wipes open while it settles, and its duotone clears on hover.
- **Quote form:** a single page with five groups.

Content lives in `lib/industries.ts`: page copy, the sectors and the ten featured industries in display order. Each featured industry gets a static `/industries/[slug]` page.

**Quote form with attachments.**
- Groups: Contact, Scope of work, Origin address, Destination address (if different), Attachments. Groups fade up as they scroll into view.
- The destination is optional, but once any part of it is filled in it must be a complete address. That rule is a refinement on the zod schema, so the client and the server share it.
- Flagged fields re-check as you type, so error lines disappear while you fix them, not on the next click. Clearing them on blur would shift the layout under the pointer and swallow the click.
- Files: JPG, PNG, GIF, PDF or XLS/XLSX, up to 5 files, 10 MB each.
- `submitIndustryQuote` (`app/industries/actions.ts`) validates again and forwards multipart (`payload` JSON plus `files`) to `FORMS_WEBHOOK_URL`.
- `next.config.ts` raises the server-action body limit to 52 MB. Some hosts cap request bodies lower; Vercel functions allow about 4.5 MB. On such a host, upload files straight to storage (for example presigned S3 URLs) and send only the keys.

## Forms

`/get-a-quote` is a four-step form: Project → Load → Route → Contact. Each step validates its own fields inline with zod. Values persist across steps, and steps slide in the direction of travel.

Both forms submit to server actions in `app/actions.ts`, which:
- validate again with the same schemas
- drop honeypot spam silently
- POST JSON to `FORMS_WEBHOOK_URL`

Without the webhook, visitors still see a confirmation with a reference number, but nothing is delivered. **Set it before launch.**

## SEO

Every page has a title, description, canonical URL and Open Graph / Twitter cards (`lib/seo.ts`). Also included:
- `sitemap.xml` and `robots.txt`
- LocalBusiness JSON-LD for the headquarters, with every branch listed as a department, plus one LocalBusiness per location page
- Service JSON-LD on service pages, NewsArticle JSON-LD on posts, and BreadcrumbList JSON-LD on inner pages

## Lighthouse (local production build, home page)

| Run | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop | 97 | 100 | 100 | 100 |
| Mobile, first visit (preloader shown) | ~80 | 100 | 100 | 100 |
| Mobile, returning visit | ~82 | — | — | — |

Inner pages score 97–98 on desktop.

`/industries` scores 98 on desktop and about 73 on mobile. `/industries/[slug]` scores 98 on desktop and 73–82 on mobile. Accessibility, best practices and SEO are 100 on both. On mobile, the simulated LCP is the full-bleed hero photo, as on the other inner pages.

On mobile the main penalty is Lighthouse's *simulated* LCP (~4.3s). Its model counts every script that finished downloading before first paint. In a real Chrome session with 4× CPU throttling, first paint is ~0.45s and LCP under 0.9s.

The remaining cost is framework JavaScript (React, Next, Motion, GSAP). The next steps would be lazy-loading GSAP after first paint and switching Motion to `LazyMotion`/`m` components.
