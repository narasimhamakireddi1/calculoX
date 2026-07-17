# calculox

**Status:** 🟡 AdSense Re-review Pending | 2026-07-17 (2 waves): (1) expanded all 14 calc layout.tsx SEO sections to 850–1,030 words each (About / Why / How-to / Examples / FAQ); (2) E-E-A-T + trust pass — new `/verification-methodology` page, expanded author page (expertise/process/commitment), `CalculatorDisclaimer` above every calc (via CalcPageWrapper, category-aware wording), homepage disclaimer strip + "Why Trust calculox?" section, nav/footer/blog-byline links, fixed stale FY 2024-25 tax FAQ on homepage | Next: deploy → request fresh GSC re-indexing → wait for re-crawl → AdSense → Sites → Request Review
**Stack:** Next.js 16.2.6 + React 19 + TypeScript + Tailwind + Decimal.js | **Build:** 55 static pages, 0 TS errors | **Last updated:** 2026-07-17
**AdSense:** Ad slots live ✅, NPA soft-consent live ✅ | **GA4:** G-GFN66QLNZP | **Publisher:** ca-pub-7034746357427731

## Quick Start
```bash
npm install --legacy-peer-deps
npm run dev    # http://localhost:3000
npm run build  # 54 pages, 0 errors
npm run lint && npm run type-check
```

**Lint (2026-07-17):** `next lint` was removed in Next 16 — `npm run lint` now runs `eslint .` via `eslint.config.mjs` (flat config; extends `eslint-config-next/core-web-vitals` + `/typescript`). `.eslintrc.json` deleted. `react/no-unescaped-entities` off (prose copy); React Hooks v7 rules (`static-components`, `set-state-in-effect`) + `no-explicit-any` downgraded to warn for pre-existing code (~134 warnings, 0 errors). `npm run lint:fix` available.

## Project Structure
```
app/                        lib/                        config/
├── layout.tsx              ├── calculators/ (14 engines) ├── calculators.config.ts
├── page.tsx                ├── tax-engine/ (9-module)    └── site.config.ts
├── *-calculator/           ├── validators/
│   ├── page.tsx            ├── blog/utils.ts             components/
│   └── layout.tsx          └── seo/schemas.ts            ├── layout/Navbar.tsx, Footer.tsx
├── blog/[slug]/                                          ├── mobile/ResultsScrollCue.tsx, CalcFAB.tsx
├── api/og/route.tsx        public/                       ├── ui/RangeSlider.tsx, ConfidenceBadge.tsx
└── robots.ts, sitemap.ts   ├── blog/*.svg (25 images)   ├── ui/RelatedCalculators.tsx, RelatedBlogPosts.tsx
                            └── ads.txt                  ├── charts/useChartColors.ts, ChartEmptyState.tsx
                                                          └── blog/ReadingProgress.tsx, BlogTOC.tsx
```

## 14 Calculators & Formulas

| Calculator | Formula | Key Features |
|---|---|---|
| EMI | P×R×(1+R)^N÷[(1+R)^N−1] | Amortization table, virtual scroll |
| SIP | FV=PMT×[((1+r)^n−1)÷r]×(1+r) | Step-up SIP, ProjectionTable, AreaChart |
| FD | A=P×(1+r/n)^(nt) | 4 modes (cumulative/quarterly/monthly/SI), senior +0.5% |
| RD | A=Monthly×[((1+r)^n−1)÷r]×(1+r) | Compound monthly, ProjectionTable |
| BMI | kg/m² or 703×lbs/in² | WHO+ICMR cutoffs, CSS horizontal gauge (no Recharts) |
| Tax | FY 2025-26 slabs | Old/New regime comparison, 9 deductions, rebate 87A. 2026-07-17 compact redesign: regime/age PillGroup tabs, collapsible HRA+Deductions (hidden when regime=new), side-by-side Old/New summary card, slab/trace/tips collapsed accordions, pie chart + education below fold, SEO/FAQ moved outside `{result &&}` (survives reset), QuickStartExamples removed (scenario keys didn't match FormData — was broken) |
| GST | Base×(1+rate/100) | 5 rates (0/5/12/18/28%), CGST/SGST/IGST breakdown |
| Percentage | 6 independent engines | Hike/discount, X%ofY, what%, reverse, sequential |
| CAGR | (EV÷BV)^(1÷n)−1 | Year-by-year, asset-class benchmarks |
| Simple Interest | SI=(P×R×T)÷100 | 3 tracks (Y/M/D), leap-year auto-detect, ProjectionTable |
| Retirement | 4-step NISM framework | 10 inputs, dual-phase, ProjectionTable |
| Home Loan vs Rent | Opportunity Cost dual-track | 13 inputs, month-by-month, break-even, Section 24(b) |
| Profit Margin | Cost-driven/Price-driven + GST | 2-mode, margin dilution warning, GST exclusive/inclusive |
| Scientific | Tokenizer→Shunting-Yard→RPN | Standard/Complex/Matrix/Statistics, 4 engines, history |

**All calculators:** lazy `useState` initializer (zero CLS on first paint) · 300ms debounce auto-calc · `id="[calc]-results"` on results div · `[id$="-results"]` pattern used by mobile FABs · main form+results grid uses `grid grid-cols-1 lg:grid-cols-2 gap-8` (Tax: `gap-6`, compact EMI-style layout since 2026-07-17) with `min-w-0` on both direct children · h1: `text-3xl sm:text-4xl font-bold mb-4 text-gradient flex flex-wrap items-center justify-center gap-2`

## Component Inventory

**Global (app/layout.tsx):** `ResultsScrollCue` + `CalcFAB` + `CookieConsent` + `AdSenseLoader` + `GoogleAnalyticsLoader`

**RangeSlider (`components/ui/RangeSlider.tsx`):**
- Extracts `accent-{color}-{shade}` from className → 30-entry `ACCENT_FILL` hex map → CSS custom props `--fill-pct`, `--fill-color`, `--thumb-color`
- 6px track (was 12px), 22px mobile thumb (was 28px), progress fill updates live
- Floating drag tooltip: `percent = ((value-min)/(max-min))×100`, `thumbOffset = 8 - 0.16×percent`
- Sizing classes extracted via regex → applied to wrapper `<div>`, not `<input>`

**Slider mobile override (`app/globals.css`):** `@media (max-width:767px)` `:has()` rule — `div:has(> div > input[type="range"]) > input[type="number"]` → white card (bg white, border #e2e8f0, rounded-xl). Dark: bg #1e293b, border #334155. Specificity [0,2,4] beats Tailwind [0,1,0], no !important needed.

**Slider dark mode track (`app/globals.css`):** `html.dark input[type="range"]::-webkit-slider-runnable-track` — unfilled portion uses `rgba(100, 116, 139, 0.8)` (slate-500 80%); previously `rgba(51, 65, 85, 0.65)` (slate-700) was invisible on `#070b15` dark bg. Filled portion keeps `var(--fill-color, #60a5fa)`.

**CalcFAB:** MutationObserver + IntersectionObserver on `[id$="-results"]`. Show when `entry.isIntersecting || entry.boundingClientRect.top < 0`. Two buttons: Share (navigator.share → clipboard fallback) + Calculate Again (scroll to top). `fixed bottom-20 right-4 z-40 md:hidden`.

**ResultsScrollCue:** MutationObserver (80ms debounce) + IntersectionObserver (threshold 0.15). Shows "See Results ↓" when results below fold. `fixed bottom-20 md:hidden`.

**Blog components:**
- `ReadingProgress.tsx` — 3px fixed top bar, z-60, passive scroll listener
- `BlogTOC.tsx` — `variant="inline"` (lg:hidden, collapsible) + `variant="sidebar"` (xl+, fixed right-4 top-24 w-52). Both use IntersectionObserver `rootMargin: -10% 0px -75% 0px`. `toId(text)` = lowercase, strip non-alphanumeric, replace spaces with `-`
- `BlogStickyBar` — fires at 40% scroll depth; checks `localStorage.cookie_consent` to set `bottom-[76px]` vs `bottom-0` (avoids cookie banner overlap)
- `RelatedBlogPosts` — emerald theme, 3-phase: direct match → category fallback → fill. Source: `lib/blog/utils.ts:getRelatedBlogPosts(calcHref)`

**Charts:** All wrapped in `memo()` + `useMemo()`. Chart states (`chartData`, `schedule`, etc.) are pre-initialized from a module-level `INITIAL_XYZ_DATA` IIFE alongside `result` — charts render on first paint with no empty-state flash. `useChartColors.ts` watches `document.documentElement.classList` for `dark` → returns adaptive tooltip/grid/axis colors. SIP/FD/RD/SI/EMI use `AreaChart` with gradient fills (0.25→0.02 opacity). `isAnimationActive={false}` on all Area/Line. Chart render condition is always `{result ? <Charts /> : <ChartEmptyState />}` — never `chartData.length > 0`. `ChartEmptyState.tsx` shown when `result` is null on all 10 chart calculators: EMI/SIP/FD/RD/SI (ternary), CAGR/GST (standalone pie section ternary, `columns={1}`), Profit Margin (standalone charts section ternary, `columns={2}`), Percentage (inside `showPie &&` ternary, `columns={1}`), Home Loan vs Rent (`{!result && <ChartEmptyState columns={2} />}` after result block). BMI uses CSS gauge (no Recharts); Tax pie is inside the result panel (inline data, no separate chartData state); Retirement has its own text placeholder; Scientific has no chart components.

**Icon system:** `CalculatorIcon.tsx` — slug→Lucide map (sip=Repeat, emi=Landmark, bmi=Scale, tax=ReceiptText, fd=Lock, rd=PiggyBank, si=FileText, gst=Calculator, pct=Percent, cagr=TrendingUp, retirement=Target, hlr=Home, pm=LineChart, sci=FlaskConical). Pattern: `const Icon = prop.icon; <Icon className="w-N h-N" strokeWidth={2} aria-hidden="true" />` — never pass function refs as ReactNode. Category tiles: Finance=`from-blue-500 to-indigo-600`, Health=`from-rose-500 to-pink-600`, Utility=`from-violet-500 to-purple-600`.

**Ads:** `AdSenseLoader.tsx` — sets `window.adsbygoogle.requestNonPersonalizedAds=1` before injecting script (NPA by default); flips to 0 on `cookie_consent_update`. Guards double-injection with `getElementById('adsense-js')`. `GoogleAnalyticsLoader.tsx` — fully consent-gated. `html.dark .adsbygoogle { background: transparent !important }` in globals.css prevents white flash.

**ConfidenceBadge** (`'emi'|'tax'|'sip'|'bmi'`): EMI→RBI rbi.org.in, Tax→Finance Act 2025-26 incometaxindia.gov.in, SIP→SEBI/AMFI sebi.gov.in, BMI→WHO/ICMR who.int

**About page — formula verification section (`app/about/page.tsx`):** Emerald card "How We Verify Our Formulas" — 2-col grid of 5 source cards (`formulaSources` array) with `ExternalLink` icons linking to official sites. Sources: RBI (EMI/FD/RD/SI) · Finance Act 2025-26 / incometaxindia.gov.in (Tax) · SEBI/AMFI (SIP/CAGR/Retirement) · GST Council/CBIC gst.gov.in (GST) · WHO/ICMR who.int (BMI). Keep in sync with ConfidenceBadge URLs above if sources change.

**CalcPageWrapper:** Server component. Renders `Home / Calculators / [title]` breadcrumb, then `<CalculatorDisclaimer category={category} />` (added 2026-07-17), then children. Accepts `category: 'Finance'|'Health'|'Utility'` for hero gradient + disclaimer wording. Breadcrumb schema: 3-item (`Home → Calculators → Calculator`). Added `title` prop; all 14 `layout.tsx` files pass display name. **No longer renders its own ad unit** (removed 2026-07-03) — each `*-calculator/layout.tsx` already places `calcAboveFold` + `calcBelowResult`; the wrapper duplicating `calcBelowResult` stacked 2 ad blocks before the educational content on every calc page, a likely contributor to the AdSense "low value content" rejection. Ad slots per calc page are now exactly 2.

**CalculatorDisclaimer (`components/ui/CalculatorDisclaimer.tsx`):** Amber warning box (AlertTriangle icon) shown above every calculator via CalcPageWrapper. Category-aware copy: Finance → "not financial advice, consult CA/CFP/SEBI-registered advisor"; Health → "not medical advice"; Utility → "verify independently". Links to `/verification-methodology` + `/terms-of-service`. Homepage has a matching slim strip above the hero.

**Trust/E-E-A-T pages (2026-07-17):** `/verification-methodology` — 4-step validation process, per-calculator official source cards (rbi.org.in, incometaxindia.gov.in + incometax.gov.in cross-check, gstcouncil.gov.in, sebi.gov.in, who.int; SBI/HDFC bank calculator cross-checks), `LAST_VERIFIED` constant ('July 2026' — bump on each audit), WebPage schema. `/author/narasimha-makireddi` — expanded: insurance-domain background, 4-month build framing, 90/10 accuracy-first process, tech credibility (Decimal.js/Zod/browser-only), commitment section (24h error investigation via supportcalculox@gmail.com). Linked from: Navbar ("Verification" NavLink), mobile CalculatorBottomSheet, Footer Company column ("Meet the Developer" + "Verification Methodology"), blog byline ("Learn about my expertise →" in `app/blog/[slug]/page.tsx` — note: byline lives there, NOT in BlogPostLayout.tsx which also got the link but is unused by the slug route), About page verification section, homepage "Why Trust calculox?" section (before "Why Choose", 3 cards: Verified Sources / Privacy / Transparency — no user-count claims, kept conservative).

**Design system docs (2026-07-17):** `docs/DESIGN-SYSTEM.md` (tokens, motion spec, component patterns) + `docs/ADSENSE-COMPLIANCE.md` (design-change checklist). Tokens live in `globals.css` `:root`: brand scale, semantic colors, motion durations (`--motion-fast/base/slow/reveal`), easings (`--ease-out-soft`), shadows, radii.

**ScrollReveal (`components/ui/ScrollReveal.tsx`):** Scroll-triggered fade+rise (18px, 600ms `--ease-out-soft`) for below-fold homepage sections. Content visible by default (SEO/no-JS safe) — `.sr-hidden` added post-mount only, skipped for reduced-motion, missing IO support, or elements already in viewport. Wraps sections: Real Scenarios, Blog, Why Trust, Why Choose, FAQ.

**Homepage hero (2026-07-17 redesign):** Brand "calculox" demoted to gradient eyebrow (`<p>`); `<h1>` is now the value prop "Free, accurate calculators for every financial decision" (gradient keyword span). Bank-verification line is an emerald BadgeCheck chip. Every homepage section h2 now has a `.section-eyebrow` label (Explore / Real Numbers / Learn / Trust & Transparency / Built for You / Support) — uppercase 12px tracking-[0.18em] emerald with leading dash, defined in globals.css.

**Homepage — "Latest from the Blog" (`app/page.tsx`):** Added 2026-07-03. `LATEST_POSTS` = top 4 `blogPosts` sorted by `date` desc, rendered as cards linking to `/blog/[slug]`, placed between "Real Indian Scenarios" and "Why Choose Our Calculators" — surfaces blog depth on first paint ahead of AdSense re-review.

**Navbar:** Desktop mega-menu (hover open 150ms debounce, close 200ms delay, Escape, outside-click). `megaIn` animation: 0.15s ease-out fade + 6px translateY. Inline search: auto-focus 80ms delay, filters `title`+`description`+`keywords`, collapses empty sections. Mobile: hamburger → `CalculatorBottomSheet` side drawer (CSS `translate-x-full`→`translate-x-0`, cubic-bezier). Focus rings: `focus-visible:ring-2 focus-visible:ring-blue-500` on all 6 nav elements.

**Blog listing (`app/blog/BlogClient.tsx`):** `PINNED_SLUGS = ['how-to-calculate-emi', 'how-to-calculate-income-tax-india', 'sip-calculator-guide']` — amber "Most Read" section on "All" tab. Category filter tabs with count badges. `key={activeCategory}` triggers `animate-fade-in`.

**Result panels (all 11 calculators):** Hero card `text-5xl sm:text-6xl font-black border-2 shadow-lg` + secondary `grid grid-cols-2 sm:grid-cols-3 text-sm sm:text-lg font-bold`. BMI already `text-7xl font-black`, Percentage already dominant — skipped.

**FAQ chevrons:** `group-open:rotate-90">▶` (closed=▶, open=▼). Fixed across all 12 calc pages + homepage + blog.

**ProjectionTable (SIP/FD/SI/Retirement):** First 12 rows default, "Show All" toggle, smooth `scrollIntoView` on expand, lazy load 50 rows.

**Footer:** Mobile: `grid grid-cols-2 gap-4 md:contents` wrapper — 2-col mobile, dissolves to 5-col desktop. All inner column `<div>`s carry `min-w-0` to prevent content blowout. Legal links duplicated: `md:hidden` inside Company column (mobile) + `hidden md:block` standalone (desktop). Email `<a>` uses `break-all` so long address wraps on narrow screens.

## SEO & Performance

| Metric | Value |
|---|---|
| PageSpeed | 97/100 |
| Accessibility | 100/100 — WCAG 2.1 AAA |
| Best Practices + SEO | 100/100 |
| Blog Posts | 25 (7-15 min read, accurate estimates) |
| Pages | 55 (1 home + 14 calc + 25 blog + 3 legal + 12 other) |
| GSC | ✅ Verified, sitemap live (47 pages), manual indexing requested |
| Schema | Organization+Website+WebApp+Calculator+FAQ+Breadcrumb+Article+HowTo+Person |
| ads.txt | `google.com, pub-7034746357427731, DIRECT, f08c47fec0942fa0` |

**Keywords:** BMI (165K) · EMI (74K) · Tax (60.5K) · SIP (49K) · Scientific (27.1K) · FD (18.1K) · Home Loan vs Rent (12.1K) · Profit Margin (8.9K) + 90+ long-tail

**OG image:** `app/api/og/route.tsx` → 1200×630 PNG via `next/og`. Rewrite in `next.config.js`: `/og-image.png` → `/api/og`.
**Favicon:** `public/favicon.ico` generated by `scripts/generate-favicon-ico.mjs` (rerun when favicon.png changes).
**Sitemap:** `app/sitemap.ts` — `CALC_LAST_MODIFIED` constant (update when calc pages change meaningfully). Blog uses actual `post.date`.
**Blog hero images:** All 25 SVGs in `public/blog/`, rendered with `width={800} height={420}` (800:420 aspect ratio pre-reserved for CLS). `loading="eager"`.
**Blog posts:** Fields: `image`, `lastUpdated: '2026-06-16'`, `readTime` (accurate), `relatedCalculator.href`, `postType?`, `quickSummary?`, `comparisonTable?`, `keyStats?`. Author: Narasimha Makireddi, `/author/narasimha-makireddi`, Person schema.
**Static content:** Each calculator `layout.tsx` has a server-rendered `<section>` with 850–1,030 words (About → Why You Need → How to Use with real field names → formula + worked example → 2 Real-World Examples with verified numbers → 3 Accuracy FAQs as `<details>`) — crawlable without JS. Blog links use real slugs from `lib/blog/posts.ts`; each section cross-links 1–2 sibling calculators. SIP layout's new FAQ answers were also appended to its `faqs` schema array.

## Key Implementation Patterns

**Auto-calculate:**
```typescript
const watchValues = watch();
useEffect(() => {
  const timer = setTimeout(() => calculateResults(watchValues), 300);
  return () => clearTimeout(timer);
}, [watchValues]);
```
Initial result and chart states computed at module level — eliminates CLS and renders charts on first paint:
```typescript
function computeXYZAll(data: XYZFormData) {
  const result = calculateXYZ(data);
  return { result, chartData: [...], schedule: [...] };
}
const INITIAL_XYZ_DATA = (() => { try { return computeXYZAll(DEFAULT_VALUES); } catch { return null; } })();
// In component:
const [result, setResult] = useState(INITIAL_XYZ_DATA?.result ?? null);
const [chartData, setChartData] = useState(INITIAL_XYZ_DATA?.chartData ?? []);
```
`calculateResults` calls `computeXYZAll` and sets all state together. `handleReset` clears all derived arrays.

**Mobile grid layout (all calculators):** Main form+results wrapper: `grid grid-cols-1 lg:grid-cols-2 gap-8` (Tax uses `gap-6`). Both direct grid children carry `min-w-0` — prevents long numbers/tables from blowing out the column on mobile. Page `<h1>` pattern: `text-3xl sm:text-4xl font-bold mb-4 text-gradient flex flex-wrap items-center justify-center gap-2` (icon + text wrap gracefully on narrow screens).

**Slider pattern (all calculators):** `flex flex-col md:flex-row gap-3 items-stretch md:items-center` wrapper · `w-full flex-1 h-3 accent-{color}-600` on RangeSlider · `w-full md:w-28 px-2 py-2 text-center` on number input · `dark:bg-{color}-900/20 dark:border-{color}-700`

**Color semantics (2026-07-17 Navy+Emerald repaint):** Navy (`--navy-900` #0e2a47)=headings/structure/wordmark · Emerald=CTAs/links/focus/interactive (`.btn-primary`, `.section-eyebrow`, nav active pills navy→emerald) · Blue=Finance category accent only · Rose=Health · Violet=Utility · Teal=Conversion/renter · Amber=disclaimers/stars. Borders via `--color-border` (#d9e2e7 light / #263b52 dark navy-slate), set as CSS var on inputs+`.card`. `.text-gradient` (all calc/blog h1s)=navy→emerald gradient text (white→emerald dark). Bare h1–h4 default navy light/slate dark via element rules; `footer h1-h4` forced light (always-dark surface). Canvas: light #f5f9f7 mint-slate, dark #060f1c deep navy. Footer/Navbar logo SVG stops #0e2a47→#047857. Spacing tightened one notch: `main` py-5/8, `.card` p-5, homepage `space-y-10`.

**Background:** `body` bg: `#f6f8fd` light / `#070b15` dark. Spotlight + ambient glows on `body::after` (wrapped in `@media (prefers-reduced-motion: no-preference)`). Dot-grid on `body::before`.

**Share:** `components/ui/ShareButtons.tsx` — WhatsApp (`wa.me/?text=...`) + X (SVG logo, #000000) + LinkedIn + Facebook + Copy (2s "Copied!" state). On homepage widget: `navigator.share()` → clipboard fallback.

**Consent flow:** `localStorage.cookie_consent` = `'accepted'`/`'declined'`. Events: `cookie_consent_update`. NPA ads by default; GA4 consent-gated.

## ⚠️ Implementation Gotchas

- **Fixed overlays inside `backdrop-filter`/`filter`/`transform`/`will-change` parents get clipped** to parent bounds, not viewport. Always render `position:fixed` components outside such elements (use Fragment).
- **`type="search"` inputs** — browser-injected styles override Tailwind `pl-*`. Use `type="text"` + `inputMode="search"` + inline `paddingLeft` style.
- **Lucide icons in server components** — `import { X } from 'lucide-react'` works directly; no `'use client'` needed (pure SVG). Pattern: `const Icon = prop.icon; <Icon ... />` — never spread function refs as ReactNode.
- **`public/ads.txt` only** — deleted `public/Ads.txt` (Linux/Vercel is case-sensitive; uppercase variant not crawled).
- **Dark mode ad flash** — `html.dark .adsbygoogle { background: transparent !important }` in globals.css. iframe fills it once ad loads.
- **Blog SVG text visibility** — SVG renders in document order; white `<rect>` after `<text>` paints over it. Keep text within column bounds or reorder elements.
- **Stale nested `calc/.git`** — before the `abedfd2` gitlink fix, `calc/` had its own disconnected local git repo (same remote, HEAD frozen on an old pre-fix commit). Any git command run with cwd inside `calc/` silently operated on it instead of the real repo, showing false "modified" files for anything changed since. Removed 2026-07-03. If it reappears, delete `calc/.git` only (never touch source files) and re-run git from the repo root.

## Deployment

```bash
git push origin master   # Auto-deploys to Vercel → https://www.calculox.in
```

**Required env vars (Vercel):**
- `NEXT_PUBLIC_SITE_URL=https://www.calculox.in`
- `NEXT_PUBLIC_FORMSPREE_ID=xjgdzrpv` (contact form → supportcalculox@gmail.com)
- `NEXT_PUBLIC_GOOGLE_VERIFICATION` (hardcoded fallback in layout.tsx if absent)
- AdSense `ca-pub-7034746357427731` hardcoded in layout.tsx (not env var)

## Code Conventions

- TypeScript strict mode | Zod schemas for all inputs | Decimal.js (28 decimal places)
- Comments: WHY only — no what, no task refs | PascalCase components · camelCase utils · kebab-case routes
- No emojis in UI — Lucide icons only | No PDF export (removed) | ShareButtons on all 13 financial calculators

## Quick Links

- **GitHub:** github.com/narasimhamakireddi1 | **Domain:** calculox.in
- **Email:** narasimha.makireddi1@gmail.com | **Support:** supportcalculox@gmail.com
- **AdSense:** ca-pub-7034746357427731 | **GA4:** G-GFN66QLNZP | **Formspree:** xjgdzrpv

**Update CLAUDE.md when:** adding features, modifying major files, or changing architecture.
See [MEMORY.md](MEMORY.md) for user preferences and project context.
