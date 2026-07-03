# Design Tokens Quick Reference

**Fast lookup guide for all design tokens used in calculox.in**

---

## Color Tokens

### Primary (Blue)
```
primary-50   #eff6ff  primary-100  #dbeafe  primary-200  #bfdbfe
primary-300  #93c5fd  primary-400  #60a5fa  primary-500  #3b82f6
primary-600  #2563eb  primary-700  #1d4ed8  primary-800  #1e40af
primary-900  #1e3a8a  primary-950  #172554
```

### Success (Green)
```
success-50   #f0fdf4  success-100  #dcfce7  success-200  #bbf7d0
success-300  #86efac  success-400  #4ade80  success-500  #22c55e
success-600  #16a34a  success-700  #15803d  success-800  #166534
success-900  #145231  success-950  #0c2818
```

### Warning (Amber)
```
warning-50   #fffbeb  warning-100  #fef3c7  warning-200  #fde68a
warning-300  #fcd34d  warning-400  #fbbf24  warning-500  #f59e0b
warning-600  #d97706  warning-700  #b45309  warning-800  #92400e
warning-900  #78350f  warning-950  #451a03
```

### Error (Red)
```
error-50     #fef2f2  error-100    #fee2e2  error-200    #fecaca
error-300    #fca5a5  error-400    #f87171  error-500    #ef4444
error-600    #dc2626  error-700    #b91c1c  error-800    #991b1b
error-900    #7f1d1d  error-950    #4c0519
```

### Info (Cyan)
```
info-50      #f0f9ff  info-100     #e0f2fe  info-200     #bae6fd
info-300     #7dd3fc  info-400     #38bdf8  info-500     #06b6d4
info-600     #0891b2  info-700     #0e7490  info-800     #155e75
info-900     #164e63  info-950     #0c2d3d
```

### Gray (Neutral)
```
gray-50      #f9fafb  gray-100     #f3f4f6  gray-200     #e5e7eb
gray-300     #d1d5db  gray-400     #9ca3af  gray-500     #6b7280
gray-600     #4b5563  gray-700     #374151  gray-800     #1f2937
gray-900     #111827  gray-950     #030712
```

### Semantic Text & Background
```
text-primary       → gray-900      bg-primary          → white
text-secondary     → gray-700      bg-secondary        → gray-50
text-tertiary      → gray-600      bg-tertiary         → gray-100
text-disabled      → gray-400      bg-overlay          → black/50%
text-inverse       → white
```

---

## Typography Tokens

### Font Sizes
```
font-size-xs       12px   (0.75rem)
font-size-sm       14px   (0.875rem)
font-size-base     16px   (1rem)
font-size-lg       18px   (1.125rem)
font-size-xl       20px   (1.25rem)
font-size-2xl      24px   (1.5rem)
font-size-3xl      30px   (1.875rem)
font-size-4xl      36px   (2.25rem)
font-size-5xl      48px   (3rem)
font-size-6xl      60px   (3.75rem)
```

### Font Weights
```
font-weight-light       300
font-weight-regular     400
font-weight-medium      500
font-weight-semibold    600
font-weight-bold        700
font-weight-extrabold   800
```

### Line Heights
```
line-height-xs      1       (tight)
line-height-sm      1.25    (snug)
line-height-base    1.5     (normal)
line-height-lg      1.625   (relaxed)
line-height-xl      1.75    (loose)
line-height-2xl     2       (extra loose)
```

### Letter Spacing
```
letter-spacing-tight      -0.02em
letter-spacing-normal     0
letter-spacing-wide       0.05em
letter-spacing-wider      0.1em
```

### Font Families
```
font-family-sans       Inter, system fonts
font-family-serif      Crimson Text, Georgia
font-family-mono       Menlo, Monaco, Courier
```

---

## Spacing Tokens (4px Grid)

```
spacing-1      4px      spacing-2      8px       spacing-3      12px
spacing-4      16px     spacing-5      20px      spacing-6      24px
spacing-7      28px     spacing-8      32px      spacing-10     40px
spacing-12     48px     spacing-14     56px      spacing-16     64px
spacing-20     80px     spacing-24     96px      spacing-32     128px
```

### Component Padding
```
component-padding-xs       8px
component-padding-sm       12px
component-padding-md       16px
component-padding-lg       24px
component-padding-xl       32px
```

### Section Padding
```
section-padding-tight      32px
section-padding-normal     48px
section-padding-generous   64px
```

---

## Shadow & Elevation Tokens

### Shadow Levels
```
shadow-1       0 1px 2px rgba(16, 24, 40, 0.04)
shadow-2       0 4px 8px rgba(16, 24, 40, 0.08)
shadow-3       0 10px 28px -16px rgba(16, 24, 40, 0.16)
shadow-4       0 20px 48px -8px rgba(16, 24, 40, 0.24)
```

### Accent Shadows
```
shadow-primary-sm      0 0 0 2px rgba(59, 130, 246, 0.2)
shadow-primary-md      0 0 0 4px rgba(59, 130, 246, 0.15)
shadow-primary-lg      0 8px 24px rgba(59, 130, 246, 0.25)

shadow-success-sm      0 0 0 2px rgba(34, 197, 94, 0.2)
shadow-success-md      0 0 0 4px rgba(34, 197, 94, 0.15)
shadow-success-lg      0 8px 24px rgba(34, 197, 94, 0.25)

shadow-error-sm        0 0 0 2px rgba(239, 68, 68, 0.2)
shadow-error-md        0 0 0 4px rgba(239, 68, 68, 0.15)
shadow-error-lg        0 8px 24px rgba(239, 68, 68, 0.25)
```

### Inner Highlights
```
shadow-inner-light        inset 0 1px 0 rgba(255, 255, 255, 0.7)
shadow-inner-highlight    inset 0 1px 0 rgba(255, 255, 255, 0.9)
```

---

## Border Radius Tokens

```
radius-sm       6px      (0.375rem)
radius-md       8px      (0.5rem)
radius-lg       12px     (0.75rem)
radius-xl       16px     (1rem)
radius-2xl      24px     (1.5rem)
radius-full     9999px   (circle/pill)
```

---

## Transition Tokens

### Durations
```
transition-fast     150ms
transition-base     200ms
transition-slow     300ms
transition-slower   500ms
```

### Easing Functions
```
easing-in          cubic-bezier(0.4, 0, 1, 1)       (accelerating)
easing-out         cubic-bezier(0, 0, 0.2, 1)       (decelerating)
easing-in-out      cubic-bezier(0.4, 0, 0.2, 1)     (smooth)
```

---

## Z-Index Scale

```
z-base              0
z-sticky            10
z-fixed             20
z-dropdown          100
z-sticky-header     120
z-modal-backdrop    1000
z-modal             1001
z-popover           1002
z-tooltip           1003
z-notification      2000
```

---

## Quick Component Examples

### Button with Tokens
```tsx
<button className="btn-primary">
  {/* Applies: primary-600, white, px-6 py-3, rounded-xl, shadow-md */}
  Save Changes
</button>
```

### Card with Spacing
```tsx
<div className="card card-spacious">
  {/* Applies: rounded-2xl, padding-xl, shadow-2, border */}
  Content here
</div>
```

### Text with Colors
```tsx
<p className="text-secondary">
  {/* Applies: gray-700 light mode, gray-200 dark mode */}
  Secondary text that adapts to theme
</p>
```

### Form Input
```tsx
<input 
  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
  placeholder="Enter value"
/>
```

### Success State
```tsx
<div className="card card-success">
  <p className="card-success-text">✓ Operation successful</p>
</div>
```

### Badge
```tsx
<span className="badge badge-primary">Featured</span>
```

---

## Tailwind Class Examples

### Colors
```tsx
<div className="text-primary-600">Primary text</div>
<div className="bg-success-100">Success background</div>
<div className="border-warning-300">Warning border</div>
<div className="shadow-lg">Elevated shadow</div>
```

### Typography
```tsx
<h1 className="text-6xl font-bold">Display</h1>
<p className="text-base leading-lg">Body text</p>
<span className="text-xs font-semibold">Label</span>
```

### Spacing
```tsx
<div className="p-6 mb-4 gap-4">Spaced content</div>
```

### Rounded Corners
```tsx
<div className="rounded-lg">Card</div>
<div className="rounded-full">Circle</div>
```

### Shadows
```tsx
<div className="shadow-sm">Light shadow</div>
<div className="shadow-lg">Heavy shadow</div>
```

### Transitions
```tsx
<button className="transition-all duration-base hover:shadow-lg">
  Smooth interaction
</button>
```

---

## Dark Mode Behavior

All tokens automatically adapt when `html.dark` class is applied:

```tsx
// Light mode (default)
<div className="text-primary bg-primary">Text and background</div>

// Dark mode (when <html class="dark">)
// Automatically switches to dark-mode colors
```

**Manual testing:**
```tsx
// Add to <html> tag to test dark mode
<html className="dark">
```

---

## CSS Variable Usage

```css
.my-element {
  color: var(--text-primary);
  background: var(--bg-secondary);
  padding: var(--component-padding-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2);
  font-size: var(--font-size-base);
  transition: all var(--transition-base) var(--easing-in-out);
}
```

---

## File Locations

| Purpose | File |
|---------|------|
| Token definitions | `styles/design-tokens.css` |
| Tailwind config | `tailwind.config.ts` |
| Global styles | `app/globals.css` |
| Animations | `styles/animations.css` |
| Full documentation | `DESIGN_SYSTEM.md` |
| Implementation details | `PHASE1_IMPLEMENTATION.md` |

---

## Common Patterns

### Primary Button
```tsx
<button className="btn-primary">Action</button>
```

### Secondary Button
```tsx
<button className="btn-secondary">Secondary</button>
```

### Outline Button
```tsx
<button className="btn-outline">Cancel</button>
```

### Input Field
```tsx
<input className="px-4 py-3 border rounded-lg" />
```

### Form Label
```tsx
<label className="text-sm font-medium">Label</label>
```

### Success Message
```tsx
<div className="card card-success">
  <p className="card-success-text">✓ Success</p>
</div>
```

### Error Message
```tsx
<div className="card card-danger">
  <p className="card-danger-text">✗ Error</p>
</div>
```

### Warning Alert
```tsx
<div className="card card-warning">
  <p className="card-warning-text">⚠ Warning</p>
</div>
```

### Info Banner
```tsx
<div className="card card-info">
  <p className="card-info-text">ℹ Information</p>
</div>
```

---

## Best Practices

1. **Always use tokens** — Never hardcode colors, sizes, spacing
2. **Use semantic colors** — Choose primary, success, warning, error, info
3. **4px grid rhythm** — All spacing should be multiples of 4px
4. **Responsive first** — Design mobile, then enhance for larger screens
5. **Dark mode support** — All components must work in dark mode
6. **Accessibility first** — Maintain proper contrast and focus states
7. **Consistent spacing** — Use component-padding-* or section-padding-* tokens

---

## Migration Checklist

When updating existing code to use tokens:

- [ ] Replace hardcoded colors with token classes
- [ ] Replace hardcoded spacing with token utilities
- [ ] Replace hardcoded shadows with shadow tokens
- [ ] Replace hardcoded border-radius with radius tokens
- [ ] Test in both light and dark modes
- [ ] Verify accessibility (contrast, focus states)
- [ ] Update any component styles in globals.css

---

*Last Updated: July 2026*
*Status: Phase 1 Complete ✅*
