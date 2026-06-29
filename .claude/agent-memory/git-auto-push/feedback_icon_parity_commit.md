---
name: lucide-icon-parity-commit-pattern
description: Commit message conventions for emoji→Lucide icon sweep commits across calculator pages
metadata:
  type: feedback
---

Use `feat(icons):` scope for site-wide emoji → Lucide icon replacement commits.

Commit body structure that worked (87f0c69, 2026-06-11):
- Subject: "complete Lucide icon parity across all N calculators"
- Body: bullet per calculator listing which icons changed and what semantic role they fill
- Include duplicate `'use client'` removals in the same commit when they accompany icon fixes (they co-occur because files were being cleaned up together)
- End body with: `Build: 74 static pages, 0 TypeScript errors`

**Why:** The icon pass is a multi-file, multi-calculator change. A single bundled commit is preferred over per-calculator commits — confirmed by project history (every icon wave was one commit). The detailed body documents semantic intent (e.g. "rose-600 active gradient matches Health category color") so future reviewers understand the design system rationale.

**How to apply:** When staging icon-only or icon+cleanup changes across many calculator files, group them into one `feat(icons):` commit. Do not split by calculator.

See also: [[icon-tile-consistency]]
