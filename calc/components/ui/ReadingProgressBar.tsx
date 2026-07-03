'use client';

import { useEffect, useState } from 'react';

interface ReadingProgressBarProps {
  className?: string;
  color?: 'blue' | 'emerald' | 'purple' | 'rose';
}

export function ReadingProgressBar({ className = '', color = 'blue' }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    purple: 'bg-gradient-to-r from-purple-500 to-pink-500',
    rose: 'bg-gradient-to-r from-rose-500 to-pink-500',
  };

  return (
    <div
      className={`fixed top-0 left-0 h-1 ${colorClasses[color]} z-50 transition-all duration-300 ease-out ${className}`}
      style={{
        width: `${progress}%`,
      }}
    />
  );
}
