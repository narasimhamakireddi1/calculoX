import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import type { BlogPostPreview } from '@/lib/blog/utils';

const CATEGORY_COLORS: Record<string, string> = {
  Finance: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Investment: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Investing: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Tax: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Health: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  Business: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Retirement: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Savings: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  'Personal Finance': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'Wealth Building': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
};

interface RelatedBlogPostsProps {
  posts: BlogPostPreview[];
}

export function RelatedBlogPosts({ posts }: RelatedBlogPostsProps) {
  if (posts.length === 0) return null;

  return (
    <nav aria-label="Related articles" className="card bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
      <div className="flex items-center gap-3 mb-8">
        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-100 dark:ring-emerald-900/50 flex-shrink-0">
          <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Related Articles</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">In-depth guides to help you go deeper on this topic</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:scale-105 transform flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                {post.category}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{post.readTime}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed line-clamp-2">
                {post.description}
              </p>
            </div>
            <span aria-hidden="true" className="text-sm font-medium text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all duration-300 group-hover:translate-x-1">
              Read article →
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
