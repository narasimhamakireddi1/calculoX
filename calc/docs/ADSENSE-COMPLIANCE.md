# AdSense Compliance Checklist — Design & Layout

Every design change must pass this list before deploy. Status: re-review pending (2026-07-17). Publisher: `ca-pub-7034746357427731`.

## Ad placement & labeling
- [x] Exactly 2 ad slots per calculator page (`calcAboveFold` + `calcBelowResult` in each `*-calculator/layout.tsx`) — CalcPageWrapper renders none (duplicate removed 2026-07-03).
- [x] Ads never adjacent to buttons/CTAs in a way that invites accidental clicks; keep ≥24px separation from interactive elements.
- [x] No ads styled to mimic content, navigation, or calculator results.
- [x] Dark mode: `html.dark .adsbygoogle { background: transparent }` — no white flash, no fake-content look.
- [x] `ads.txt` at `public/ads.txt` (lowercase only — Vercel is case-sensitive).

## Consent & privacy
- [x] NPA (non-personalized ads) by default; personalized only after `cookie_consent = 'accepted'` (`AdSenseLoader.tsx`).
- [x] GA4 fully consent-gated (`GoogleAnalyticsLoader.tsx`).
- [x] Cookie banner does not overlap ads or content (BlogStickyBar offsets `bottom-[76px]`).
- [x] Privacy Policy, Terms, Contact pages linked in footer.

## Content & layout integrity
- [x] No misleading layouts: scroll-reveal animations (ScrollReveal) never hide content from crawlers — content is visible by default, hidden state is JS-applied post-mount only.
- [x] No auto-play media, no interstitials, no pop-ups.
- [x] Disclaimers above every calculator (CalculatorDisclaimer) + homepage strip — YMYL trust signal, do not remove or de-emphasize.
- [x] 850–1,030 words of server-rendered educational content per calculator page (crawlable without JS).
- [x] E-E-A-T: author page, verification methodology page, official-source citations (RBI, Finance Act, SEBI, WHO, GST Council).

## Layout stability (invalid-click prevention)
- [x] Zero CLS from animations: only `opacity`/`transform` animated site-wide; ad slots have reserved space.
- [x] Charts render on first paint (module-level initial data) — no late layout shifts that displace ads.
- [x] Sticky/fixed elements (CalcFAB, ResultsScrollCue, BlogStickyBar) never overlap ad units.

## When making future design changes
1. Never add a third ad slot to calculator pages without re-reading placement policy.
2. Never animate anything near an ad unit (accidental-click risk).
3. Keep disclaimer amber styling prominent — it is a trust feature for YMYL review.
4. Re-run Lighthouse after visual changes; CLS must stay < 0.1.
5. Content behind tabs/accordions is fine (FAQ `<details>`, tax accordions) — but primary educational content must remain expanded/serverside.
