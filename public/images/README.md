# Images — what to drop in

Replace every file below with a real photo or logo. **Keep the filename
unchanged** so you don't have to touch `src/App.jsx`. Anything you drop
into `public/` is served from the site root at runtime (e.g. `/images/hero.jpg`).

| Filename            | Purpose                                                          | Recommended size       | Notes                                              |
| ------------------- | ---------------------------------------------------------------- | ---------------------- | -------------------------------------------------- |
| `logo.png`          | Full brand logo with text (shown in the contact card)            | ~1000 × 600 px         | PNG with transparent background. Looks best wider than tall. |
| `logo-icon.png`     | Icon-only mark (nav top-left, footer bottom-left)                | ~400 × 400 px          | Square or near-square PNG with transparent background. Displayed at `h-40` (160px) on desktop. |
| `hero.jpg`          | Hero background — front of the home, exterior, or wide interior  | ≥ 2400 × 1600 px       | Heavily darkened by overlay; choose a photo with rich detail. |
| `about.jpg`         | About-section image (left half of the split layout)              | ≥ 1200 × 1600 px       | Portrait-oriented works best; gradient fades to dark at bottom. |
| `services-bg.jpg`   | Services-section background (90% dark overlay)                   | ≥ 2000 × 1400 px       | Almost invisible — provides subtle texture only.   |
| `gallery-1.jpg`     | Gallery hero tile (large 2×2 cell, top-left of the grid)         | ≥ 1600 × 1200 px       | Your most striking photo.                          |
| `gallery-2.jpg`     | Gallery tile                                                     | ≥ 1200 × 900 px        |                                                    |
| `gallery-3.jpg`     | Gallery tile                                                     | ≥ 1200 × 900 px        |                                                    |
| `gallery-4.jpg`     | Gallery tile (half-width on mobile)                              | ≥ 1000 × 800 px        |                                                    |
| `gallery-5.jpg`     | Gallery tile (half-width on mobile)                              | ≥ 1000 × 800 px        |                                                    |
| `gallery-6.jpg`     | Gallery tile                                                     | ≥ 1200 × 900 px        |                                                    |

## Tips

- **Compress** with [Squoosh](https://squoosh.app) or similar — aim for
  ≤ 300 KB per JPEG, ≤ 100 KB per PNG. Hero can go a bit larger.
- **JPEG** for photos, **PNG** only for logos with transparency.
- All photos use `object-cover`, so focal subjects should sit near the
  center of the frame (or expect cropping at small screens).
- Each gallery tile also has a short `{{GALLERY_n_LABEL}}` rendered at the
  bottom in gold caps — edit those in `src/App.jsx` to match what's shown.
