'use client';

import { useState, useMemo, useRef, useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  IndianRupee, Heart, Wrench, ArrowLeftRight,
  Zap, ShieldCheck, Smartphone, Lock, Scale,
  Landmark, ReceiptText, Target,
} from 'lucide-react';
import { CalculatorCard } from "@/components/ui/CalculatorCard";
import { CalculatorSearch } from "@/components/ui/CalculatorSearch";
import { CategoryTabs, type CalculatorCategory } from "@/components/ui/CategoryTabs";
import { getActiveCalculators } from "@/config/calculators.config";

// ── helpers ───────────────────────────────────────────────────────────────────
function formatINR(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)}L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

function calcEMI(principal: number, annualRate: number, years: number) {
  const n = years * 12;
  const r = annualRate / 12 / 100;
  if (r === 0) return { emi: principal / n, totalInterest: 0, totalAmount: principal };
  const pow = Math.pow(1 + r, n);
  const emi = (principal * r * pow) / (pow - 1);
  const totalAmount = emi * n;
  return { emi, totalInterest: totalAmount - principal, totalAmount };
}

// ── Item 3: CountUp component (triggers on scroll into view) ──────────────────
function CountUp({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const dur = 1500;
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setCount(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [to]);

  return <div ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</div>;
}

// ── Item 6: Floating formula motifs (EMI-themed) ──────────────────────────────
const MOTIFS: Array<{ text: string; style: CSSProperties }> = [
  { text: 'EMI = P×r×(1+r)ⁿ',  style: { top: '7%',    left: '2%',   transform: 'rotate(-8deg)'  } },
  { text: '₹20,00,000',          style: { top: '13%',   right: '3%',  transform: 'rotate(6deg)'   } },
  { text: '8.5% p.a.',           style: { top: '60%',   left: '1%',   transform: 'rotate(-4deg)'  } },
  { text: '÷ [(1+r)ⁿ−1]',       style: { bottom: '24%',right: '2%',  transform: 'rotate(10deg)'  } },
  { text: '= ₹17,356/mo',        style: { top: '42%',   left: '0.5%', transform: 'rotate(-6deg)'  } },
  { text: '20 Years',            style: { bottom: '9%', left: '7%',   transform: 'rotate(4deg)'   } },
];

// ── Item 2: Sample results (EMI only for now) ─────────────────────────────────
const SAMPLE_RESULTS: Record<string, string> = {
  '/emi-calculator': '₹20L · 8.5% · 20Y → ₹17,356/mo',
};

// ── Item 5: Real Scenario data (EMI-themed) ───────────────────────────────────
const REAL_SCENARIOS = [
  {
    Icon: Landmark,
    tag: 'Home Loan · Mumbai',
    inputs: 'Loan ₹60L · 8.75% p.a. · 20 Years',
    result: '₹53,000',
    sub: 'Total Interest paid: ₹67.2L',
    cta: 'Run Your Numbers',
    href: '/emi-calculator',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-100 dark:border-blue-800/50',
    accent: 'from-blue-500 to-blue-600',
  },
  {
    Icon: ReceiptText,
    tag: 'Home Loan · Bengaluru',
    inputs: 'Loan ₹80L · 9.0% p.a. · 25 Years',
    result: '₹67,120',
    sub: 'vs renting ₹35K/mo — break-even: Yr 9',
    cta: 'Compare EMI vs Rent',
    href: '/home-loan-vs-rent',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'border-violet-100 dark:border-violet-800/50',
    accent: 'from-violet-500 to-violet-600',
  },
  {
    Icon: Target,
    tag: 'Car Loan · Delhi',
    inputs: 'Loan ₹8L · 10.5% p.a. · 5 Years',
    result: '₹17,200',
    sub: 'Total Interest: ₹2.3L over 60 months',
    cta: 'Calculate Car EMI',
    href: '/emi-calculator',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-100 dark:border-emerald-800/50',
    accent: 'from-emerald-500 to-emerald-600',
  },
] as const;

const categoryConfig: Record<string, { label: string; Icon: LucideIcon }> = {
  finance:    { label: 'Finance',    Icon: IndianRupee },
  health:     { label: 'Health',     Icon: Heart },
  utility:    { label: 'Utility',    Icon: Wrench },
  conversion: { label: 'Conversion', Icon: ArrowLeftRight },
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<CalculatorCategory | null>(null);

  // Item 1: Hero quick calculator state
  const [principal, setPrincipal] = useState(2_000_000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const emiResult = useMemo(() => calcEMI(principal, rate, years), [principal, rate, years]);

  const allCalculators = getActiveCalculators().map((calc) => ({
    title: calc.title,
    description: calc.description,
    href: calc.href,
    icon: calc.icon,
    category: calc.category,
    sampleResult: SAMPLE_RESULTS[calc.href],
  }));

  const filteredCalculators = selectedCategory
    ? allCalculators.filter(calc => calc.category.toLowerCase() === selectedCategory)
    : allCalculators;

  const groupedByCategory: Record<string, typeof allCalculators> = {};
  (selectedCategory ? filteredCalculators : allCalculators).forEach(calc => {
    const catKey = calc.category.toLowerCase();
    if (!groupedByCategory[catKey]) groupedByCategory[catKey] = [];
    groupedByCategory[catKey].push(calc);
  });

  return (
    <div className="space-y-12">

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
          Contains: Item 1 (quick calc), Item 3 (count-up), Item 6 (motifs)
      ═══════════════════════════════════════════════════════════ */}
      <section className="text-center py-12 md:py-16 space-y-8 relative">

        {/* ── Item 6: Floating EMI formula motifs ── */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none select-none"
          aria-hidden="true"
        >
          {MOTIFS.map((m, i) => (
            <span
              key={i}
              className="absolute font-mono text-blue-900/[0.06] dark:text-blue-200/[0.07] text-sm md:text-base font-bold"
              style={m.style}
            >
              {m.text}
            </span>
          ))}
        </div>

        {/* Search */}
        <div className="mb-8 relative z-10">
          <CalculatorSearch />
        </div>

        {/* Brand + tagline */}
        <div className="space-y-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              calculox
            </span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Results verified against SBI, HDFC, and ICICI official calculators
          </p>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Premium online calculators for your financial, health, and daily calculations.{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              Fast, accurate, and completely free.
            </span>
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 pt-4 relative z-10">
          {['100% Free', 'No Registration', '14 Calculators'].map(label => (
            <div
              key={label}
              className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 text-sm font-semibold border border-gray-200 dark:border-gray-700"
            >
              {label}
            </div>
          ))}
          <Link
            href="/compare"
            className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold border border-blue-200 dark:border-blue-800/60 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
            Compare Calculators
          </Link>
        </div>

        {/* ── Item 1: Hero EMI Quick Calculator ── */}
        <div className="relative z-10 max-w-2xl mx-auto mt-6 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-blue-200 dark:border-blue-800/60 shadow-xl p-6 md:p-8 text-left">

          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              EMI Quick Calculator
            </span>
          </div>

          {/* Sliders */}
          <div className="space-y-5">
            {/* Principal */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Loan Amount</label>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatINR(principal)}</span>
              </div>
              <input
                type="range" min={100_000} max={10_000_000} step={100_000}
                value={principal}
                onChange={e => setPrincipal(+e.target.value)}
                className="w-full h-2 rounded-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>₹1L</span><span>₹1Cr</span>
              </div>
            </div>

            {/* Rate */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Interest Rate</label>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{rate.toFixed(1)}% p.a.</span>
              </div>
              <input
                type="range" min={5} max={18} step={0.1}
                value={rate}
                onChange={e => setRate(+e.target.value)}
                className="w-full h-2 rounded-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>5%</span><span>18%</span>
              </div>
            </div>

            {/* Tenure */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tenure</label>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{years} Years</span>
              </div>
              <input
                type="range" min={1} max={30} step={1}
                value={years}
                onChange={e => setYears(+e.target.value)}
                className="w-full h-2 rounded-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>1 Yr</span><span>30 Yrs</span>
              </div>
            </div>
          </div>

          {/* Live result row */}
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                ₹{Math.round(emiResult.emi).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">Monthly EMI</p>
            </div>
            <div>
              <div className="text-lg md:text-2xl font-bold text-orange-500 dark:text-orange-400 tabular-nums">
                {formatINR(emiResult.totalInterest)}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">Total Interest</p>
            </div>
            <div>
              <div className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-200 tabular-nums">
                {formatINR(emiResult.totalAmount)}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">Total Payment</p>
            </div>
          </div>

          <Link
            href="/emi-calculator"
            className="mt-5 block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 will-change-transform"
          >
            See Full Amortization Schedule →
          </Link>
        </div>

        {/* ── Item 3: Count-Up Trust Bar ── */}
        <div className="relative z-10 mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-blue-800/50">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                <CountUp to={14} suffix="+" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Free Calculators</p>
            </div>
            <div className="text-center">
              <Lock className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400" strokeWidth={2} aria-hidden="true" />
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">No Data Stored</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-violet-600 dark:text-violet-400">
                <CountUp to={100} suffix="%" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Browser-Only</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CALCULATOR GRID
          Contains: Item 2 (EMI sample result), Item 4 (Finance gradient)
      ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-8">
        <div className="space-y-2 mb-8">
          <h2 className="text-4xl font-bold">Popular Calculators</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedCategory
              ? `Explore our ${categoryConfig[selectedCategory]?.label ?? selectedCategory} calculators`
              : 'Choose from our collection of powerful financial and health calculators'}
          </p>
        </div>

        <CategoryTabs
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {selectedCategory ? (
          <div key={selectedCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            {filteredCalculators.map((calc) => (
              <CalculatorCard key={calc.href} {...calc} />
            ))}
          </div>
        ) : (
          <div key="all" className="space-y-12 animate-fade-in">
            {Object.entries(groupedByCategory).map(([category, calcs]) => {
              const cfg = categoryConfig[category];
              const CategoryIcon = cfg?.Icon;
              return (
                <div key={category} className="space-y-4 relative">

                  {/* ── Item 4: Ambient gradient header for Finance ── */}
                  {category === 'finance' && (
                    <div
                      className="absolute -inset-x-4 -top-4 h-28 bg-gradient-to-b from-blue-100/60 via-blue-50/30 to-transparent dark:from-blue-500/10 dark:via-blue-950/5 rounded-t-2xl pointer-events-none"
                      aria-hidden="true"
                    />
                  )}

                  <div className="relative flex items-center gap-3 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
                    <h3 className={`text-2xl font-bold flex items-center gap-2 ${
                      category === 'finance'    ? 'text-blue-600 dark:text-blue-400'   :
                      category === 'health'     ? 'text-rose-600 dark:text-rose-400'   :
                      category === 'utility'    ? 'text-violet-600 dark:text-violet-400' :
                      'text-teal-600 dark:text-teal-400'
                    }`}>
                      {CategoryIcon && (
                        <CategoryIcon className="w-6 h-6" strokeWidth={2} aria-hidden="true" />
                      )}
                      {cfg?.label ?? category}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      category === 'finance'    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'     :
                      category === 'health'     ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'     :
                      category === 'utility'    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' :
                      'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                    }`}>
                      {calcs.length} {calcs.length === 1 ? 'Calculator' : 'Calculators'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {calcs.map((calc) => (
                      <CalculatorCard key={calc.href} {...calc} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Item 5: REAL SCENARIOS (replaces Use Cases)
      ═══════════════════════════════════════════════════════════ */}
      <section className="space-y-8">
        <div className="space-y-2 mb-8">
          <h2 className="text-4xl font-bold">Real Indian Scenarios</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Actual numbers — try the calculator and see for yourself
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REAL_SCENARIOS.map((sc) => (
            <div
              key={sc.tag}
              className={`relative overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl border ${sc.border} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6`}
            >
              {/* Left accent bar */}
              <span className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${sc.accent} rounded-l-2xl`} />

              <div className={`inline-flex p-2.5 rounded-xl mb-3 ${sc.bg}`}>
                <sc.Icon className={`w-5 h-5 ${sc.color}`} strokeWidth={2} aria-hidden="true" />
              </div>

              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{sc.tag}</p>

              {/* Result box — the calculator-themed core */}
              <div className={`${sc.bg} rounded-xl p-4 mb-4 font-mono`}>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{sc.inputs}</p>
                <p className={`text-2xl font-extrabold tabular-nums ${sc.color}`}>
                  {sc.result}
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">/mo</span>
                </p>
                <p className="text-[11px] text-gray-400 mt-1">{sc.sub}</p>
              </div>

              <Link href={sc.href} className={`text-sm font-semibold ${sc.color} hover:underline`}>
                {sc.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 md:p-16 border border-blue-100 dark:border-gray-700">
        <h2 className="text-4xl font-bold mb-12 text-center">Why Choose Our Calculators?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { Icon: Zap,         label: 'Fast & Accurate',  desc: 'Get instant results with high precision calculations powered by advanced algorithms', color: 'text-amber-500' },
            { Icon: ShieldCheck, label: 'Secure & Private', desc: 'Your data is never stored or shared. All calculations happen securely in your browser', color: 'text-blue-600' },
            { Icon: Smartphone,  label: 'Mobile Friendly',  desc: 'Works perfectly on any device - desktop, tablet, or phone with optimized responsive design', color: 'text-violet-600' },
          ].map(({ Icon, label, desc, color }) => (
            <div key={label} className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/60 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <Icon className={`w-12 h-12 mx-auto mb-4 ${color}`} strokeWidth={1.75} aria-hidden="true" />
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{label}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-8 pt-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400">Find answers to common questions about our calculators</p>
        </div>
        <div className="space-y-4">
          {[
            {
              q: 'Are these calculators free to use?',
              a: "Yes! All our calculators are completely free and don't require any registration or payment. We believe financial tools should be accessible to everyone.",
            },
            {
              q: 'Is my data secure?',
              a: 'Yes. All calculations happen in your browser. We never store or transmit your personal data. Your privacy is our top priority.',
            },
            {
              q: 'Will you add more calculators?',
              a: "Yes! We're constantly adding new calculators based on user feedback. Check back soon for more powerful tools to make your life easier.",
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              className="group bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer"
            >
              <summary className="font-semibold text-lg text-gray-900 dark:text-white flex items-center justify-between group-open:text-blue-600 dark:group-open:text-blue-400 transition-colors">
                <span>{q}</span>
                <span className="transform group-open:rotate-180 transition-transform duration-300 text-xl">▾</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
