'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export function AdSenseLoader() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem('cookie_consent') === 'accepted') {
        setLoad(true);
      }
    } catch {
      // localStorage unavailable
    }

    function handleConsent(e: Event) {
      if ((e as CustomEvent).detail === 'accepted') setLoad(true);
    }
    window.addEventListener('cookie_consent_update', handleConsent);
    return () => window.removeEventListener('cookie_consent_update', handleConsent);
  }, []);

  if (!load) return null;

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7034746357427731"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
