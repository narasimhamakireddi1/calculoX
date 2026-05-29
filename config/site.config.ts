/**
 * Site Configuration
 * Centralized configuration for the entire site
 */

export const siteConfig = {
  name: 'calculox',
  description: 'Premium online calculators for Indian users - SIP, EMI, BMI, Tax & 14+ more',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  author: 'calculox',
  email: 'supportcalculox@gmail.com',

  // SEO - Comprehensive keyword strategy for all calculators
  seo: {
    keywords: [
      // Primary High-Volume Keywords (Monthly searches: 4,000+)
      'EMI calculator',
      'loan EMI calculator',
      'home loan EMI calculator',
      'car loan EMI calculator',
      'personal loan calculator',
      'SIP calculator',
      'income tax calculator',
      'GST calculator',
      'FD calculator',
      'RD calculator',
      'CAGR calculator',
      'BMI calculator',
      'percentage calculator',
      'simple interest calculator',
      'scientific calculator',

      // Secondary Long-Tail Keywords (Monthly searches: 1,000-3,999)
      'EMI calculator with amortization',
      'how to calculate EMI',
      'SIP calculator for Indian investors',
      'income tax calculator FY 2026',
      'GST calculator online',
      'loan comparison calculator',
      'best investment calculator',
      'tax saving investment calculator',
      'step-up SIP calculator',
      'property loan calculator',
      'fixed deposit calculator',
      'recurring deposit calculator',
      'personal loan EMI',
      'home loan calculator',
      'car loan EMI calculator',

      // Comparison & How-To Keywords
      'EMI vs personal loan',
      'SIP vs RD comparison',
      'FD vs simple interest',
      'SIP vs mutual funds',
      'home loan vs personal loan',
      'loan comparison India',
      'how to calculate percentage',
      'how to calculate tax',
      'investment calculator India',
      'retirement planning calculator',

      // Voice Search & Question-Based Keywords
      'how do I calculate EMI',
      'what is EMI calculator',
      'best loan calculator in India',
      'how to use SIP calculator',
      'which is best investment',
      'how much tax will I pay',
      'can I calculate GST online',
      'how to plan retirement',
      'which is better EMI or loan',

      // Brand & General Keywords
      'calculator',
      'online calculator',
      'free calculator',
      'financial calculator',
      'financial calculator India',
      'investment calculator India',
      'tax calculator India',
      'calculox',
    ],
    openGraph: {
      type: 'website',
      locale: 'en_IN',
    },
  },

  // Navigation
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/' },
  ],

  // Footer
  footer: {
    sections: [
      {
        title: 'About',
        links: [
          { label: 'About Us', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Disclaimer', href: '/disclaimer' },
        ],
      },
    ],
  },

  // Feature Flags
  features: {
    adsense: process.env.NEXT_PUBLIC_ENABLE_ADSENSE === 'true',
    analytics: true,
    darkMode: true,
  },

  // Ads Configuration
  ads: {
    clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
  },
};

