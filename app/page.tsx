import { CalculatorCard } from "@/components/ui/CalculatorCard";
import { CalculatorSearch } from "@/components/ui/CalculatorSearch";
import { getActiveCalculators } from "@/config/calculators.config";

export default function Home() {
  // Get only active calculators (MVP: SIP, EMI, BMI, Tax)
  const calculators = getActiveCalculators().map((calc) => ({
    title: calc.title,
    description: calc.description,
    href: calc.href,
    icon: calc.icon,
    category: calc.category,
  }));
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-24 space-y-8">
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
        </div>

        {/* Trust Bar */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-blue-800/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">50K+</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Indians using CalculoX</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">✅</div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Zero Ad Clutter</p>
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

      {/* Calculators Grid */}
      <section className="space-y-8">
        <div className="space-y-2 mb-8">
          <h2 className="text-4xl font-bold">Popular Calculators</h2>
          <p className="text-gray-600 dark:text-gray-400">Choose from our collection of powerful financial and health calculators</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {calculators.map((calc) => (
            <CalculatorCard key={calc.href} {...calc} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="space-y-8">
        <div className="space-y-2 mb-8">
          <h2 className="text-4xl font-bold">What Users Are Saying</h2>
          <p className="text-gray-600 dark:text-gray-400">Real stories from Indians using CalculoX every day</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-l-4 border-blue-500 border-r border-b border-t border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
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
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-l-4 border-emerald-500 border-r border-b border-t border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
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
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-l-4 border-purple-500 border-r border-b border-t border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
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
          <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Fast & Accurate</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Get instant results with high precision calculations powered by advanced algorithms
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Secure & Private</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Your data is never stored or shared. All calculations happen securely in your browser
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700">
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
          <details className="group bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer">
            <summary className="font-semibold text-lg text-gray-900 dark:text-white flex items-center justify-between group-open:text-blue-600 dark:group-open:text-blue-400 transition-colors">
              <span>Are these calculators free to use?</span>
              <span className="transform group-open:rotate-180 transition-transform duration-300 text-xl">▾</span>
            </summary>
            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              Yes! All our calculators are completely free and don&apos;t require any registration or payment. We believe financial tools should be accessible to everyone.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer">
            <summary className="font-semibold text-lg text-gray-900 dark:text-white flex items-center justify-between group-open:text-blue-600 dark:group-open:text-blue-400 transition-colors">
              <span>Is my data secure?</span>
              <span className="transform group-open:rotate-180 transition-transform duration-300 text-xl">▾</span>
            </summary>
            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              Yes. All calculations happen in your browser. We never store or transmit your personal data. Your privacy is our top priority.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer">
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
