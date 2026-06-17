'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem('cookie_consent')) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (SSR or private browsing)
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem('cookie_consent', 'accepted');
      window.dispatchEvent(new CustomEvent('cookie_consent_update', { detail: 'accepted' }));
    } catch {
      // ignore
    }
    setVisible(false);
  }

  function decline() {
    try {
      localStorage.setItem('cookie_consent', 'declined');
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed bottom-0 inset-x-0 z-50 bg-gray-900 border-t border-gray-700 text-white px-4 py-4 md:py-3 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="flex-1 text-sm text-gray-300 leading-relaxed">
          We use cookies to analyse site traffic and serve personalised ads via{' '}
          <strong className="text-white">Google AdSense</strong>. You can accept
          or decline non-essential cookies.{' '}
          <Link href="/privacy-policy" className="underline text-blue-400 hover:text-blue-300">
            Learn more
          </Link>
          .
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
