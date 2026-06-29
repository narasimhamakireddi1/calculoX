import Script from 'next/script';
import Link from 'next/link';
import { generateArticleSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas';

const categoryColors: Record<string, string> = {
  'Finance': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Investment': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Tax': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'Health & Wellness': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  'Loan Calculations': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'GST': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'Investment Performance': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  'Utility Calculations': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  'Financial Planning': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  'Advanced Calculations': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200',
};

interface BlogPostLayoutProps {
  title: string;
  description: string;
  author: string;
  authorCredentials?: string;
  publishedDate: string;
  readTime: string;
  category: string;
  content: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function BlogPostLayout({
  title,
  description,
  author,
  authorCredentials,
  publishedDate,
  readTime,
  category,
  content,
  faqs,
}: BlogPostLayoutProps) {
  // Extract slug from title for breadcrumb/schema (simplified version)
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const articleSchema = generateArticleSchema({
    title,
    description,
    slug,
    date: publishedDate,
    author,
  });

  const faqSchema = generateFAQSchema(faqs);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: title, href: `/blog/${slug}` },
  ]);

  return (
    <>
      <Script id="schema-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="schema-post-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-post-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-blue-600">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white truncate">{title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
              {category}
            </span>
            <span className="text-sm text-gray-400">{readTime}</span>
            <span className="text-sm text-gray-400">
              {new Date(publishedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">{title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
        </header>

        {/* Author Byline */}
        {author && (
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {author.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{author}</p>
              {authorCredentials && <p className="text-xs text-gray-500 dark:text-gray-400">{authorCredentials}</p>}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mb-12" dangerouslySetInnerHTML={{ __html: formatContent(content) }} />

        {/* FAQ */}
        {faqs && faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
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
        )}
      </article>
    </>
  );
}

// Helper function to format markdown-like content to HTML
function formatContent(content: string): string {
  let html = content;

  // Headers
  html = html.replace(/^### (.*?)$/gm, '<h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">$1</h2>');

  // Code blocks
  html = html.replace(/```\n([\s\S]*?)\n```/g, '<pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code>$1</code></pre>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">$1</code>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" className="text-blue-600 dark:text-blue-400 hover:underline">$1</a>');

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p className="mb-4">');
  html = `<p className="mb-4">${html}</p>`;

  // Lists
  html = html.replace(/\n- (.*?)(?=\n|$)/g, '\n<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)/s, '<ul className="list-disc list-inside mb-4">$1</ul>');

  // Tables (simplified)
  html = html.replace(/\|\s*(.*?)\s*\|/g, '<td className="border border-gray-300 dark:border-gray-600 px-4 py-2">$1</td>');

  // Checkmarks and indicators
  html = html.replace(/✅/g, '✅');
  html = html.replace(/❌/g, '❌');
  html = html.replace(/⚠️/g, '⚠️');

  return html;
}
