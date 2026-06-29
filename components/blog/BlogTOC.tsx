'use client';
import { useEffect, useState } from 'react';

export interface TOCHeading {
  id: string;
  text: string;
}

interface Props {
  headings: TOCHeading[];
  variant: 'inline' | 'sidebar';
}

export function BlogTOC({ headings, variant }: Props) {
  const [activeId, setActiveId] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-10% 0px -75% 0px', threshold: 0 },
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (variant === 'inline') {
    return (
      <div className="lg:hidden mb-8 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800/60">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors"
          aria-expanded={open}
        >
          <span>Table of Contents</span>
          <span className={`text-gray-400 text-xs transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
        </button>
        {open && (
          <nav aria-label="Article sections" className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <ol className="space-y-2">
              {headings.map(({ id, text }, i) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    className={`flex gap-2 text-sm leading-snug transition-colors ${
                      activeId === id
                        ? 'text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    <span className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 tabular-nums flex-shrink-0">
                      {i + 1}.
                    </span>
                    {text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    );
  }

  // sidebar variant — rendered outside the article as a fixed panel on xl+ screens
  return (
    <div className="hidden xl:block fixed right-4 top-24 w-52 z-10 max-h-[calc(100vh-7rem)] overflow-y-auto">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-1">
        On this page
      </p>
      <nav aria-label="Article sections">
        <ol className="space-y-0.5">
          {headings.map(({ id, text }, i) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`flex gap-2.5 text-sm leading-snug py-1.5 px-2 rounded-lg transition-colors ${
                  activeId === id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                }`}
              >
                <span
                  className={`text-xs mt-0.5 tabular-nums flex-shrink-0 ${
                    activeId === id ? 'text-blue-400 dark:text-blue-500' : 'text-gray-300 dark:text-gray-600'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="line-clamp-2">{text}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
