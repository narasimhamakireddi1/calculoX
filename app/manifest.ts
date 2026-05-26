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
