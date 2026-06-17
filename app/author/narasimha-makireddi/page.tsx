import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Code2, Mail, ExternalLink, CheckCircle2,
  BookOpen, AlertTriangle, Landmark, Shield, Lightbulb,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Narasimha Makireddi — Creator of calculox.in',
  description:
    'Narasimha Makireddi is the software developer who built calculox.in, a free financial calculator platform for India. All formulas are sourced from RBI, Income Tax Act, and SEBI guidelines.',
  alternates: { canonical: `${BASE_URL}/author/narasimha-makireddi` },
  openGraph: {
    title: 'Narasimha Makireddi — Creator of calculox.in',
    description:
      'Software developer who built 14 free financial calculators for India. Formulas sourced from RBI, Finance Act 2025-26, and SEBI norms.',
    url: `${BASE_URL}/author/narasimha-makireddi`,
    type: 'profile',
  },
};

const authorSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Narasimha Makireddi',
  url: `${BASE_URL}/author/narasimha-makireddi`,
  email: 'narasimha.makireddi1@gmail.com',
  sameAs: [
    'https://github.com/narasimhamakireddi1',
    'https://www.linkedin.com/in/narasimha-makireddi-4807b7223',
  ],
  jobTitle: 'Software Developer',
  description:
    'Software developer and creator of calculox.in — 14 free financial calculators for India. All formulas sourced from RBI, Finance Act 2025-26, and SEBI guidelines.',
  worksFor: {
    '@type': 'Organization',
    name: 'calculox',
    url: BASE_URL,
  },
  knowsAbout: [
    'Web Development',
    'Financial Calculators',
    'EMI Calculation',
    'SIP Returns',
    'Income Tax India',
    'GST Calculation',
    'React',
    'Next.js',
    'TypeScript',
  ],
};

const sources = [
  {
    Icon: Landmark,
    title: 'Reserve Bank of India (RBI)',
    desc: 'EMI formula, FD compounding methodology, RD calculations, and lending rate guidelines.',
  },
  {
    Icon: BookOpen,
    title: 'Finance Act 2025-26',
    desc: 'Income tax slabs, rebate under Section 87A, deductions (80C, 80D, 80CCD), and surcharge rates.',
  },
  {
    Icon: Shield,
    title: 'GST Council Notifications',
    desc: 'GST rates (0%, 5%, 12%, 18%, 28%), CGST/SGST/IGST split, and HSN-based rate categories.',
  },
  {
    Icon: CheckCircle2,
    title: 'SEBI Mutual Fund Regulations',
    desc: 'SIP and CAGR calculation methodology for mutual fund return projections.',
  },
  {
    Icon: Lightbulb,
    title: 'WHO BMI Classification',
    desc: 'Body Mass Index ranges and health categories per the World Health Organization guidelines (2000).',
  },
];

export default function AuthorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">Author</span>
        </nav>

        {/* Hero */}
        <div className="flex items-start gap-5 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-200 dark:ring-blue-800 flex items-center justify-center flex-shrink-0">
            <Code2 className="w-8 h-8 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Narasimha Makireddi</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Software Developer · Creator of calculox.in</p>
            <div className="flex items-center gap-4 mt-3">
              <a
                href="https://www.linkedin.com/in/narasimha-makireddi-4807b7223"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                LinkedIn
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://github.com/narasimhamakireddi1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Code2 className="w-4 h-4" />
                GitHub
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="mailto:narasimha.makireddi1@gmail.com"
                className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Bio */}
        <section className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            I&apos;m a software developer who built <strong>calculox.in</strong> to give every Indian free access
            to accurate financial calculation tools. I found that most online calculators either lacked Indian-specific
            tax rules, had poor mobile experience, or were buried under ads — so I built all 14 from scratch.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Every formula on this site is sourced directly from official government publications — the Finance Act,
            RBI circulars, and GST Council notifications. The code is open on{' '}
            <a
              href="https://github.com/narasimhamakireddi1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              GitHub
            </a>
            {' '}if you want to verify the implementation.
          </p>
        </section>

        {/* Important disclaimer */}
        <section className="mb-10 p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Tools, not financial advice</p>
              <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                I am not a Chartered Accountant, SEBI-registered Investment Advisor, or CFP. calculox provides
                calculation tools for educational and planning purposes only — not personalised financial advice.
                For decisions specific to your situation, please consult a qualified CA or SEBI-registered advisor.
              </p>
            </div>
          </div>
        </section>

        {/* Formula sources */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Formula Sources</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">
            Every calculator&apos;s formula is traced to a primary official source. This is what &quot;verified formulas&quot; means on this site:
          </p>
          <div className="space-y-3">
            {sources.map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-100 dark:ring-blue-900/60 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What was built */}
        <section className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What I built</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
            {[
              'EMI Calculator', 'SIP Calculator', 'FD Calculator',
              'RD Calculator', 'Income Tax Calculator', 'GST Calculator',
              'BMI Calculator', 'Percentage Calculator', 'CAGR Calculator',
              'Simple Interest Calculator', 'Retirement Calculator',
              'Home Loan vs Rent Calculator', 'Profit Margin Calculator',
              'Scientific Calculator',
            ].map((name) => (
              <li key={name} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" strokeWidth={2} />
                {name}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Explore all 14 calculators →
          </Link>
        </div>
      </div>
    </>
  );
}
