---
name: feedback-indian-rupee-icon
description: Use IndianRupee (not DollarSign) as the Finance/money icon — this is an Indian rupee product
metadata:
  type: feedback
---

Always use `IndianRupee` (₹) from lucide-react, never `DollarSign` ($), for any icon that represents money, income, or the Finance category on this site.

**Why:** calculox.in is an Indian financial calculator site — all values are in INR. DollarSign is semantically wrong and visually jarring for Indian users. The fix was applied 2026-06-11 across `app/page.tsx` (Finance category tab), `app/about/page.tsx` (Investment & Wealth section), and `app/tax-calculator/page.tsx` (Income Details h2).

**How to apply:** When adding or reviewing any icon that represents currency, income, finance, or money in this project, import `IndianRupee` from `lucide-react`. Grep for `DollarSign` before committing any icon-related change to catch regressions.

See also: [[feedback-icon-parity-commit]]
