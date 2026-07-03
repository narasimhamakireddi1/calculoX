import type { Metadata } from "next";

import Link from "next/link";
import { blogPosts } from "@/lib/blog/posts";
import { BlogPageClient } from "./BlogPageClient";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.calculox.in";

export const metadata: Metadata = {
  title: "Finance & Calculator Guides Blog",
  description:
    "Free guides on EMI calculation, SIP returns, income tax comparison, BMI health tips & CAGR explained. Expert articles for Indian investors and taxpayers.",
  keywords: [
    "finance blog India",
    "EMI guide",
    "SIP guide",
    "tax saving tips India",
    "investment calculator guide",
    "BMI health India",
  ],
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: "Finance & Calculator Guides Blog | calculox",
    description:
      "Free expert guides on EMI, SIP, income tax, BMI & CAGR for Indian users.",
    url: `${BASE_URL}/blog`,
    type: "website",
  },
};

export default function BlogPage() {
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "calculox Blog",
    url: `${BASE_URL}/blog`,
    description:
      "Free guides on finance calculators, tax saving, investment strategies for Indian users",
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${BASE_URL}/blog/${post.slug}`,
      datePublished: post.date,
      author: { "@type": "Person", name: post.author },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">Blog</span>
        </nav>
      </div>

      <BlogPageClient posts={blogPosts} />
    </>
  );
}
