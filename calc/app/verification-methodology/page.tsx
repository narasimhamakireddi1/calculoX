import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck, ExternalLink, Mail, RefreshCw, Microscope,
  Landmark, BookOpen, Receipt, TrendingUp, HeartPulse, AlertTriangle,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Verification Methodology — How calculox Formulas Are Validated',
  description:
    'How every calculox calculator is validated: formula sources (RBI, Income Tax Department, GST Council, SEBI, WHO), monthly accuracy audits, cross-checks against SBI and HDFC bank calculators, and our error-reporting process.',
  alternates: { canonical: `${BASE_URL}/verification-methodology` },
  openGraph: {
    title: 'Verification Methodology | calculox',
    description:
      'Every formula traced to an official source and re-verified monthly. See exactly how calculox calculators are validated against RBI, Finance Act, SEBI, GST Council, and WHO standards.',
    url: `${BASE_URL}/verification-methodology`,
    type: 'website',
  },
};

const LAST_VERIFIED = 'July 2026';

interface SourceEntry {
  Icon: typeof Landmark;
  calculators: string;
  sourceName: string;
  sourceUrl: string;
  reference: string;
  crossCheck?: string;
}

const sourceEntries: SourceEntry[] = [
  {
    Icon: Landmark,
    calculators: 'EMI, FD, RD & Simple Interest Calculators',
    sourceName: 'Reserve Bank of India — rbi.org.in',
    sourceUrl: 'https://www.rbi.org.in/',
    reference:
      'Reducing-balance EMI methodology used by all RBI-regulated lenders; quarterly compounding convention for bank deposits; RBI master directions on interest rates on deposits.',
    crossCheck:
      'Outputs cross-checked against the public EMI and deposit calculators of SBI (sbi.co.in) and HDFC Bank (hdfcbank.com).',
  },
  {
    Icon: BookOpen,
    calculators: 'Income Tax Calculator',
    sourceName: 'Income Tax Department — incometaxindia.gov.in',
    sourceUrl: 'https://incometaxindia.gov.in/',
    reference:
      'Finance Act 2025 — FY 2025-26 slab rates for both regimes, ₹75,000 standard deduction, Section 87A rebate, deduction sections 80C/80D/80CCD, HRA exemption rules, and the 4% health & education cess.',
    crossCheck:
      'Results compared against the official tax calculator on the e-filing portal (incometax.gov.in).',
  },
  {
    Icon: Receipt,
    calculators: 'GST Calculator',
    sourceName: 'GST Council — gstcouncil.gov.in',
    sourceUrl: 'https://gstcouncil.gov.in/',
    reference:
      'Current GST rate slabs (0%, 5%, 12%, 18%, 28%), CGST/SGST split for intra-state supply, and IGST for inter-state supply per GST Council rate notifications (also published at gst.gov.in).',
  },
  {
    Icon: TrendingUp,
    calculators: 'SIP, CAGR & Retirement Calculators',
    sourceName: 'SEBI — sebi.gov.in',
    sourceUrl: 'https://www.sebi.gov.in/',
    reference:
      'SEBI-mandated CAGR disclosure methodology for mutual fund returns; AMFI-standard SIP future-value (annuity-due) formula; NISM retirement planning framework for corpus estimation.',
  },
  {
    Icon: HeartPulse,
    calculators: 'BMI Calculator',
    sourceName: 'World Health Organization — who.int',
    sourceUrl: 'https://www.who.int/',
    reference:
      'WHO BMI classification (kg/m²) plus the lower Asian cutoffs recommended for Indian populations by ICMR — overweight at BMI 23 and obesity at 25 for South Asians.',
  },
];

export default function VerificationMethodologyPage() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Verification Methodology',
    url: `${BASE_URL}/verification-methodology`,
    description:
      'How calculox validates every calculator formula against official Indian government and regulatory sources.',
    isPartOf: { '@type': 'WebSite', name: 'calculox', url: BASE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">Verification Methodology</span>
        </nav>

        {/* Hero */}
        <div className="flex items-start gap-5 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-200 dark:ring-emerald-800 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verification Methodology</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              How every calculox formula is validated — and how you can check it yourself.
            </p>
          </div>
        </div>

        {/* How I validate */}
        <section className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How formulas are validated</h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
            Every calculator on calculox follows the same four-step process before and after it ships:
          </p>
          <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300 list-decimal pl-5">
            <li>
              <strong>Source first:</strong> the formula is taken from a primary official publication —
              an RBI direction, the Finance Act, a GST Council notification, SEBI/AMFI methodology, or WHO
              guidelines — never from another calculator website.
            </li>
            <li>
              <strong>Independent implementation:</strong> each engine is a standalone, typed module computed
              with 28-digit decimal precision, so rounding errors can&apos;t creep in through floating-point math.
            </li>
            <li>
              <strong>Cross-reference:</strong> outputs are compared against the official source&apos;s own
              examples and, where they exist, against public bank calculators (SBI, HDFC, ICICI) across a range
              of test inputs including edge cases like zero rates and leap-year day counts.
            </li>
            <li>
              <strong>Monthly audit:</strong> I re-run the comparison suite monthly, and immediately whenever a
              Union Budget, RBI circular, or GST Council meeting changes a rule that touches any calculator.
            </li>
          </ol>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
            Last full audit: {LAST_VERIFIED} — verified FY 2025-26 tax slabs, current GST rate structure, and
            bank calculator cross-checks after the July content update.
          </p>
        </section>

        {/* Sources per calculator */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Official sources, by calculator</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">
            Each entry links to the primary source. All links go to official government, regulatory, or
            international bodies and open in a new tab.
          </p>
          <div className="space-y-4">
            {sourceEntries.map(({ Icon, calculators, sourceName, sourceUrl, reference, crossCheck }) => (
              <div key={calculators} className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-100 dark:ring-emerald-900/60 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{calculators}</p>
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
                    >
                      {sourceName}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                    </a>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <strong className="text-gray-700 dark:text-gray-300">Reference:</strong> {reference}
                    </p>
                    {crossCheck && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5">
                        <strong className="text-gray-700 dark:text-gray-300">Cross-check:</strong> {crossCheck}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Last verified: {LAST_VERIFIED}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Accuracy commitment */}
        <section className="mb-10 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Microscope className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
            Accuracy commitment
          </h2>
          <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
            <li>
              • Results are verified against the official sources above and re-audited monthly. India-specific
              rules (RBI conventions, Finance Act slabs, GST rates, SEBI methodology) are applied as published
              by those bodies.
            </li>
            <li>
              • Calculations run in your browser with high-precision decimal arithmetic — the same inputs
              always produce the same outputs, and you can reproduce any result by hand from the formula shown
              on each page.
            </li>
            <li>
              • Small differences from a bank&apos;s final figures can still occur — lenders round EMIs, add
              processing fees, and post interest on their own schedules. That&apos;s a difference in fees and
              rounding, not in the formula.
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true" />
              <span>
                <strong>Spotted a discrepancy?</strong> Email{' '}
                <a href="mailto:supportcalculox@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  supportcalculox@gmail.com
                </a>{' '}
                with the calculator name and your inputs. Error reports are prioritised — I aim to investigate
                within 24 hours and publish a correction if one is needed.
              </span>
            </li>
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="mb-10 p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
              Verified formulas are still estimates, not advice. calculox results are for education and
              planning; they are <strong>not</strong> financial, tax, or medical advice. Consult a qualified
              CA, SEBI-registered advisor, or doctor before major decisions. See our{' '}
              <Link href="/terms-of-service" className="underline hover:text-amber-900 dark:hover:text-amber-200">Terms of Service</Link>.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center space-x-3">
          <Link
            href="/author/narasimha-makireddi"
            className="inline-block px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
          >
            Meet the developer
          </Link>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Explore the calculators →
          </Link>
        </div>
      </div>
    </>
  );
}
