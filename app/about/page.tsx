import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  IndianRupee, Home, BarChart2, Heart, FlaskConical,
  Zap, Target, Smartphone, Gift, Globe, Moon,
} from 'lucide-react';
import { generateOrganizationSchema } from '@/lib/seo/schemas';
import { getActiveCalculators } from '@/config/calculators.config';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';

const categoryColors: Record<string, { iconBg: string; iconColor: string; hoverBorder: string; hoverText: string }> = {
  Finance:    { iconBg: 'bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-100 dark:ring-blue-900/60',   iconColor: 'text-blue-600 dark:text-blue-400',   hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-600/70',   hoverText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400' },
  Health:     { iconBg: 'bg-rose-50 dark:bg-rose-950/40 ring-1 ring-rose-100 dark:ring-rose-900/60',   iconColor: 'text-rose-600 dark:text-rose-400',   hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-600/70',   hoverText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400' },
  Utility:    { iconBg: 'bg-violet-50 dark:bg-violet-950/40 ring-1 ring-violet-100 dark:ring-violet-900/60', iconColor: 'text-violet-600 dark:text-violet-400', hoverBorder: 'hover:border-violet-300 dark:hover:border-violet-600/70', hoverText: 'group-hover:text-violet-600 dark:group-hover:text-violet-400' },
  Conversion: { iconBg: 'bg-teal-50 dark:bg-teal-950/40 ring-1 ring-teal-100 dark:ring-teal-900/60',   iconColor: 'text-teal-600 dark:text-teal-400',   hoverBorder: 'hover:border-teal-300 dark:hover:border-teal-600/70',   hoverText: 'group-hover:text-teal-600 dark:group-hover:text-teal-400' },
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

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

const missionSections: Array<{ Icon: LucideIcon; color: string; heading: string; body: string }> = [
  {
    Icon: IndianRupee,
    color: 'text-blue-600 dark:text-blue-400',
    heading: 'Investment & Wealth Planning',
    body: 'Plan your financial future with SIP Calculator (systematic investment returns), CAGR Calculator (growth rate analysis), FD Calculator (fixed deposit maturity), RD Calculator (recurring deposit tracking), and Simple Interest Calculator (loan & deposit interest).',
  },
  {
    Icon: Home,
    color: 'text-violet-600 dark:text-violet-400',
    heading: 'Loans & Real Estate Decisions',
    body: 'Make informed housing decisions with EMI Calculator (loan repayment schedules), Home Loan vs Rent Calculator (buy vs rent break-even analysis), and understand your monthly payment obligations with detailed amortization schedules.',
  },
  {
    Icon: BarChart2,
    color: 'text-teal-600 dark:text-teal-400',
    heading: 'Tax & Business Planning',
    body: 'Optimize your finances with Income Tax Calculator (FY 2024-25 slabs, new vs old regime, 9+ deductions), GST Calculator (add/remove tax at all rates), Profit Margin Calculator (cost-driven & price-driven pricing with GST impact), and Percentage Calculator (6 modes for business calculations).',
  },
  {
    Icon: Heart,
    color: 'text-rose-600 dark:text-rose-400',
    heading: 'Health & Wellness',
    body: 'Monitor your health with BMI Calculator (Body Mass Index with WHO health categories and personalized tips for your weight category).',
  },
  {
    Icon: FlaskConical,
    color: 'text-indigo-600 dark:text-indigo-400',
    heading: 'Advanced Tools',
    body: 'Scientific Calculator (Casio ClassWiz-style with 4 engines: Standard, Complex Numbers, Matrix Operations, and Statistical Analysis) for students, engineers, and professionals.',
  },
];

const whyChooseItems: Array<{ Icon: LucideIcon; title: string; desc: string }> = [
  { Icon: Zap,        title: 'Lightning Fast',    desc: 'Instant calculations with no delays or loading screens.' },
  { Icon: Target,     title: '100% Accurate',     desc: 'Verified formulas used by financial professionals.' },
  { Icon: Smartphone, title: 'Mobile Friendly',   desc: 'Works perfectly on all devices – phone, tablet, desktop.' },
  { Icon: Gift,       title: 'Completely Free',   desc: 'All calculators are free forever. No registration needed.' },
  { Icon: Globe,      title: 'Made for India',    desc: 'Tailored for Indian tax laws, RBI rates & financial norms.' },
  { Icon: Moon,       title: 'Dark Mode',         desc: 'Easy on the eyes with full dark mode support.' },
];

export default function AboutPage() {
  const orgSchema = generateOrganizationSchema();
  const calculators = getActiveCalculators().map((calc) => ({
    name: calc.title,
    href: calc.href,
    desc: calc.description,
    category: calc.category,
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About calculox</h1>
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
            {missionSections.map(({ Icon, color, heading, body }) => (
              <div key={heading}>
                <h3 className={`font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2 ${color}`}>
                  <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                  <span className="text-gray-900 dark:text-white">{heading}</span>
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What We Offer (14 Calculators)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculators.map((calc) => {
              const colors = categoryColors[calc.category] ?? categoryColors['Finance'];
              return (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className={`group flex items-start gap-3 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all ${colors.hoverBorder}`}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 ${colors.iconBg}`}>
                    <CalculatorIcon idOrHref={calc.href} className={`w-5 h-5 ${colors.iconColor}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-gray-900 dark:text-white mb-1 transition-colors ${colors.hoverText}`}>{calc.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{calc.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Why calculox */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Why Choose calculox?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyChooseItems.map(({ Icon, title, desc }) => (
              <div key={title} className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <Icon className="w-8 h-8 mb-3 text-blue-600 dark:text-blue-400" strokeWidth={1.75} aria-hidden="true" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Founder */}
        <section className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Built by a developer, for Indian users</h2>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-200 dark:ring-blue-800 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-lg tracking-tight">NM</span>
            </div>
            <div className="min-w-0">
              <Link
                href="/author/narasimha-makireddi"
                className="text-base font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Narasimha Makireddi
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Software Developer · Founder</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
                I built calculox.in after finding that most free calculators didn&apos;t handle India&apos;s tax rules,
                RBI guidelines, or SEBI norms correctly. All 14 calculators are built from scratch with formulas
                sourced from official government publications. I&apos;m not a CA or CFP — this is a technology
                platform providing tools, not financial advice.
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Link
                  href="/author/narasimha-makireddi"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Full bio & formula sources →
                </Link>
                <a
                  href="https://github.com/narasimhamakireddi1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  GitHub →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Have feedback, suggestions, or found a bug? I&apos;d love to hear from you.
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
