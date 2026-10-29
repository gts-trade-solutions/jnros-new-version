# Jnros Logistics — marketing site

Multi-page marketing site for Jnros Logistics, Bangalore: project cargo, breakbulk, ODC, heavy lift, and international air and ocean freight. Light theme, with photo heroes in a dark tone.

- **Next.js 16** (App Router, TypeScript, Turbopack), **Tailwind CSS v4**
- **Motion** (`motion/react`) for component, layout and page-transition animation
- **GSAP + ScrollTrigger** (`@gsap/react`) for pinned and scrubbed scroll sequences
- **Lenis** smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync
- **react-hook-form + zod** forms, submitted through server actions
- `next/image`, `next/font` (Barlow Condensed, Inter, JetBrains Mono), `lucide-react`

Every route is statically generated.

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
  about  solutions/[slug]  services/[slug]  gallery  contact
components/
  layout/                 Header, MegaMenu, MobileMenu, Footer, PageTransition, SmoothScroll,
                          FloatingActions (BackToTop + ChatAssistant)
  sections/               Hero, Stats, AboutIntro, ServicesGrid, ServiceCard, OfferingIndex, OfferingDetail,
                          CtaBanner, PageHero, VideoBand, Gallery (masonry + lightbox)
  ui/                     Button, MagneticButton, Magnetic, SplitText, Reveal, RevealImage, ParallaxImage, LoopVideo,
                          Counter, SectionLabel, GridLines, Breadcrumbs, JsonLd, Logo, Icon, …
  forms/                  ContactForm, Field
hooks/                    useMediaQuery, useReducedMotion, useIdleGSAP
lib/
  data.ts                 ALL content: solutions, services, home / about copy, nav, site details
  images.ts               photo and clip helpers for /public/images and /public/videos
  assistant.ts            the chat assistant's scripted answers (keyword matching over data.ts)
  image-loader.ts         next/image loader for the pre-built WebP sizes (widths in image-widths.json)
  seo.ts                  metadata builder + JSON-LD (LocalBusiness, Service, BreadcrumbList)
  schemas.ts              zod schema shared by the contact form and its server action
  gsap.ts  motion.ts      animation setup and the shared easing / duration / media-query constants
public/images/            photography from jnroslogistics.com, and the video poster frames
public/videos/            background clips, 1080p + 720p H.264 (scripts/encode-video.mjs)
public/img/               generated WebP sizes (scripts/optimize-images.mjs, not committed)
scripts/                  optimize-images.mjs, encode-video.mjs
```

Pages are server components. Anything interactive or animated is a `"use client"` leaf component, so all text is in the server-rendered HTML.

## Editing content

Everything lives in **`lib/data.ts`**, and all of it is taken from **jnroslogistics.com**:
- the 8 solutions and 8 services (card line + page text)
- the home and About page sections, and the counters
- the gallery photos
- the nav, the footer columns, and the phone, email, address and WhatsApp link

Pages, the sitemap and the JSON-LD all read from it. Add content only when it is also published on the live site.

**Photography** lives in `public/images/`; the `photo(file, alt, width, height)` helper records each file's real size so `next/image` knows its aspect ratio.

**Image sizes are pre-built.** `npm run dev` and `npm run build` first run `scripts/optimize-images.mjs`, which writes every width `next/image` can request (from `lib/image-widths.json`) as a static WebP in `public/img/`. `lib/image-loader.ts` points `<Image>` at those files, so photos are plain CDN files from the first visit. On-demand optimization took 0.4–1.2s the first time each size was requested. The script is incremental, so after adding or replacing a photo it only encodes that one.

**Background video.** The home hero slides, the home film band and the "Project logistics" showcase, and the heroes of all 8 solution pages and of the International Ocean Freight, Overland Transport, Warehousing and Distribution and Project and Heavy Cargo service pages, play a muted loop over its first frame (the `clips` table in `lib/data.ts`). In the slideshows only the clip on screen plays and downloads. These clips are stock footage from Pexels (free licence, no attribution required; each is marked with its source in `lib/data.ts`) and are the only content not from the live site. To add or replace one (ideally with Jnros' own footage), with ffmpeg installed:

```bash
node scripts/encode-video.mjs path/to/source.mp4 my-clip --start 2 --end 14 --fade 1
```

This writes `public/videos/my-clip-1080.mp4` and `-720.mp4` (H.264, no audio, index at the front so playback starts while it downloads) and the poster `public/images/my-clip-poster.jpg`; then use `clip("my-clip", "alt text")` in `lib/data.ts`. `--fade` dissolves the end back into the start for a seamless loop; leave it out when the loop point is a cut. Keep loops around 10–14s: each 1080p second is about 0.5 MB. `LoopVideo` downloads a clip only once it is on screen and the page is idle, fades it in once it is actually playing (the poster shows until then), pauses it off-screen, and serves phones the 720p file. Reduced motion, Save-Data and 2G connections keep the poster.

**Chat assistant and back to top.** The bottom-right corner of every page has a back-to-top button (it appears after a screen of scrolling; its ring fills with reading progress) and a chat launcher. The assistant is scripted, not AI (`lib/assistant.ts`): quick replies and typed questions are matched by keyword to a solution or service, the contact details, a quote request or the lists of offerings, and answered with the site's own text and a link. Questions it can't place open WhatsApp with the question already typed in. Add words to `aliases` there to teach it new phrasings.

**Logo.** `public/brand/jnros-logo.png` is the supplied logo with its white background removed; `jnros-logo-light.png` is a white knockout of it, shown in the header while it is over a dark hero.

**Old URLs.** `next.config.ts` permanently redirects the WordPress site's URLs (`/about-us`, `/contact-us`, `/odc-cargo-shipping`, …) to their new paths.

## Theme

Light by default: the tokens are on `:root` in `app/globals.css` (`--bg`, `--surface`, `--surface-2`, `--raised`, `--accent`, `--text`, `--muted`, `--border`). The deep green accent passes AA as text on every light surface.

**Dark tone over photos.** Elements with `data-tone="dark"` switch the same tokens back to a slate palette with the bright brand green, so white text stays legible over photography. Used by `PageHero`, `Hero`, `CtaBanner`, the image cards, the mega menu's photo panel and the lightbox. The fixed header takes that tone while it is transparent over a hero (`data-over-hero`, only on pages with a `[data-hero]`), and turns light once it lifts into its floating island on scroll.

## Animation system

| What | Tool | Where |
|---|---|---|
| Page change: instant swap (pages are prefetched) and a 0.35s fade, no covering panel | Motion + `template.tsx` | `app/template.tsx`, `layout/PageTransition.tsx` (scroll reset under Lenis) |
| Header hide/show and shrink, mega menu, mobile menu | Motion | `layout/Header.tsx`, `MegaMenu.tsx`, `MobileMenu.tsx` |
| Hero intros (home and inner pages), Ken Burns, slide timer | CSS keyframes (compositor), no wait for JavaScript | `globals.css` (`.hero-line`, `animate-kenburns`) |
| Scroll reveals (split text, fade/clip groups, image wipes) | CSS start state + IntersectionObserver + GSAP tween | `ui/Reveal.tsx`, `ui/SplitText.tsx`, `ui/RevealImage.tsx` |
| Pinned / scrubbed (hero parallax, un-crop, word highlight, horizontal Recent Works strip, route line) | GSAP ScrollTrigger | set up in idle tasks via `useIdleGSAP`; `WorksScroller.tsx`, `RouteBand.tsx` |
| Name band: two looping rows that speed up and lean with scroll velocity | GSAP loop + ScrollTrigger velocity | `sections/KineticMarquee.tsx` |
| Route marker travelling Sea → Air → Land | GSAP MotionPath | `sections/RouteBand.tsx` |
| Lightbox | Motion `AnimatePresence` | `Gallery.tsx` |
| Card tilt + glare | Motion springs | `ui/Tilt.tsx` |
| Offers showcase: photo stage with clip-path wipes, Ken Burns, rising titles and an auto-advancing timer | Motion + CSS keyframes | `sections/OffersShowcase.tsx` |
| Magnetic buttons, scroll progress bar | Motion springs / `useScroll` | `ui/Magnetic.tsx`, `layout/ScrollProgress.tsx` |
| Footer Sea, Air & Land scene: plane, ship on rolling waves, truck | CSS keyframes (compositor) | `layout/FooterTransit.tsx`, `globals.css` (`cross-right`, `cross-left`, `waves`, `rock`, `hover`) |

**Conventions**
- One easing everywhere: `cubic-bezier(0.22, 1, 0.36, 1)`. It is `"brand"` in GSAP, `EASE` in Motion and `ease-brand` in CSS.
- Durations are 0.6–1.2s. Staggers are 0.06–0.12s, or 0.04s inside the mega menu.
- Only `transform`, `opacity` and `clip-path` animate. The one exception is the route line's scrubbed `stroke-dashoffset` (a single SVG path).

**Reduced motion.** Lenis, magnetic pulls, card tilt, the showcase autocycle, pinning, parallax, the Ken Burns zoom, the name band, the route marker, and the footer scene are all off. Reveals become plain fades.

**Off-screen loops pause.** The name band, the route marker and the footer scene stop while out of view.

**No JavaScript.** Every pre-hidden state is gated on `html.js`, which an inline boot script sets. A safety net removes that class if the app hasn't hydrated within 5s, so content can never stay invisible.

**Performance notes**
- **Reveals have no setup cost.** Start states come from CSS and an IntersectionObserver plays them, so hydration never reads layout.
- **ScrollTriggers wait for idle.** They're created in idle tasks (`lib/idle.ts`), pinned section first, then re-measured once.
- **Hydration is split.** Home sections sit in Suspense boundaries so React hydrates them in separate chunks.
- **CSS is inlined.** It removes the only render-blocking request.

## Forms

`/contact` carries the live site's form: first name, last name, email, job title, company, country, mobile / landline and alternate number. It validates inline with zod and submits to the server action in `app/actions.ts`, which:
- validates again with the same schema
- drops honeypot spam silently
- POSTs JSON to `FORMS_WEBHOOK_URL`

Without the webhook, visitors still see a confirmation with a reference number, but nothing is delivered. **Set it before launch.**

## SEO

Every page has a title, description, canonical URL and Open Graph / Twitter cards (`lib/seo.ts`). Also included:
- `sitemap.xml` and `robots.txt`
- LocalBusiness JSON-LD for the Bangalore office
- Service and BreadcrumbList JSON-LD on solution and service pages
