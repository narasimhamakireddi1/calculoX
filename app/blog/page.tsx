import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog/posts';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'Finance & Calculator Guides Blog',
  description: 'Free guides on EMI calculation, SIP returns, income tax comparison, BMI health tips & CAGR explained. Expert articles for Indian investors and taxpayers.',
  keywords: ['finance blog India', 'EMI guide', 'SIP guide', 'tax saving tips India', 'investment calculator guide', 'BMI health India'],
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: 'Finance & Calculator Guides Blog | calculox',
    description: 'Free expert guides on EMI, SIP, income tax, BMI & CAGR for Indian users.',
    url: `${BASE_URL}/blog`,
    type: 'website',
  },
};

const categoryColors: Record<string, string> = {
  Finance: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Investment: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Tax: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  Health: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
};

export default function BlogPage() {
  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'calculox Blog',
    url: `${BASE_URL}/blog`,
    description: 'Free guides on finance calculators, tax saving, investment strategies for Indian users',
    blogPost: blogPosts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${BASE_URL}/blog/${post.slug}`,
      datePublished: post.date,
      author: { '@type': 'Organization', name: post.author },
    })),
  };

  return (
    <>
      <Script id="schema-blog" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">Blog</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Finance & Calculator Guides
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Expert articles on EMI, SIP, income tax, BMI & more – written for Indian users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-800'}`}>
                    {post.category}
                  </span>
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
                    {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-sm text-blue-600 font-medium group-hover:underline">
                    Read More →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
