import { CalculatorCard } from "@/components/ui/CalculatorCard";

const calculators = [
  // Phase 1: MVP
  {
    title: "SIP Calculator",
    description:
      "Calculate your Systematic Investment Plan returns and projected wealth.",
    href: "/sip-calculator",
    icon: "📊",
    category: "Finance",
  },
  {
    title: "EMI Calculator",
    description:
      "Calculate your loan EMI, total interest, and amortization schedule.",
    href: "/emi-calculator",
    icon: "🏦",
    category: "Finance",
  },
  {
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index and check your health status.",
    href: "/bmi-calculator",
    icon: "⚖️",
    category: "Health",
  },
  {
    title: "Income Tax Calculator",
    description: "Calculate your income tax liability and tax deductions.",
    href: "/tax-calculator",
    icon: "💰",
    category: "Finance",
  },
  // Phase 2: Batch 1 - Simple Formula Calculators
  {
    title: "FD Calculator",
    description: "Calculate Fixed Deposit maturity amount and interest earned.",
    href: "/fd-calculator",
    icon: "🏦",
    category: "Finance",
  },
  {
    title: "RD Calculator",
    description: "Calculate Recurring Deposit maturity and interest earned.",
    href: "/rd-calculator",
    icon: "💳",
    category: "Finance",
  },
  {
    title: "Simple Interest Calculator",
    description: "Calculate simple interest using SI = P × R × T / 100.",
    href: "/simple-interest-calculator",
    icon: "📊",
    category: "Finance",
  },
  {
    title: "GST Calculator",
    description: "Add or remove GST at 5%, 12%, 18%, or 28% rates.",
    href: "/gst-calculator",
    icon: "🧮",
    category: "Finance",
  },
  {
    title: "Percentage Calculator",
    description:
      "Calculate percentage of, percentage change, and what percentage.",
    href: "/percentage-calculator",
    icon: "📈",
    category: "Utility",
  },
  {
    title: "CAGR Calculator",
    description: "Calculate Compound Annual Growth Rate for your investments.",
    href: "/cagr-calculator",
    icon: "📊",
    category: "Finance",
  },
  // Phase 2: Batch 2 & 3 - Coming Soon
  {
    title: "Inflation Calculator",
    description:
      "Calculate the real value of money after accounting for inflation.",
    href: "/inflation-calculator",
    icon: "💵",
    category: "Finance",
  },
  {
    title: "PPF Calculator",
    description: "Calculate Public Provident Fund maturity over 15 years.",
    href: "/ppf-calculator",
    icon: "🏛️",
    category: "Finance",
  },
  {
    title: "HRA Calculator",
    description: "Calculate House Rent Allowance exemption for income tax.",
    href: "/hra-calculator",
    icon: "🏠",
    category: "Finance",
  },
  {
    title: "Loan Eligibility Calculator",
    description: "Calculate maximum loan you can get based on your income.",
    href: "/loan-eligibility-calculator",
    icon: "💰",
    category: "Finance",
  },
  {
    title: "Retirement Calculator",
    description: "Calculate the corpus needed to retire comfortably.",
    href: "/retirement-calculator",
    icon: "🎯",
    category: "Finance",
  },
  {
    title: "Age Calculator",
    description:
      "Calculate exact age from date of birth in years, months, days.",
    href: "/age-calculator",
    icon: "🎂",
    category: "Utility",
  },
  {
    title: "Unit Converter",
    description: "Convert length, weight, temperature, and area units.",
    href: "/unit-converter",
    icon: "⚖️",
    category: "Conversion",
  },
  {
    title: "Currency Converter",
    description: "Convert Indian Rupees to USD, EUR, GBP and other currencies.",
    href: "/currency-converter",
    icon: "💱",
    category: "Conversion",
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-gradient">CalculoX</span>
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
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Fast & Accurate</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get instant results with high precision calculations
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your data is never stored or shared with anyone
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📱</div>
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
