import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { generateOrganizationSchema } from '@/lib/seo/schemas';
import { getActiveCalculators } from '@/config/calculators.config';

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

export default function AboutPage() {
  const orgSchema = generateOrganizationSchema();
  const calculators = getActiveCalculators().map((calc) => ({
    name: calc.title,
    href: calc.href,
    desc: calc.description,
    icon: calc.icon,
  }));

  return (
    <>
      <Script id="schema-about-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

      <div className="max-w-6xl mx-auto px-4 py-12">
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
            India's premium free calculator platform – built for accuracy, speed & simplicity.
          </p>
        </div>

        {/* Mission */}
        <section className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            At calculox, our mission is to empower every Indian with access to accurate, free, and easy-to-use financial, health, and utility calculators. We believe financial literacy and smart decision-making should not be restricted by expensive tools or complex processes.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">💰 Investment & Wealth Planning</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Plan your financial future with SIP Calculator (systematic investment returns), CAGR Calculator (growth rate analysis), FD Calculator (fixed deposit maturity), RD Calculator (recurring deposit tracking), and Simple Interest Calculator (loan & deposit interest).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🏠 Loans & Real Estate Decisions</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Make informed housing decisions with EMI Calculator (loan repayment schedules), Home Loan vs Rent Calculator (buy vs rent break-even analysis), and understand your monthly payment obligations with detailed amortization schedules.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📊 Tax & Business Planning</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Optimize your finances with Income Tax Calculator (FY 2024-25 slabs, new vs old regime, 9+ deductions), GST Calculator (add/remove tax at all rates), Profit Margin Calculator (cost-driven & price-driven pricing with GST impact), and Percentage Calculator (6 modes for business calculations).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">❤️ Health & Wellness</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Monitor your health with BMI Calculator (Body Mass Index with WHO health categories and personalized tips for your weight category).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔬 Advanced Tools</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Scientific Calculator (Casio ClassWiz-style with 4 engines: Standard, Complex Numbers, Matrix Operations, and Statistical Analysis) for students, engineers, and professionals.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What We Offer (14 Calculators)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculators.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="flex items-start gap-3 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <span className="text-2xl flex-shrink-0">{calc.icon}</span>
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
              { icon: '⚡', title: 'Lightning Fast', desc: 'Instant calculations with no delays or loading screens.' },
              { icon: '🎯', title: '100% Accurate', desc: 'Verified formulas used by financial professionals.' },
              { icon: '📱', title: 'Mobile Friendly', desc: 'Works perfectly on all devices – phone, tablet, desktop.' },
              { icon: '🆓', title: 'Completely Free', desc: 'All calculators are free forever. No registration needed.' },
              { icon: '🇮🇳', title: 'Made for India', desc: 'Tailored for Indian tax laws, RBI rates & financial norms.' },
              { icon: '🌙', title: 'Dark Mode', desc: 'Easy on the eyes with full dark mode support.' },
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
            Have feedback, suggestions, or found a bug? We'd love to hear from you.
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
