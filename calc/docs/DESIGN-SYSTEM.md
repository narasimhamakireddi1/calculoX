# calculox Design System

Single source of truth for visual design. Tokens live in `app/globals.css` (`:root` block); this document explains intent and usage. Last updated: 2026-07-17.

## Brand Personality

Professional financial credibility + educational approachability. Blue anchors trust (banks, RBI-adjacent seriousness); the blue→purple gradient is reserved for the brand wordmark and hero keywords only — never for body UI.

## Color Tokens

### Brand
| Token | Value | Use |
|---|---|---|
| `--brand-600` | `#2563eb` | Primary CTAs, links, active states |
| `--brand-700` | `#1d4ed8` | CTA hover |
| `--brand-500` / `--brand-400` | `#3b82f6` / `#60a5fa` | Dark-mode links, slider fills |
| `--brand-grad-from → --brand-grad-to` | `#2563eb → #9333ea` | Wordmark + hero gradient text only |

### Category accents (fixed — do not remix)
| Category | Accent | Tailwind family |
|---|---|---|
| Finance | Blue | `blue-*` (tiles: `from-blue-500 to-indigo-600`) |
| Health | Rose | `rose-*` (tiles: `from-rose-500 to-pink-600`) |
| Utility | Violet | `violet-*` (tiles: `from-violet-500 to-purple-600`) |

### Semantic
| Token | Value | Use |
|---|---|---|
| `--color-success` | `#10b981` (emerald) | Positive results, verification badges |
| `--color-warning` | `#f59e0b` (amber) | Disclaimers, caution — the disclaimer amber is a trust feature, keep prominent |
| `--color-danger` | `#ef4444` | Errors, negative margins |
| `--color-info` | `#3b82f6` | Informational chips |
| Teal | `teal-*` | Conversion/renter track (Home Loan vs Rent) |

### Surfaces
Light: page `#f6f8fd` (gradient tinted), cards `white/80` + backdrop-blur.
Dark: page `#070b15`, cards `gray-900/50` glass with inner top highlight.
Both modes share the dot-grid texture (`body::before`) and ambient corner glows (`body::after`, reduced-motion gated).

## Typography

| Level | Classes | Notes |
|---|---|---|
| Hero h1 | `text-4xl md:text-6xl font-bold tracking-tight leading-[1.08]` | Value proposition, gradient on keyword span |
| h2 | `text-4xl font-bold` (global: `text-3xl md:text-4xl tracking-tight`) | Section titles |
| Section eyebrow | `.section-eyebrow` | Uppercase 12px, `tracking-[0.18em]`, blue, leading dash — precedes every homepage h2 |
| Calc page h1 | `text-3xl sm:text-4xl font-bold text-gradient` | Established pattern, do not change |
| Result hero number | `text-5xl sm:text-6xl font-black tabular-nums` | Dominant single number per result panel |
| Body | `leading-relaxed` (1.625), gray-700 / dark gray-300 | |

## Motion Spec (micro-interactions)

All durations/easings are tokens — use them, don't hardcode:

| Token | Value | Applies to |
|---|---|---|
| `--motion-fast` | 150ms | Hover color shifts, focus rings, tab switches |
| `--motion-base` | 250ms | Card lift (`hover:-translate-y-1`), shadow transitions |
| `--motion-slow` | 400ms | Panel/accordion transitions |
| `--motion-reveal` | 600ms | Scroll-triggered reveals |
| `--ease-out-soft` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals, entrances (decelerating, premium feel) |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Reversible state changes |

Rules:
- **Transform + opacity only** — never animate layout properties (width/height/top). Zero CLS budget.
- Buttons: lift `-translate-y-0.5` on hover, `scale-[0.98]` on active. No bouncy springs.
- Cards: `-translate-y-1` + blue-tinted glow ring on hover (`.card`).
- Every animation is disabled or skipped under `prefers-reduced-motion: reduce` (global `transition-none` + JS checks).

### ScrollReveal (`components/ui/ScrollReveal.tsx`)
Wrap below-fold homepage sections: `<ScrollReveal><section>…</section></ScrollReveal>`.
- Content is visible by default (SEO/no-JS safe); hidden state applied only after mount.
- Skips elements already in viewport, reduced-motion users, and browsers without IntersectionObserver.
- 18px rise + fade over `--motion-reveal`; optional `delay` prop for stagger (use ≤3 steps of 80ms).
- Children stay server-renderable when passed through (RSC-safe).

## Component Patterns

- **Cards**: `.card` (glass, 16px radius, hover lift+glow). Variants: `card-compact/spacious/success/warning/danger/info/result`.
- **Buttons**: `.btn-primary/secondary/outline/danger/success/warning/info` — gradient fills, 12px radius, shadow tinted to fill color.
- **Badges**: `.badge` + semantic variants; status dots `.status-dot-*`.
- **Section header**: eyebrow (`.section-eyebrow`) → h2 → one-line gray subtitle. Centered sections add `justify-center w-full` to the eyebrow.
- **Radii**: controls 12px (`rounded-xl`), cards 16px (`rounded-2xl`). Never mix per-element.
- **Icons**: Lucide only, `strokeWidth={2}` (1.75 for large feature icons), always `aria-hidden="true"`. No emojis in UI.

## Accessibility (WCAG AAA — maintained)

- Focus: `focus-visible:ring-2 ring-blue-500` on all interactive elements; inputs get ring + border + tinted shadow.
- Touch targets ≥48px on mobile (`min-h-12`).
- 16px input font on mobile (prevents iOS zoom).
- All decorative layers `aria-hidden` + `pointer-events-none`.
- Reduced-motion: global kill-switch + per-component JS checks.

## Performance Guardrails

- Hero widget computes results at render from `useMemo` — no loading states, no CLS.
- Charts: `isAnimationActive={false}`, memoized, initial data computed at module level (first-paint render).
- Blog SVGs: fixed 800×420 aspect pre-reserved.
- ScrollReveal animates compositor-only properties; observers disconnect after firing.
- Budget: LCP < 2.5s · CLS < 0.1 · INP < 200ms. Current Lighthouse: 97/100 perf, 100 a11y/BP/SEO.
