'use client';

import { useEffect } from 'react';

const CLIENT_ID = 'ca-pub-7034746357427731';

export function AdSenseLoader() {
  useEffect(() => {
    // Pages with no ad units (homepage, blog listing, legal/about pages) rendered
    // no <ins class="adsbygoogle"> — loading the ~230KB SDK there was pure waste
    // that competed with LCP paint for main-thread time (74-80% unused per
    // PageSpeed). AdUnit's <ins> is part of the initial server-rendered HTML for
    // pages that have one, so this DOM check is reliable by the time this effect
    // (mounted after <main>{children}</main> in the tree) runs.
    if (!document.querySelector('.adsbygoogle')) return;

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

    function inject() {
      if (document.getElementById('adsense-js')) return;
      const s = document.createElement('script');
      s.id = 'adsense-js';
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ID}`;
      s.crossOrigin = 'anonymous';
      document.head.appendChild(s);
    }

    // Defer the SDK fetch/execution off the critical rendering path — ad slots
    // queue via adsbygoogle.push({}) in AdUnit regardless of when the SDK script
    // itself loads, so a short delay here doesn't drop or reorder any ad request.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ric = (window as any).requestIdleCallback;
    const idleId = ric ? ric(inject, { timeout: 2500 }) : undefined;
    const timeoutId = ric ? undefined : setTimeout(inject, 2000);

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
    return () => {
      window.removeEventListener('cookie_consent_update', handleConsent);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (idleId !== undefined) (window as any).cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
