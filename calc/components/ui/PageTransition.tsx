'use client';

import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  type?: 'fade' | 'slide';
  duration?: number;
  className?: string;
}

export function PageTransition({
  children,
  type = 'fade',
  duration = 500,
  className = '',
}: PageTransitionProps) {
  const animationClass = type === 'fade' ? 'page-load-fade-in' : 'page-slide-in';

  return (
    <div
      className={`${animationClass} ${className}`}
      style={{
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}
