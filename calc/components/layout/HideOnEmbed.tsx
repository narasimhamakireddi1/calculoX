'use client';

import { usePathname } from 'next/navigation';

// Wraps chrome/side-effect components (Footer, CookieConsent, ad loaders, etc.) that
// don't already have their own /embed/* awareness, so app/layout.tsx doesn't render
// them on the bare MCP Apps widget surface. usePathname (unlike useSearchParams) needs
// no Suspense boundary and doesn't force the page out of static rendering, so there's
// no flash-of-chrome-then-hide — the server already omits this markup for /embed/*.
export function HideOnEmbed({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/embed/')) return null;
  return <>{children}</>;
}
