'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  /** Stagger delay in ms, applied via transition-delay when revealing */
  delay?: number;
  className?: string;
}

/**
 * Fades + slides content in when it scrolls into view.
 * Content is visible by default (SEO/no-JS safe); the hidden state is only
 * applied after mount, and only for users without prefers-reduced-motion.
 * Animates opacity/transform only, so it can never cause layout shift.
 */
export function ScrollReveal({ children, delay = 0, className = '' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    // Already in (or above) the viewport on mount — don't hide above-the-fold content.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return;

    el.classList.add('sr-hidden');
    if (delay) el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.classList.add('sr-visible');
            el.classList.remove('sr-hidden');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
