/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
  },
  headers: async () => [
    {
      source: '/:path*',
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
      source: '/sitemap.xml',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' }],
    },
    {
      source: '/_next/static/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      source: '/robots.txt',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
    },
  ],
  redirects: async () => [
    { source: '/calculators', destination: '/', permanent: true },
    { source: '/privacy', destination: '/privacy-policy', permanent: true },
    { source: '/terms', destination: '/terms-of-service', permanent: true },
    { source: '/disclaimer', destination: '/terms-of-service', permanent: true },
  ],
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

module.exports = nextConfig;
