'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const GA_ID = 'G-GFN66QLNZP';

export function GoogleAnalyticsLoader() {
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
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />
    </>
  );
}
