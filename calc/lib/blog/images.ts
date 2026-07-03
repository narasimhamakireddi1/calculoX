// Category color schemes for featured images
export const categoryImageColors: Record<string, { bg: string; accent: string; icon: string }> = {
  Finance: {
    bg: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    accent: '#60a5fa',
    icon: '💰',
  },
  Investment: {
    bg: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
    accent: '#34d399',
    icon: '📈',
  },
  Investing: {
    bg: 'linear-gradient(135deg, #047857 0%, #14b8a6 100%)',
    accent: '#2dd4bf',
    icon: '🎯',
  },
  Tax: {
    bg: 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)',
    accent: '#fbbf24',
    icon: '📋',
  },
  Health: {
    bg: 'linear-gradient(135deg, #831843 0%, #ec4899 100%)',
    accent: '#f472b6',
    icon: '❤️',
  },
  Business: {
    bg: 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)',
    accent: '#c084fc',
    icon: '💼',
  },
  Retirement: {
    bg: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
    accent: '#fbbf24',
    icon: '🏖️',
  },
  Savings: {
    bg: 'linear-gradient(135deg, #134e4a 0%, #14b8a6 100%)',
    accent: '#2dd4bf',
    icon: '🏦',
  },
  'Personal Finance': {
    bg: 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)',
    accent: '#a5b4fc',
    icon: '💎',
  },
  'Wealth Building': {
    bg: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
    accent: '#fb923c',
    icon: '🚀',
  },
};

export function generateFeaturedImageSvg(
  slug: string,
  title: string,
  category: string,
): string {
  const colors = categoryImageColors[category] || categoryImageColors.Finance;
  const icon = colors.icon;

  return `
    <svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-grad-${slug}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.bg.split(',')[0].replace('linear-gradient(135deg, ', '')};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.bg.split(',')[1].replace(')', '').trim()};stop-opacity:1" />
        </linearGradient>
        <filter id="blur-${slug}">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>

      <!-- Background with gradient -->
      <rect width="1200" height="675" fill="url(#bg-grad-${slug})"/>

      <!-- Decorative shapes -->
      <circle cx="1100" cy="50" r="150" fill="${colors.accent}" opacity="0.1"/>
      <circle cx="100" cy="600" r="120" fill="${colors.accent}" opacity="0.1"/>
      <rect x="50" y="100" width="200" height="200" fill="${colors.accent}" opacity="0.05" rx="20" transform="rotate(-20 150 200)"/>

      <!-- Icon -->
      <text x="600" y="320" font-size="120" text-anchor="middle" dominant-baseline="central" opacity="0.3">
        ${icon}
      </text>

      <!-- Title text (optional, can be overlaid with CSS) -->
      <rect x="0" y="500" width="1200" height="175" fill="rgba(0,0,0,0.4)"/>
      <text x="60" y="590" font-size="48" font-weight="bold" fill="white" font-family="system-ui, -apple-system, sans-serif" text-length="1080">
        ${title.substring(0, 60)}
      </text>
    </svg>
  `;
}

export function getFeaturedImageUrl(slug: string, title: string, category: string): string {
  // For now, return a data URL with the SVG
  // In production, you could serve these from /public/blog/images/ as pre-generated files
  const svg = generateFeaturedImageSvg(slug, title, category);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
