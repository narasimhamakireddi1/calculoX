'use client';

import { ReactNode } from 'react';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

interface ScrollAnimatedElementProps {
  children: ReactNode;
  animation?: 'fade' | 'slide-up' | 'scale-up';
  delay?: number;
  className?: string;
}

export function ScrollAnimatedElement({
  children,
  animation = 'slide-up',
  delay = 0,
  className = '',
}: ScrollAnimatedElementProps) {
  const { ref, isVisible } = useScrollAnimation();

  const animationClass = {
    fade: 'scroll-fade-in',
    'slide-up': 'scroll-slide-up',
    'scale-up': 'scroll-scale-up',
  }[animation];

  return (
    <div
      ref={ref}
      className={`
        ${isVisible ? animationClass : ''}
        ${className}
      `}
      style={{
        animationDelay: isVisible ? `${delay}ms` : 'unset',
      }}
    >
      {children}
    </div>
  );
}

interface ScrollAnimatedListProps {
  items: ReactNode[];
  animation?: 'fade' | 'slide-up' | 'scale-up';
  staggerDelay?: number;
  className?: string;
}

export function ScrollAnimatedList({
  items,
  animation = 'slide-up',
  staggerDelay = 100,
  className = '',
}: ScrollAnimatedListProps) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <ScrollAnimatedElement
          key={index}
          animation={animation}
          delay={index * staggerDelay}
        >
          {item}
        </ScrollAnimatedElement>
      ))}
    </div>
  );
}
