# AdSense Approval — Action Plan (Indexing-First)

This supersedes the earlier implementation guide. The earlier guide optimised the wrong
thing (disclaimer tone, fake testimonials/stats). The real blocker is **indexing**, not
content. Work top-down: item 1 is ~80% of the outcome.

---

## 1. Get the site indexed (the actual fix) — do this first

Google has indexed ~1 of ~48 pages. Until that changes, re-applying is wasted.

**In Google Search Console (property already verified via the meta tag):**

1. **Sitemaps → Add a new sitemap →** `sitemap.xml` → Submit. Confirm status "Success" and "Discovered URLs" ≈ 48.
2. **URL Inspection** the homepage → **Request Indexing**. Repeat for each of the 14 calculator pages and `/blog`. Do ~10/day (there's a daily quota).
3. **Pages report** → read the "Why pages aren't indexed" reasons:
   - "Discovered – currently not indexed" / "Crawled – currently not indexed" → confirms a crawl-budget / newness issue (expected for a new domain). Requesting indexing + inbound links is the remedy.
   - "Duplicate, Google chose different canonical" → confirm the page's canonical points to the `www` version (it does site-wide).
   - Any "Blocked"/"noindex"/"redirect error" → fix immediately (none currently expected).
4. Re-check `site:calculox.in` weekly. **Reapply to AdSense only once 30+ pages are indexed.**

## 2. Build a little authority so the crawler has reasons to return

- Add the site to your own **LinkedIn / GitHub** profiles (real links).
- One or two genuine posts (IndieHackers, a relevant subreddit, a "Show" community) linking to a specific calculator.
- List in 1–2 reputable free tool directories.
- Keep publishing: 1 new blog guide / week signals a live, growing site.

Even 3–5 real referring links dramatically speed up indexing of a new domain.

## 3. On-site improvements already implemented (this branch)

- **Author byline + "Last reviewed <date>"** on all 14 calculator pages — single source of
  truth in `components/layout/CalcPageWrapper.tsx` (`CONTENT_REVIEWED`). Update that date
  when you re-audit formulas.
- **Homepage blog link cloud** (`MORE_POSTS` in `app/page.tsx`) surfaces all guides as
  crawlable text links from the root, with accurate counts.

## 4. Optional polish (minor)

- Make the apex→www redirect **permanent (308)** in Vercel → Project → Domains (currently 307).
- Confirm `og-image` renders (served via `/api/og` rewrite — returns 200).

## 5. Reapplication checklist

- [ ] Sitemap submitted, ~48 URLs discovered in GSC
- [ ] Top ~15 pages "Request Indexing" done
- [ ] `site:calculox.in` shows **30+ pages** indexed
- [ ] A few real inbound links live
- [ ] Then: AdSense → Sites → calculox.in → **Request Review**

## Do NOT

- ❌ Fake testimonials or invented usage/rating numbers (policy violation).
- ❌ Remove honest disclaimers.
- ❌ Mass-rewrite calculator content — it's already strong.
