# PHASE 5: ANIMATIONS QUICK REFERENCE

## ⚡ Copy-Paste Components

### Page Transition
```tsx
import { PageTransition } from '@/components/ui/PageTransition';

<PageTransition type="fade">
  {/* Page content */}
</PageTransition>
```

### Animated Input (Auto Error Shake)
```tsx
import { AnimatedInput } from '@/components/ui/AnimatedInput';

<AnimatedInput
  label="Amount"
  value={amount}
  onChange={setAmount}
  error={error || ''}
  success={isValid}
/>
```

### Animated Result Card (Number Counter)
```tsx
import { AnimatedResultCard } from '@/components/ui/AnimatedResultCard';

<AnimatedResultCard
  label="Monthly Payment"
  value={monthlyPayment}
  isPrimary={true}
  format="currency"
  icon={DollarSign}
/>
```

### Ripple Button (Material Design Click Effect)
```tsx
import { RippleButton } from '@/components/ui/RippleButton';

<RippleButton variant="primary">
  Calculate Now
</RippleButton>
```

### Scroll Fade-In
```tsx
import { ScrollAnimatedElement } from '@/components/ui/ScrollAnimatedElement';

<ScrollAnimatedElement animation="fade">
  <YourComponent />
</ScrollAnimatedElement>
```

### Scroll Slide-Up (Most Common)
```tsx
<ScrollAnimatedElement animation="slide-up">
  <FeatureCard />
</ScrollAnimatedElement>
```

### Scroll Scale-Up
```tsx
<ScrollAnimatedElement animation="scale-up">
  <BlogCard />
</ScrollAnimatedElement>
```

### Staggered List (Auto-Stagger Items)
```tsx
import { ScrollAnimatedList } from '@/components/ui/ScrollAnimatedElement';

<ScrollAnimatedList 
  items={items}
  animation="slide-up"
  staggerDelay={100}
/>
```

### Reading Progress Bar (Blog Articles)
```tsx
import { ReadingProgressBar } from '@/components/ui/ReadingProgressBar';

<ReadingProgressBar color="blue" />
```

### Parallax Hero Image
```tsx
import { ParallaxImage } from '@/components/ui/ParallaxImage';

<ParallaxImage
  src="/blog/featured.svg"
  alt="Hero"
  speed={0.5}
/>
```

### Floating Particles (Hero Section)
```tsx
import { FloatingParticles } from '@/components/ui/FloatingParticles';

<section className="hero relative">
  <FloatingParticles count={15} duration={4000} />
  <div className="relative z-10">{/* Hero content */}</div>
</section>
```

---

## 🎨 CSS Classes (Direct Application)

### Scroll Animations
```tsx
<div className="scroll-fade-in">Fades in on scroll</div>
<div className="scroll-slide-up">Slides up on scroll</div>
<div className="scroll-scale-up">Scales on scroll</div>
```

### Input States
```tsx
<input className="input-invalid-shake" />  {/* Shakes on error */}
<input className="input-invalid-pulse" />  {/* Pulses on error */}
```

### Number Display
```tsx
<div className="number-flip">Flips when value updates</div>
<div className="number-loading">Pulses while loading</div>
```

### Button/CTA Polish
```tsx
<button className="button-glow">Glowing effect</button>
<div className="cta-bounce">Bounces subtly</div>
<div className="glow-pulse">Pulsing glow</div>
```

### Transitions
```tsx
<div className="bounce-in">Bounces in</div>
<div className="slide-left">Slides from right</div>
<div className="slide-right">Slides from left</div>
<div className="rotate-in">Rotates in</div>
<div className="expand-height">Height expands</div>
```

---

## ⏱️ Animation Durations

```
Fast     → 150ms   (input focus, small tweens)
Base     → 300ms   (standard transitions)
Slow     → 500ms   (scroll animations, results)
Slower   → 800ms   (page transitions, complex)
```

---

## 🎯 Common Patterns

### Calculator Page (Full Setup)
```tsx
import { PageTransition } from '@/components/ui/PageTransition';
import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { AnimatedResultCard } from '@/components/ui/AnimatedResultCard';
import { RippleButton } from '@/components/ui/RippleButton';

export default function CalculatorPage() {
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState(0);

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <AnimatedInput
          label="Amount"
          value={amount}
          onChange={setAmount}
        />

        <RippleButton onClick={calculate} className="mt-6">
          Calculate
        </RippleButton>

        {result > 0 && (
          <AnimatedResultCard
            label="Result"
            value={result}
            isPrimary={true}
            format="currency"
          />
        )}
      </div>
    </PageTransition>
  );
}
```

### Blog Article (Full Setup)
```tsx
import { ReadingProgressBar } from '@/components/ui/ReadingProgressBar';
import { ParallaxImage } from '@/components/ui/ParallaxImage';
import { ScrollAnimatedElement } from '@/components/ui/ScrollAnimatedElement';

export default function BlogPost() {
  return (
    <>
      <ReadingProgressBar color="emerald" />

      <article className="max-w-3xl mx-auto">
        <ParallaxImage
          src={post.image}
          alt={post.title}
          speed={0.3}
        />

        <ScrollAnimatedElement animation="slide-up">
          <section className="mt-8">
            {post.content}
          </section>
        </ScrollAnimatedElement>

        <ScrollAnimatedElement animation="fade" delay={200}>
          <RelatedPosts posts={related} />
        </ScrollAnimatedElement>
      </article>
    </>
  );
}
```

### Homepage Hero
```tsx
import { FloatingParticles } from '@/components/ui/FloatingParticles';
import { ScrollAnimatedList } from '@/components/ui/ScrollAnimatedElement';

export default function HomePage() {
  return (
    <>
      <section className="hero relative">
        <FloatingParticles />
        <div className="relative z-10">
          {/* Hero content */}
        </div>
      </section>

      <ScrollAnimatedList
        items={features.map(f => <FeatureCard key={f.id} {...f} />)}
        animation="slide-up"
        staggerDelay={100}
      />
    </>
  );
}
```

---

## 🔧 Hook Examples

### useScrollAnimation (Detect When Visible)
```tsx
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

function MyComponent() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref}>
      {isVisible && <p>Visible on screen!</p>}
    </div>
  );
}
```

### useParallax (Manual Parallax)
```tsx
import { useParallax } from '@/lib/hooks/useScrollAnimation';

function HeroImage() {
  const ref = useParallax(0.5);
  return <img ref={ref} src="hero.jpg" />;
}
```

### useAnimatedNumber (Number Counter)
```tsx
import { useAnimatedNumber } from '@/lib/hooks/useAnimatedNumber';

function ResultDisplay({ finalValue }) {
  const animated = useAnimatedNumber(finalValue, 600);
  return <div className="number-flip">{animated}</div>;
}
```

---

## 📱 Responsive Tips

```tsx
// Don't animate on mobile (if heavy)
<ScrollAnimatedElement 
  animation="slide-up" 
  className="hidden sm:block"
>
  <Component />
</ScrollAnimatedElement>

// Use faster durations on mobile
<PageTransition duration={300}>
  {/* Mobile-optimized */}
</PageTransition>

// Parallax speed varies
<ParallaxImage speed={window.innerWidth < 768 ? 0.2 : 0.5} />
```

---

## 🎬 Animation Variants

### Entrance Types
- **fade** — Smooth opacity transition (600ms)
- **slide-up** — Slide from bottom + fade (800ms)
- **scale-up** — Scale from 92% + fade (600ms)

### Duration Presets
- **150ms** — Quick micro-interactions
- **300ms** — Standard UI transitions
- **500ms** — Noticeable scroll effects
- **800ms** — Page transitions

### Easing Curves
- **ease-out** — Deceleration (default for entrances)
- **ease-in-out** — Smooth S-curve
- **ease-out-back** — Bouncy overshoot (0.34, 1.56, 0.64, 1)

---

## ✨ Polish Additions

### Toast Notifications
```tsx
import { showToast } from '@/components/ui/Toast';

showToast('Calculation complete!', 'success');
showToast('Invalid input', 'error');
showToast('Loading...', 'info');
```

### Skeleton Loaders
```tsx
import { SkeletonCard, SkeletonChart } from '@/components/ui/SkeletonLoader';

{loading ? <SkeletonCard /> : <ResultCard />}
```

### Copy to Clipboard
```tsx
import { CopyToClipboard } from '@/components/ui/CopyToClipboard';

<CopyToClipboard text={result} label="Copy Result" />
```

---

## 🚀 Performance Checklist

- ✅ Use `triggerOnce={true}` on scroll animations
- ✅ Lazy load parallax images with `loading="lazy"`
- ✅ Avoid animating on paint-heavy elements
- ✅ Use CSS animations over JavaScript where possible
- ✅ Test on mobile (Lighthouse Performance)
- ✅ Respect `prefers-reduced-motion` setting

---

## 🐛 Debugging

### Animation Not Running?
```tsx
// Check element is in viewport
const { ref, isVisible } = useScrollAnimation();
console.log('isVisible:', isVisible); // Should be true

// Check CSS imported
// In globals.css: @import url('../styles/animations.css');

// Check class applied
console.log(element.className); // Should include animation class
```

### Performance Issue?
```tsx
// Remove will-change when not needed
// Use triggerOnce to prevent re-animations
// Lazy load heavy components
// Use CSS animations instead of JS transitions
```

---

## 📖 Full Documentation

See [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md) for complete documentation including:
- Detailed API for each component
- Advanced customization options
- Browser compatibility matrix
- Troubleshooting guide
- Performance optimization
- Accessibility considerations

---

## 💡 Best Practices

1. **Use semantically** — `scroll-fade-in` for section visibility
2. **Keep timing consistent** — Use CSS variables for durations
3. **Test on mobile** — Some effects may need adjustment
4. **Respect preferences** — prefers-reduced-motion is automatic
5. **Layer animations** — Combine page + element transitions
6. **Measure impact** — Use Lighthouse to verify performance

---

**Pro Tip:** Copy-paste the pattern examples above into your pages for instant professional animations! 🎨
