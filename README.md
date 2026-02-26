# Index Building – Premium Next.js Website

Rebuilt website for [indexbuilding.com.au](https://indexbuilding.com.au) using extracted on-site content.

## Stack

- **Next.js 14** App Router (static generation)
- **TypeScript** (strict)
- **Tailwind CSS** with custom design tokens
- **next/font** (Inter + Playfair Display)
- **next/image** everywhere

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the crawler (re-extract content)

```bash
npm run crawl
```

This runs `scripts/fetch-assets.ts` via `tsx`, which:
- Downloads all images from the Wayback Machine archive (Oct 2024 snapshot) into `/public/assets/images/`
- Writes structured JSON to `/_content/site.json`
- Saves HTML snapshots to `/_source_snapshots/`

### 3. Development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build

```bash
npm run build
npm start
```

---

## Content Architecture

All content is data-driven from `/_content/site.json`. The schema is typed in `src/types/site.ts`.

| JSON path | Page |
|-----------|------|
| `pages.home` | `/` |
| `pages.about` | `/about` |
| `pages.services` | `/services` |
| `pages.projects` | `/projects` |
| `pages.contact` | `/contact` |
| `business` | Global (Navbar, Footer, JSON-LD) |
| `assets.logo` | Navbar logo |
| `assets.images[]` | All downloaded assets |

Content is imported via `src/lib/site-data.ts` which re-exports typed helpers.

---

## SEO

### Per-page metadata
Each page exports `metadata: Metadata` with:
- `title` (using template `%s | Index Building`)
- `description`
- `openGraph` (title, description, url, images)
- `alternates.canonical`

### Global
- `src/app/robots.ts` → `/robots.txt`
- `src/app/sitemap.ts` → `/sitemap.xml`
- JSON-LD (`HomeAndConstructionBusiness + LocalBusiness`) injected on home page via `<SEOJsonLd />`

### Lighthouse Performance Checklist

Run locally after build:

```bash
npm run build && npm start
# Then in a separate terminal:
npx lighthouse http://localhost:3000 --view --preset=desktop
npx lighthouse http://localhost:3000 --view  # mobile (default)
```

Target scores:
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

Optimisation notes:
- Hero image: `priority` prop → LCP preload
- All images use `next/image` with `fill` + `sizes` hints → CLS ~0
- Fonts: `display: 'swap'` → no FOIT
- Minimal JS on static pages (no client components on home)
- Tailwind CSS is purged to minimal bundle

---

## CTA System

### Primary CTA
- Label: **"Contact Us"**
- Href: `/contact`
- Defined in `src/lib/site-data.ts` (`PRIMARY_CTA_LABEL`, `PRIMARY_CTA_HREF`)
- Appears in: Navbar, Hero, every `<PrimaryCTA />` section

### Floating CTA (`<FloatingCTA />`)
- **Trigger**: appears after user scrolls > 60% of page height
- **Dismissal**: click ✕ to dismiss; state stored in `localStorage` for 7 days (`indexbuilding_floatingcta_dismissed`)
- **Accessibility**: `role="complementary"`, `aria-label`, focusable dismiss button, `aria-label="Dismiss"`
- **Reduced motion**: skips slide-up animation if `prefers-reduced-motion: reduce`
- **Mobile safe**: `env(safe-area-inset-bottom)` padding, rounded-pill design doesn't cover content
- **Performance**: tiny component, lazy-triggered by scroll event, no external dependencies

---

## Design System

Defined in `tailwind.config.ts`:

| Token | Value |
|-------|-------|
| Container | `max-w-[1240px]` |
| Font display | Playfair Display (serif) |
| Font body | Inter |
| H1 | `clamp(2.5rem, 5vw, 3.5rem)` |
| H2 | `clamp(2rem, 4vw, 2.75rem)` |
| Body | `1.125rem` / `1rem` |
| Section padding | `py-16` (mobile) / `py-24` (desktop) |
| Card radius | `rounded-[1rem]` |
| Animations | fade-up 150ms, slide-up 180ms |

---

## Pages

| Route | Template |
|-------|----------|
| `/` | Home – Hero, Services, Gallery, About preview, CTA |
| `/about` | Company story, testimonial, services list |
| `/services` | Full service descriptions with images |
| `/projects` | Editorial masonry gallery + project list |
| `/contact` | Contact form + office details |

---

## API Routes

### `POST /api/contact`

Request body:
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (optional)",
  "subject": "string (optional)",
  "message": "string (required)"
}
```

Response: `{ "success": true }` or `{ "error": "..." }`

In development, submissions are logged to console. To add email integration, update `src/app/api/contact/route.ts`.
