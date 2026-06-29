import type { Metadata } from 'next';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Mail, Wrench, Lightbulb, Handshake } from 'lucide-react';
import ContactForm from '@/components/ui/ContactForm';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

export const metadata: Metadata = {
  title: 'Contact Us - calculox',
  description: 'Contact the calculox team. Report bugs, suggest new calculators, or give feedback. We respond within 24 hours.',
  alternates: { canonical: `${BASE_URL}/contact` },
};

const contactCards: Array<{ Icon: LucideIcon; color: string; title: string; desc: string; value: string; href: string }> = [
  { Icon: Mail,      color: 'text-blue-600 dark:text-blue-400',   title: 'Email Us',              desc: 'For general questions and support',     value: 'supportcalculox@gmail.com', href: 'mailto:supportcalculox@gmail.com' },
  { Icon: Wrench,    color: 'text-rose-600 dark:text-rose-400',    title: 'Report a Bug',          desc: 'Found an issue with a calculator?',     value: 'supportcalculox@gmail.com', href: 'mailto:supportcalculox@gmail.com?subject=Bug Report' },
  { Icon: Lightbulb, color: 'text-amber-600 dark:text-amber-400',  title: 'Suggest a Calculator', desc: 'Want us to build a new calculator?',    value: 'supportcalculox@gmail.com', href: 'mailto:supportcalculox@gmail.com?subject=Calculator Suggestion' },
  { Icon: Handshake, color: 'text-violet-600 dark:text-violet-400',title: 'Partnerships',         desc: 'Business & advertising inquiries',      value: 'supportcalculox@gmail.com', href: 'mailto:supportcalculox@gmail.com?subject=Partnership Inquiry' },
];

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
        {contactCards.map(({ Icon, color, title, desc, value, href }) => (
          <a
            key={title}
            href={href}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <Icon className={`w-8 h-8 mb-3 ${color}`} strokeWidth={1.75} aria-hidden="true" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{desc}</p>
            <p className="text-blue-600 text-sm font-medium">{value}</p>
          </a>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Send Us a Message</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Fill out the form below and we&apos;ll get back to you within 24–48 hours.
        </p>
        <ContactForm />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Prefer Email?</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Write directly to{' '}
          <a href="mailto:supportcalculox@gmail.com" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            supportcalculox@gmail.com
          </a>
          {' '}— we respond within <strong>24–48 hours</strong> on business days.
        </p>
      </div>
    </div>
  );
}
