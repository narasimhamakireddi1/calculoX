'use client';

import { useState } from 'react';
import { BlogHeroHeader } from '@/components/blog/BlogHeroHeader';
import BlogClient from './BlogClient';
import type { BlogPost } from '@/lib/blog/posts';

interface BlogPageClientProps {
  posts: BlogPost[];
}

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <>
      <BlogHeroHeader
        posts={posts}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <BlogClient posts={posts} initialCategory={activeCategory} />
      </div>
    </>
  );
}
