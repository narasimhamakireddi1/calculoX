# Project Structure Guide

## Directory Layout

```
calculators-website/
├── app/                              # Next.js 14 App Router
│   ├── layout.tsx                   # Root layout (metadata, providers)
│   ├── page.tsx                     # Homepage with calculator cards
│   ├── globals.css                  # Global Tailwind styles
│   ├── sip-calculator/
│   │   └── page.tsx                 # SIP calculator page (READY TO IMPLEMENT)
│   ├── emi-calculator/
│   │   └── page.tsx                 # EMI calculator page (READY TO IMPLEMENT)
│   ├── bmi-calculator/
│   │   └── page.tsx                 # BMI calculator page (READY TO IMPLEMENT)
│   └── tax-calculator/
│       └── page.tsx                 # Income Tax calculator page (READY TO IMPLEMENT)
│
├── components/                       # React components
│   ├── layout/
│   │   ├── Navbar.tsx               # Navigation bar
│   │   └── Footer.tsx               # Footer component
│   └── ui/
│       └── CalculatorCard.tsx       # Reusable calculator card
│
├── lib/                              # Business logic
│   ├── calculators/
│   │   ├── sip.ts                   # SIP calculation logic (IMPLEMENTED)
│   │   ├── emi.ts                   # EMI calculation (TODO)
│   │   ├── bmi.ts                   # BMI calculation (IMPLEMENTED)
│   │   └── tax.ts                   # Tax calculation (TODO)
│   ├── validators/
│   │   └── index.ts                 # Zod validation schemas
│   └── utils/
│       └── format.ts                # Formatting utilities
│
├── config/                           # Configuration files
│   ├── site.config.ts               # Site-wide configuration
│   └── calculators.config.ts        # Calculator metadata & routing
│
├── prisma/                           # Database
│   ├── schema.prisma                # Prisma schema definition
│   └── migrations/                  # Database migrations (empty initially)
│
├── public/                           # Static assets
│   └── robots.txt                   # SEO robots configuration
│
├── types/                            # TypeScript type definitions
│   └── calculator.ts                # Calculator-related types
│
├── __tests__/                        # Test files (create as needed)
│   ├── lib/
│   └── components/
│
├── scripts/                          # Build and utility scripts
│   ├── generate-sitemap.js          # SEO sitemap generator
│   └── seo-audit.js                 # SEO audit script
│
├── Configuration Files
├── package.json                     # Dependencies & npm scripts
├── next.config.js                   # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
├── tsconfig.json                    # TypeScript configuration
├── jest.config.js                   # Jest testing configuration
├── jest.setup.js                    # Jest setup file
├── .eslintrc.json                   # ESLint configuration
├── .env.local.example               # Environment variables template
├── .gitignore                       # Git ignore rules
│
├── Documentation Files
├── CLAUDE.md                        # Developer documentation (THIS FILE)
├── README.md                        # Project overview
├── DEPLOYMENT_GUIDE.md              # Deployment instructions
├── MASTER_INDEX_AND_GETTING_STARTED.md  # Complete guide index
└── PROJECT_STRUCTURE.md             # This file
```

## File Categories

### App Router Pages (`app/`)
- **Entry Point:** `app/layout.tsx` - Root layout with metadata and providers
- **Homepage:** `app/page.tsx` - Landing page with calculator grid
- **Calculator Pages:** `app/*/page.tsx` - Individual calculator pages

Each calculator page is a Client Component (`'use client'`) that handles:
- User input form
- Calculation logic invocation
- Results display

### Components (`components/`)
**Layout Components:**
- `Navbar.tsx` - Top navigation with calculator links
- `Footer.tsx` - Site footer with links and info

**UI Components:**
- `CalculatorCard.tsx` - Reusable card for calculator grid
- (Add more reusable components here)

### Business Logic (`lib/`)
**Calculators:**
- Each has: Input interface, Result interface, main calculation function
- Uses `Decimal.js` for precise calculations
- Pattern: `calculate<Name>(input): Result`

**Validators:**
- Zod schemas for type-safe input validation
- One schema per calculator

**Utils:**
- `format.ts` - Number, currency, percentage formatting
- (Add more utils as needed)

### Configuration (`config/`)
- `site.config.ts` - Global site configuration, feature flags, SEO
- `calculators.config.ts` - All calculator metadata, status, routing

### Database (`prisma/`)
- `schema.prisma` - Database schema with migrations
- Models: `CalculationHistory`, `PageView`, `Feedback`, `SitemapEntry`
- Run `npx prisma migrate dev` to apply migrations

### Types (`types/`)
- `calculator.ts` - Shared TypeScript interfaces
- Add more as your app grows

### Tests (`__tests__/`)
- Mirror the folder structure of `lib/` and `components/`
- Use Jest + React Testing Library

### Scripts (`scripts/`)
- Utility scripts for build, SEO, and maintenance
- Run via npm scripts in `package.json`

## Key Patterns

### Creating a New Calculator

1. **Add calculation logic:** `lib/calculators/xyz.ts`
   ```typescript
   export function calculateXYZ(input: XYZInput): XYZResult { ... }
   ```

2. **Add validation:** `lib/validators/index.ts`
   ```typescript
   export const XYZSchema = z.object({ ... });
   ```

3. **Add configuration:** `config/calculators.config.ts`
   ```typescript
   { id: 'xyz', title: '...', href: '/xyz-calculator', ... }
   ```

4. **Create page:** `app/xyz-calculator/page.tsx`
   - Import calculation and validation
   - Build form UI
   - Display results

5. **Add tests:** `__tests__/lib/calculators/xyz.test.ts`

### Adding a UI Component

1. Create in `components/ui/ComponentName.tsx`
2. Export from `components/ui/index.ts` (create if needed)
3. Use in pages or other components with `import { ComponentName } from '@/components/ui'`

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:
- `DATABASE_URL` - Prisma database connection
- `NEXT_PUBLIC_SITE_URL` - Your site URL
- Feature flags and API keys

## Next Steps

1. **Setup:** `npm install && npm run db:migrate`
2. **Develop:** `npm run dev` → http://localhost:3000
3. **Implement:** Start with calculator pages (copy SIP pattern)
4. **Test:** Add tests in `__tests__/` directory
5. **Deploy:** `npm run build && git push` (Vercel auto-deploys)

See `CLAUDE.md` for more details on development commands.
