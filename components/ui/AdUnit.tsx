'use client';

import { useEffect, useRef } from 'react';

const PUB_ID = 'ca-pub-7034746357427731';

// Replace these with real slot IDs from your AdSense dashboard.
// AdSense → Ads → By ad unit → Display ads → Create → copy the data-ad-slot value.
// Create one unit per position; give each a descriptive name in the AdSense UI.
export const AD_SLOTS = {
  calcAboveFold:   '7732689351',  // Calculator pages: above the fold, before the form
  calcBelowResult: '3793444341',  // Calculator pages: below the result panel
  blogInArticle:   '3736474722',  // Blog posts: in-article, after 3rd section
  blogFooter:      '4627179710',  // Blog posts: below bottom CTA
} as const;

interface AdUnitProps {
  slot: string;
  format?: string;
  className?: string;
}

export function AdUnit({ slot, format = 'auto', className = '' }: AdUnitProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch { /* noop */ }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={PUB_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
