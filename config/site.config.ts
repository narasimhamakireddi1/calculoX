/**
 * Site Configuration
 * Centralized configuration for the entire site
 */

export const siteConfig = {
  name: 'CalculoX',
  description: 'Premium online calculators for Indian users - SIP, EMI, BMI, Tax & 14+ more',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  author: 'CalculoX',
  email: 'supportcalculox@gmail.com',

  // SEO
  seo: {
    keywords: [
      'calculator',
      'SIP calculator',
      'EMI calculator',
      'BMI calculator',
      'tax calculator',
      'online calculator',
      'free calculator',
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
