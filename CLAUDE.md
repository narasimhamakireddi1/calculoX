# 🧮 CalculoX - CLAUDE.md

**Status:** ✅ MVP Complete | 🚀 Production Ready | Vercel Deployed  
**Last Updated:** 2026-05-28 | **Tech Stack:** Next.js 16.2.6 + React 19 + TypeScript 5.6 + Tailwind 3.4 + html2pdf.js + Recharts + Decimal.js

---

## 📊 PROJECT STATUS

**11 Calculators Live:**
- **MVP (6, Visible):** SIP, EMI, BMI, Income Tax, FD, Simple Interest
- **Phase 2 Batch 1 (4, Visible):** RD, GST, Percentage (6-track), CAGR
- **Phase 2 Batch 3 (1, Visible):** Scientific Calculator (Casio ClassWiz-style)

**Key Features:** Real-time auto-calculate | Dual inputs (slider + number) | Color-coded sliders | Responsive design | Dark mode | PDF export & clipboard sharing | Pie charts for all calculators | World-class SEO | Affiliate monetization | Performance optimized

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
├── calculators/               # 11 calculation logic files (incl. scientific.ts)
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
| **Simple Interest** | Principal, Rate, Tenure (Years/Months/Days) | 3 tracks: Years (P×R×Y/100), Months (P×R×M/1200), Days (P×R×D/(100×DaysInYear)) | Auto leap-year detection, daily accrual, projections, precision (Decimal.js) |
| **RD** | Monthly Deposit, Rate, Months | Compound interest (monthly) | Projection tables, pie chart |
| **GST** | Amount | Add/Remove @ 5%/12%/18%/28% | Breakdown, pie chart |
| **Percentage** | Values (varies by track) | 6 independent engines: hike/discount, X% of Y, what % of, % change, reverse %, sequential | 6-track switcher, live sentence banner, pie charts, directional indicators |
| **CAGR** | Beginning Value, Ending Value, Years | CAGR = (Ending/Beginning)^(1/Years) - 1 | Year-over-year breakdown, projections, pie chart |
| **Scientific** | Expression input or button clicks | Tokenizer → Shunting-Yard → RPN Evaluator | 4 engines (Standard, Complex, Matrix, Statistics), 8 button rows, dual display, DEG/RAD, memory registers, keyboard support |

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

**Auto-Calculate (All Calculators):** Results compute dynamically as users input values. No explicit "Calculate" button required — only Clear/Reset button provided.
```typescript
const watchValues = watch();
useEffect(() => {
  const timer = setTimeout(() => {
    if (watchValues.field1 && watchValues.field2 !== undefined) {
      calculateResults(watchValues);
    }
  }, 300); // 300ms debounce prevents rapid recalculations while maintaining UX responsiveness
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

**Pie/Donut Charts Across All 10 Calculators:** Implemented consistent donut visualizations (innerRadius=65-70, outerRadius=110) to show proportional data breakdowns with manual legend rows. Each chart includes currency/number formatting, dark mode support, and responsive layout:
- **GST:** Base Amount vs GST Amount (blue/orange)
- **CAGR:** Initial Investment vs Total Growth (blue/green)
- **Percentage (Tracks 1, 2, 5):** Component breakdown per calculation type (blue/green, blue/gray, etc.)
  - Track 1 (Hike/Discount): Original vs Amount Added/Saved
  - Track 2 (X% of Y): Percentage Portion vs Remainder
  - Track 5 (Reverse %): Known Amount vs Remaining Amount
  - Track 6 (Sequential): Step-by-step flow chart with total change indicator
- **SIP:** Total Invested vs Returns Gained (blue/green, lg:grid-cols-2 with line chart)
- **FD:** Principal vs Interest Earned (blue/green, side-by-side with existing line/bar charts)
- **RD:** Total Deposited vs Interest Earned (blue/green, side-by-side with line chart)
- **Simple Interest:** Principal vs Interest Accrued (blue/green, side-by-side with line chart)
- **Tax:** Take-Home Pay vs Tax Payable (green/red, displays effective tax rate)
- **BMI:** 4-category spectrum donut (Underweight/Normal/Overweight/Obese) with opacity highlighting user's current category

**Percentage Calculator - 6 Independent Calculation Engines:**
- **Track 1 (Hike/Discount):** Apply percentage increase/decrease — `V × (1 ± P/100)` with toggle for hike vs discount
- **Track 2 (X% of Y):** Find value from percentage — `(P/100) × V`
- **Track 3 (What % of):** Fraction as percentage — `(A/B) × 100` with zero-division guard
- **Track 4 (% Change):** Percentage change with directional indicator — `((B−A)/A) × 100` showing ↑ increase (green) or ↓ decrease (red)
- **Track 5 (Reverse %):** Find base when part and % known — `(V × 100) / P` (e.g., pre-GST price)
- **Track 6 (Sequential):** Apply two percentages sequentially — `V × (1+P1/100) × (1+P2/100)` with step-by-step visual flow
- **Features:** Dynamic sentence banner, live input field labels, track switcher with 6 quick-access buttons, error handling for division-by-zero, pie charts for tracks 1/2/5, breakdown tables, explicit PDF export with input data

**FD Calculator - Four RBI-Compliant Tracks:**
- **Cumulative:** Quarterly compounding (standard, reinvested): `P × (1+r/4)^q × (1+r×m/12)` for leftover months
- **Quarterly Payout:** Non-cumulative income mode: `P × r/4` per quarter, principal returned at maturity
- **Monthly Payout:** Discounted rate formula: `(P×r) / (12×(1+r/4)^(1/3))` to account for early payout
- **Short-term (< 6 months):** Simple interest: `P × (1 + r×days/365)` per RBI guidelines
- **Features:** Fractional tenures (1Y 7M) split into full quarters + leftover months. Senior citizen +0.50% bonus. Projections with monthly/quarterly breakdown. Verified against SBI/ICICI standards.

**Simple Interest Calculator - Three Precision Tracks:**
- **Years Track:** `SI = (P × R × Years) / 100` — standard formula for long-term loans/investments
- **Months Track:** `SI = (P × R × Months) / 1200` — medium-term arrangements (personal loans, P2P lending)
- **Days Track:** `SI = (P × R × Days) / (100 × DaysInYear)` — daily precision for overdrafts, credit lines, bonds
- **Leap Year Logic:** Automatic detection (`isLeapYear()`) adjusts denominator 365→366, preventing fractional under-crediting
- **Daily Accrual:** Shows per-day interest `(P × R) / DaysInYear` for quick estimation on any tenure
- **Implementation:** Decimal.js (28 decimal places) for financial precision. Verified against 3 test cases (Years: ₹1,35,000 ✓, Months: ₹39,375 ✓, Days: ₹1,600 ✓)

**Scientific Calculator - Casio ClassWiz-Style Full-Featured:**
- **Architecture:** Custom Tokenizer → Shunting-Yard → RPN Evaluator pipeline (no external math libraries beyond Decimal.js)
- **Expression Parsing:** Tokenizes input into typed tokens (NUMBER, OPERATOR, FUNCTION, LPAREN, RPAREN, CONSTANT, VARIABLE, COMMA). Handles implicit multiplication (2π → 2*π, 2(3) → 2*(3)), scientific notation, and multi-char identifiers
- **Operator Precedence:** Shunting-Yard algorithm enforces PEMDAS with proper associativity (LEFT for +−*÷%, RIGHT for ^). Converts infix to RPN for evaluation
- **RPN Evaluator:** Stack-based evaluation with proper type promotion (number ↔ ComplexNumber). Angle conversion applied before trig (DEG→RAD) and on inverse trig (RAD→DEG when angleUnit='DEG')
- **Supported Functions:** sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, log (log₁₀), ln (natural log), log₂, exp, sqrt, cbrt, abs, ceil, floor, round, factorial (!), nCr, nPr
- **Constants:** π / pi, e, i (imaginary unit), Ans (previous result), M (memory)
- **4 Computation Engines:**
  - **Standard:** All arithmetic & scientific functions with real numbers
  - **Complex:** Parse a+bi notation; all operations in complex domain; display as a+bi
  - **Matrix:** 2×2 and 3×3 grid input modals; det(A), inv(A), T(A), A+B, A×B operations
  - **Statistical:** X/Y data entry (up to 20 rows); computes n, mean, stddev, linear regression (y = mx + b), R² coefficient
- **UI Layout (8 Button Rows):**
  - Row 1 (Gray): SHIFT, MODE, DEG/RAD, M+, M-, MC, DEL, AC
  - Row 2 (Purple): x², x^y, √x, sin/asin, cos/acos, tan/atan, log/10^x, ln/e^x (SHIFT toggles labels)
  - Row 3 (Indigo): π, e, (, ), MR, Ans, sinh, cosh
  - Row 4 (Teal): 3√x, log₂, x!, nCr, nPr, det/Mat A, inv/Mat B, T(A)/Stat
  - Rows 5-7 (White/Blue): Numeric keypad (0-9, .), operators (×, ÷, +, −, %), advanced functions
  - Row 8 (Gradient): Execute (=) spans dual-width with blue→purple brand gradient
- **Dual Display Panel:** Dark bg-gray-900 screen inside white card. Status badges (engine, angle unit, memory, modifiers), input line (gray-400), result line (white bold)
- **Interactive Features:**
  - Physical keyboard support: 0-9, operators, Enter/Backspace/Escape
  - Live evaluation: useEffect on input continuously evaluates via RPN, updates liveResult silently on error
  - History panel: last 10 calculations persisted in state
  - SHIFT modifier: toggles between primary/secondary function labels (sin↔asin, log↔10^x)
  - Memory registers: M+/M-/MC/MR track M, MR appends to input, M usable in expressions
  - Matrix modals: Inline components with 2×2/3×3 size toggle, grid inputs for matrix A/B
  - Stat panel: Table with X/Y columns, +Add Row, ×Remove Row; auto-computes regression on update
  - Matrix result display: Shows last operation result as formatted matrix grid
  - Statistics result card: Shows n, mean, σ for X and Y; regression equation y = mx + b with R²
- **Keyboard Mapping:** Enters digits/operators directly; Enter finalizes to history; Backspace removes last char; Escape clears all
- **Files:** `lib/calculators/scientific.ts` (500 lines, math engine), `app/scientific-calculator/page.tsx` (600 lines, UI + state), `app/scientific-calculator/layout.tsx` (SEO)
- **Pattern Difference:** Unlike form-based calculators, scientific uses button-driven state (not React Hook Form) with continuous live evaluation instead of debounced auto-calculate

**PDF Export & Clipboard Sharing (All 11 Calculators - Production-Grade):**
- **Components:** `lib/utils/pdf-export.ts` (PDF generation) + `components/ui/ExportButton.tsx` (dual-button UI) + `lib/utils/pdf-input-formatter.ts` (helper utilities)
- **Professional Layout:**
  - Header: Gradient background (purple→violet), emoji icon, calculator name, timestamp
  - Input Parameters: Extracted label-value pairs with professional formatting (clean labels, formatted values)
  - Results: Calculator-specific results in styled containers with visual hierarchy
  - Disclaimer: Professional warning box encouraging user consultation with experts
  - Footer: CalculoX branding with website URL
- **Explicit Input Data Pattern:**
  - Each calculator creates `inputsData: FormattedInput[]` using `useMemo()`
  - Extracts values from React Hook Form's `watchValues`
  - Pre-formats with `formatCurrency()` for money, percentage formatting, natural date/time strings
  - Passed directly to ExportButton via `inputsData` prop
  - All 10 calculators implemented: SIP, EMI, BMI, Tax, FD, RD, Simple Interest, GST, CAGR, Percentage
- **Implementation Details:**
  - html2pdf.js library with dynamic imports (prevents SSR errors)
  - Dual-button layout: "Export as PDF" + "Copy to clipboard"
  - Loading states and visual feedback (button text changes on success for 2 seconds)
  - Fallback: If explicit inputsData not provided, attempts DOM extraction
  - TypeScript strict mode: `FormattedInput` interface ensures type safety
- **Quality Standards:**
  - Professional typography and spacing throughout PDF
  - Dark mode awareness: removes dark: classes for consistent PDF appearance
  - Responsive design considerations for all screen sizes
  - Accessible and shareable format for users to send results to advisors/peers

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

1. Phase 2 Batch 1: Unhide remaining 4 calculators (RD, GST, Percentage, CAGR) — toggle status in config
2. Phase 2 Batch 2 & 3: Add 8 more calculators (PPF, HRA, Inflation, Loan Eligibility, Retirement, Age, Unit Converter, Currency Converter)
3. Database: Setup PlanetScale if user accounts/calculator histories needed
4. AdSense: Apply after Privacy Policy + About pages live
5. Content: Write more blog posts for organic traffic + SI use-case guides
6. Monitoring: Track Web Vitals via Vercel Analytics (Core Web Vitals: LCP, FID, CLS)

---

**Status:** ✅ PRODUCTION READY | All 11 calculators functional | Scientific Calculator live | Deployed to Vercel | Ready for scale 🚀
