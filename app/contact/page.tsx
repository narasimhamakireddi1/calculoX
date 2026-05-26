import type { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'Contact Us - CalculoX',
  description: 'Contact the CalculoX team. Report bugs, suggest new calculators, or give feedback. We respond within 24 hours.',
  alternates: { canonical: `${BASE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Contact</span>
      </nav>

      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
        Have a question, bug report, or suggestion? We&apos;d love to hear from you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {[
          { icon: '📧', title: 'Email Us', desc: 'For general questions and support', value: 'support@calculox.in', href: 'mailto:support@calculox.in' },
          { icon: '🐛', title: 'Report a Bug', desc: 'Found an issue with a calculator?', value: 'support@calculox.in', href: 'mailto:support@calculox.in?subject=Bug Report' },
          { icon: '💡', title: 'Suggest a Calculator', desc: 'Want us to build a new calculator?', value: 'support@calculox.in', href: 'mailto:support@calculox.in?subject=Calculator Suggestion' },
          { icon: '🤝', title: 'Partnerships', desc: 'Business & advertising inquiries', value: 'support@calculox.in', href: 'mailto:support@calculox.in?subject=Partnership Inquiry' },
        ].map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.desc}</p>
            <p className="text-blue-600 text-sm font-medium">{item.value}</p>
          </a>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Response Time</h2>
        <p className="text-gray-600 dark:text-gray-300">
          We typically respond to all emails within <strong>24-48 hours</strong> on business days.
        </p>
      </div>
    </div>
  );
}
