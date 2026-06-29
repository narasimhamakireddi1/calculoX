'use client';
import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollY, innerHeight } = window;
      const total = document.documentElement.scrollHeight - innerHeight;
      setWidth(total > 0 ? Math.min((scrollY / total) * 100, 100) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[60] h-[3px] bg-blue-600 dark:bg-blue-400"
      style={{ width: `${width}%` }}
    />
  );
}
