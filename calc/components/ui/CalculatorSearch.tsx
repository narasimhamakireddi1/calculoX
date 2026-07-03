'use client';

import { useEffect, useRef, useState } from 'react';
import { getActiveCalculators } from '@/config/calculators.config';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  title: string;
  description: string;
  href: string;
  icon: string;
  category: string;
  keywords?: string[];
}

export function CalculatorSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const allCalculators = getActiveCalculators().map((calc) => ({
    title: calc.title,
    description: calc.description,
    href: calc.href,
    icon: calc.icon,
    category: calc.category,
    keywords: calc.keywords,
  }));

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = allCalculators.filter((calc) => {
      const titleMatch = calc.title.toLowerCase().includes(searchQuery);
      const descMatch = calc.description.toLowerCase().includes(searchQuery);
      const categoryMatch = calc.category.toLowerCase().includes(searchQuery);
      const keywordMatch = calc.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(searchQuery)
      );

      return titleMatch || descMatch || categoryMatch || keywordMatch;
    });

    setResults(filtered);
    setIsOpen(filtered.length > 0);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="w-full max-w-2xl mx-auto relative mb-8">
      <div className="relative">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none"
          strokeWidth={2}
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
          placeholder="Search calculators... (e.g., EMI, Tax, Investment, Loan)"
          className="w-full !pl-14 !pr-12 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-300 text-lg shadow-md hover:shadow-lg"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 text-lg font-bold"
            aria-label="Clear search"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={result.href}
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  setIsOpen(false);
                }}
                className="cursor-pointer"
              >
                <Link
                  href={result.href}
                  className={`flex items-start gap-4 px-4 py-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 group ${
                    index !== results.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                  }`}
                >
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-100 dark:ring-blue-900/50 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <CalculatorIcon idOrHref={result.href} className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {result.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                      {result.description}
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-700/50">
                      {result.category}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {isOpen && results.length === 0 && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">No calculators found for "<span className="font-semibold text-gray-900 dark:text-white">{query}</span>"</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Try searching for "EMI", "Tax", "Investment", "Loan", etc.</p>
        </div>
      )}
    </div>
  );
}
