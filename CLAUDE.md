# CLAUDE.md — Operational guide for this template

This file is the operational brain for the template. A Claude Code session
landing on this repo with no other context should be able to read this file
top-to-bottom and confidently customize the site for a new client.

`README.md` is the human-facing browse doc. **Do not duplicate** content
between the two — point at `README.md` and `public/images/README.md` for
canonical tables.

---

## Purpose

A single-page **Vite + React + Tailwind CSS v4** marketing-site template for
small **Arizona assisted-living facilities**. Premium aesthetic (Playfair
Display + Jost, warm gold/tan palette), light/dark mode toggle, mobile
drawer menu, asymmetric photo gallery, anchor-scrolled sections. Designed
to be **cloned per client**, customized via `{{PLACEHOLDER}}` find-and-replace,
and **deployed to Netlify** via Git auto-deploy.

---

## Workflow for a new client

Run these in order. Don't skip steps — the pre-deploy checklist depends on
each.

1. **Read the client intake** the user provides. If anything in
   `## Required client information` below is missing, stop and ask before
   touching code. Don't invent license numbers, phone numbers, or
   addresses.
2. **Replace every `{{PLACEHOLDER}}`** in `src/App.jsx` and `index.html`.
   Authoritative list in `## Required client information`; verify
   completion with `grep -rn "{{" src/ index.html` — should return zero
   matches.
3. **Replace placeholder images** in `public/images/`. Keep the filenames
   exactly as they are (`hero.jpg`, `about.jpg`, `services-bg.jpg`,
   `gallery-1.jpg` … `gallery-6.jpg`, `logo.png`, `logo-icon.png`) so no
   code references break. See `public/images/README.md` for purpose and
   recommended dimensions.
4. **Update the favicon** if the client provides one. The current
   `index.html` references `/vite.svg`; replace with the client's file
   (PNG or SVG) under `public/` and update the `<link rel="icon">` href.
5. **Update brand colors** by find/replacing hex codes in `src/App.jsx`.
   Colors live as Tailwind arbitrary-value classes (e.g. `bg-[#C9A96E]`,
   `text-[#C9A96E]`, `border-[#C9A96E]/50`) **and** in two inline
   `style={{ background: 'radial-gradient(…, rgba(201,169,110,…)) }}`
   blocks in the Contact section. Replace both hex and the matching `rgb`
   values. See `## Brand customization` for the full token table.
6. **Update `package.json`** `name` field to a client-appropriate slug
   (e.g. `saguaro-vista-site`). This is also the default Netlify site
   slug if Netlify isn't pre-configured.
7. **Run the pre-deploy checklist** in `## Pre-deploy checklist`.
8. **Build and deploy.** `npm run build` produces `dist/`. Commit and push
   to `main`; Netlify auto-deploys. See `## Deployment`.

---

## Required client information

Every placeholder that exists in the template, grouped logically. Read off
of this list when intaking a client — every entry must have a real value
before `npm run build`. Canonical list generated from
`grep -oE "\{\{[A-Z_0-9]+\}\}" src/App.jsx index.html`.

### Business identity

| Placeholder              | Where it appears                                       |
| ------------------------ | ------------------------------------------------------ |
| `{{BUSINESS_NAME}}`      | `<title>`, image alts, contact-card logo alt           |
| `{{BUSINESS_SHORT_NAME}}`| "About {{BUSINESS_SHORT_NAME}}" eyebrow, footer ©line  |

The template has **no separate tagline placeholder** — the hero headline
(`{{HERO_HEADLINE_PRIMARY}}` + `{{HERO_HEADLINE_ACCENT}}`) functions as
the tagline.

### Contact

| Placeholder         | Format / notes                                         |
| ------------------- | ------------------------------------------------------ |
| `{{PHONE}}`         | Display format, e.g. `(480) 555-0199`                  |
| `{{PHONE_DIGITS}}`  | Digits only for `tel:` href, e.g. `4805550199`         |
| `{{EMAIL}}`         | Used both as display text **and** the `mailto:` href   |

### Location

| Placeholder        | Format / notes                                          |
| ------------------ | ------------------------------------------------------- |
| `{{CITY}}`         | Used in hero eyebrow "City · State"                     |
| `{{STATE}}`        | Used in hero eyebrow "City · State"                     |
| `{{ADDRESS}}`      | Full street address shown in Contact section. **Include ZIP here** — no separate ZIP placeholder exists. |
| `{{LOCATION}}`     | Short "City, State" form shown in footer © line         |

### Regulatory

The template has **no dedicated `{{LICENSE_NUMBER}}` placeholder**. Include
the Arizona DHS license number inside `{{LICENSE_TEXT}}` using this format:

```
Licensed Assisted Living Facility · AZ DHS License #AL00000C
```

| Placeholder         | Notes                                                  |
| ------------------- | ------------------------------------------------------ |
| `{{LICENSE_TEXT}}`  | Footer eyebrow. **Must include the AZ DHS license number** for production. See `## Compliance flags`. |

### Brand

Colors are not driven by placeholders — they are hex values inlined in
Tailwind arbitrary classes throughout `src/App.jsx`. See
`## Brand customization` for the hex tokens and how to swap them.

### Hero

| Placeholder                 | Notes                                            |
| --------------------------- | ------------------------------------------------ |
| `{{HERO_HEADLINE_PRIMARY}}` | First line, rendered in white                    |
| `{{HERO_HEADLINE_ACCENT}}`  | Second line, italic + gold                       |
| `{{HERO_SUBTEXT}}`          | Short paragraph below the headline               |
| `{{STAT_1_NUMBER}}` / `{{STAT_1_LABEL}}` / `{{STAT_1_LABEL_SHORT}}` | First stat. `_SHORT` is the mobile-friendly label (≤ ~10 chars). |
| `{{STAT_2_NUMBER}}` / `{{STAT_2_LABEL}}` / `{{STAT_2_LABEL_SHORT}}` | Second stat |
| `{{STAT_3_NUMBER}}` / `{{STAT_3_LABEL}}` / `{{STAT_3_LABEL_SHORT}}` | Third stat  |

### Pillars (the three icon cards below the hero)

| Placeholder           | Notes                                          |
| --------------------- | ---------------------------------------------- |
| `{{PILLAR_1_TITLE}}`  | Suggested icon: `✦` (already in JSX)           |
| `{{PILLAR_1_BODY}}`   | ~25 words                                      |
| `{{PILLAR_2_TITLE}}`  | Suggested icon: `❋`                            |
| `{{PILLAR_2_BODY}}`   | ~25 words                                      |
| `{{PILLAR_3_TITLE}}`  | Suggested icon: `♡`                            |
| `{{PILLAR_3_BODY}}`   | ~25 words                                      |

### About section

| Placeholder                  | Notes                                          |
| ---------------------------- | ---------------------------------------------- |
| `{{ABOUT_IMAGE_CAPTION}}`    | Italic line overlaid on the left photo         |
| `{{ABOUT_HEADLINE_PRIMARY}}` | First line of section headline                 |
| `{{ABOUT_HEADLINE_ACCENT}}`  | Second line, italic + gold                     |
| `{{ABOUT_PARAGRAPH_1}}`      | Body paragraph 1                               |
| `{{ABOUT_PARAGRAPH_2}}`      | Body paragraph 2                               |
| `{{ABOUT_BLOCKQUOTE}}`       | Gold-bordered pull quote at the bottom         |

### Services section

| Placeholder                     | Notes                                       |
| ------------------------------- | ------------------------------------------- |
| `{{SERVICES_HEADLINE_PRIMARY}}` | First line                                  |
| `{{SERVICES_HEADLINE_ACCENT}}`  | Second line, italic + gold                  |
| `{{SERVICES_SUBTEXT}}`          | Intro paragraph                             |
| `{{SERVICE_1_TITLE}}` / `{{SERVICE_1_DESCRIPTION}}` | Tier 01           |
| `{{SERVICE_2_TITLE}}` / `{{SERVICE_2_DESCRIPTION}}` | Tier 02           |
| `{{SERVICE_3_TITLE}}` / `{{SERVICE_3_DESCRIPTION}}` | Tier 03           |

To add or remove tiers: edit the `services` array near the top of
`src/App.jsx`.

### Gallery

| Placeholder                    | Notes                                        |
| ------------------------------ | -------------------------------------------- |
| `{{GALLERY_HEADLINE_PRIMARY}}` | First line                                   |
| `{{GALLERY_HEADLINE_ACCENT}}`  | Second line, italic + gold                   |
| `{{GALLERY_SUBTEXT}}`          | Intro paragraph                              |
| `{{GALLERY_1_LABEL}}` … `{{GALLERY_6_LABEL}}` | One short caption per tile (caps, ≤ ~20 chars). Order: 1 = large featured tile, 2–6 = supporting tiles. |

### Testimonial / quote band

| Placeholder                  | Notes                                          |
| ---------------------------- | ---------------------------------------------- |
| `{{TESTIMONIAL_QUOTE}}`      | One sentence, italic, centered                 |
| `{{TESTIMONIAL_ATTRIBUTION}}`| Short attribution under the quote              |

### Contact section

| Placeholder                    | Notes                                         |
| ------------------------------ | --------------------------------------------- |
| `{{CONTACT_HEADLINE_PRIMARY}}` | First line                                    |
| `{{CONTACT_HEADLINE_ACCENT}}`  | Second line, italic + gold                    |
| `{{CONTACT_SUBTEXT}}`          | Short invitation paragraph                    |

### Meta

| Placeholder              | Where                                              |
| ------------------------ | -------------------------------------------------- |
| `{{META_DESCRIPTION}}`   | `<meta name="description">` in `index.html`        |

> The literal token `{{PLACEHOLDER}}` also appears inside an explanatory
> comment block at the top of `src/App.jsx`. That one is **not a real
> placeholder** — leave it alone, or delete the whole comment block once
> you're done customizing.

---

## Image requirements

`public/images/README.md` is **authoritative**. Read it before sourcing
images. Summary:

| Filename            | Purpose                                                | Min size            |
| ------------------- | ------------------------------------------------------ | ------------------- |
| `logo.png`          | Full brand logo with text (Contact card)               | ~1000 × 600, PNG transparent |
| `logo-icon.png`     | Icon-only mark (nav top-left, footer bottom-left)      | ~400 × 400, PNG transparent  |
| `hero.jpg`          | Full-screen hero background                            | ≥ 2400 × 1600       |
| `about.jpg`         | About section, left half (portrait works best)         | ≥ 1200 × 1600       |
| `services-bg.jpg`   | Services background (90% dark overlay — texture only)  | ≥ 2000 × 1400       |
| `gallery-1.jpg`     | Gallery featured tile (2×2 cell, top-left)             | ≥ 1600 × 1200       |
| `gallery-2.jpg` … `gallery-6.jpg` | Gallery supporting tiles                | ≥ 1000 × 800        |

Rules:

- **Keep filenames exact.** Renaming requires touching `src/App.jsx`.
- **JPEG for photos, PNG for transparent logos.** Target ≤ 300 KB per JPEG, ≤ 100 KB per PNG.
- All photos use `object-cover` — focal subjects belong near center.
- Update gallery `{{GALLERY_n_LABEL}}` text to match what each new photo shows.

---

## Brand customization

### Colors

Defined as **inline Tailwind arbitrary-value classes** throughout
`src/App.jsx`. There is **no `tailwind.config.js` or CSS variables file**
to edit — to rebrand, find/replace each hex token below across `App.jsx`,
and also update the two inline `rgba(...)` gradients in the Contact section.

| Token              | Hex       | Role                                              |
| ------------------ | --------- | ------------------------------------------------- |
| Warm gold (primary)| `#C9A96E` | Italic headlines, buttons, dividers, gallery labels |
| Light gold (hover) | `#D4AF6A` | Gold button hover state                           |
| Cream (light bg)   | `#EFE5D3` | Main background in light mode                     |
| Deeper tan         | `#E5D8BD` | Alt sections (pillars, quote band) light mode     |
| Espresso text      | `#2A1810` | Body text in light mode                           |
| Muted brown        | `#5C4633` | Secondary text in light mode                      |
| Deep coffee        | `#1F140C` | Photo overlays, footer, brown contact card        |
| Near-black         | `#0D0D0D` | Main background in dark mode                      |
| Off-black alt      | `#111111` | Pillars / quote band in dark mode                 |

For a two-color client brief (primary + accent):

- **Primary color** → replace `#C9A96E` (and `#D4AF6A` as a slightly lighter hover variant — bump lightness ~5%).
- **Accent color** → use sparingly. The cleanest place to inject it is the
  pillar icons (`✦ ❋ ♡`), the gallery label dashes, and the gold radial
  glows in the Contact section. Replace `#C9A96E` selectively in those
  spots only — or globally if the client wants a single brand color.
- For the `rgba(...)` values in the two Contact-section radial gradients,
  convert the new primary hex to RGB and substitute. Existing values:
  `rgba(201,169,110,…)` = `#C9A96E`, `rgba(212,175,106,…)` = `#D4AF6A`.

### Fonts

Loaded via Google Fonts in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
```

Applied via Tailwind arbitrary classes: `font-['Playfair_Display']` and
`font-['Jost']`. To swap: update the Google Fonts URL **and** find/replace
the two font-family class names across `src/App.jsx`.

### Logo

If the client provides a logo:

- **With text** → save as `public/images/logo.png` (transparent background).
- **Icon only** → save as `public/images/logo-icon.png` (square transparent PNG).
- If they only provide one, derive the other (crop the icon out of the full logo, or vice versa).
- If they have an SVG, you can convert to PNG or update the two `<img>` tags in `App.jsx` to point at the SVG.

---

## Pre-deploy checklist

Run every item. Don't skip.

- [ ] All `{{PLACEHOLDERS}}` replaced. Verify with `grep -rn "{{" src/ index.html` → expect zero matches (ignoring the explanatory comment block at the top of `App.jsx`).
- [ ] **Arizona DHS license number** visible in the footer (inside `{{LICENSE_TEXT}}` per the format above).
- [ ] Meta tags updated in `index.html`: `<title>`, `<meta name="description">`. Add `og:image` and `og:title` if the client cares about social previews — the template ships without them.
- [ ] Favicon swapped. Confirm the `<link rel="icon">` href in `index.html` resolves to a file that actually exists in `public/`.
- [ ] Contact links functional. Click the Contact phone + email links in `npm run dev` and confirm they trigger the dialer / mail client on a real device.
- [ ] All placeholder images replaced with real client photos. Run `ls public/images/` and compare to the image table above — every required file present.
- [ ] **Image alt text** is descriptive on every `<img>`. Open `src/App.jsx`, search `alt="`, ensure no `alt="{{BUSINESS_NAME}}"` or generic alts remain — replace with descriptive text per image.
- [ ] Mobile responsive check passed. Use Chrome DevTools device toolbar at iPhone 14 + Pixel 7 widths. Verify: nav hamburger opens drawer, hero text doesn't overflow, gallery tiles stack 2-up, contact card and buttons stack.
- [ ] **Phone number sanity check.** Call `{{PHONE}}` from a separate device. Confirms the number is correct and that the `tel:` link triggers the dialer on mobile.
- [ ] **Email deliverability check.** Send a test message to `{{EMAIL}}` from an external inbox (not the client's own domain). Confirms the address is live, monitored, and not silently bouncing.
- [ ] **Google Business Profile NAP match.** Confirm the business name, address, and phone on the site match the client's Google Business Profile exactly. Mismatched NAP across web and GBP is a real SEO problem for local-search-dependent businesses.
- [ ] **LocalBusiness JSON-LD present.** Open `index.html` and verify a `<script type="application/ld+json">` block exists with `@type: "AssistedLivingFacility"` (preferred) or `"LocalBusiness"` (fallback), populated with the client's name, address, phone, and URL.
- [ ] **WCAG AA contrast** on all text. Gold on cream (light mode) is the riskiest pair — verify with a contrast checker. If failing, darken the gold or use the espresso color for body text instead.
- [ ] No console errors in browser dev tools on `npm run dev`.
- [ ] `npm run build` succeeds with no warnings. Review the terminal output, not just the exit code.

---

## Deployment

- **Host:** Netlify, Git auto-deploy from `main` branch.
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** Vite 8 requires Node 20+ — set `NODE_VERSION = 20` in Netlify env vars if their default is older.
- **HTTPS:** Netlify auto-provisions via Let's Encrypt. **Toggle "Force HTTPS" on** in Site settings → Domain management.
- **Custom domain:** add via Site settings → Domain management → Add custom domain; client points their DNS A/CNAME at Netlify per the on-screen instructions.

Optional but recommended: add a `netlify.toml` at the repo root so the
build settings are version-controlled instead of UI-configured:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

---

## Tech stack and constraints

- **Vite 8 + React 19 + Tailwind CSS v4** (via `@tailwindcss/vite`).
- **Single-page React app.** All routing is anchor-link scroll on a single route (`#about`, `#services`, `#gallery`, `#contact`).
- **No `tailwind.config.js`** — Tailwind v4 uses CSS-first config; the only `@custom-variant dark` lives in `src/index.css`.
- **No router, no state management, no backend, no CMS.**
- **Don't add frameworks, routing libraries, or backends without discussing with the user first.**
- If a client needs **multi-page** (e.g. separate pages for each care level, a blog), **SSR/SSG** (for SEO beyond basic meta tags), or a **CMS** (so the client can edit copy themselves), **flag it before starting**. The template will need to be rewritten on a different stack (likely Next.js or Astro) — this is not a small change.

---

## Common client requests

Patterns for the most-likely asks. Match the existing section conventions:
`max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-20 md:py-24 lg:py-32`, headlines
in `font-['Playfair_Display'] text-[34px] sm:text-4xl md:text-5xl lg:text-[52px]`
with the italic-gold accent span, gold `{{...HEADLINE_ACCENT}}` style.

### Adding more testimonials

The current Quote Band shows one centered quote. To add a multi-card
testimonials section:

- Insert a new `<section>` between Gallery and Quote Band.
- Use a 3-column grid (`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8`).
- Each card: dark coffee background, gold quote mark, italic Playfair body, attribution underneath. Mirror the brown contact-card styling.
- Keep the existing Quote Band as the closer "hero quote" if the client wants a featured one.

### Adding gallery rows

The gallery is `grid-cols-2 lg:grid-cols-6` with `auto-rows-[…]`. To add
more photos:

- Add new files `gallery-7.jpg`, `gallery-8.jpg`, etc. under `public/images/`.
- Add matching `<GalleryImg>` components inside the gallery grid in `src/App.jsx`.
- Update `public/images/README.md` and the image-requirements table above so they stay accurate.
- Spans: large featured = `col-span-2 lg:col-span-4 row-span-2`; standard tile = `col-span-2 lg:col-span-2`; half-width-on-mobile = `col-span-1 lg:col-span-2`.

### Adding a careers / jobs section

- Insert between About and Services, or after Services.
- Headline + intro paragraph (mirror About / Services layout).
- Job listings can be a static list (title, schedule, "Apply" mailto link) or a single CTA pointing at the client's preferred job board (Indeed / LinkedIn).
- Add `Careers` to the `navLinks` array in `App.jsx` and matching `scroll-mt-20 md:scroll-mt-28 lg:scroll-mt-40` on the new section.

### Adding a virtual tour video

- Use a wrapper with `aspect-video` (Tailwind) to lock 16:9.
- Embed via `<iframe>` (YouTube/Vimeo) or `<video>` (self-hosted MP4).
- Place after About or after Gallery.
- If autoplay: `muted` and `playsInline` are required for mobile browsers.

### Adding staff bios

- 3- or 4-column grid below About.
- Each card: square portrait (`aspect-square object-cover`), name in Playfair, role in gold uppercase eyebrow, 2–3 line bio.
- Add staff portraits under `public/images/staff/` (new subfolder) and document in `public/images/README.md`.

---

## Compliance flags for the assisted-living vertical

- **Arizona DHS license number must be displayed in the footer.** This is a regulatory requirement for licensed AZ assisted-living facilities. Verify before launch — embed it inside `{{LICENSE_TEXT}}` (no dedicated placeholder exists). Without it, the site is non-compliant.
- **Fair Housing language is recommended** in the footer (e.g. an "Equal Housing Opportunity" line or logo). Not strictly required for assisted living, but standard practice — confirm with the client.
- **HIPAA risk if any form collects health information.** The template ships with **no forms** — Contact uses `tel:` and `mailto:` only, which is HIPAA-safe. If the client requests an intake form, inquiry form, or anything else that captures resident health info or PHI, **flag it for HIPAA review** before building. Don't add a form-handling service (Formspree, Netlify Forms, etc.) for health-info collection without confirming compliance posture.
- **Never use placeholder values for license number, address, or phone in production.** A `{{LICENSE_TEXT}}` or `(480) 555-…` value reaching `main` is a launch-blocker, not a typo to fix later.
- **Verify license accuracy.** The Arizona DHS license number lookup is at <https://azdhs.gov/licensing/medical-facilities/> — confirm the number matches the licensed entity name the client provided before publishing.
