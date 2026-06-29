'use client';

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  const applyTheme = (selectedTheme: Theme) => {
    try {
      const htmlElement = document.documentElement;

      if (selectedTheme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          htmlElement.classList.add('dark');
        } else {
          htmlElement.classList.remove('dark');
        }
      } else if (selectedTheme === 'dark') {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  };

  useEffect(() => {
    try {
      const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
      applyTheme('system');
    }
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
    applyTheme(newTheme);
  };

  if (!mounted) return null;

  const buttonClass = (isActive: boolean) => `
    p-2.5 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5
    flex items-center justify-center w-10 h-10
    ${isActive
      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40'
      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
    }
  `;

  return (
    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1.5">
      <button
        onClick={() => handleThemeChange('light')}
        className={buttonClass(theme === 'light')}
        title="Light mode"
        aria-label="Light mode"
        aria-pressed={theme === 'light'}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v6m0 6v6M23 12h-6m-6 0H1M20.485 3.515l-4.243 4.243m-8.484 0l-4.243-4.243M20.485 20.485l-4.243-4.243m-8.484 0l-4.243 4.243"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </button>

      <button
        onClick={() => handleThemeChange('system')}
        className={buttonClass(theme === 'system')}
        title="System default"
        aria-label="System default theme"
        aria-pressed={theme === 'system'}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M6 17h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 20h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <button
        onClick={() => handleThemeChange('dark')}
        className={buttonClass(theme === 'dark')}
        title="Dark mode"
        aria-label="Dark mode"
        aria-pressed={theme === 'dark'}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </button>
    </div>
  );
}
