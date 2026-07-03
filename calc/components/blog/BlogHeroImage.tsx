'use client';

import { useEffect, useState } from 'react';

interface BlogHeroImageProps {
  src: string | null;
  title: string;
  category: string;
  categoryColor: string;
}

export function BlogHeroImage({
  src,
  title,
  category,
  categoryColor,
}: BlogHeroImageProps) {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categoryImageGradients: Record<string, string> = {
    Finance: 'from-blue-600 to-blue-400',
    Investment: 'from-green-600 to-green-400',
    Investing: 'from-emerald-600 to-emerald-400',
    Tax: 'from-orange-600 to-orange-400',
    Health: 'from-rose-600 to-rose-400',
    Business: 'from-purple-600 to-purple-400',
    Retirement: 'from-amber-600 to-amber-400',
    Savings: 'from-teal-600 to-teal-400',
    'Personal Finance': 'from-indigo-600 to-indigo-400',
    'Wealth Building': 'from-orange-700 to-orange-500',
  };

  const gradientClass = categoryImageGradients[category] || 'from-blue-600 to-blue-400';

  return (
    <div className="mb-8 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
      <div className="relative h-96 overflow-hidden bg-gradient-to-br ${gradientClass}">
        {src ? (
          <>
            <img
              src={src}
              alt={`${title} — featured image`}
              className="w-full h-full object-cover"
              loading="eager"
              style={{
                transform: `translateY(${offsetY}px)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <div className="text-center">
              <div className="text-6xl mb-3 opacity-40">📊</div>
              <p className="text-white/50 text-sm font-medium">{category}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
