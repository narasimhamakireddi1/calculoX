'use client';

import { useState, useEffect } from 'react';
import BlogClient from './BlogClient';
import type { BlogPost } from '@/lib/blog/posts';

const categoryColors: Record<string, string> = {
  Finance: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
  Investment: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
  Investing: 'from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800',
  Tax: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
  Health: 'from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800',
  Business: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
  Retirement: 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
  Savings: 'from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800',
  'Personal Finance': 'from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800',
  'Wealth Building': 'from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800',
};

interface BlogPageClientProps {
  posts: BlogPost[];
}

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [displayedPostCount, setDisplayedPostCount] = useState(0);
  const [displayedReaderCount, setDisplayedReaderCount] = useState(0);
  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

  // Animated counters
  useEffect(() => {
    const totalPosts = posts.length;
    const interval = setInterval(() => {
      setDisplayedPostCount((prev) => {
        if (prev < totalPosts) return prev + 1;
        return totalPosts;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [posts.length]);

  useEffect(() => {
    const targetReaders = 250000;
    const interval = setInterval(() => {
      setDisplayedReaderCount((prev) => {
        const increment = Math.ceil((targetReaders - prev) / 20);
        if (prev + increment < targetReaders) return prev + increment;
        return targetReaders;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12 mb-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-200 dark:bg-green-900/20 rounded-full blur-3xl opacity-30 -z-10" />

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Finance & Calculator <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Guides</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Expert-written articles on EMI, SIP, tax planning, investments, and wealth building — trusted by Indian investors
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center backdrop-blur-sm">
              <p className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {displayedPostCount}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Published Articles</p>
            </div>

            <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center backdrop-blur-sm">
              <p className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                {displayedReaderCount.toLocaleString('en-IN')}
                <span className="text-lg">+</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Monthly Readers</p>
            </div>

            <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center backdrop-blur-sm md:col-span-1 col-span-2">
              <p className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {categories.length - 1}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Categories</p>
            </div>
          </div>

          {/* Category Filters */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 px-1">
              Filter by category
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                const postCount = category === 'All' ? posts.length : posts.filter((p) => p.category === category).length;

                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${categoryColors[category] || 'from-blue-600 to-blue-700'} text-white shadow-lg`
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    aria-pressed={isActive}
                  >
                    {category}
                    <span className={`ml-2 text-xs font-bold ${isActive ? 'bg-white/25' : 'bg-gray-100 dark:bg-gray-700'} px-2 py-0.5 rounded-full`}>
                      {postCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Listing */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <BlogClient posts={posts} initialCategory={activeCategory} />
      </div>
    </>
  );
}
