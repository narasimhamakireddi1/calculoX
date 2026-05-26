import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'CalculoX - Premium Online Calculators',
  description: 'CalculoX: Premium online calculators for Indian users. SIP, EMI, BMI, Income Tax, and 14+ more calculators. Fast, accurate, and completely free.',
  keywords: ['calculator', 'SIP calculator', 'EMI calculator', 'BMI calculator', 'tax calculator', 'CalculoX'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://calculox.in',
    siteName: 'CalculoX',
    title: 'CalculoX - Premium Online Calculators',
    description: 'Premium online calculators for Indian users - SIP, EMI, BMI, Tax & more',
    images: [
      {
        url: 'https://calculox.in/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
