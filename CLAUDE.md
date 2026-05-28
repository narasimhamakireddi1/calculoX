# 🧮 CalculoX - CLAUDE.md

**Status:** ✅ MVP Complete | 🚀 Production Ready | Vercel Deployed  
**Last Updated:** 2026-05-29 | **Tech Stack:** Next.js 16.2.6 + React 19 + TypeScript 5.6 + Tailwind 3.4

---

## 📊 PROJECT STATUS

**10 Calculators Live:**
- **MVP (5, Visible):** SIP, EMI, BMI, Income Tax, FD
- **Phase 2 Batch 1 (5, Hidden):** RD, Simple Interest, GST, Percentage, CAGR

**Key Features:** Real-time auto-calculate | Dual inputs (slider + number) | Color-coded sliders | Responsive design | Dark mode | World-class SEO | Affiliate monetization | Performance optimized

---

## 🚀 QUICK START

```bash
npm install --legacy-peer-deps
npm run dev                    # http://localhost:3000
```

---

## 📁 PROJECT STRUCTURE

```
app/
├── layout.tsx                 # Root + metadata + SEO schemas
├── page.tsx                   # Homepage (calculator grid)
├── *-calculator/page.tsx      # 10 calculator pages (auto-calculate)
├── blog/[slug]/page.tsx       # Blog posts
├── about/privacy/contact/     # Static SEO pages
├── robots.ts, sitemap.ts      # Dynamic SEO
└── manifest.ts                # PWA manifest

components/
├── layout/Navbar.tsx          # Gradient logo, active links
├── layout/Footer.tsx          # Company + legal links
└── ui/                        # Shared UI components

lib/
├── calculators/               # 10 calculation logic files
├── tax-engine/                # 9-module tax system
├── validators/index.ts        # Zod schemas
└── seo/schemas.ts             # JSON-LD generators

config/
├── calculators.config.ts      # Calculator metadata (active/coming-soon)
└── site.config.ts             # Site configuration
```

---

## 📊 CALCULATOR SPECIFICATIONS

| Calculator | Inputs | Formula | Features |
|-----------|--------|---------|----------|
| **SIP** | Monthly, Years, Return%, StepUp% | Iterative monthly loop (annuity due) | Charts, projections, auto step-up |
| **EMI** | Principal, Rate, Years | Monthly reducing balance method | Amortization table, virtual scrolling |
| **BMI** | Weight, Height (metric/imperial) | BMI = kg/(m²) or 703×lbs/(in²) | Category display, health tips |
| **Tax** | Income + 9 deductions | FY 2025-26 slabs + rebate 87A + surcharge | Regime comparison, breakdown, trace |
| **FD** | Principal, Rate, Years/Months/Days, Payout Type | 4 tracks: Cumulative (Q-compound), Quarterly, Monthly (discounted), Short-term (SI) | RBI-compliant, Senior citizen +0.50%, Projections |
| **RD** | Monthly Deposit, Rate, Months | Compound interest (monthly) | Projection tables |
| **GST** | Amount | Add/Remove @ 5%/12%/18%/28% | Breakdown |
| **Others** | Various | Standard financial formulas | Charts/tables |

---

## 🛠️ DEVELOPMENT COMMANDS

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # ESLint validation
npm run type-check       # TypeScript strict mode
npm run audit:performance # Lighthouse audit
```

---

## 🔧 KEY IMPLEMENTATION PATTERNS

**Auto-Calculate (All Calculators):**
```typescript
const watchValues = watch();
useEffect(() => {
  const timer = setTimeout(() => {
    if (watchValues.field1 && watchValues.field2 !== undefined) {
      calculateResults(watchValues);
    }
  }, 300); // 300ms debounce
  return () => clearTimeout(timer);
}, [watchValues]);
```

**Slider-Input Sync (All Calculators):**
```typescript
// Slider: always numeric value
<input type="range" value={watchValues.field ?? 0} onChange={...} />

// Input: shows empty when 0 (clearable by backspace)
<input type="number" value={watchValues.field === 0 ? '' : watchValues.field} onChange={...} />
```

**Meaningful Defaults:** SIP (₹10K/month), EMI (₹10L @ 8.5%), BMI (70kg/175cm), Tax (₹5L income), FD (₹1L @ 6.5%), etc.

---

## ⚙️ ENVIRONMENT VARIABLES

```bash
NEXT_PUBLIC_SITE_URL=https://www.calculox.in    # For SEO/og tags
NEXTAUTH_SECRET=<32-char-random>                # NextAuth (optional)
DATABASE_URL=<postgresql-url>                   # PostgreSQL (optional)
```

---

## 🚀 DEPLOYMENT (Vercel)

```bash
git push origin main        # Auto-deploys to Vercel
# Monitor: Vercel Dashboard → Deployments
```

**Live URL:** https://www.calculox.in (DNS configured in GoDaddy)

---

## 📈 BUILD STATUS

| Check | Status |
|-------|--------|
| Production Build | ✅ SUCCESS (27 pages, ~11s) |
| TypeScript Strict Mode | ✅ PASS |
| ESLint | ✅ PASS (zero warnings) |
| Dev Server | ✅ RUNNING |
| Vercel Deployment | ✅ DEPLOYED |

---

## 🔍 SEO IMPLEMENTATION

✅ Dynamic sitemap + robots.txt  
✅ JSON-LD schemas (FAQPage, WebApplication, Article, BreadcrumbList)  
✅ Open Graph + Twitter cards (all pages)  
✅ Blog section (5 posts, keyword-targeted)  
✅ Affiliate banners (Groww, Zerodha, ClearTax, HealthifyMe)  
✅ Favicon (SVG, blue gradient 'CX' monogram)  

---

## 📋 ARCHITECTURE DECISIONS

**Slider-Input Pattern:** Sliders always show numeric value for correct positioning; inputs show empty string when cleared (user-friendly backspace). Both sync with React Hook Form's `watch/setValue`.

**Auto-Calculate + Debounce:** 300ms debounce on `watchValues` dependency prevents recalculations on every keystroke while keeping UX responsive. Navbar stays interactive during calculations.

**Default Values:** Meaningful defaults (not zero) provide immediate examples. Users clear by backspace (shows empty) or use Clear All button (resets to defaults).

**Regime-Specific UI:** Tax calculator hides deductions section for New Regime (only standard deduction allowed). Old Regime shows full deduction form.

**Component Memoization:** EMI calculator memoizes expensive components (charts, tables) to prevent unnecessary re-renders. Virtual scrolling for 60-month schedules.

**FD Calculator - Four RBI-Compliant Tracks:**
- **Cumulative:** Quarterly compounding (standard, reinvested): `P × (1+r/4)^q × (1+r×m/12)` for leftover months
- **Quarterly Payout:** Non-cumulative income mode: `P × r/4` per quarter, principal returned at maturity
- **Monthly Payout:** Discounted rate formula: `(P×r) / (12×(1+r/4)^(1/3))` to account for early payout
- **Short-term (< 6 months):** Simple interest: `P × (1 + r×days/365)` per RBI guidelines
- **Features:** Fractional tenures (1Y 7M) split into full quarters + leftover months. Senior citizen +0.50% bonus. Projections with monthly/quarterly breakdown. Verified against SBI/ICICI standards.

---

## 🎯 CODE CONVENTIONS

- **File Naming:** PascalCase (components), camelCase (utilities), kebab-case (routes)
- **TypeScript:** Strict mode enabled everywhere
- **Validation:** Zod schemas for all inputs
- **Calculations:** Decimal.js for financial precision (28 decimal places)
- **Comments:** Only for WHY (non-obvious), not WHAT (self-explanatory code)
- **State Management:** React Hook Form + Zustand (when needed)

---

## ✅ MEMORY NOTE

**Update CLAUDE.md whenever:** Adding features, modifying major files, changing architecture, adding calculators, updating tech stack.

Keep it concise: This is a reference guide, not detailed documentation. Point to external docs for specifics.

---

## 🔗 QUICK LINKS

- **GitHub:** narasimhamakireddi1
- **Domain:** calculox.in
- **Email:** narasimha.makireddi1@gmail.com
- **Admin:** Vercel Dashboard for deployment monitoring

---

## 🚀 NEXT STEPS (If Needed)

1. Phase 2 Batch 1: Unhide 6 calculators (toggle in config)
2. Phase 2 Batch 2 & 3: Add 8 more calculators
3. Database: Setup PlanetScale if user accounts needed
4. AdSense: Apply after Privacy Policy + About pages live
5. Content: Write more blog posts for organic traffic
6. Monitoring: Track Web Vitals via Vercel Analytics

---

**Status:** ✅ PRODUCTION READY | All 10 calculators functional | Deployed to Vercel | Ready for scale 🚀
