'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getActiveCalculators } from '@/config/calculators.config';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

interface CalculatorBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalculatorBottomSheet({ isOpen, onClose }: CalculatorBottomSheetProps) {
  const router = useRouter();
  const activeCalculators = getActiveCalculators();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleNavigate = (href: string) => {
    onClose();
    setSearchQuery('');
    router.push(href);
  };

  const filteredCalculators = activeCalculators.filter((calc) =>
    calc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    calc.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div className="fixed top-0 right-0 h-screen z-50 w-full max-w-xs bg-white dark:bg-gray-900 shadow-2xl md:hidden flex flex-col overflow-hidden">
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-4 py-6">
          {/* Header Top - Logo + Close */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-6 h-6"
              >
                <defs>
                  <linearGradient id="gradMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#fff', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#dbeafe', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <rect width="32" height="32" rx="6" fill="url(#gradMobile)" />
                <text
                  x="16"
                  y="22"
                  fontFamily="Arial, sans-serif"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#2563eb"
                  textAnchor="middle"
                  letterSpacing="-0.5"
                >
                  CX
                </text>
              </svg>
              <span className="text-lg font-bold text-white">calculox</span>
            </div>
            <button
              onClick={onClose}
              className="text-2xl text-white/80 hover:text-white transition-colors p-1"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-sm"
            />
            <span className="absolute right-3 top-2.5 text-white/50">🔍</span>
          </div>

          {/* Theme Switcher in Header */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Theme</span>
            <div className="scale-75 origin-right">
              <ThemeSwitcher />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Primary Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            {/* Home */}
            <button
              onClick={() => handleNavigate('/')}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-800/50 transition-colors flex items-center gap-3 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🏠</span>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Home</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Back to main</div>
              </div>
            </button>
          </div>

          {/* Calculators Section */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>📊</span> All Calculators {filteredCalculators.length > 0 && `(${filteredCalculators.length})`}
              </div>

              {/* Calculators Grid */}
              <div className="grid grid-cols-3 gap-2">
                {filteredCalculators && filteredCalculators.length > 0 ? (
                  filteredCalculators.map((calc) => (
                    <button
                      key={calc.id}
                      onClick={() => handleNavigate(calc.href)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all transform hover:scale-105 group"
                      title={calc.title}
                    >
                      <span className="text-2xl group-hover:scale-125 transition-transform">{calc.icon}</span>
                      <span className="text-xs text-center text-gray-700 dark:text-gray-300 line-clamp-2 font-medium">
                        {calc.title.replace(' Calculator', '')}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                    No calculators found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resources Section */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>📚</span> Resources
              </div>

              {/* Blog */}
              <button
                onClick={() => handleNavigate('/blog')}
                className="w-full px-3 py-2.5 text-left hover:bg-blue-50 dark:hover:bg-gray-800/50 transition-colors rounded-lg flex items-center gap-3 group mb-2"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📖</span>
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">Blog</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Articles & guides</div>
                </div>
              </button>

              {/* About */}
              <button
                onClick={() => handleNavigate('/about')}
                className="w-full px-3 py-2.5 text-left hover:bg-blue-50 dark:hover:bg-gray-800/50 transition-colors rounded-lg flex items-center gap-3 group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">ℹ️</span>
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">About</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">About us</div>
                </div>
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="px-4 py-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              <span className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">14 Free Calculators</span>
              Financial, health & productivity tools designed for accuracy
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
