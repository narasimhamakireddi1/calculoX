import Link from 'next/link';
import {
  Landmark, ReceiptText, Target, AlertTriangle, BadgeCheck, Scale,
  Zap, ShieldCheck, Smartphone, Lock, Mail, BookOpen,
} from 'lucide-react';
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CalculatorSearch } from "@/components/ui/CalculatorSearch";
import { QuickCalculatorWidget } from "@/components/home/QuickCalculatorWidget";
import { CalculatorGrid } from "@/components/home/CalculatorGrid";
import { getActiveCalculators } from "@/config/calculators.config";
import { blogPosts } from "@/lib/blog/posts";
import type { CSSProperties } from 'react';

// ── Floating motifs ───────────────────────────────────────────────────────────
const MOTIFS: Array<{ text: string; style: CSSProperties }> = [
  { text: 'EMI = P×r×(1+r)ⁿ',  style: { top: '7%',    left: '2%',   transform: 'rotate(-8deg)' } },
  { text: '₹20,00,000',          style: { top: '13%',   right: '3%',  transform: 'rotate(6deg)'  } },
  { text: '8.5% p.a.',           style: { top: '60%',   left: '1%',   transform: 'rotate(-4deg)' } },
  { text: '÷ [(1+r)ⁿ−1]',       style: { bottom: '24%',right: '2%',  transform: 'rotate(10deg)' } },
  { text: '= ₹17,356/mo',        style: { top: '42%',   left: '0.5%', transform: 'rotate(-6deg)' } },
  { text: '20 Years',            style: { bottom: '9%', left: '7%',   transform: 'rotate(4deg)'  } },
];

// ── Sample results for calculator cards ───────────────────────────────────────
const SAMPLE_RESULTS: Record<string, string> = {
  '/emi-calculator':          '₹20L · 8.5% · 20Y → ₹17,356/mo',
  '/sip-calculator':          '₹10K/mo · 12% · 15Y → ₹50.4L corpus',
  '/fd-calculator':           '₹5L · 7% · 3Y → ₹6.2L maturity',
  '/bmi-calculator':          '70 kg · 170 cm → BMI 24.2 (Normal)',
  '/rd-calculator':           '₹5K/mo · 7% · 3Y → ₹2.0L maturity',
  '/tax-calculator':          '₹16L income · New Regime → ₹1.13L tax',
  '/gst-calculator':          '₹10,000 + 18% GST → ₹11,800 total',
  '/percentage-calculator':   '₹800 → ₹1,000 → 25% increase',
  '/cagr-calculator':         '₹1L → ₹2.5L · 5Y → 20.1% CAGR',
  '/simple-interest-calculator': '₹1L · 8% · 3Y → ₹24,000 interest',
  '/retirement-calculator':   '₹30K/mo · 25Y · 10% → ₹3.96Cr corpus',
  '/home-loan-vs-rent':       '₹80L · 9% · 25Y — break-even: Yr 9',
  '/profit-margin-calculator':'Cost ₹800 · MRP ₹1,200 → 33.3% margin',
  '/scientific-calculator':   '√144 = 12 · log₁₀(1000) = 3',
};

// ── Real Scenarios ────────────────────────────────────────────────────────────
const REAL_SCENARIOS = [
  {
    Icon: Landmark,
    tag: 'Home Loan · Mumbai',
    inputs: 'Loan ₹60L · 8.75% p.a. · 20 Years',
    result: '₹53,000', sub: 'Total Interest paid: ₹67.2L',
    cta: 'Run Your Numbers', href: '/emi-calculator',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-100 dark:border-blue-800/50',
    accent: 'from-blue-500 to-blue-600',
  },
  {
    Icon: ReceiptText,
    tag: 'Home Loan · Bengaluru',
    inputs: 'Loan ₹80L · 9.0% p.a. · 25 Years',
    result: '₹67,120', sub: 'vs renting ₹35K/mo — break-even: Yr 9',
    cta: 'Compare EMI vs Rent', href: '/home-loan-vs-rent',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'border-violet-100 dark:border-violet-800/50',
    accent: 'from-violet-500 to-violet-600',
  },
  {
    Icon: Target,
    tag: 'Car Loan · Delhi',
    inputs: 'Loan ₹8L · 10.5% p.a. · 5 Years',
    result: '₹17,200', sub: 'Total Interest: ₹2.3L over 60 months',
    cta: 'Calculate Car EMI', href: '/emi-calculator',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-100 dark:border-emerald-800/50',
    accent: 'from-emerald-500 to-emerald-600',
  },
] as const;

const SORTED_POSTS = [...blogPosts]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
const LATEST_POSTS = SORTED_POSTS.slice(0, 4);
// Additional guides surfaced as text links so the full blog depth is reachable
// (and crawlable) directly from the homepage — helps discovery/indexing.
const MORE_POSTS = SORTED_POSTS.slice(4, 16);

export default function Home() {
  const allCalculators = getActiveCalculators().map(calc => ({
    title: calc.title,
    description: calc.description,
    href: calc.href,
    category: calc.category,
    sampleResult: SAMPLE_RESULTS[calc.href],
  }));

  return (
    <div className="space-y-10">

      {/* ══════════════════════════════════════════
          SITE-WIDE DISCLAIMER STRIP
      ══════════════════════════════════════════ */}
      <div role="note" aria-label="Disclaimer" className="flex items-start sm:items-center justify-center gap-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-300 -mb-4">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0 text-amber-600 dark:text-amber-400" strokeWidth={2} aria-hidden="true" />
        <p>
          <strong>All results are estimates — not financial advice.</strong> Consult a qualified CA/CFP before major decisions.{' '}
          <Link href="/verification-methodology" className="font-medium underline underline-offset-2 hover:text-amber-950 dark:hover:text-amber-100">How we verify results</Link>
          {' · '}
          <Link href="/terms-of-service" className="font-medium underline underline-offset-2 hover:text-amber-950 dark:hover:text-amber-100">Terms</Link>
        </p>
      </div>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="text-center py-8 md:py-12 space-y-8 relative">

        {/* Floating formula motifs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          {MOTIFS.map((m, i) => (
            <span key={i} className="absolute font-mono text-blue-900/[0.06] dark:text-blue-200/[0.07] text-sm md:text-base font-bold" style={m.style}>
              {m.text}
            </span>
          ))}
        </div>

        {/* Search */}
        <div className="mb-8 relative z-20">
          <CalculatorSearch />
        </div>

        {/* Brand + value proposition */}
        <div className="space-y-5 relative z-0">
          <p className="text-2xl md:text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#0e2a47] to-emerald-600 dark:from-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">calculox</span>
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Free, accurate calculators for{' '}
            <span className="bg-gradient-to-r from-[#0e2a47] via-[#0d4a44] to-emerald-600 dark:from-sky-200 dark:via-emerald-200 dark:to-emerald-400 bg-clip-text text-transparent">
              every financial decision
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            EMI, SIP, income tax, FD and 10 more — instant answers with formulas you can verify.{' '}
            <span className="font-semibold text-gray-900 dark:text-white">No sign-up. Nothing stored.</span>
          </p>
          <p className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/60 text-[13px] font-medium text-emerald-700 dark:text-emerald-400">
            <BadgeCheck className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
            Verified against SBI, HDFC &amp; ICICI official calculators
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 pt-4 relative z-10">
          {['100% Free', 'No Registration', '14 Calculators'].map(label => (
            <div key={label} className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 text-sm font-semibold border border-gray-200 dark:border-gray-700">
              {label}
            </div>
          ))}
          <Link href="/compare" className="px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-sm font-semibold border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
            Compare Calculators
          </Link>
        </div>

        <QuickCalculatorWidget />
      </section>

      {/* ══════════════════════════════════════════
          CALCULATOR GRID
      ══════════════════════════════════════════ */}
      <CalculatorGrid calculators={allCalculators} />

      {/* ══════════════════════════════════════════
          REAL SCENARIOS
      ══════════════════════════════════════════ */}
      <ScrollReveal>
      <section className="space-y-8">
        <div className="space-y-2 mb-8">
          <p className="section-eyebrow">Real Numbers</p>
          <h2 className="text-4xl font-bold">Real Indian Scenarios</h2>
          <p className="text-gray-600 dark:text-gray-400">Actual numbers — try the calculator and see for yourself</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REAL_SCENARIOS.map(sc => (
            <div key={sc.tag} className={`relative overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl border ${sc.border} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6`}>
              <span className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${sc.accent} rounded-l-2xl`} />
              <div className={`inline-flex p-2.5 rounded-xl mb-3 ${sc.bg}`}>
                <sc.Icon className={`w-5 h-5 ${sc.color}`} strokeWidth={2} aria-hidden="true" />
              </div>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">{sc.tag}</p>
              <div className={`${sc.bg} rounded-xl p-4 mb-4 font-mono`}>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{sc.inputs}</p>
                <p className={`text-2xl font-extrabold tabular-nums ${sc.color}`}>
                  {sc.result}<span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">/mo</span>
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{sc.sub}</p>
              </div>
              <Link href={sc.href} className={`text-sm font-semibold ${sc.color} hover:underline`}>{sc.cta} →</Link>
            </div>
          ))}
        </div>
      </section>
      </ScrollReveal>

      {/* ══════════════════════════════════════════
          LATEST FROM THE BLOG
      ══════════════════════════════════════════ */}
      <ScrollReveal>
      <section className="space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <p className="section-eyebrow">Learn</p>
            <h2 className="text-4xl font-bold flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" strokeWidth={2} aria-hidden="true" />
              Latest from the Blog
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{blogPosts.length} in-depth guides on EMI, SIP, tax, and more — beyond the calculators</p>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap">
            View all {blogPosts.length} articles →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LATEST_POSTS.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">{post.category}</span>
              <h3 className="mt-2 text-base font-bold text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{post.description}</p>
              <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400">{post.readTime}</p>
            </Link>
          ))}
        </div>

        {/* More guides — text links keep the full blog depth reachable from the homepage */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 backdrop-blur-md p-6">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">More financial guides</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
            {MORE_POSTS.map(post => (
              <li key={post.slug} className="flex">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug"
                >
                  <span className="text-gray-500 dark:text-gray-500 group-hover:text-blue-500 mr-1.5" aria-hidden="true">→</span>
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/blog" className="inline-block mt-5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Browse all {blogPosts.length} guides →
          </Link>
        </div>
      </section>
      </ScrollReveal>

      {/* Features */}
      {/* ══════════════════════════════════════════
          WHY TRUST CALCULOX
      ══════════════════════════════════════════ */}
      <ScrollReveal>
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-[#0b1a2c] dark:to-[#0d2136] rounded-2xl p-8 md:p-12 border border-emerald-100 dark:border-[#1e3650]">
        <p className="section-eyebrow justify-center w-full mb-3">Trust &amp; Transparency</p>
        <h2 className="text-4xl font-bold mb-4 text-center">Why Trust calculox?</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Trust in a calculator comes down to three things: where the formulas come from, what happens to
          your data, and who answers when something looks wrong. Here is our answer to all three.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Verified sources */}
          <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/60 backdrop-blur-md shadow-sm border border-gray-100 dark:border-gray-700">
            <BadgeCheck className="w-10 h-10 mb-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} aria-hidden="true" />
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Verified Against Official Sources</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 leading-relaxed">
              <li>• RBI lending guidelines — EMI, FD &amp; RD calculators</li>
              <li>• Finance Act 2025-26 rates — Income Tax calculator</li>
              <li>• SEBI &amp; AMFI norms — SIP, CAGR &amp; retirement</li>
              <li>• GST Council rates — GST calculator</li>
              <li>• WHO &amp; ICMR standards — BMI calculator</li>
              <li>• Monthly accuracy audits against these sources, cross-checked with SBI &amp; HDFC bank calculators</li>
            </ul>
            <Link href="/verification-methodology" className="inline-block mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
              See our Verification Methodology →
            </Link>
          </div>

          {/* Privacy */}
          <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/60 backdrop-blur-md shadow-sm border border-gray-100 dark:border-gray-700">
            <Lock className="w-10 h-10 mb-4 text-blue-600 dark:text-blue-400" strokeWidth={1.75} aria-hidden="true" />
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Privacy &amp; Security</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 leading-relaxed">
              <li>• Zero data storage — every calculation happens in your browser</li>
              <li>• Your salary, loan, and health inputs are never sent to a server, tracked, or stored</li>
              <li>• HTTPS encryption on every page</li>
              <li>• Verifiable: open your browser&apos;s network tab — no data leaves the page when you calculate</li>
            </ul>
            <Link href="/privacy-policy" className="inline-block mt-4 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline">
              Read the full Privacy Policy →
            </Link>
          </div>

          {/* Transparency */}
          <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/60 backdrop-blur-md shadow-sm border border-gray-100 dark:border-gray-700">
            <Mail className="w-10 h-10 mb-4 text-violet-600 dark:text-violet-400" strokeWidth={1.75} aria-hidden="true" />
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Transparency</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 leading-relaxed">
              <li>• Built by Narasimha Makireddi — technology background with insurance-domain fintech experience</li>
              <li>• Every formula is published on its calculator page so you can verify results by hand</li>
              <li>• Found an error? Email <a href="mailto:supportcalculox@gmail.com" className="text-violet-700 dark:text-violet-400 hover:underline break-all">supportcalculox@gmail.com</a> — correction reports are prioritised</li>
            </ul>
            <Link href="/author/narasimha-makireddi" className="inline-block mt-4 text-sm font-semibold text-violet-700 dark:text-violet-400 hover:underline">
              Meet the Developer →
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="bg-gradient-to-br from-slate-50 to-emerald-50/50 dark:from-[#0b1a2c] dark:to-[#0d2136] rounded-2xl p-8 md:p-12 border border-emerald-100/80 dark:border-[#1e3650]">
        <p className="section-eyebrow justify-center w-full mb-3">Built for You</p>
        <h2 className="text-4xl font-bold mb-12 text-center">Why Choose Our Calculators?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { Icon: Zap,         label: 'Fast & Accurate',  desc: 'Instant results with high-precision calculations powered by advanced algorithms', color: 'text-amber-500'  },
            { Icon: ShieldCheck, label: 'Secure & Private', desc: 'Your data is never stored or shared. All calculations happen securely in your browser', color: 'text-blue-600'  },
            { Icon: Smartphone,  label: 'Mobile Friendly',  desc: 'Works perfectly on any device — desktop, tablet, or phone with optimised responsive design', color: 'text-violet-600' },
          ].map(({ Icon, label, desc, color }) => (
            <div key={label} className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/60 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <Icon className={`w-12 h-12 mx-auto mb-4 ${color}`} strokeWidth={1.75} aria-hidden="true" />
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{label}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      </ScrollReveal>

      {/* FAQ */}
      <ScrollReveal>
      <section className="space-y-8 pt-4">
        <div className="space-y-2">
          <p className="section-eyebrow">Support</p>
          <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400">Find answers to common questions about our calculators</p>
        </div>
        <div className="space-y-4">
          {[
            { q: 'Are these calculators free to use?', a: "Yes! All calculators on calculox are completely free — no registration, no subscription, no hidden charges. We believe financial literacy tools should be universally accessible. The site is supported by non-intrusive Google AdSense ads, which is how we keep everything free." },
            { q: 'How accurate are the results?', a: "Very accurate. All formulas are sourced from official publications: the EMI formula matches RBI guidelines, income tax slabs follow the Finance Act 2025-26, SIP returns use the AMFI-standard future value formula, and BMI uses WHO classification criteria. Results are verified against SBI, HDFC, and ICICI bank calculators. Note: all results are estimates — real-world figures may vary due to bank-specific processing fees, variable interest rate changes, and individual circumstances." },
            { q: 'Is my data safe and private?', a: "Yes. Every calculation runs entirely inside your browser using JavaScript — no input data is ever sent to our servers. We do not store, log, or share your financial figures. The only data collected is anonymous usage analytics via Google Analytics (page views, not calculation inputs). You can verify this by checking your browser network tab: no POST requests are made when you calculate." },
            { q: 'Which EMI calculator formula does calculox use?', a: "We use the standard reducing-balance EMI formula: EMI = [P × R × (1+R)^N] / [(1+R)^N − 1], where P = principal, R = monthly interest rate (annual rate ÷ 1200), N = loan tenure in months. This is the same formula used by all RBI-regulated banks in India for personal loans, home loans, and car loans. For edge cases like zero interest rate, we fall back to simple principal division." },
            { q: 'What is the difference between SIP and lump-sum investment?', a: "SIP (Systematic Investment Plan) spreads your investment over time with fixed monthly contributions, giving you rupee-cost averaging — you automatically buy more mutual fund units when prices are lower. Lump sum means investing the entire amount at once, which is optimal only if you can time the market perfectly. For most Indian investors, SIP over 10+ years consistently outperforms lump sum because it removes the need for market timing and enforces financial discipline. Use our SIP Calculator to compare both scenarios." },
            { q: 'How is income tax calculated under the New Regime for FY 2025-26?', a: "Under the New Regime for FY 2025-26 (Finance Act 2025): Income up to ₹4L = 0%, ₹4–8L = 5%, ₹8–12L = 10%, ₹12–16L = 15%, ₹16–20L = 20%, ₹20–24L = 25%, above ₹24L = 30%. A ₹75,000 standard deduction applies automatically for salaried taxpayers. The Section 87A rebate eliminates tax entirely if net taxable income is ≤ ₹12L — making salary effectively tax-free up to ₹12.75L. Add 4% health & education cess on the computed tax. Our Tax Calculator handles all this automatically, including surcharge for incomes above ₹50L." },
            { q: 'Will you add more calculators?', a: "Yes! We actively expand the toolkit based on user requests. Planned additions include: PPF Calculator, NPS Calculator, Sukanya Samriddhi Calculator, Currency Converter, Compound Interest Calculator, and a Loan Comparison tool. Contact us at supportcalculox@gmail.com to request a specific calculator." },
          ].map(({ q, a }) => (
            <details key={q} className="group bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-white flex items-center justify-between group-open:text-blue-600 dark:group-open:text-blue-400 transition-colors">
                <span>{q}</span>
                <span className="transform group-open:rotate-90 transition-transform duration-300 text-xl">▸</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>
      </ScrollReveal>
    </div>
  );
}
