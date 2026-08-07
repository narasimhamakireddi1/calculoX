/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['recharts', 'react-hook-form', 'decimal.js'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.placeholder.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  headers: async () => [
    {
      // Excludes /embed/* (matched by its own block below) so those pages are not
      // blocked from third-party framing — they're the MCP Apps widget surface,
      // meant to be iframed from an AI host's origin. Everything else keeps the
      // normal SAMEORIGIN protection.
      source: '/((?!embed/).*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'X-Robots-Tag', value: 'index, follow' },
      ],
    },
    {
      // Bare MCP Apps widget pages: framable by any origin (no X-Frame-Options),
      // and kept out of search entirely (noindex here backs up the robots meta in
      // app/embed/layout.tsx — the header is the signal engines actually trust most).
      source: '/embed/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
      ],
    },
    {
      source: '/sitemap.xml',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' }],
    },
    {
      source: '/_next/static/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      source: '/_next/data/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' }],
    },
    {
      source: '/robots.txt',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
    },
  ],
  rewrites: async () => [
    // Serve the dynamically generated OG image at the static path all layouts reference
    { source: '/og-image.png', destination: '/api/og' },
  ],
  redirects: async () => [
    { source: '/calculators', destination: '/', permanent: true },
    { source: '/privacy', destination: '/privacy-policy', permanent: true },
    { source: '/terms', destination: '/terms-of-service', permanent: true },
    { source: '/disclaimer', destination: '/terms-of-service', permanent: true },
    // Merged duplicate blog post (2026-08-07) — same topic/keywords as new-vs-old-tax-regime,
    // was splitting ranking signal between two near-identical pages.
    { source: '/blog/new-vs-old-tax-regime-comparison', destination: '/blog/new-vs-old-tax-regime', permanent: true },
  ],
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

module.exports = nextConfig;
