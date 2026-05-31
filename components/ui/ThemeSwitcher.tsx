'use client';

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  // Apply theme to HTML element
  const applyTheme = (selectedTheme: Theme) => {
    try {
      const htmlElement = document.documentElement;

      if (selectedTheme === 'system') {
        // Use system preference
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
    // Get saved theme from localStorage
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

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
      <button
        onClick={() => handleThemeChange('light')}
        className={`px-3 py-2 rounded-md transition-all duration-300 text-base font-medium transform hover:scale-110 ${
          theme === 'light'
            ? 'bg-white dark:bg-gray-600 text-yellow-500 shadow-md border border-yellow-200 dark:border-yellow-700/50'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        title="Light mode"
        aria-label="Light mode"
      >
        ☀️
      </button>
      <button
        onClick={() => handleThemeChange('system')}
        className={`px-3 py-2 rounded-md transition-all duration-300 text-base font-medium transform hover:scale-110 ${
          theme === 'system'
            ? 'bg-white dark:bg-gray-600 text-blue-500 shadow-md border border-blue-200 dark:border-blue-700/50'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        title="System default"
        aria-label="System default theme"
      >
        💻
      </button>
      <button
        onClick={() => handleThemeChange('dark')}
        className={`px-3 py-2 rounded-md transition-all duration-300 text-base font-medium transform hover:scale-110 ${
          theme === 'dark'
            ? 'bg-white dark:bg-gray-600 text-purple-500 shadow-md border border-purple-200 dark:border-purple-700/50'
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
