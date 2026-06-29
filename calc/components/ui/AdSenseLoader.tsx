'use client';

import { useEffect } from 'react';

const CLIENT_ID = 'ca-pub-7034746357427731';

export function AdSenseLoader() {
  useEffect(() => {
    let personalized = false;
    try {
      personalized = localStorage.getItem('cookie_consent') === 'accepted';
    } catch {}

    // Set the NPA flag BEFORE injecting the script so AdSense reads it on first load.
    // requestNonPersonalizedAds=1 → non-personalized ads (GDPR-safe default)
    // requestNonPersonalizedAds=0 → personalized ads (only after explicit accept)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adsense = ((window as any).adsbygoogle = (window as any).adsbygoogle || []);
    adsense.requestNonPersonalizedAds = personalized ? 0 : 1;

    if (!document.getElementById('adsense-js')) {
      const s = document.createElement('script');
      s.id = 'adsense-js';
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ID}`;
      s.crossOrigin = 'anonymous';
      document.head.appendChild(s);
    }

    function handleConsent(e: Event) {
      if ((e as CustomEvent).detail === 'accepted') {
        // Upgrade subsequent ad requests to personalized ads
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).adsbygoogle) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).adsbygoogle.requestNonPersonalizedAds = 0;
        }
      }
    }
    window.addEventListener('cookie_consent_update', handleConsent);
    return () => window.removeEventListener('cookie_consent_update', handleConsent);
  }, []);

  return null;
}
