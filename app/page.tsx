'use client';

import { useState } from 'react';
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

const categoryConfig: Record<string, { label: string; Icon: LucideIcon }> = {
  finance:    { label: 'Finance',    Icon: IndianRupee },
  health:     { label: 'Health',     Icon: Heart },
  utility:    { label: 'Utility',    Icon: Wrench },
  conversion: { label: 'Conversion', Icon: ArrowLeftRight },
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<CalculatorCategory | null>(null);

  const allCalculators = getActiveCalculators().map((calc) => ({
    title: calc.title,
    description: calc.description,
    href: calc.href,
    icon: calc.icon,
    category: calc.category,
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
      {/* Hero Section */}
      <section className="text-center py-12 md:py-24 space-y-8 relative">
        <div className="mb-8">
          <CalculatorSearch />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">calculox</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Results verified against SBI, HDFC, and ICICI official calculators
          </p>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Premium online calculators for your financial, health, and daily calculations.{' '}
            <span className="font-semibold text-gray-900 dark:text-white">Fast, accurate, and completely free.</span>
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 pt-4">
          <div className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 text-sm font-semibold border border-gray-200 dark:border-gray-700">
            100% Free
          </div>
          <div className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 text-sm font-semibold border border-gray-200 dark:border-gray-700">
            No Registration
          </div>
          <div className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 text-sm font-semibold border border-gray-200 dark:border-gray-700">
            14 Calculators
          </div>
          <Link
            href="/compare"
            className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold border border-blue-200 dark:border-blue-800/60 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
            Compare Calculators
          </Link>
        </div>

        {/* Trust Bar */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-blue-800/50">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">14</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Free Calculators</p>
            </div>
            <div className="text-center">
              <Lock className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400" strokeWidth={2} aria-hidden="true" />
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">No Data Stored</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-violet-600 dark:text-violet-400">0</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Signup Required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculators Grid with Category Tabs */}
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
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
                    <h3 className={`text-2xl font-bold flex items-center gap-2 ${
                      category === 'finance'    ? 'text-blue-600 dark:text-blue-400' :
                      category === 'health'     ? 'text-rose-600 dark:text-rose-400' :
                      category === 'utility'    ? 'text-violet-600 dark:text-violet-400' :
                      'text-teal-600 dark:text-teal-400'
                    }`}>
                      {CategoryIcon && <CategoryIcon className="w-6 h-6" strokeWidth={2} aria-hidden="true" />}
                      {cfg?.label ?? category}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      category === 'finance'    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      category === 'health'     ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
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

      {/* Use Cases Section */}
      <section className="space-y-8">
        <div className="space-y-2 mb-8">
          <h2 className="text-4xl font-bold">Common Use Cases</h2>
          <p className="text-gray-600 dark:text-gray-400">See how CalculoX helps with everyday financial decisions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              Icon: Landmark,
              color: 'text-blue-600 dark:text-blue-400',
              bg: 'bg-blue-50 dark:bg-blue-900/20',
              title: 'Home Loan Planning',
              body: 'Compare EMIs across tenures, see total interest paid over the loan life, and decide between buying and renting — before signing with a bank.',
              cta: 'Try EMI Calculator',
              href: '/emi-calculator',
            },
            {
              Icon: ReceiptText,
              color: 'text-violet-600 dark:text-violet-400',
              bg: 'bg-violet-50 dark:bg-violet-900/20',
              title: 'Old vs New Tax Regime',
              body: 'Enter your salary, HRA, and deductions once. The tax calculator shows the exact liability under both regimes so you pick the one that saves more.',
              cta: 'Try Tax Calculator',
              href: '/tax-calculator',
            },
            {
              Icon: Target,
              color: 'text-emerald-600 dark:text-emerald-400',
              bg: 'bg-emerald-50 dark:bg-emerald-900/20',
              title: 'Retirement Corpus Goal',
              body: 'Use the NISM-based retirement planner to find out how much you need to invest each month to retire at your chosen age with the lifestyle you want.',
              cta: 'Try Retirement Planner',
              href: '/retirement-calculator',
            },
          ].map((card) => (
            <div key={card.title} className="relative overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <span className="absolute inset-y-0 left-0 w-1.5 bg-blue-500 rounded-l-2xl" />
              <div className={`inline-flex p-2.5 rounded-xl mb-4 ${card.bg}`}>
                <card.Icon className={`w-5 h-5 ${card.color}`} strokeWidth={2} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{card.body}</p>
              <Link href={card.href} className={`text-sm font-semibold ${card.color} hover:underline`}>{card.cta} →</Link>
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
            <details key={q} className="group bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer">
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
