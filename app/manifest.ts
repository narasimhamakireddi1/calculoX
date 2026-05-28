import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'calculox - Premium Online Calculators',
    short_name: 'calculox',
    description: 'Free online calculators for Indian users - SIP, EMI, BMI, Tax & more',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait',
    categories: ['finance', 'utilities', 'productivity'],
    lang: 'en-IN',
    icons: [
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/apple-icon.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    shortcuts: [
      { name: 'SIP Calculator', url: '/sip-calculator', description: 'Calculate SIP returns' },
      { name: 'EMI Calculator', url: '/emi-calculator', description: 'Calculate loan EMI' },
      { name: 'BMI Calculator', url: '/bmi-calculator', description: 'Check Body Mass Index' },
      { name: 'Tax Calculator', url: '/tax-calculator', description: 'Calculate income tax' },
    ],
  };
}

