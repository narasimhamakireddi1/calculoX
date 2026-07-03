# Design System Guide — World-Class Foundation

A comprehensive design system for **calculox.in** built on semantic tokens, consistent spacing, and accessible components. This guide covers all design tokens, usage patterns, and best practices.

---

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing & Grid](#spacing--grid)
4. [Elevation & Shadows](#elevation--shadows)
5. [Border Radius](#border-radius)
6. [Transitions & Animation](#transitions--animation)
7. [Z-Index Scale](#z-index-scale)
8. [Component Variants](#component-variants)
9. [Dark Mode](#dark-mode)
10. [Usage Examples](#usage-examples)

---

## Color System

### Semantic Color Palette

The color system is built on **semantic meaning**, not arbitrary names. Each color family has 11 shades (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950) for maximum flexibility.

#### Primary Colors (Blue)

Used for primary actions, focus states, and links.

```css
--color-primary-50: #eff6ff;    /* Lightest: Backgrounds */
--color-primary-100: #dbeafe;
--color-primary-200: #bfdbfe;
--color-primary-300: #93c5fd;   /* Light: Hover states */
--color-primary-400: #60a5fa;
--color-primary-500: #3b82f6;   /* Medium: Secondary elements */
--color-primary-600: #2563eb;   /* Standard: Buttons, links */
--color-primary-700: #1d4ed8;   /* Dark: Hover buttons */
--color-primary-800: #1e40af;
--color-primary-900: #1e3a8a;   /* Darkest: Disabled states */
--color-primary-950: #172554;
```

#### Success Color (Green)

Used for positive actions, confirmations, and valid states.

```css
--color-success-50: #f0fdf4;
--color-success-100: #dcfce7;
--color-success-200: #bbf7d0;
--color-success-300: #86efac;
--color-success-400: #4ade80;
--color-success-500: #22c55e;   /* Standard success */
--color-success-600: #16a34a;   /* Dark success */
--color-success-700: #15803d;
--color-success-800: #166534;
--color-success-900: #145231;
--color-success-950: #0c2818;
```

#### Warning Color (Amber)

Used for alerts, warnings, and caution states.

```css
--color-warning-50: #fffbeb;
--color-warning-100: #fef3c7;
--color-warning-200: #fde68a;
--color-warning-300: #fcd34d;
--color-warning-400: #fbbf24;
--color-warning-500: #f59e0b;   /* Standard warning */
--color-warning-600: #d97706;   /* Dark warning */
--color-warning-700: #b45309;
--color-warning-800: #92400e;
--color-warning-900: #78350f;
--color-warning-950: #451a03;
```

#### Error/Danger Color (Red)

Used for destructive actions, errors, and alerts.

```css
--color-error-50: #fef2f2;
--color-error-100: #fee2e2;
--color-error-200: #fecaca;
--color-error-300: #fca5a5;
--color-error-400: #f87171;
--color-error-500: #ef4444;     /* Standard error */
--color-error-600: #dc2626;     /* Dark error */
--color-error-700: #b91c1c;
--color-error-800: #991b1b;
--color-error-900: #7f1d1d;
--color-error-950: #4c0519;
```

#### Info Color (Cyan)

Used for information, secondary highlights, and status indicators.

```css
--color-info-50: #f0f9ff;
--color-info-100: #e0f2fe;
--color-info-200: #bae6fd;
--color-info-300: #7dd3fc;
--color-info-400: #38bdf8;
--color-info-500: #06b6d4;     /* Standard info */
--color-info-600: #0891b2;     /* Dark info */
--color-info-700: #0e7490;
--color-info-800: #155e75;
--color-info-900: #164e63;
--color-info-950: #0c2d3d;
```

#### Neutral Colors (Gray)

Used for text, borders, backgrounds, and dividers.

```css
--color-gray-50: #f9fafb;       /* Lightest background */
--color-gray-100: #f3f4f6;      /* Secondary background */
--color-gray-200: #e5e7eb;      /* Subtle divider */
--color-gray-300: #d1d5db;      /* Default divider */
--color-gray-400: #9ca3af;      /* Muted text */
--color-gray-500: #6b7280;      /* Secondary text */
--color-gray-600: #4b5563;      /* Tertiary text */
--color-gray-700: #374151;      /* Primary text (light mode) */
--color-gray-800: #1f2937;      /* Dark background */
--color-gray-900: #111827;      /* Darkest (dark mode primary) */
--color-gray-950: #030712;      /* Darkest background */
```

### Semantic Text & Background Tokens

These override based on light/dark mode:

```css
/* Light Mode */
--text-primary: #111827;        /* Body text, headings */
--text-secondary: #374151;      /* Secondary text */
--text-tertiary: #6b7280;       /* Muted text, labels */
--text-disabled: #9ca3af;       /* Disabled form fields */
--text-inverse: #ffffff;        /* White text on dark */

--bg-primary: #ffffff;          /* Main background */
--bg-secondary: #f9fafb;        /* Secondary surfaces */
--bg-tertiary: #f3f4f6;         /* Tertiary surfaces */
--bg-overlay: rgba(0, 0, 0, 0.5);

/* Dark Mode (automatically switched) */
--text-primary: #f3f4f6;        /* Light text */
--text-secondary: #e5e7eb;
--bg-primary: #111827;          /* Dark background */
--bg-secondary: #1f2937;
```

### Usage Examples

```tsx
// Button with primary color
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  Calculate
</button>

// Success badge
<span className="badge badge-success">Valid</span>

// Warning card
<div className="card card-warning card-warning-text">
  Check your input values
</div>

// Using CSS variables directly
<div style={{ color: 'var(--text-secondary)' }}>
  Secondary text
</div>
```

---

## Typography

### Type Scale

The typography scale is designed with **meaningful jumps** for visual hierarchy:

```css
--font-size-xs: 0.75rem;        /* 12px */
--font-size-sm: 0.875rem;       /* 14px */
--font-size-base: 1rem;         /* 16px (body) */
--font-size-lg: 1.125rem;       /* 18px */
--font-size-xl: 1.25rem;        /* 20px */
--font-size-2xl: 1.5rem;        /* 24px */
--font-size-3xl: 1.875rem;      /* 30px */
--font-size-4xl: 2.25rem;       /* 36px */
--font-size-5xl: 3rem;          /* 48px */
--font-size-6xl: 3.75rem;       /* 60px */
```

### Line Heights

Automatically applied with font sizes in Tailwind:

```css
--line-height-xs: 1;            /* Tight */
--line-height-sm: 1.25;         /* Snug */
--line-height-base: 1.5;        /* Normal */
--line-height-lg: 1.625;        /* Relaxed */
--line-height-xl: 1.75;         /* Loose */
--line-height-2xl: 2;           /* Extra loose */
```

### Letter Spacing

```css
--letter-spacing-tight: -0.02em;  /* Heading tightness */
--letter-spacing-normal: 0;       /* Default */
--letter-spacing-wide: 0.05em;    /* Label emphasis */
--letter-spacing-wider: 0.1em;    /* Upper labels */
```

### Font Weights

```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;       /* Labels, semibold */
--font-weight-semibold: 600;     /* Headings */
--font-weight-bold: 700;         /* Strong headings */
--font-weight-extrabold: 800;
```

### Heading Styles

```tsx
<h1>Display text — 60px, bold, tight</h1>
<h2>Large heading — 36px, bold</h2>
<h3>Medium heading — 24px, bold</h3>
<h4>Small heading — 20px, semibold</h4>
<p>Body text — 16px, 1.625 line-height</p>
<label>Label — 14px, medium weight</label>
```

---

## Spacing & Grid

### 4px Grid System

All spacing is based on 4px rhythm for perfect alignment:

```css
--spacing-0: 0;
--spacing-1: 0.25rem;    /* 4px */
--spacing-2: 0.5rem;     /* 8px */
--spacing-3: 0.75rem;    /* 12px */
--spacing-4: 1rem;       /* 16px */
--spacing-5: 1.25rem;    /* 20px */
--spacing-6: 1.5rem;     /* 24px */
--spacing-7: 1.75rem;    /* 28px */
--spacing-8: 2rem;       /* 32px */
--spacing-10: 2.5rem;    /* 40px */
--spacing-12: 3rem;      /* 48px */
--spacing-14: 3.5rem;    /* 56px */
--spacing-16: 4rem;      /* 64px */
--spacing-20: 5rem;      /* 80px */
--spacing-24: 6rem;      /* 96px */
--spacing-32: 8rem;      /* 128px */
```

### Component Padding

Preset padding sizes for consistency:

```css
--component-padding-xs: 0.5rem;      /* 8px */
--component-padding-sm: 0.75rem;     /* 12px */
--component-padding-md: 1rem;        /* 16px */
--component-padding-lg: 1.5rem;      /* 24px */
--component-padding-xl: 2rem;        /* 32px */
```

### Section Padding

For spacing major sections:

```css
--section-padding-tight: 2rem;       /* 32px */
--section-padding-normal: 3rem;      /* 48px */
--section-padding-generous: 4rem;    /* 64px */
```

### Usage Examples

```tsx
// Margin/padding classes
<div className="mb-4 p-6">Content</div>

// Gap between items
<div className="flex gap-4">Item 1 | Item 2</div>

// Using CSS variables
<div style={{ 
  padding: 'var(--component-padding-lg)', 
  marginBottom: 'var(--spacing-8)' 
}}>
  Spaced content
</div>

// Grid with spacing
<div className="grid grid-cols-2 gap-6 md:gap-8">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

---

## Elevation & Shadows

### Shadow Levels

Four distinct elevation levels for depth hierarchy:

```css
/* Level 1: Subtle (Minimal depth, hover states) */
--shadow-1: 0 1px 2px rgba(16, 24, 40, 0.04);

/* Level 2: Standard (Cards, buttons) */
--shadow-2: 0 4px 8px rgba(16, 24, 40, 0.08);

/* Level 3: Prominent (Modals, dropdowns) */
--shadow-3: 0 10px 28px -16px rgba(16, 24, 40, 0.16);

/* Level 4: Maximum (Floating elements, popovers) */
--shadow-4: 0 20px 48px -8px rgba(16, 24, 40, 0.24);
```

### Accent Shadows

Colored shadows for focus/hover states:

```css
/* Primary color shadows */
--shadow-primary-sm: 0 0 0 2px rgba(59, 130, 246, 0.2);
--shadow-primary-md: 0 0 0 4px rgba(59, 130, 246, 0.15);
--shadow-primary-lg: 0 8px 24px rgba(59, 130, 246, 0.25);

/* Success shadows */
--shadow-success-sm: 0 0 0 2px rgba(34, 197, 94, 0.2);
--shadow-success-md: 0 0 0 4px rgba(34, 197, 94, 0.15);
--shadow-success-lg: 0 8px 24px rgba(34, 197, 94, 0.25);

/* Error shadows */
--shadow-error-sm: 0 0 0 2px rgba(239, 68, 68, 0.2);
--shadow-error-md: 0 0 0 4px rgba(239, 68, 68, 0.15);
--shadow-error-lg: 0 8px 24px rgba(239, 68, 68, 0.25);
```

### Inner Highlights

For glass-morphism effects:

```css
--shadow-inner-light: inset 0 1px 0 rgba(255, 255, 255, 0.7);
--shadow-inner-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.9);
```

### Usage Examples

```tsx
// Shadow classes
<div className="shadow-xs">Subtle shadow</div>
<div className="shadow-md">Standard card shadow</div>
<div className="shadow-lg">Modal shadow</div>

// Using CSS variables
<div style={{ boxShadow: 'var(--shadow-3)' }}>
  Elevated element
</div>

// Multiple shadows
<div className="shadow-md shadow-primary-lg">
  Button with glow
</div>
```

---

## Border Radius

Consistent rounding across the design:

```css
--radius-sm: 0.375rem;        /* 6px */
--radius-md: 0.5rem;          /* 8px */
--radius-lg: 0.75rem;         /* 12px */
--radius-xl: 1rem;            /* 16px */
--radius-2xl: 1.5rem;         /* 24px */
--radius-full: 9999px;        /* Circle/pill */
```

### Usage

```tsx
// Rounded corners
<div className="rounded-lg">Slightly rounded</div>
<div className="rounded-2xl">More rounded</div>
<div className="rounded-full">Pill shape</div>

// Input field
<input className="rounded-lg border" />

// Card
<div className="rounded-2xl bg-white shadow">Card</div>
```

---

## Transitions & Animation

### Timing

```css
--transition-fast: 150ms;       /* Quick feedback */
--transition-base: 200ms;       /* Standard */
--transition-slow: 300ms;       /* Noticeable */
--transition-slower: 500ms;     /* Deliberate */
```

### Easing Functions

```css
--easing-in: cubic-bezier(0.4, 0, 1, 1);        /* Accelerating */
--easing-out: cubic-bezier(0, 0, 0.2, 1);       /* Decelerating */
--easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);  /* Smooth */
```

### Usage Examples

```tsx
// Button hover with transition
<button className="transition-all duration-base">
  Smooth interaction
</button>

// Using CSS variables
<div style={{
  transition: `all var(--transition-base) var(--easing-in-out)`
}}>
  Animated element
</div>

// Custom animation
<div className="animate-pulse">
  Pulsing indicator
</div>
```

---

## Z-Index Scale

Consistent layering for modals, dropdowns, and overlays:

```css
--z-base: 0;                /* Default */
--z-sticky: 10;             /* Sticky headers */
--z-fixed: 20;              /* Fixed navigation */
--z-dropdown: 100;          /* Dropdown menus */
--z-sticky-header: 120;     /* Sticky header over dropdowns */
--z-modal-backdrop: 1000;   /* Modal background */
--z-modal: 1001;            /* Modal content */
--z-popover: 1002;          /* Popovers */
--z-tooltip: 1003;          /* Tooltips */
--z-notification: 2000;     /* Toast notifications */
```

### Usage

```tsx
// Modal with backdrop
<div style={{ zIndex: 'var(--z-modal-backdrop)' }} className="fixed inset-0 bg-black/50" />
<div style={{ zIndex: 'var(--z-modal)' }} className="fixed">
  Modal content
</div>

// Dropdown
<div style={{ zIndex: 'var(--z-dropdown)' }} className="absolute">
  Menu items
</div>
```

---

## Component Variants

### Buttons

```tsx
// Primary action
<button className="btn-primary">Save Changes</button>

// Secondary action
<button className="btn-secondary">Next Step</button>

// Outline style
<button className="btn-outline">Cancel</button>

// Success feedback
<button className="btn-success">Confirmed</button>

// Warning state
<button className="btn-warning">Caution</button>

// Error action
<button className="btn-danger">Delete</button>

// Info
<button className="btn-info">Learn More</button>
```

### Cards

```tsx
// Standard card
<div className="card">Content</div>

// Compact spacing
<div className="card card-compact">Tight spacing</div>

// Generous spacing
<div className="card card-spacious">Loose spacing</div>

// Elevated
<div className="card card-elevated">Extra shadow</div>

// Flat
<div className="card card-flat">No shadow</div>

// Success variant
<div className="card card-success">
  <p className="card-success-text">Success message</p>
</div>

// Warning variant
<div className="card card-warning">
  <p className="card-warning-text">Warning message</p>
</div>

// Error variant
<div className="card card-danger">
  <p className="card-danger-text">Error message</p>
</div>

// Info variant
<div className="card card-info">
  <p className="card-info-text">Info message</p>
</div>

// Result card (for calculator output)
<div className="card card-result">
  <h3>Result: ₹1,23,456</h3>
</div>
```

### Badges & Status

```tsx
// Badges
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-error">Error</span>
<span className="badge badge-info">Info</span>

// Status dots
<span className="status-dot status-dot-success"></span>
<span className="status-dot status-dot-warning"></span>
<span className="status-dot status-dot-error"></span>

// Pulsing indicator
<span className="status-dot status-dot-pulse status-dot-success"></span>
```

### Form Elements

```tsx
// Input
<input className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500" />

// Label
<label className="text-sm font-medium text-gray-700">
  Calculator Input
</label>

// Text colors
<p className="text-primary">Primary text</p>
<p className="text-secondary">Secondary text</p>
<p className="text-tertiary">Tertiary text</p>
```

---

## Dark Mode

The design system automatically adapts to dark mode via CSS variables.

### How It Works

```css
/* Light mode (default) */
:root {
  --text-primary: #111827;
  --bg-primary: #ffffff;
}

/* Dark mode (when html.dark class is set) */
html.dark {
  --text-primary: #f3f4f6;
  --bg-primary: #111827;
}
```

### Usage

```tsx
// Components automatically adapt
<div className="text-primary bg-primary">
  Works in both light and dark modes
</div>

// Force dark mode for testing
<html className="dark">
  <body>Dark mode enabled</body>
</html>
```

---

## Usage Examples

### Complete Calculator Input

```tsx
<div className="card card-spacious">
  <label htmlFor="amount" className="text-sm font-medium text-gray-700">
    Investment Amount
  </label>
  <input
    id="amount"
    type="number"
    className="mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
    placeholder="Enter amount in ₹"
  />
  <button className="btn-primary mt-6 w-full">
    Calculate
  </button>
</div>
```

### Result Display

```tsx
<div className="card card-result">
  <h3 className="text-xl font-bold text-primary-600">
    Your Result
  </h3>
  <p className="mt-4 text-4xl font-bold text-primary-700">
    ₹2,50,000
  </p>
  <p className="mt-2 text-tertiary">
    After 5 years at 12% annual return
  </p>
</div>
```

### Info Banner

```tsx
<div className="card card-info">
  <p className="card-info-text font-medium">
    💡 Tip: Increase your investment for better returns
  </p>
</div>
```

### Responsive Grid

```tsx
<div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
  <div className="card">Column 1</div>
  <div className="card">Column 2</div>
</div>
```

---

## Best Practices

1. **Use semantic colors** — Choose colors based on meaning (success, warning, error) not appearance
2. **Maintain spacing rhythm** — Always use `--spacing-*` tokens for consistency
3. **Leverage dark mode** — All components automatically work in dark mode
4. **Minimal transitions** — Keep animations under 300ms for responsiveness
5. **Accessible contrast** — All color combinations meet WCAG AA standards
6. **Mobile-first** — Design for small screens first, then enhance for larger ones
7. **Reduce motion** — Respect `prefers-reduced-motion` media query for accessibility

---

## File Locations

- **Tokens:** `styles/design-tokens.css`
- **Global Styles:** `app/globals.css`
- **Config:** `tailwind.config.ts`
- **Components:** `components/` directory

---

## Quick Reference

| Token Type | Variable Prefix | Use Case |
|-----------|-----------------|----------|
| Colors | `--color-` | Text, backgrounds, borders |
| Typography | `--font-size-`, `--font-weight-` | Text styling |
| Spacing | `--spacing-` | Margins, padding, gaps |
| Shadows | `--shadow-` | Depth, elevation |
| Radius | `--radius-` | Rounded corners |
| Transitions | `--transition-` | Animation timing |

---

**Last Updated:** July 2026

This design system will evolve as the product grows. Maintain consistency by always referencing tokens rather than hardcoding values.
