import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Code2, Mail, ExternalLink, CheckCircle2,
  BookOpen, AlertTriangle, Landmark, Shield, Lightbulb,
  Microscope, Lock, GitBranch, Timer,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Narasimha Makireddi — Creator of calculox.in | Expertise & Methodology',
  description:
    'Meet Narasimha Makireddi, the technologist behind calculox.in. Insurance-domain fintech background, formula-first development process, and every calculator verified against RBI, Finance Act, SEBI, and GST Council sources.',
  alternates: { canonical: `${BASE_URL}/author/narasimha-makireddi` },
  openGraph: {
    title: 'Narasimha Makireddi — Creator of calculox.in',
    description:
      'Technologist building for India\'s financial needs. 14 free calculators, every formula verified against official RBI, Finance Act 2025-26, SEBI, and GST Council sources.',
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
    'Software developer and creator of calculox.in — 14 free financial calculators for India. Insurance-domain technology background. All formulas sourced from RBI, Finance Act 2025-26, and SEBI guidelines.',
  worksFor: {
    '@type': 'Organization',
    name: 'calculox',
    url: BASE_URL,
  },
  knowsAbout: [
    'Web Development',
    'Financial Calculators',
    'Insurance Technology',
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
    desc: 'EMI reducing-balance formula, FD quarterly compounding methodology, RD calculations, and lending rate guidelines.',
  },
  {
    Icon: BookOpen,
    title: 'Finance Act 2025-26',
    desc: 'Income tax slabs, rebate under Section 87A, deductions (80C, 80D, 80CCD), standard deduction, and cess rates.',
  },
  {
    Icon: Shield,
    title: 'GST Council Notifications',
    desc: 'GST rates (0%, 5%, 12%, 18%, 28%), CGST/SGST/IGST split, and HSN-based rate categories.',
  },
  {
    Icon: CheckCircle2,
    title: 'SEBI & AMFI Standards',
    desc: 'SIP future-value methodology, CAGR disclosure norms, and mutual fund return projection conventions.',
  },
  {
    Icon: Lightbulb,
    title: 'WHO & ICMR BMI Classification',
    desc: 'Body Mass Index ranges per WHO guidelines plus the stricter Asian cutoffs adopted by ICMR for Indian populations.',
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
            <p className="text-gray-500 dark:text-gray-400 mt-1">Technologist building for India&apos;s financial needs · Creator of calculox.in</p>
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Who I am and why I built this</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            I&apos;m a software developer with a background in financial services technology — primarily the
            insurance domain, the corner of fintech where a wrong number on a screen has real consequences
            for real families. Years of building and testing systems where premiums, sums assured, and payouts
            had to be correct to the rupee shaped how I approach every tool on this site: the formula comes
            first, the interface second.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            calculox exists because of a frustration most Indians will recognise. When I needed to check an
            EMI or compare tax regimes, every calculator I found either used outdated slabs, ignored
            Indian-specific rules like Section 87A or ICMR BMI cutoffs, broke on mobile, or buried the result
            under a wall of ads. So I built all 14 calculators from scratch — focused, mobile-first, and free.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            I built the platform in four months, and I&apos;d frame that timeline honestly: it was possible
            because I spent it obsessively on a narrow goal — validating every formula against official RBI,
            Finance Act, SEBI, and GST Council sources — rather than on features nobody needs. Roughly 90% of
            my time on this site goes into verifying accuracy and keeping rules current; 10% goes into writing.
            This is not a side project I poke at on weekends — it is my primary focus.
          </p>
        </section>

        {/* Important disclaimer */}
        <section className="mb-10 p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Tools, not financial advice</p>
              <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                I am a technologist, not a Chartered Accountant, SEBI-registered Investment Advisor, or CFP.
                I build tools, not financial advice. calculox provides calculation tools for educational and
                planning purposes only. For decisions specific to your situation, please consult a qualified
                CA or SEBI-registered advisor. Every calculator page carries this disclaimer, and our{' '}
                <Link href="/terms-of-service" className="underline hover:text-amber-900 dark:hover:text-amber-200">Terms of Service</Link>{' '}
                spell it out in full.
              </p>
            </div>
          </div>
        </section>

        {/* Technical credibility */}
        <section className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How the platform is built</h2>
          <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <GitBranch className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <span>
                <strong>Modern, typed stack:</strong> Next.js and React with TypeScript in strict mode. Financial
                math runs on Decimal.js with 28-digit precision — never floating-point shortcuts — and every
                input is validated with Zod schemas before it reaches a formula.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Microscope className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <span>
                <strong>Algorithm-by-algorithm validation:</strong> each of the 14 calculation engines is a
                separate, independently testable module, and each one&apos;s output is cross-checked against
                its official source and against bank calculators (SBI, HDFC, ICICI) before it ships.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <span>
                <strong>Privacy-first architecture:</strong> all calculations run entirely in your browser.
                Your salary, loan amount, or weight is never sent to a server, never stored, never logged.
                You can verify this yourself in your browser&apos;s network tab — no data leaves the page
                when you calculate.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <span>
                <strong>Open to scrutiny:</strong> my work is public on{' '}
                <a href="https://github.com/narasimhamakireddi1" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub</a>,
                and code review of any calculation engine is available on request — email me and I&apos;ll
                walk you through the implementation.
              </span>
            </li>
          </ul>
        </section>

        {/* Formula sources */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">How every formula is verified</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">
            Every calculator&apos;s formula is traced to a primary official source, and I re-test outputs
            against those sources monthly — plus immediately whenever a Budget, RBI circular, or GST Council
            meeting changes the rules. This is what &quot;verified formulas&quot; means on this site:
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
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-5">
            The full process — sources, links, and last-verified dates for each calculator — is documented on the{' '}
            <Link href="/verification-methodology" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Verification Methodology page
            </Link>
            .
          </p>
        </section>

        {/* Commitment to accuracy */}
        <section className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">My commitment to accuracy</h2>
          <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <Timer className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <span>
                <strong>Rules change, the site follows:</strong> when a Union Budget revises tax slabs or the
                GST Council moves a rate, updating the affected calculator is the first thing I do — the FY
                2025-26 slabs, ₹75,000 standard deduction, and Section 87A rebate on this site reflect the
                current Finance Act.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <span>
                <strong>Found an error?</strong> Email{' '}
                <a href="mailto:supportcalculox@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">supportcalculox@gmail.com</a>.
                Correction reports jump the queue — I aim to investigate within 24 hours, because a calculator
                that&apos;s wrong is worse than no calculator at all.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <span>
                <strong>Honest limits:</strong> results are estimates built on documented assumptions. Where a
                calculator has a known blind spot — market returns aren&apos;t guaranteed, banks round EMIs,
                BMI can&apos;t see muscle mass — the page says so plainly instead of hiding it.
              </span>
            </li>
          </ul>
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
        <div className="text-center space-x-3">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Explore all 14 calculators →
          </Link>
          <Link
            href="/verification-methodology"
            className="inline-block px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
          >
            Verification Methodology
          </Link>
        </div>
      </div>
    </>
  );
}
