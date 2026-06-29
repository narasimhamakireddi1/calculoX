'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/lib/blog/posts';

const PINNED_SLUGS = [
  'how-to-calculate-emi',
  'how-to-calculate-income-tax-india',
  'sip-calculator-guide',
];

const categoryColors: Record<string, string> = {
  Finance: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Investment: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Investing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Tax: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  Health: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  Business: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  Retirement: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  Savings: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  'Personal Finance': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  'Wealth Building': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
};

const tabActiveColors: Record<string, string> = {
  All: 'bg-blue-600 text-white shadow-lg shadow-blue-600/25',
  Finance: 'bg-blue-600 text-white shadow-lg shadow-blue-600/25',
  Investment: 'bg-green-600 text-white shadow-lg shadow-green-600/25',
  Investing: 'bg-green-600 text-white shadow-lg shadow-green-600/25',
  Tax: 'bg-orange-500 text-white shadow-lg shadow-orange-500/25',
  Health: 'bg-rose-600 text-white shadow-lg shadow-rose-600/25',
  Business: 'bg-purple-600 text-white shadow-lg shadow-purple-600/25',
  Retirement: 'bg-amber-500 text-white shadow-lg shadow-amber-500/25',
  Savings: 'bg-teal-600 text-white shadow-lg shadow-teal-600/25',
  'Personal Finance': 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25',
  'Wealth Building': 'bg-rose-700 text-white shadow-lg shadow-rose-700/25',
};

interface BlogClientProps {
  posts: BlogPost[];
}

export default function BlogClient({ posts }: BlogClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

  const pinnedPosts = PINNED_SLUGS.map((slug) => posts.find((p) => p.slug === slug)).filter(Boolean) as BlogPost[];
  const filtered = activeCategory === 'All' ? posts : posts.filter((p) => p.category === activeCategory);
  const filteredWithoutPinned = activeCategory === 'All'
    ? posts.filter((p) => !PINNED_SLUGS.includes(p.slug))
    : filtered;

  const countFor = (cat: string) =>
    cat === 'All' ? posts.length : posts.filter((p) => p.category === cat).length;

  return (
    <>
      {/* Category filter tabs */}
      <div className="mb-6 overflow-x-auto pb-1 -mx-4 px-4">
        <div className="flex gap-2 min-w-max sm:flex-wrap sm:min-w-0">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? tabActiveColors[cat] ?? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {cat}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {countFor(cat)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Most Read pinned section — shown only on "All" tab */}
      {activeCategory === 'All' && pinnedPosts.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Most Read
            </span>
            <div className="flex-1 h-px bg-amber-200 dark:bg-amber-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pinnedPosts.map((post) => (
              <PostCard key={post.slug} post={post} pinned />
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Showing <span className="font-medium text-gray-700 dark:text-gray-300">{filtered.length}</span> article
        {filtered.length !== 1 ? 's' : ''}
        {activeCategory !== 'All' && (
          <> in <span className="font-medium text-gray-700 dark:text-gray-300">{activeCategory}</span></>
        )}
      </p>

      {/* Post grid */}
      <div key={activeCategory} className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
        {filteredWithoutPinned.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </>
  );
}

function PostCard({ post, pinned = false }: { post: BlogPost; pinned?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              categoryColors[post.category] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            {post.category}
          </span>
          {pinned && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 flex items-center gap-1">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Most Read
            </span>
          )}
          <span className="text-xs text-gray-400">{post.readTime}</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors leading-snug">
          {post.title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {new Date(post.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <span className="text-sm text-blue-600 font-medium group-hover:underline">Read More →</span>
        </div>
      </div>
    </Link>
  );
}
