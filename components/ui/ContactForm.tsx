'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

const FORMSPREE_ENDPOINT =
  process.env.NEXT_PUBLIC_FORMSPREE_ID
    ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`
    : null;

const SUBJECTS = [
  { value: 'general',     label: 'General Question' },
  { value: 'bug',         label: 'Bug Report' },
  { value: 'suggestion',  label: 'Calculator Suggestion' },
  { value: 'partnership', label: 'Partnership / Advertising' },
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    /* Formspree not yet configured — fall back to mailto */
    if (!FORMSPREE_ENDPOINT) {
      const subject = encodeURIComponent(String(data.subject ?? 'Contact'));
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
      );
      window.location.href = `mailto:supportcalculox@gmail.com?subject=${subject}&body=${body}`;
      setStatus('idle');
      return;
    }

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        const json = (await res.json()) as { error?: string };
        setErrorMsg(json.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 px-8">
        <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={1.5} />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Message Sent!</h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-sm">
          Thanks for reaching out. We&apos;ll reply to your email within 24–48 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Narasimha Makireddi"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="cf-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Subject <span className="text-red-500">*</span>
        </label>
        <select
          id="cf-subject"
          name="subject"
          required
          defaultValue=""
          className={inputClass}
        >
          <option value="" disabled>Select a topic…</option>
          {SUBJECTS.map(({ value, label }) => (
            <option key={value} value={label}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          placeholder="Tell us what's on your mind…"
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <div className="flex items-start gap-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] will-change-transform transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>

      <p className="text-xs text-center text-gray-400 dark:text-gray-500">
        We typically reply within 24–48 hours on business days.
      </p>
    </form>
  );
}
