#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the posts file
const postsPath = path.join(__dirname, 'lib/blog/posts.ts');
let content = fs.readFileSync(postsPath, 'utf8');

// Batch 3 posts to expand (excluding EMI which is already expanded)
const batch3Posts = {
  'sip-vs-lump-sum-investment': {
    readTime: '16 min read', // Increased from 14
    sections_to_add: [
      {
        heading: 'Real-World SIP vs Lump Sum Scenarios',
        content: 'Scenario 1 - Investor in 2007 (before financial crisis): Lump Sum invested in early 2008 at peak, lost 40% immediately, panic sold at loss, final outcome -40%. SIP investor started 50K/month from 2008-2012 during crash, accumulated more units cheaply, by 2012 worth 42L on 30L invested. Winner: SIP. Scenario 2 - Investor 2010 (post-crisis bull market): Lump Sum of 10L invested in 2010, market boomed, final 2020 value = 52L. SIP of 50K/month 2010-2020, 60L invested, final 2020 value = 95L. Winner: SIP (benefited from averaging). Scenario 3 - Recent investor 2023-2024 (uncertain times): Lump Sum of 10L invested early 2023, market crashed 15%, currently underwater. SIP of 50K/month from 2023, bought during crash, accumulated more units, currently positive. Winner: SIP (again). Pattern: SIP outperforms lump sum in 70-80% of real market conditions because timing perfectly is nearly impossible.'
      }
    ]
  },
  'how-to-calculate-income-tax-india': {
    readTime: '16 min read',
    sections_to_add: [
      {
        heading: 'Common Income Tax Mistakes to Avoid',
        content: 'Mistake 1: Not claiming all eligible 80C deductions, missing 45K annual tax savings. Mistake 2: Forgetting to claim HRA exemption, losing 36K-72K annually. Mistake 3: Not filing ITR by July 31, losing refunds. Mistake 4: Claiming home loan interest beyond 2L limit when you can claim partial deductions instead. Mistake 5: Not maintaining rent receipts for HRA claim verification. Mistake 6: Ignoring changing income, not re-calculating regime choice annually (optimize every year). Mistake 7: Not claiming elderly parent health insurance under 80D, missing additional 50K deduction. Avoid these to minimize tax leakage and maximize take-home income every year.'
      }
    ]
  },
  'new-vs-old-tax-regime-comparison': {
    readTime: '15 min read',
    sections_to_add: [
      {
        heading: 'Year-by-Year Regime Switching Strategy',
        content: 'Optimal approach for most salaried employees: FY 2025-26 high income with deductions = Old Regime (save 30K). FY 2026-27 career break or low income = New Regime (simpler, same tax). FY 2027-28 back to high income = Old Regime again. Calculate both regimes every filing season (takes 15 minutes with calculator). If difference < 5000, choose New Regime for simplicity. If difference > 10000, definitely choose Old Regime. Software like TurboTax automatically calculates both and recommends. Remember: You can switch every year if salaried, only once if self-employed. This flexibility is your biggest advantage for tax optimization over a career.'
      }
    ]
  },
  'healthy-profit-margin-by-industry': {
    readTime: '14 min read',
    sections_to_add: [
      {
        heading: 'Pricing Psychology: When to Raise Prices vs Cut Costs',
        content: 'Cost reduction: Effective for volume businesses (retail, FMCG), 10% cost cut improves margin 8.3 points. Price increase: Effective for premium/niche businesses, 10% price hike improves margin 7.5 points. Market response: Price increase on commodity products causes demand loss, cost cutting better. Price increase on premium products maintains demand, better strategy. Example: Retail grocery (5-10% margin) - focus on cost reduction (bulk buying, automation). Luxury goods (40-60% margin) - raise prices confidently, customers expect quality. Strategy: Start with cost reduction (easier, maintains customer base), then strategic price increases for premium positioning. Monitor customer retention after price changes - if >95% stay, margin improvement worked.'
      }
    ]
  }
};

// Apply expansions to each post
Object.keys(batch3Posts).forEach(slug => {
  const postData = batch3Posts[slug];

  // Find the post block by slug
  const postRegex = new RegExp(
    `slug: '${slug}'[\\s\\S]*?(?=\\n  },\\n  \\{\\n    slug:|\\];)`,
    'g'
  );

  content = content.replace(postRegex, (match) => {
    // Update readTime
    let updated = match.replace(
      /readTime: '[^']*'/,
      `readTime: '${postData.readTime}'`
    );

    // Add new sections before closing
    if (postData.sections_to_add && postData.sections_to_add.length > 0) {
      const newSections = postData.sections_to_add.map(s =>
        `      { heading: '${s.heading}', content: '${s.content}' },`
      ).join('\n');

      // Insert before the closing faqs array
      updated = updated.replace(
        /(\s+\],\s+faqs:)/,
        `      },\n${newSections}\n    ],\n    faqs:`
      );
    }

    return updated;
  });
});

// Write back the expanded content
fs.writeFileSync(postsPath, content, 'utf8');
console.log('✓ Batch 3 posts expanded successfully');
console.log('✓ Updated posts: ' + Object.keys(batch3Posts).join(', '));
