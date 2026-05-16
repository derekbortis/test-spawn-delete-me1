# Assisted Living — Single-Page Site Template

A premium, fully responsive single-page React + Vite + Tailwind CSS v4 site
designed for small assisted-living facilities. Includes a light/dark mode
toggle, a mobile drawer menu, and a warm tan + gold brand palette.

---

## Quick start

```bash
npm install
npm run dev      # local dev server (http://localhost:5173)
npm run build    # production bundle → ./dist
npm run preview  # serve the production bundle locally
```

Tech stack: **React 19**, **Vite 8**, **Tailwind CSS v4** (via
`@tailwindcss/vite`), **Playfair Display + Jost** from Google Fonts.

---

## What to replace when reusing this template

All client-specific copy is marked with `{{DOUBLE_BRACED_PLACEHOLDERS}}`.
Do a project-wide find/replace for each.

### Identity & contact (touched in `src/App.jsx` and `index.html`)

| Placeholder              | Example                                       | Notes                                              |
| ------------------------ | --------------------------------------------- | -------------------------------------------------- |
| `{{BUSINESS_NAME}}`      | `Tramonto Desert Rose Assisted Living`        | Full legal/marketing name. Used in `<title>`, alts. |
| `{{BUSINESS_SHORT_NAME}}`| `Tramonto Desert Rose`                        | Conversational form. Used in copy + footer.        |
| `{{PHONE}}`              | `(480) 826-5087`                              | Display format.                                    |
| `{{PHONE_DIGITS}}`       | `4808265087`                                  | Digits only — for `tel:` links.                    |
| `{{EMAIL}}`              | `hello@example.com`                           | Used for display **and** the `mailto:` href.       |
| `{{CITY}}`               | `Phoenix`                                     | Used in the hero eyebrow.                          |
| `{{STATE}}`              | `Arizona`                                     | Used in the hero eyebrow.                          |
| `{{ADDRESS}}`            | `Phoenix, Arizona` or `1234 Rose Ln, Phoenix` | Shown in the Contact section.                      |
| `{{LOCATION}}`           | `Phoenix, Arizona`                            | Shown in the footer copyright line.                |
| `{{LICENSE_TEXT}}`       | `Licensed Assisted Living Facility`           | Footer eyebrow line.                               |
| `{{META_DESCRIPTION}}`   | `Personalized assisted living care in …`      | `<meta name="description">` in `index.html`.       |

### Hero

| Placeholder                 | Example                                          |
| --------------------------- | ------------------------------------------------ |
| `{{HERO_HEADLINE_PRIMARY}}` | `Where Every`                                    |
| `{{HERO_HEADLINE_ACCENT}}`  | `Life is Honored` *(rendered italic + gold)*     |
| `{{HERO_SUBTEXT}}`          | `Personalized, compassionate care in a …`        |

### Hero stats (3 columns, used both desktop & mobile)

| Placeholder              | Example       |
| ------------------------ | ------------- |
| `{{STAT_1_NUMBER}}`      | `10+`         |
| `{{STAT_1_LABEL}}`       | `Years Experience` |
| `{{STAT_1_LABEL_SHORT}}` | `Years`       |
| `{{STAT_2_NUMBER}}`      | `3`           |
| `{{STAT_2_LABEL}}`       | `Care Levels` |
| `{{STAT_2_LABEL_SHORT}}` | `Care Levels` |
| `{{STAT_3_NUMBER}}`      | `100%`        |
| `{{STAT_3_LABEL}}`       | `Family Centered` |
| `{{STAT_3_LABEL_SHORT}}` | `Family`      |

### Pillars (3 cards)

| Placeholder         | Example                                          |
| ------------------- | ------------------------------------------------ |
| `{{PILLAR_1_TITLE}}`| `Licensed & Certified`                           |
| `{{PILLAR_1_BODY}}` | `Fully licensed assisted living facility …`      |
| `{{PILLAR_2_TITLE}}`| `Intimate Home Setting`                          |
| `{{PILLAR_2_BODY}}` | `A small, family-run residence where …`          |
| `{{PILLAR_3_TITLE}}`| `Family Legacy of Care`                          |
| `{{PILLAR_3_BODY}}` | `More than a decade of hands-on caregiving …`    |

### About section

| Placeholder                  | Example                                          |
| ---------------------------- | ------------------------------------------------ |
| `{{ABOUT_IMAGE_CAPTION}}`    | `A place where comfort, dignity, …`              |
| `{{ABOUT_HEADLINE_PRIMARY}}` | `Serving Others Is`                              |
| `{{ABOUT_HEADLINE_ACCENT}}`  | `Who We Are` *(rendered italic + gold)*          |
| `{{ABOUT_PARAGRAPH_1}}`      | First body paragraph.                            |
| `{{ABOUT_PARAGRAPH_2}}`      | Second body paragraph.                           |
| `{{ABOUT_BLOCKQUOTE}}`       | The gold-bordered pull quote at the bottom.      |

### Services section

| Placeholder                     | Example                                        |
| ------------------------------- | ---------------------------------------------- |
| `{{SERVICES_HEADLINE_PRIMARY}}` | `Three Tiers of`                               |
| `{{SERVICES_HEADLINE_ACCENT}}`  | `Thoughtful Care` *(italic + gold)*            |
| `{{SERVICES_SUBTEXT}}`          | Paragraph beneath the headline.                |
| `{{SERVICE_1_TITLE}}`           | `Supervisory Care`                             |
| `{{SERVICE_1_DESCRIPTION}}`     | Body text for service 01.                      |
| `{{SERVICE_2_TITLE}}`           | `Personal Care`                                |
| `{{SERVICE_2_DESCRIPTION}}`     | Body text for service 02.                      |
| `{{SERVICE_3_TITLE}}`           | `Directed Care`                                |
| `{{SERVICE_3_DESCRIPTION}}`     | Body text for service 03.                      |

To add or remove tiers, edit the `services` array near the top of
`src/App.jsx`.

### Gallery

| Placeholder                    | Example                          |
| ------------------------------ | -------------------------------- |
| `{{GALLERY_HEADLINE_PRIMARY}}` | `A Place That Feels`             |
| `{{GALLERY_HEADLINE_ACCENT}}`  | `Like Home` *(italic + gold)*    |
| `{{GALLERY_SUBTEXT}}`          | Intro paragraph beside headline. |
| `{{GALLERY_1_LABEL}}` … `{{GALLERY_6_LABEL}}` | One short label per tile (e.g. `The Patio`, `The Kitchen`). |

### Testimonial / quote band

| Placeholder                  | Example                                          |
| ---------------------------- | ------------------------------------------------ |
| `{{TESTIMONIAL_QUOTE}}`      | The centered italic quote.                       |
| `{{TESTIMONIAL_ATTRIBUTION}}`| Short attribution, e.g. `The Tramonto Family`.   |

### Contact section

| Placeholder                     | Example                                          |
| ------------------------------- | ------------------------------------------------ |
| `{{CONTACT_HEADLINE_PRIMARY}}`  | `Begin the`                                      |
| `{{CONTACT_HEADLINE_ACCENT}}`   | `Conversation` *(italic + gold)*                 |
| `{{CONTACT_SUBTEXT}}`           | One-line invitation to get in touch.             |

---

## Images to swap

All images live in `public/images/`. Replace each file in place — keep the
filename so the code doesn't change. See `public/images/README.md` for
recommended dimensions and what each image should show.

| File                 | Where it appears                                   |
| -------------------- | -------------------------------------------------- |
| `logo.png`           | Full brand logo with text (contact card, footer center on some skins). |
| `logo-icon.png`      | Icon-only mark (top-left nav, footer bottom-left). |
| `hero.jpg`           | Full-screen hero background.                       |
| `about.jpg`          | Left half of the About section.                    |
| `services-bg.jpg`    | Behind the Services list (heavily dimmed).         |
| `gallery-1.jpg`      | Gallery — large featured tile (top-left, 2×2).     |
| `gallery-2.jpg` … `gallery-6.jpg` | Gallery — supporting tiles.            |

---

## Brand palette

Colors are baked into Tailwind arbitrary classes throughout `src/App.jsx`.
To rebrand, find/replace the hex codes:

| Token              | Hex       | Role                                |
| ------------------ | --------- | ----------------------------------- |
| Warm gold (accent) | `#C9A96E` | Italic headlines, buttons, dividers |
| Light gold (hover) | `#D4AF6A` | Gold button hover state             |
| Cream (light bg)   | `#EFE5D3` | Main background in light mode       |
| Deeper tan         | `#E5D8BD` | Alt sections (pillars, quote band)  |
| Espresso text      | `#2A1810` | Body text in light mode             |
| Muted brown        | `#5C4633` | Secondary text in light mode        |
| Deep coffee        | `#1F140C` | Photo overlays, footer, brown card  |
| Near-black         | `#0D0D0D` | Main background in dark mode        |
| Off-black alt      | `#111111` | Pillars / quote band in dark mode   |

Fonts (loaded in `index.html`):
- **Playfair Display** — all headings, italic accents
- **Jost** (weight 300) — body text

---

## File map

```
assisted-living-template/
├── index.html              ← <title>, <meta description>, font links
├── package.json
├── vite.config.js          ← @tailwindcss/vite + @vitejs/plugin-react
├── eslint.config.js
├── src/
│   ├── App.jsx             ← entire site — every {{PLACEHOLDER}} lives here
│   ├── App.css             ← empty (kept for compatibility)
│   ├── index.css           ← `@import "tailwindcss"` + dark variant
│   └── main.jsx            ← React entry
└── public/
    ├── favicon.svg
    ├── icons.svg
    └── images/             ← swap all photos and logos here
```

---

## Recommended replacement workflow

1. **Drop in new images** under `public/images/` using the exact filenames listed above.
2. **Find/replace placeholders.** From the project root:
   - VS Code: `Ctrl+Shift+H` → find `{{` → review each match.
   - CLI: `grep -rn "{{" src/ index.html` to list every placeholder still pending.
3. **Sanity check** — once all `{{` markers are gone, run `npm run dev` and click through every section (and the mobile menu) in both light and dark modes.
4. **Rebrand colors** (optional) — search for `#C9A96E` and the other hex tokens above and replace with the new client's palette.
5. **Update `package.json`** `name` field if you want to rename the project.
6. **Ship** — `npm run build` and deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, S3, etc.).
