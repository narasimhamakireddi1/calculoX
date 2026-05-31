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
