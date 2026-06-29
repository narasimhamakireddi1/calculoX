---
name: icon-tile-consistency
description: Icon tile wrapping pattern — all H1 headers use rounded tile containers with category-aware colors; established 2026-06-11
metadata:
  type: project
---

All 14 calculator H1 headers, RelatedCalculators, and Compare panel now wrap CalculatorIcon in rounded tile containers matching CalculatorCard homepage tiles.

**Tile color convention:**
- Finance calculators (EMI, SIP, FD, RD, Tax, Simple Interest, CAGR, Retirement, Home Loan vs Rent, GST, Profit Margin): blue bg/text
- Health (BMI): rose bg/text
- Utility/Conversion (Percentage, Scientific): violet bg/text

**Why:** Visual hierarchy parity — bare icons in H1 headers looked inconsistent next to the tiled icons on the homepage CalculatorCard grid. Tile containers give every icon surface a uniform premium look.

**How to apply:** Any new calculator page added to the project must wrap its H1 CalculatorIcon in a `rounded-2xl` tile with the appropriate category color. RelatedCalculators and Compare panel follow the same rounded-tile convention.

**Commit:** b9e882d (2026-06-11) — 18 files, +74/-21 lines
