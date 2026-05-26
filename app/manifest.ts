import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CalculoX - Premium Online Calculators',
    short_name: 'CalculoX',
    description: 'Free online calculators for Indian users - SIP, EMI, BMI, Tax & more',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait',
    categories: ['finance', 'utilities', 'productivity'],
    lang: 'en-IN',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'SIP Calculator', url: '/sip-calculator', description: 'Calculate SIP returns' },
      { name: 'EMI Calculator', url: '/emi-calculator', description: 'Calculate loan EMI' },
      { name: 'BMI Calculator', url: '/bmi-calculator', description: 'Check Body Mass Index' },
      { name: 'Tax Calculator', url: '/tax-calculator', description: 'Calculate income tax' },
    ],
  };
}
