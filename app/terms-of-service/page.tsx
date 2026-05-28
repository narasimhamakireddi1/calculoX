import type { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'Terms of Service - calculox',
  description: 'Read the calculox Terms of Service. Understand the terms and conditions for using our free online calculator tools.',
  alternates: { canonical: `${BASE_URL}/terms-of-service` },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Terms of Service</span>
      </nav>

      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">Last Updated: May 26, 2026</p>

      <div className="space-y-8">
        {[
          {
            title: '1. Acceptance of Terms',
            content: 'By accessing and using calculox ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.',
          },
          {
            title: '2. Use of Calculators',
            content: 'All calculators on calculox are provided for informational and educational purposes only. The results generated are estimates based on the inputs you provide and standard mathematical formulas. They do not constitute financial, medical, legal, or professional advice.',
          },
          {
            title: '3. Accuracy Disclaimer',
            content: 'While we strive to provide accurate calculations, calculox makes no warranties about the completeness, reliability, or accuracy of this information. Results may vary from actual outcomes due to real-world factors. Always consult a qualified professional for important financial decisions.',
          },
          {
            title: '4. Intellectual Property',
            content: 'All content, design, code, and calculators on calculox are the intellectual property of calculox. You may not reproduce, distribute, or create derivative works without our express written permission.',
          },
          {
            title: '5. Prohibited Uses',
            content: 'You agree not to: (a) use the service for illegal purposes, (b) attempt to hack or disrupt our servers, (c) scrape or crawl our content in bulk, (d) use automated bots to submit calculator requests, or (e) misrepresent our tools or results.',
          },
          {
            title: '6. Third-Party Links',
            content: 'Our service may contain links to third-party websites. We are not responsible for the content or privacy practices of these sites. Use them at your own discretion.',
          },
          {
            title: '7. Limitation of Liability',
            content: 'calculox shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of or inability to use our calculators or services.',
          },
          {
            title: '8. Changes to Terms',
            content: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the service constitutes acceptance of the updated terms.',
          },
          {
            title: '9. Governing Law',
            content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.',
          },
          {
            title: '10. Contact',
            content: 'For questions about these Terms, contact us at supportcalculox@gmail.com.',
          },
        ].map((section) => (
          <section key={section.title}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{section.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{section.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

