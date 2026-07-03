# PHASE 5: ADVANCED ANIMATIONS GUIDE

This guide documents all animation components and utilities implemented for calculox.in.

---

## 🎬 PAGE TRANSITIONS

### Page Load Fade In
Use on calculator pages for smooth page load effect.

```tsx
import { PageTransition } from '@/components/ui/PageTransition';

export default function CalculatorPage() {
  return (
    <PageTransition type="fade">
      <main>{/* Calculator content */}</main>
    </PageTransition>
  );
}
```

**CSS Class:** `page-load-fade-in`
**Duration:** 0.5s

### Page Slide In
Use for more prominent page transitions.

```tsx
<PageTransition type="slide">
  <main>{/* Content */}</main>
</PageTransition>
```

**CSS Class:** `page-slide-in`
**Duration:** 0.6s

---

## 🎨 COMPONENT MICRO-ANIMATIONS

### Animated Input with Error Shake
Automatically shakes on validation errors.

```tsx
import { AnimatedInput } from '@/components/ui/AnimatedInput';

<AnimatedInput
  label="Amount"
  value={amount}
  onChange={setAmount}
  error={error}
  success={isValid}
  helperText="Enter a valid amount"
/>
```

**Features:**
- Error shake animation (0.4s)
- Border color transitions
- Success checkmark with scale-in
- Color-coded states

### Animated Result Cards
Shows number flip animation when value changes.

```tsx
import { AnimatedResultCard } from '@/components/ui/AnimatedResultCard';

<AnimatedResultCard
  label="Monthly Payment"
  value={monthlyPayment}
  format="currency"
  isPrimary={true}
  icon={DollarSign}
/>
```

**Features:**
- Number flip animation (0.6s)
- `useAnimatedNumber` hook for smooth counting
- Hover scale effect
- Color customization

### Ripple Button
Adds ripple effect on click.

```tsx
import { RippleButton } from '@/components/ui/RippleButton';

<RippleButton 
  variant="primary" 
  onClick={handleCalculate}
>
  Calculate Now
</RippleButton>
```

**Features:**
- Click-based ripple effect (0.6s)
- Multiple variants: primary, secondary, danger, success
- Sizes: sm, md, lg
- Disabled state support

---

## 📜 SCROLL ANIMATIONS

### Scroll Fade-In
Element fades in when scrolled into view.

```tsx
import { ScrollAnimatedElement } from '@/components/ui/ScrollAnimatedElement';

<ScrollAnimatedElement animation="fade">
  <div className="content">Content fades in</div>
</ScrollAnimatedElement>
```

### Scroll Slide-Up
Element slides up with fade when scrolled into view.

```tsx
<ScrollAnimatedElement animation="slide-up">
  <FeatureCard />
</ScrollAnimatedElement>
```

### Scroll Scale-Up
Element scales up with fade when scrolled into view.

```tsx
<ScrollAnimatedElement animation="scale-up">
  <BlogCard />
</ScrollAnimatedElement>
```

### Staggered List Animation
Multiple items animate in sequence.

```tsx
import { ScrollAnimatedList } from '@/components/ui/ScrollAnimatedElement';

const items = blogPosts.map(post => <BlogPostCard key={post.id} post={post} />);

<ScrollAnimatedList 
  items={items}
  animation="slide-up"
  staggerDelay={100}
/>
```

**Options:**
- `animation`: 'fade' | 'slide-up' | 'scale-up'
- `staggerDelay`: milliseconds between item animations

### Reading Progress Bar
Shows reading progress on blog articles.

```tsx
import { ReadingProgressBar } from '@/components/ui/ReadingProgressBar';

export default function BlogPost() {
  return (
    <>
      <ReadingProgressBar color="blue" />
      <article>{/* Content */}</article>
    </>
  );
}
```

**Colors:** 'blue' | 'emerald' | 'purple' | 'rose'

---

## 🖼️ PARALLAX EFFECTS

### Parallax Image
Featured images scroll at different speeds for depth.

```tsx
import { ParallaxImage } from '@/components/ui/ParallaxImage';

<ParallaxImage
  src="/blog/featured.svg"
  alt="Blog hero"
  width={800}
  height={420}
  speed={0.5}
/>
```

**Options:**
- `speed`: 0-1 (0 = no parallax, 1 = full scroll speed)
- `loading`: 'eager' | 'lazy'

---

## ✨ FLOATING ELEMENTS

### Floating Particles
Animated particles floating up on hero sections.

```tsx
import { FloatingParticles } from '@/components/ui/FloatingParticles';

<section className="hero relative">
  <FloatingParticles count={15} duration={4000} />
  <div className="relative z-10">
    {/* Hero content */}
  </div>
</section>
```

**Options:**
- `count`: number of particles (default: 15)
- `duration`: animation duration in ms (default: 4000)

---

## 🔌 HOOKS

### useScrollAnimation
Detects when element enters viewport.

```tsx
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

function MyComponent() {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true,
  });

  return (
    <div ref={ref}>
      {isVisible && <span>Visible!</span>}
    </div>
  );
}
```

### useParallax
Parallax scroll effect hook.

```tsx
import { useParallax } from '@/lib/hooks/useScrollAnimation';

function ParallaxComponent() {
  const ref = useParallax(0.5); // speed = 0.5

  return <div ref={ref}>{/* Content */}</div>;
}
```

### useAnimatedNumber
Animated number counter.

```tsx
import { useAnimatedNumber } from '@/lib/hooks/useAnimatedNumber';

function ResultCard({ value }) {
  const animatedValue = useAnimatedNumber(value, 600);
  return <div>{animatedValue.toLocaleString()}</div>;
}
```

**Options:**
- `targetValue`: number to animate to
- `duration`: animation duration in ms (default: 600)

---

## 📊 TOAST NOTIFICATIONS

### Enhanced Toast with Slide-Up
Already configured in `Toast.tsx` with animations.

```tsx
import { showToast } from '@/components/ui/Toast';

// Success
showToast('Calculation complete!', 'success');

// Error
showToast('Invalid input', 'error');

// Info
showToast('Check your results', 'info');
```

---

## 🎯 CSS UTILITY CLASSES

Apply animations directly with CSS classes:

```tsx
// Page transitions
<div className="page-load-fade-in">Fade in</div>
<div className="page-slide-in">Slide in</div>

// Scroll animations
<div className="scroll-fade-in">Fades on scroll</div>
<div className="scroll-slide-up">Slides up on scroll</div>
<div className="scroll-scale-up">Scales on scroll</div>

// Number animations
<div className="number-flip">Flips when updated</div>
<div className="number-loading">Pulses while loading</div>

// Input states
<input className="input-invalid-shake" />
<input className="input-invalid-pulse" />

// Utility classes
<div className="bounce-in">Bounce in</div>
<div className="slide-left">Slide from right</div>
<div className="slide-right">Slide from left</div>
<div className="rotate-in">Rotate in</div>
<div className="expand-height">Expand height</div>
<div className="collapse-height">Collapse height</div>

// Polish
<button className="button-glow">Glowing button</button>
<div className="cta-bounce">Bouncing CTA</div>
<div className="glow-pulse">Pulsing glow</div>
```

---

## 🎬 CSS ANIMATION VARIABLES

Use predefined timing functions:

```css
animation-duration: var(--animation-duration-fast);      /* 150ms */
animation-duration: var(--animation-duration-base);      /* 300ms */
animation-duration: var(--animation-duration-slow);      /* 500ms */
animation-duration: var(--animation-duration-slower);    /* 800ms */

animation-timing-function: var(--animation-timing-ease-in);      /* cubic-bezier(0.4, 0, 1, 1) */
animation-timing-function: var(--animation-timing-ease-out);     /* cubic-bezier(0, 0, 0.2, 1) */
animation-timing-function: var(--animation-timing-ease-in-out);  /* cubic-bezier(0.4, 0, 0.2, 1) */
animation-timing-function: var(--animation-timing-ease-out-back); /* cubic-bezier(0.34, 1.56, 0.64, 1) */
```

---

## 📱 IMPLEMENTATION CHECKLIST

### Calculator Pages
- [ ] Wrap page in `<PageTransition>`
- [ ] Use `<AnimatedInput>` for all inputs
- [ ] Use `<AnimatedResultCard>` for results
- [ ] Use `<RippleButton>` for CTAs
- [ ] Add `<ReadingProgressBar>` if article-style

### Blog Posts
- [ ] Use `<ReadingProgressBar>` at top
- [ ] Use `<ParallaxImage>` for featured images
- [ ] Wrap sections in `<ScrollAnimatedElement>`
- [ ] Use `<ScrollAnimatedList>` for related posts

### Homepage
- [ ] Add `<FloatingParticles>` to hero
- [ ] Use `<ScrollAnimatedElement>` for sections
- [ ] Apply scroll animations to feature cards
- [ ] Use parallax on hero images

---

## 🚀 PERFORMANCE TIPS

1. **Use `triggerOnce={true}`** in `useScrollAnimation` to prevent re-animations
2. **Lazy load** parallax images with `loading="lazy"`
3. **Respect prefers-reduced-motion** (automatically handled in CSS)
4. **Use `will-change` sparingly** (already on `.parallax-image`)
5. **Debounce scroll handlers** (scroll animations handle this)

---

## 🎨 CUSTOMIZATION

### Custom Animation Speeds
Extend Tailwind config or use inline styles:

```tsx
<PageTransition duration={800}>
  <main>{/* Slower transition */}</main>
</PageTransition>
```

### Custom Colors
Pass variants to components:

```tsx
<ReadingProgressBar color="rose" />
<RippleButton variant="danger">Delete</RippleButton>
```

### Custom Stagger
Adjust stagger timing:

```tsx
<ScrollAnimatedList 
  items={items}
  staggerDelay={200}
/>
```

---

## 🐛 TROUBLESHOOTING

### Animations not running
- Check that `@import url('../styles/animations.css')` is in `globals.css`
- Verify element is inside viewport (scroll animations)
- Check `prefers-reduced-motion` setting

### Parallax not working
- Ensure parent is not using `transform` (conflicts with parallax)
- Check `will-change` CSS property
- Verify scroll event listener is attached

### Number animation jumps
- Use `useAnimatedNumber` hook instead of directly setting values
- Ensure duration is sufficient for large numbers
- Use `font-variant-numeric: tabular-nums` on number displays

---

## 📚 RELATED FILES

- `styles/animations.css` — All keyframes and animation utilities
- `lib/hooks/useScrollAnimation.ts` — Scroll detection hooks
- `lib/hooks/useAnimatedNumber.ts` — Number counter hook
- `components/ui/PageTransition.tsx` — Page transition wrapper
- `components/ui/ScrollAnimatedElement.tsx` — Scroll animation wrapper
- `components/ui/ReadingProgressBar.tsx` — Article progress indicator
- `components/ui/ParallaxImage.tsx` — Parallax scroll effect
- `components/ui/FloatingParticles.tsx` — Floating particle animation
- `components/ui/AnimatedInput.tsx` — Input with error shake
- `components/ui/AnimatedResultCard.tsx` — Number card with counter
- `components/ui/RippleButton.tsx` — Button with ripple effect
- `components/ui/Toast.tsx` — Toast notifications with slide animation

---

## 🎯 NEXT STEPS

1. **Add page transitions** to all calculator pages
2. **Implement scroll animations** in blog posts
3. **Add floating particles** to homepage hero
4. **Convert buttons** to `RippleButton`
5. **Add progress bar** to blog articles
6. **Test on mobile** for performance
7. **Verify animation timing** across browsers
