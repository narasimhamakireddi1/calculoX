import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { generateOrganizationSchema } from '@/lib/seo/schemas';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'About calculox - Free Online Calculators for India',
  description: 'calculox is India\'s premium free calculator platform. We provide accurate, fast, and mobile-friendly calculators for finance, health & utility. Learn our mission and values.',
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    title: 'About calculox - Free Online Calculators for India',
    description: 'Learn about calculox - India\'s premium free calculator platform for finance, health & utility calculations.',
    url: `${BASE_URL}/about`,
    type: 'website',
  },
};

const calculators = [
  { name: 'SIP Calculator', href: '/sip-calculator', desc: 'Systematic Investment Plan returns' },
  { name: 'EMI Calculator', href: '/emi-calculator', desc: 'Loan EMI & amortization schedule' },
  { name: 'BMI Calculator', href: '/bmi-calculator', desc: 'Body Mass Index & health tips' },
  { name: 'Tax Calculator', href: '/tax-calculator', desc: 'Income Tax FY 2024-25 New vs Old regime' },
];

export default function AboutPage() {
  const orgSchema = generateOrganizationSchema();

  return (
    <>
      <Script id="schema-about-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">About</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About calculox
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            India&apos;s premium free calculator platform â€” built for accuracy, speed & simplicity.
          </p>
        </div>

        {/* Mission */}
        <section className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            At calculox, our mission is to make financial and health calculations accessible to every Indian.
            We believe that accurate financial tools should be free, fast, and easy to use â€” whether you&apos;re
            planning your first SIP investment, calculating a home loan EMI, or checking your BMI.
          </p>
        </section>

        {/* What We Offer */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calculators.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{calc.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{calc.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Why calculox */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Why Choose calculox?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'âš¡', title: 'Lightning Fast', desc: 'Instant calculations with no delays or loading screens.' },
              { icon: 'ðŸŽ¯', title: '100% Accurate', desc: 'Verified formulas used by financial professionals.' },
              { icon: 'ðŸ“±', title: 'Mobile Friendly', desc: 'Works perfectly on all devices â€” phone, tablet, desktop.' },
              { icon: 'ðŸ†“', title: 'Completely Free', desc: 'All calculators are free forever. No registration needed.' },
              { icon: 'ðŸ‡®ðŸ‡³', title: 'Made for India', desc: 'Tailored for Indian tax laws, RBI rates & financial norms.' },
              { icon: 'ðŸŒ™', title: 'Dark Mode', desc: 'Easy on the eyes with full dark mode support.' },
            ].map((item) => (
              <div key={item.title} className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Have feedback, suggestions, or found a bug? We&apos;d love to hear from you.
          </p>
          <a
            href="mailto:supportcalculox@gmail.com"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            supportcalculox@gmail.com
          </a>
        </section>
      </div>
    </>
  );
}

