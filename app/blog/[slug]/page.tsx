import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts, getBlogPostBySlug } from '@/lib/blog/posts';
import { generateArticleSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

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
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ['/og-image.png'],
    },
  };
}

const categoryColors: Record<string, string> = {
  Finance: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Investment: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Tax: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  Health: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = generateArticleSchema({ title: post.title, description: post.description, slug: post.slug, date: post.date, author: post.author });
  const faqSchema = generateFAQSchema(post.faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: post.title, href: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <Script id="schema-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="schema-post-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-post-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {post.description}
          </p>
        </header>

        {/* Author Byline */}
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-200 dark:ring-blue-800 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-tight">CX</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{post.author}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Free financial calculator tools for Indian users · calculox.in</p>
          </div>
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

        {/* Content Sections */}
        <div className="space-y-8 mb-12">
          {post.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{section.heading}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {post.faqs.map((faq, i) => (
              <details key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 group">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                  {faq.question}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg">▾</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

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
      </article>
    </>
  );
}
