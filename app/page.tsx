import { CalculatorCard } from "@/components/ui/CalculatorCard";
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
      <section className="text-center py-12 md:py-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-gradient">calculox</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Premium online calculators for your financial, health, and daily
          calculations. Fast, accurate, and completely free.
        </p>
      </section>

      {/* Calculators Grid */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold mb-8">Popular Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {calculators.map((calc) => (
            <CalculatorCard key={calc.href} {...calc} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Why Choose Our Calculators?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">âš¡</div>
            <h3 className="text-xl font-semibold mb-2">Fast & Accurate</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get instant results with high precision calculations
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">ðŸ”’</div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your data is never stored or shared with anyone
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">ðŸ“±</div>
            <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Works perfectly on any device - desktop, tablet, or phone
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              Are these calculators free to use?
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Yes! All our calculators are completely free and don&apos;t
              require any registration or payment.
            </p>
          </details>
          <details className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              Is my data secure?
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Yes. All calculations happen in your browser. We never store or
              transmit your personal data.
            </p>
          </details>
          <details className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              Will you add more calculators?
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Yes! We&apos;re constantly adding new calculators based on user
              feedback. Check back soon.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}

