import type { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export const metadata: Metadata = {
  title: 'Privacy Policy - CalculoX',
  description: 'Read the CalculoX Privacy Policy. Learn how we collect, use, and protect your information when you use our free online calculators.',
  alternates: { canonical: `${BASE_URL}/privacy-policy` },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Privacy Policy</span>
      </nav>

      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">Last Updated: May 26, 2026</p>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">1. Introduction</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Welcome to CalculoX (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We are committed to protecting your personal information
            and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you visit our website at <strong>calculox.in</strong> and use our free online calculators.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">2. Information We Collect</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            <strong>Calculator Inputs:</strong> All calculator inputs (investment amounts, loan values, weight, height, income, etc.)
            are processed entirely in your browser. We do <strong>not</strong> store, transmit, or save any calculation data you enter.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            <strong>Usage Data:</strong> We automatically collect certain information when you visit our site, including
            your IP address, browser type, operating system, referring URLs, pages visited, and time spent on pages.
            This is collected via Google Analytics.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Cookies:</strong> We use cookies to analyze site traffic and improve your experience.
            You can disable cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>To operate and improve our calculator tools</li>
            <li>To analyze website traffic and user behavior (via Google Analytics)</li>
            <li>To display relevant advertisements (via Google AdSense)</li>
            <li>To comply with legal obligations</li>
            <li>To respond to your inquiries sent via email</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">4. Google AdSense & Advertising</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We use Google AdSense to display advertisements. Google may use cookies and web beacons to collect
            data about your visits to this and other websites to provide targeted advertisements. You can opt out
            of personalized advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Google Ad Settings
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">5. Third-Party Services</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">We use the following third-party services:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mt-3">
            <li><strong>Google Analytics</strong> — Website traffic analysis</li>
            <li><strong>Google AdSense</strong> — Display advertising</li>
            <li><strong>Vercel</strong> — Website hosting and deployment</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">6. Data Security</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We implement appropriate technical and organizational security measures to protect your information.
            Our website uses HTTPS encryption. However, no method of internet transmission is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">7. Children&apos;s Privacy</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Our service is not directed to children under 13 years of age. We do not knowingly collect
            personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">8. Your Rights</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            You have the right to access, correct, or delete your personal information. Since we don&apos;t store
            calculator inputs, there is no personal calculation data to request. For other inquiries, contact us
            at <a href="mailto:support@calculox.in" className="text-blue-600 hover:underline">support@calculox.in</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">9. Changes to This Policy</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with
            an updated &quot;Last Updated&quot; date. Continued use of our service after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">10. Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            For privacy-related questions, contact us at:<br />
            <strong>Email:</strong> <a href="mailto:support@calculox.in" className="text-blue-600 hover:underline">support@calculox.in</a><br />
            <strong>Website:</strong> <a href={BASE_URL} className="text-blue-600 hover:underline">calculox.in</a>
          </p>
        </section>
      </div>
    </div>
  );
}
