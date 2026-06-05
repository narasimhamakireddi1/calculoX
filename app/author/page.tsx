import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Narasimha Makireddi | Author & Fintech Expert',
  description: 'Meet Narasimha Makireddi - Fintech professional with 5+ years experience building trusted financial calculators for millions of Indians. Expert in investment planning, tax optimization, and banking solutions.',
  openGraph: {
    title: 'About Narasimha Makireddi | Financial Calculator Expert',
    description: 'Fintech innovator empowering Indians with accurate, transparent financial calculators and educational content.',
    type: 'website',
  },
};

export default function AuthorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0 border-4 border-white/30">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-6xl font-bold">
                NM
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Narasimha Makireddi</h1>
              <p className="text-xl text-blue-100 mb-4">Fintech Professional & Financial Calculator Expert</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur">Financial Tech</span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur">Investment Planning</span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur">Tax Optimization</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Bio Section */}
        <section className="mb-12 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Professional Biography</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              I am a fintech professional with over 5 years of experience building accurate, transparent financial calculators trusted by millions of Indians. My mission is simple but powerful: <strong>empower every Indian with free, reliable financial tools and education</strong> to make better money decisions.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Through years of working in financial technology, I've witnessed how complex financial decisions become when people lack access to transparent, easy-to-use tools. Most financial calculators online are either overly complicated, filled with advertising, or lack the accuracy needed for real Indian financial scenarios. This is why I built Calculox - a comprehensive suite of 14 financial calculators designed specifically for Indian needs.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Every calculator on this platform has been developed with meticulous attention to accuracy, compliance with RBI guidelines, GST regulations, Income Tax slabs (FY 2025-26), and SEBI investment standards. My work combines technical expertise with a deep understanding of Indian financial products, tax structures, and investment options.
            </p>
          </div>
        </section>

        {/* Expertise Areas */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Core Expertise Areas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Loan & EMI Calculations</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Expertise in home loan EMI, car loan calculations, personal loan analysis, and prepayment strategy optimization. RBI-compliant calculation methodologies.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Investment Planning</h3>
              <p className="text-gray-600 dark:text-gray-400">
                SIP calculations, mutual fund returns, CAGR analysis, retirement corpus planning, and wealth-building strategies. SEBI-compliant methodologies.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🏦</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Banking & Savings</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Fixed Deposits (FD), Recurring Deposits (RD), interest calculations, ladder strategies, and comparative banking analysis. RBI-verified rates.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Tax Optimization</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Income tax slabs (FY 2025-26), new vs old regime analysis, GST calculations, tax-saving strategies. Government compliance specialist.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🏥</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Health & Wellness</h3>
              <p className="text-gray-600 dark:text-gray-400">
                BMI calculator development, health metric analysis, ICMR guidelines implementation for Indian health standards.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-3">🔬</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Advanced Calculations</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Scientific calculations, profit margin analysis, percentage methods, compound interest, and complex financial formulas.
              </p>
            </div>
          </div>
        </section>

        {/* Compliance & Verification */}
        <section className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Professional Compliance & Verification</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">✅</div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">RBI-Verified Calculations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">All loan EMI, FD, and banking calculations follow Reserve Bank of India official guidelines and formulas.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-3xl">✅</div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">SEBI-Compliant Investment Tools</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">SIP, mutual fund, and investment calculators adhere to Securities and Exchange Board of India standards.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-3xl">✅</div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Government Tax Compliance</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tax calculator uses official FY 2025-26 slabs from Income Tax India and latest GST regulations.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-3xl">✅</div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">ICMR Health Standards</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">BMI calculator implements Indian Council of Medical Research guidelines for Indian health metrics.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-3xl">✅</div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Decimal.js Precision</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">All calculations use 28 decimal places precision to eliminate rounding errors common in financial math.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-3xl">✅</div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Regular Audits & Updates</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">All 14 calculators are updated quarterly with latest rates, regulations, and government announcements.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-12 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Mission & Vision</h2>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mission</h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              To empower every Indian with <strong>free, transparent, and accurate financial calculators</strong> that eliminate confusion, build financial confidence, and enable better money decisions for building long-term wealth and financial security.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Core Principles</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 text-xl">🎯</span>
                <span className="text-gray-700 dark:text-gray-300"><strong>Accuracy First:</strong> Every calculator is built with government-verified formulas and professional precision</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 text-xl">🔒</span>
                <span className="text-gray-700 dark:text-gray-300"><strong>Privacy Protected:</strong> Zero data collection - all calculations happen in your browser, your data stays yours</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 text-xl">💡</span>
                <span className="text-gray-700 dark:text-gray-300"><strong>Education Focused:</strong> Each calculator includes detailed explanations, real-world examples, and expert tips</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 text-xl">🆓</span>
                <span className="text-gray-700 dark:text-gray-300"><strong>Always Free:</strong> No paywalls, no registration, no hidden costs - financial tools should be accessible to all</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 text-xl">📱</span>
                <span className="text-gray-700 dark:text-gray-300"><strong>Mobile-First:</strong> Optimized for smartphones so you can calculate anywhere, anytime</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Explore All 14 Calculators</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover our complete suite of free financial calculators designed specifically for Indian financial planning, tax optimization, investment analysis, and personal wealth building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Explore All Calculators
            </Link>
            <Link
              href="/blog"
              className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-colors border-2 border-white"
            >
              Read Financial Articles
            </Link>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Have questions, feedback, or suggestions? I'd love to hear from you!
          </p>
          <a
            href="mailto:narasimha.makireddi1@gmail.com"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Me
          </a>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Email: narasimha.makireddi1@gmail.com
          </div>
        </section>
      </div>

      {/* Trust Badges */}
      <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 mb-6">TRUSTED BY MILLIONS OF INDIANS</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">50K+</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Users</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">14</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Free Calculators</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">25+</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Financial Articles</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">100%</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ad-Free & Free</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
