# Ba Chanh Truc Le — Marketing, Creative Ops & AI Systems Portfolio

[![Live Site](https://img.shields.io/badge/Live%20Portfolio-lebachanhtruc.ca-0f766e?style=flat-square)](https://www.lebachanhtruc.ca)
[![Profile Mode](https://img.shields.io/badge/View-Capabilities%20%26%20Case%20Studies-172536?style=flat-square)](https://www.lebachanhtruc.ca/?mode=builder)

A dual-mode trilingual (`EN` / `FR` / `VI`) web platform serving as both:
1. **TYM Production Studio & Services** — showcasing commercial culinary & luxury photography, generative AI visual production, conversion-tracked multilingual brand websites (e.g., `patisseriedzung.ca` with GA4 Consent Mode v2, Microsoft Clarity heatmaps, 50/50 Hero CTA A/B testing, O2O packaging QR `/goi-bo`, Google Search Console, branded UTMs & Québec Law 25), 4K animated menus, storefront TV signage, and interactive client quotations across Montréal & South Shore, QC.
2. **Marketing, Creative Operations & AI Systems Profile** (`?mode=builder`) — showcasing measurable growth & operational work by **Ba Chanh Truc Le** (*Pâtisserie Dzung Live Growth & CRO Lab*, *Lime Payroll Enterprise* cutting bi-weekly payroll reconciliation by **85%**, **$2.3M+ multi-site F&B operations** with **+12% YoY** digital orders, **LXRandCo Photography Lead – North America**, and **PSPO I — 91.3%**).

---

## Live Links

- **Studio & Portfolio:** https://www.lebachanhtruc.ca
- **Capabilities & Case Studies Mode:** https://www.lebachanhtruc.ca/?mode=builder
- **Live Client Growth & CRO Lab:** https://www.patisseriedzung.ca
- **AI Operations SaaS Sandbox (Lime Payroll):** https://enterprise-payroll.vercel.app/

---

## Key Features

- **Dual-Profile Switching (`agency` / `cv` mode):** Instantly switches hero messaging, overview metrics, and case-study highlights between the commercial creative studio view and the Product Builder / AI Operations dossier.
- **Trilingual Localization (`EN` / `FR` / `VI`):** Complete multi-language support powered by structured JSON locales (`src/locales/en.json`, `fr.json`, `vi.json`) and a custom `LanguageContext`.
- **Interactive Quote Builder & Shareable Client Proposals:** Built-in pricing configurator (`InteractiveQuoteSection.tsx`) with persistent short-link proposals (`/api/quotes` backed by **Vercel Blob**) via `?q=<shortId>`.
- **Visual Showcase UX:** Interactive before/after AI image retouching slider (`BeforeAfterSlider.tsx`), viewport-aware lazy video playback (`ViewportVideo.tsx`), and categorized project grids.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite |
| **Serverless API & Storage** | Vercel Functions (`api/quotes.ts`), `@vercel/blob` |
| **Code Quality** | Oxlint (`.oxlintrc.json`) |
| **Deployment** | Vercel |

---

## Project Structure

```text
portfolio/
├── api/
│   └── quotes.ts          # Serverless endpoint for storing & loading shareable client quotes
├── public/                # Optimized static images, media, and OG cover
├── src/
│   ├── components/        # HeroSection, AboutSection, ProjectGrids, InteractiveQuoteSection, etc.
│   ├── contexts/          # LanguageContext (EN / FR / VI)
│   ├── data/              # Structured projects.json & quotes.json datasets
│   ├── locales/           # Translation bundles (en.json, fr.json, vi.json)
│   ├── utils/             # Quote token encoding/decoding & smooth scrolling helpers
│   ├── App.tsx            # Mode routing (?mode=builder, ?q=, ?admin=1) & section navigation
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Lint with oxlint
npm run lint

# Type-check and build for production
npm run build
```

---

## Connect

- **LinkedIn:** [linkedin.com/in/lebachanhtruc](https://www.linkedin.com/in/lebachanhtruc)
- **Email:** lebachanhtruc@gmail.com
- **Location:** Longueuil / Montréal, QC, Canada
