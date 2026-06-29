import { blogPosts, type BlogPost } from './posts';

export type BlogPostPreview = Pick<BlogPost, 'slug' | 'title' | 'description' | 'category' | 'readTime'>;

// Fallback blog categories to fill remaining slots when direct matches < limit.
// Order matters: first listed category is tried first.
const FALLBACK_CATEGORIES: Record<string, string[]> = {
  '/emi-calculator':              ['Finance', 'Savings', 'Investment'],
  '/sip-calculator':             ['Investment', 'Investing', 'Finance', 'Wealth Building'],
  '/tax-calculator':             ['Tax', 'Finance', 'Savings'],
  '/bmi-calculator':             ['Health', 'Personal Finance', 'Finance'],
  '/fd-calculator':              ['Finance', 'Savings', 'Investment'],
  '/rd-calculator':              ['Savings', 'Finance', 'Investment'],
  '/simple-interest-calculator': ['Finance', 'Savings'],
  '/gst-calculator':             ['Business', 'Finance', 'Tax'],
  '/percentage-calculator':      ['Finance', 'Personal Finance'],
  '/cagr-calculator':            ['Investment', 'Investing', 'Finance'],
  '/retirement-calculator':      ['Retirement', 'Investment', 'Finance'],
  '/home-loan-vs-rent':          ['Finance', 'Savings', 'Investment'],
  '/profit-margin-calculator':   ['Business', 'Finance', 'Tax'],
  '/scientific-calculator':      ['Finance', 'Personal Finance'],
};

function toPreview(p: BlogPost): BlogPostPreview {
  return { slug: p.slug, title: p.title, description: p.description, category: p.category, readTime: p.readTime };
}

export function getRelatedBlogPosts(calcHref: string, limit = 3): BlogPostPreview[] {
  // Phase 1: posts whose primary calculator is this one
  const direct = blogPosts.filter(p => p.relatedCalculator.href === calcHref);
  if (direct.length >= limit) return direct.slice(0, limit).map(toPreview);

  const result = direct.map(toPreview);
  const usedSlugs = new Set(direct.map(p => p.slug));
  const fallbackCats = FALLBACK_CATEGORIES[calcHref] ?? ['Finance', 'Investment'];

  // Phase 2: fill from fallback categories in priority order
  for (const cat of fallbackCats) {
    if (result.length >= limit) break;
    for (const p of blogPosts) {
      if (result.length >= limit) break;
      if (!usedSlugs.has(p.slug) && p.category === cat) {
        result.push(toPreview(p));
        usedSlugs.add(p.slug);
      }
    }
  }

  // Phase 3: any remaining posts if still short
  for (const p of blogPosts) {
    if (result.length >= limit) break;
    if (!usedSlugs.has(p.slug)) {
      result.push(toPreview(p));
    }
  }

  return result;
}
