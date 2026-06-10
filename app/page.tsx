'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalculatorCard } from "@/components/ui/CalculatorCard";
import { CalculatorSearch } from "@/components/ui/CalculatorSearch";
import { CategoryTabs, type CalculatorCategory } from "@/components/ui/CategoryTabs";
import { getActiveCalculators } from "@/config/calculators.config";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<CalculatorCategory | null>(null);

  // Get only active calculators
  const allCalculators = getActiveCalculators().map((calc) => ({
    title: calc.title,
    description: calc.description,
    href: calc.href,
    icon: calc.icon,
    category: calc.category,
  }));

  // Filter calculators by category
  const filteredCalculators = selectedCategory
    ? allCalculators.filter(calc => calc.category.toLowerCase() === selectedCategory)
    : allCalculators;

  // Group calculators by category
  const groupedByCategory: Record<string, typeof allCalculators> = {};
  (selectedCategory ? filteredCalculators : allCalculators).forEach(calc => {
    const catKey = calc.category.toLowerCase();
    if (!groupedByCategory[catKey]) {
      groupedByCategory[catKey] = [];
    }
    groupedByCategory[catKey].push(calc);
  });

  const categoryLabels: Record<string, string> = {
    finance: '💰 Finance',
    health: '💪 Health',
    utility: '📈 Utility',
    conversion: '🔄 Conversion'
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-24 space-y-8 relative">
        {/* Search Bar */}
        <div className="mb-8">
          <CalculatorSearch />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">calculox</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            ✅ Results verified against SBI, HDFC, and ICICI official calculators
          </p>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Premium online calculators for your financial, health, and daily calculations. <span className="font-semibold text-gray-900 dark:text-white">Fast, accurate, and completely free.</span>
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 pt-4">
          <div className="px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold border border-green-200 dark:border-green-800">
            ✓ 100% Free
          </div>
          <div className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold border border-blue-200 dark:border-blue-800">
            ✓ No Registration
          </div>
          <div className="px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-semibold border border-purple-200 dark:border-purple-800">
            ✓ 14 Calculators
          </div>
          <Link href="/compare" className="px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-semibold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors">
            ⚖️ Compare Calculators
          </Link>
        </div>

        {/* Trust Bar */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-blue-800/50">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">50K+</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Indians using CalculoX</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">🔒</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">No Data Stored</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400">⭐ 4.8</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">User Rating</p>
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
              ? `Explore our ${categoryLabels[selectedCategory].split(' ')[1]} calculators`
              : 'Choose from our collection of powerful financial and health calculators'}
          </p>
        </div>

        {/* Category Tabs */}
        <CategoryTabs
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Grouped Calculator Cards */}
        {selectedCategory ? (
          // Single category view
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCalculators.map((calc) => (
              <CalculatorCard key={calc.href} {...calc} />
            ))}
          </div>
        ) : (
          // All calculators grouped by category
          <div className="space-y-12">
            {Object.entries(groupedByCategory).map(([category, calcs]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
                  <h3 className={`text-2xl font-bold ${
                    category === 'finance' ? 'text-blue-600' :
                    category === 'health' ? 'text-pink-600' :
                    category === 'utility' ? 'text-orange-600' :
                    'text-purple-600'
                  }`}>
                    {categoryLabels[category]}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    category === 'finance' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    category === 'health' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' :
                    category === 'utility' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
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
            ))}
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="space-y-8">
        <div className="space-y-2 mb-8">
          <h2 className="text-4xl font-bold">What Users Are Saying</h2>
          <p className="text-gray-600 dark:text-gray-400">Real stories from Indians using CalculoX every day</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="relative overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <span className="absolute inset-y-0 left-0 w-1.5 bg-blue-500" />
            <div className="flex items-center mb-4">
              <span className="text-amber-400">⭐⭐⭐⭐⭐</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed italic">
              &quot;Calculated my home loan EMI in seconds — way more detailed than bank calculators. The breakdown is so clear!&quot;
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">Priya S.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Bangalore</p>
          </div>

          {/* Testimonial 2 */}
          <div className="relative overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <span className="absolute inset-y-0 left-0 w-1.5 bg-emerald-500" />
            <div className="flex items-center mb-4">
              <span className="text-amber-400">⭐⭐⭐⭐⭐</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed italic">
              &quot;The tax calculator helped me save ₹45,000 by comparing old vs new regime. Absolutely worth it!&quot;
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">Rahul M.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Delhi</p>
          </div>

          {/* Testimonial 3 */}
          <div className="relative overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <span className="absolute inset-y-0 left-0 w-1.5 bg-purple-500" />
            <div className="flex items-center mb-4">
              <span className="text-amber-400">⭐⭐⭐⭐⭐</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed italic">
              &quot;Love the retirement planner — finally understand how much I need to save monthly. Game changer!&quot;
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">Sneha K.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Mumbai</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 md:p-16 border border-blue-100 dark:border-gray-700">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Why Choose Our Calculators?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/60 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Fast & Accurate</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Get instant results with high precision calculations powered by advanced algorithms
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/60 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Secure & Private</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Your data is never stored or shared. All calculations happen securely in your browser
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/60 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Mobile Friendly</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Works perfectly on any device - desktop, tablet, or phone with optimized responsive design
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-8 pt-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400">Find answers to common questions about our calculators</p>
        </div>
        <div className="space-y-4">
          <details className="group bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer">
            <summary className="font-semibold text-lg text-gray-900 dark:text-white flex items-center justify-between group-open:text-blue-600 dark:group-open:text-blue-400 transition-colors">
              <span>Are these calculators free to use?</span>
              <span className="transform group-open:rotate-180 transition-transform duration-300 text-xl">▾</span>
            </summary>
            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              Yes! All our calculators are completely free and don&apos;t require any registration or payment. We believe financial tools should be accessible to everyone.
            </p>
          </details>
          <details className="group bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer">
            <summary className="font-semibold text-lg text-gray-900 dark:text-white flex items-center justify-between group-open:text-blue-600 dark:group-open:text-blue-400 transition-colors">
              <span>Is my data secure?</span>
              <span className="transform group-open:rotate-180 transition-transform duration-300 text-xl">▾</span>
            </summary>
            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              Yes. All calculations happen in your browser. We never store or transmit your personal data. Your privacy is our top priority.
            </p>
          </details>
          <details className="group bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer">
            <summary className="font-semibold text-lg text-gray-900 dark:text-white flex items-center justify-between group-open:text-blue-600 dark:group-open:text-blue-400 transition-colors">
              <span>Will you add more calculators?</span>
              <span className="transform group-open:rotate-180 transition-transform duration-300 text-xl">▾</span>
            </summary>
            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              Yes! We&apos;re constantly adding new calculators based on user feedback. Check back soon for more powerful tools to make your life easier.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
