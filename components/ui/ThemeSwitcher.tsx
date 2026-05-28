'use client';

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get saved theme from localStorage
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (selectedTheme: Theme) => {
    const htmlElement = document.documentElement;

    if (selectedTheme === 'system') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      htmlElement.classList.toggle('dark', prefersDark);
    } else if (selectedTheme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => handleThemeChange('light')}
        className={`px-3 py-1.5 rounded transition-all duration-200 text-sm font-medium ${
          theme === 'light'
            ? 'bg-white dark:bg-gray-700 text-yellow-500 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        title="Light mode"
        aria-label="Light mode"
      >
        ☀️
      </button>
      <button
        onClick={() => handleThemeChange('system')}
        className={`px-3 py-1.5 rounded transition-all duration-200 text-sm font-medium ${
          theme === 'system'
            ? 'bg-white dark:bg-gray-700 text-blue-500 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        title="System default"
        aria-label="System default theme"
      >
        💻
      </button>
      <button
        onClick={() => handleThemeChange('dark')}
        className={`px-3 py-1.5 rounded transition-all duration-200 text-sm font-medium ${
          theme === 'dark'
            ? 'bg-white dark:bg-gray-700 text-purple-500 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        title="Dark mode"
        aria-label="Dark mode"
      >
        🌙
      </button>
    </div>
  );
}
