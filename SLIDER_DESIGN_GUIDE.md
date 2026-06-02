# 📱 Mobile Slider Design Guide - Calculox

**Status:** Reference Document for Consistent UI/UX  
**Last Updated:** 2026-06-02  
**Reference Calculator:** `app/rd-calculator/page.tsx`

---

## 🎯 Design Philosophy

Every calculator slider on mobile should follow the **RD Design Pattern** - a 5-component structure that ensures visual consistency and excellent user experience.

---

## 5-Component Slider Pattern

Each slider input consists of:

```
1. LABEL (with unit)
   └─→ "Monthly Deposit (₹)" / "Annual Rate (%)" / "Tenure (Months)"

2. FLEX CONTAINER (mobile: stacked, desktop: row)
   ├─→ SLIDER (gradient background, 24px thumb)
   └─→ NUMBER INPUT (color-matched border & text)

3. PRESET BUTTONS (below slider, quick selection)
   └─→ 4 preset values in a flex row

4. HELPER TEXT (emoji + description)
   └─→ "💡 Description text explaining this input"

5. RANGE TEXT (min-max reference)
   └─→ "₹100 - ₹1,00,000" or "1 to 600 months"
```

---

## Color Scheme (Input Type)

| Input Type | Color | Gradient Classes | Use Case |
|-----------|-------|-----------------|----------|
| **Amount/Value** | Green | `from-green-300 to-green-600` | Principal, Monthly Investment, Monthly Deposit |
| **Rate/Percentage** | Blue | `from-blue-300 to-blue-600` | Annual Rate, Interest Rate, Expected Return |
| **Time Period** | Orange | `from-orange-300 to-orange-600` | Tenure, Duration, Years, Months |

---

## HTML Structure Template

```html
<!-- EXAMPLE: Monthly Deposit (Amount Input) -->
<div class="space-y-3">
  <!-- 1. LABEL -->
  <label for="monthly-deposit" class="block text-sm font-bold text-gray-900 dark:text-white">
    Monthly Deposit (₹)
  </label>

  <!-- 2. FLEX CONTAINER (slider + input) -->
  <div class="flex flex-col md:flex-row gap-3 items-center md:items-center">
    
    <!-- 2a. SLIDER (gradient, 24px→28px thumb) -->
    <input
      type="range"
      id="monthly-deposit-slider"
      min="1000"
      max="1000000"
      step="1000"
      value={monthlyDeposit}
      onChange={(e) => handleInputChange('monthlyDeposit', Number(e.target.value))}
      onBlur={(e) => handleValidateField('monthlyDeposit', Number(e.target.value))}
      class="flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
    />

    <!-- 2b. NUMBER INPUT (color-matched) -->
    <input
      type="number"
      id="monthly-deposit"
      min="1000"
      max="1000000"
      step="1000"
      placeholder="0"
      value={monthlyDeposit === 0 ? "" : monthlyDeposit}
      onChange={(e) => handleInputChange('monthlyDeposit', e.target.value === '' ? 0 : Number(e.target.value))}
      onBlur={(e) => handleValidateField('monthlyDeposit', Number(e.target.value))}
      class="w-full md:w-28 px-3 py-3 border-2 border-green-400 rounded-lg font-bold text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
    />
  </div>

  {errors.monthlyDeposit && <p class="text-red-500 text-sm">{errors.monthlyDeposit.message}</p>}

  <!-- 3. PRESET BUTTONS -->
  <div class="flex gap-2 flex-wrap mt-3">
    {[1000, 2000, 5000, 10000].map(val => (
      <button
        key={val}
        type="button"
        onClick={() => handleInputChange('monthlyDeposit', val)}
        class="text-xs px-3 py-1.5 rounded-full border border-green-200 dark:border-green-700
                 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300
                 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
      >
        ₹{val / 1000}K
      </button>
    ))}
  </div>

  <!-- 4. HELPER TEXT (emoji + description) -->
  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
    💡 Start with smaller amounts. Even ₹1,000/month becomes ₹6L+ in 10 years at 7% interest
  </p>

  <!-- 5. RANGE TEXT (optional, use when helpful) -->
  <p class="text-xs text-gray-500 dark:text-gray-400">
    ₹1,000 - ₹1,00,00,000
  </p>
</div>
```

---

## CSS Classes Reference

### Slider Colors
```
Green (Amounts):    bg-gradient-to-r from-green-300 to-green-600
Blue (Rates):       bg-gradient-to-r from-blue-300 to-blue-600
Orange (Time):      bg-gradient-to-r from-orange-300 to-orange-600
```

### Number Input Pattern
```
Border:    border-2 border-{color}-400
Text:      text-{color}-700 dark:text-{color}-400
Background: bg-{color}-50 dark:bg-{color}-900/20
Border Dark: dark:border-{color}-700
```

### Preset Button Pattern
```
Border:    border border-{color}-200 dark:border-{color}-700
Text:      text-{color}-700 dark:text-{color}-300
Background: bg-{color}-50 dark:bg-{color}-900/30
Hover:     hover:bg-{color}-100 dark:hover:bg-{color}-900/50
```

---

## Custom Slider Thumb Styling

Add this `<style>` block inside your component for consistent 24px→28px thumb:

```jsx
<style>{`
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    border: 2px solid currentColor;
    transition: all 0.15s ease;
  }
  input[type='range']::-webkit-slider-thumb:active {
    width: 28px;
    height: 28px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  input[type='range']::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    border: 2px solid currentColor;
    transition: all 0.15s ease;
  }
  input[type='range']::-moz-range-thumb:active {
    width: 28px;
    height: 28px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  input[type='range']:focus {
    outline: none;
  }
`}</style>
```

---

## Preset Button Examples

### Amount Presets (Currency)
```
For ₹ amounts: ₹1K, ₹2K, ₹5K, ₹10K
For large ₹: ₹10L, ₹50L, ₹1Cr, ₹5Cr
```

### Rate Presets (Percentages)
```
Interest rates: 3%, 6%, 9%, 12%
Expected return: 8%, 10%, 12%, 15%
```

### Time Presets (Duration)
```
Years: 2Y, 5Y, 10Y, 20Y
Months: 12M, 24M, 36M, 60M
```

---

## Helper Text Pattern

Use emoji + concise explanation (1-2 sentences):

```
Amount inputs:
💡 Start small - even ₹500/month becomes ₹6L+ in 10 years

Rate inputs:
💡 Current FD rates range from 6-7%. Expected market returns: 10-12%

Time inputs:
💡 Longer tenure = higher returns. Minimum lock-in periods apply to RDs & FDs
```

---

## Responsive Layout

| Screen | Layout | Slider | Input | Notes |
|--------|--------|--------|-------|-------|
| Mobile ≤640px | `flex-col` | 100% width | Full width below | Stacked vertically |
| Desktop ≥768px | `flex-row` | Flex-1 (expand) | 112px (md:w-28) | Side-by-side |

---

## Implementation Checklist

For each calculator slider, ensure:

- [ ] **Label with unit** (e.g., "Annual Rate (%)")
- [ ] **Slider with gradient** (correct color: green/blue/orange)
- [ ] **Number input** (same color scheme, px-3 py-3)
- [ ] **Preset buttons** (4 values, color-matched)
- [ ] **Helper text** (emoji + 1-2 sentence explanation)
- [ ] **Range text** (min-max reference, optional)
- [ ] **Custom thumb CSS** (24px default, 28px active)
- [ ] **Mobile responsive** (flex-col on mobile, flex-row on desktop)
- [ ] **Dark mode** (all dark: variants applied)
- [ ] **Error handling** (red text for validation errors)

---

## Calculators to Update (Priority Order)

| # | Calculator | Status | Changes Needed |
|---|-----------|--------|-----------------|
| 1 | EMI | ❌ | Add emoji helper text + preset buttons |
| 2 | Tax | ❌ | Add emoji helper text + preset buttons |
| 3 | Home Loan vs Rent | ⚠️ | Update to match RD pattern (custom layout currently) |
| 4 | Profit Margin | ⚠️ | Add preset buttons to margin/markup inputs |
| 5 | GST | ⚠️ | Add emoji helper text to sliders |
| 6 | Scientific | ℹ️ | N/A (expression-based, not slider-based) |

---

## Quick Copy-Paste Templates

### Green Slider (Amount)
```jsx
className="flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600"
// Input: border-green-400, text-green-700, bg-green-50
```

### Blue Slider (Rate)
```jsx
className="flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
// Input: border-blue-400, text-blue-700, bg-blue-50
```

### Orange Slider (Time)
```jsx
className="flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600"
// Input: border-orange-400, text-orange-700, bg-orange-50
```

---

## Dark Mode Support

All classes include dark mode variants:
- `dark:text-{color}-400` (text)
- `dark:bg-{color}-900/20` (background)
- `dark:border-{color}-700` (border)
- `dark:hover:bg-{color}-900/50` (hover)

---

## Reference Files

- **Reference Implementation:** `app/rd-calculator/page.tsx` (lines 200-295)
- **Matching Implementations:** SIP, Simple Interest, FD, BMI, CAGR, Percentage, Retirement
- **Component (Not Currently Used):** `components/ui/MobileSliderInput.tsx`

---

## Example Calculator Inputs Map

### RD Calculator (Complete Reference)
```
monthlyDeposit → Green (Amount)
annualRate → Blue (Rate)
months → Orange (Time)
```

### EMI Calculator (To Update)
```
principal → Green (Amount)
annualRate → Blue (Rate)
years → Orange (Time)
```

### Tax Calculator (To Update)
```
grossSalary → Green (Amount)
(various deductions) → Green (Amounts)
```

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-06-02 | 1.0 | Initial guide based on RD Calculator reference |

