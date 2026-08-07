import type { Metadata } from 'next';

// Bare MCP Apps widget surface — no site chrome (see HideOnEmbed in app/layout.tsx),
// intentionally excluded from search (see the /embed/:path* X-Frame-Options carve-out
// and matching X-Robots-Tag header in next.config.js, plus the disallow in app/robots.ts).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return <div className="max-w-2xl mx-auto px-4 py-6">{children}</div>;
}
