'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface Props {
  calculatorName: string;
  calculatorHref: string;
}

export function BlogStickyBar({ calculatorName, calculatorHref }: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  // Offset upward when cookie consent banner is visible so the dismiss button stays clickable
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);

  useEffect(() => {
    // Check if cookie consent has already been given; if not, the cookie banner is showing
    try {
      if (!localStorage.getItem('cookie_consent')) {
        setCookieBannerVisible(true);
      }
    } catch { /* localStorage unavailable */ }

    function onCookieUpdate() {
      setCookieBannerVisible(false);
    }
    window.addEventListener('cookie_consent_update', onCookieUpdate);
    return () => window.removeEventListener('cookie_consent_update', onCookieUpdate);
  }, []);

  useEffect(() => {
    function onScroll() {
      if (dismissed) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      setVisible(window.scrollY / total > 0.4);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div
      role="complementary"
      aria-label="Calculator call to action"
      className={`fixed inset-x-0 z-40 bg-blue-700 border-t border-blue-600 text-white px-4 py-3 shadow-2xl transition-[bottom] duration-200 ${
        cookieBannerVisible ? 'bottom-[76px]' : 'bottom-0'
      }`}
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-blue-100 leading-snug">
          Ready to try it? Use our free{' '}
          <strong className="text-white">{calculatorName}</strong> for instant results.
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={calculatorHref}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition-colors"
          >
            Open Calculator →
          </Link>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-blue-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
