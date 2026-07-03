import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts, getBlogPostBySlug, getRelatedPosts } from '@/lib/blog/posts';
import { generateArticleSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';
import { BlogStickyBar } from '@/components/ui/BlogStickyBar';
import { AdUnit, AD_SLOTS } from '@/components/ui/AdUnit';
import { Fragment, type ReactNode } from 'react';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { BlogTOC } from '@/components/blog/BlogTOC';
import { BlogHeroImage } from '@/components/blog/BlogHeroImage';

/**
 * Converts a plain-text content string into structured HTML.
 *
 * Detects three patterns that appear in posts.ts content strings:
 *   1. Embedded numbered lists  "1. item 2. item 3. item"  → <ol><li>
 *   2. Step sequences           "Step 1: text Step 2: text" → <ol><li>
 *   3. Long paragraphs (>400 chars) → split every ~3 sentences for readability
 */
function renderContent(text: string): ReactNode {
  const liClass = 'leading-relaxed';
  const pClass  = 'text-gray-700 dark:text-gray-300 leading-relaxed';
  const olClass = 'list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300';

  // 1. Embedded numbered list: "1. item 2. item 3. item"
  if (/\b1\.\s/.test(text) && /\b2\.\s/.test(text)) {
    const start  = text.search(/\b1\.\s/);
    const prefix = start > 0 ? text.slice(0, start).trim() : '';
    const items  = text
      .slice(start)
      .split(/(?=\b\d+\.\s)/)
      .map((s) => s.replace(/^\d+\.\s+/, '').trim())
      .filter(Boolean);

    return (
      <div className="space-y-3">
        {prefix && <p className={pClass}>{prefix}</p>}
        <ol className={olClass}>
          {items.map((item, i) => <li key={i} className={liClass}>{item}</li>)}
        </ol>
      </div>
    );
  }

  // 2. Step sequence: "Step 1: text Step 2: text"
  if (/Step\s+1[:.]\s/.test(text) && /Step\s+2[:.]\s/.test(text)) {
    const start  = text.search(/Step\s+1[:.]\s/);
    const prefix = start > 0 ? text.slice(0, start).trim() : '';
    const steps  = text
      .slice(start)
      .split(/(?=Step\s+\d+[:.]\s)/)
      .map((s) => s.replace(/^Step\s+\d+[:.]\s+/, '').trim())
      .filter(Boolean);

    return (
      <div className="space-y-3">
        {prefix && <p className={pClass}>{prefix}</p>}
        <ol className={olClass}>
          {steps.map((step, i) => <li key={i} className={liClass}>{step}</li>)}
        </ol>
      </div>
    );
  }

  // 3. Long plain text: split at ". " before capital letters and group into paragraphs
  if (text.length > 400) {
    // Split at sentence end (". ") only when followed by a capital letter.
    // This avoids splitting on "Rs 1.5L", "e.g.", decimals, etc.
    const chunks = text.split(/\. (?=[A-Z])/);
    // Re-attach the stripped period to every chunk except the last
    const sentences = chunks.map((c, i) => (i < chunks.length - 1 ? c + '.' : c));

    if (sentences.length >= 3) {
      const paras: string[] = [];
      for (let i = 0; i < sentences.length; i += 3) {
        paras.push(sentences.slice(i, i + 3).join(' '));
      }
      return (
        <div className="space-y-4">
          {paras.map((para, i) => <p key={i} className={pClass}>{para}</p>)}
        </div>
      );
    }
  }

  // Default: single paragraph
  return <p className={pClass}>{text}</p>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  const ogImage = post.image ? `${BASE_URL}${post.image}` : `${BASE_URL}/og-image.png`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

const categoryColors: Record<string, string> = {
  Finance:          'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200',
  Investment:       'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200',
  Investing:        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
  Tax:              'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200',
  Health:           'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200',
  Business:         'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200',
  Retirement:       'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
  Savings:          'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200',
  'Personal Finance': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200',
  'Wealth Building':  'bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200',
};

function toId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug, 3);

  const tocHeadings = [
    ...post.sections.map((s) => ({ id: toId(s.heading), text: s.heading })),
    { id: 'frequently-asked-questions', text: 'Frequently Asked Questions' },
  ];

  const articleSchema = generateArticleSchema({ title: post.title, description: post.description, slug: post.slug, date: post.date, author: post.author });
  const faqSchema = generateFAQSchema(post.faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: post.title, href: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ReadingProgress />

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white truncate">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] || ''}`}>
              {post.category}
            </span>
            <span className="text-sm text-gray-400">{post.readTime}</span>
            <span className="text-sm text-gray-400">
              {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            {post.lastUpdated && (
              <span className="text-sm text-gray-400">
                Updated: {new Date(post.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {post.description}
          </p>
        </header>

        {/* Author Byline */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-200 dark:ring-blue-800 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-tight">NM</span>
          </div>
          <div>
            <Link
              href="/author/narasimha-makireddi"
              className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {post.author}
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400">{post.authorCredentials}</p>
          </div>
        </div>

        {/* Hero Image with Parallax */}
        <BlogHeroImage
          src={post.image || null}
          title={post.title}
          category={post.category}
          categoryColor={categoryColors[post.category] || ''}
        />

        {/* Disclaimer */}
        <div className="mb-10 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
          <strong>Not financial advice:</strong> This article is for educational purposes only. calculox provides calculation tools, not personalised advice. For decisions specific to your situation, consult a SEBI-registered advisor or Chartered Accountant.
        </div>

        {/* Related Calculator CTA */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Try it yourself →</p>
            <p className="text-sm text-blue-600 dark:text-blue-300">Use our free {post.relatedCalculator.name} for instant results</p>
          </div>
          <Link
            href={post.relatedCalculator.href}
            className="shrink-0 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            {post.relatedCalculator.name} →
          </Link>
        </div>

        {/* Ad slot: after the intro hook, before article body */}
        <AdUnit slot={AD_SLOTS.blogFooter} className="mb-10" />

        {/* Quick Summary Box — Wikipedia-style lead paragraph */}
        {post.quickSummary && (
          <div className="mb-8 p-5 bg-gray-50 dark:bg-gray-800/60 border-l-4 border-blue-500 rounded-r-xl">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">Quick Answer</p>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{post.quickSummary}</p>
          </div>
        )}

        {/* Key Stats Cards — at-a-glance data visual */}
        {post.keyStats && post.keyStats.length > 0 && (
          <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {post.keyStats.map((stat, i) => (
              <div key={i} className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 flex flex-col gap-1">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium leading-snug">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                {stat.note && <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{stat.note}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Comparison Table — data-first layout for comparison posts */}
        {post.comparisonTable && (
          <div className="mb-10 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="px-4 pt-4 pb-2 text-sm font-medium text-gray-500 dark:text-gray-400 italic">{post.comparisonTable.caption}</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  {post.comparisonTable.headers.map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {post.comparisonTable.rows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/60'}>
                    {row.map((cell, ci) => (
                      <td key={ci} className={`px-4 py-3 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/50 ${ci === 0 ? 'font-medium' : ''}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table of Contents — mobile collapsible */}
        <BlogTOC headings={tocHeadings} variant="inline" />

        {/* Content Sections */}
        <div className="space-y-8 mb-12">
          {post.sections.map((section, i) => (
            <Fragment key={i}>
              <section>
                <h2 id={toId(section.heading)} className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{section.heading}</h2>
                {renderContent(section.content)}
              </section>
              {i === 2 && (
                <AdUnit slot={AD_SLOTS.blogInArticle} className="my-8" />
              )}
            </Fragment>
          ))}
        </div>

        {/* FAQ */}
        <section className="mb-12">
          <h2 id="frequently-asked-questions" className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {post.faqs.map((faq, i) => (
              <details key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 group">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                  {faq.question}
                  <span className="text-gray-400 group-open:rotate-90 transition-transform text-lg">▸</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Articles</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {relatedPosts.map((related) => {
                const categoryImageGradients: Record<string, string> = {
                  Finance: 'from-blue-600 to-blue-400',
                  Investment: 'from-green-600 to-green-400',
                  Investing: 'from-emerald-600 to-emerald-400',
                  Tax: 'from-orange-600 to-orange-400',
                  Health: 'from-rose-600 to-rose-400',
                  Business: 'from-purple-600 to-purple-400',
                  Retirement: 'from-amber-600 to-amber-400',
                  Savings: 'from-teal-600 to-teal-400',
                  'Personal Finance': 'from-indigo-600 to-indigo-400',
                  'Wealth Building': 'from-orange-700 to-orange-500',
                };
                const gradientClass = categoryImageGradients[related.category] || 'from-blue-600 to-blue-400';

                return (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image Header */}
                    <div className={`relative h-40 bg-gradient-to-br ${gradientClass} overflow-hidden`}>
                      {related.image ? (
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-30">
                          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className={`inline-flex text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm ${categoryColors[related.category] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                          {related.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-snug line-clamp-2 flex-1 mb-2">
                        {related.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{related.readTime}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Try Our Free {post.relatedCalculator.name}</h3>
          <p className="text-blue-100 mb-5">Get instant, accurate results without any registration required.</p>
          <Link
            href={post.relatedCalculator.href}
            className="inline-block px-8 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors"
          >
            Open {post.relatedCalculator.name} →
          </Link>
        </div>

        <AdUnit slot={AD_SLOTS.blogFooter} className="mt-10" />
      </article>

      <BlogTOC headings={tocHeadings} variant="sidebar" />

      <BlogStickyBar
        calculatorName={post.relatedCalculator.name}
        calculatorHref={post.relatedCalculator.href}
      />
    </>
  );
}
