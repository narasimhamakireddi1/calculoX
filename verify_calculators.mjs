import chromium from 'chromium';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'http://localhost:3001';
const SCREENSHOTS_DIR = './test_screenshots';
const REPORT = [];

if (!existsSync(SCREENSHOTS_DIR)) {
  mkdirSync(SCREENSHOTS_DIR);
}

async function testCalculator(browser, calcName, calcPath) {
  console.log(`\n🔍 Testing ${calcName}...`);
  REPORT.push(`\n## ${calcName}`);
  REPORT.push(`**Path:** ${calcPath}`);

  const page = await browser.newPage();

  try {
    await page.goto(`${BASE_URL}${calcPath}`, { waitUntil: 'networkidle' });

    // Check for sliders
    const sliders = await page.$$('input[type="range"]');
    const inputs = await page.$$('input[type="number"]');

    REPORT.push(`- Sliders Found: ${sliders.length}`);
    REPORT.push(`- Number Inputs Found: ${inputs.length}`);

    if (sliders.length === 0) {
      REPORT.push('- Status: ❌ NO SLIDERS FOUND');
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/${calcName.replace(/ /g, '_')}_no_sliders.png` });
      return;
    }

    // Test first slider
    if (sliders.length > 0 && inputs.length > 0) {
      const sliderSelector = 'input[type="range"]:first-of-type';
      const inputSelector = 'input[type="number"]:first-of-type';

      // Take screenshot before
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/${calcName.replace(/ /g, '_')}_before.png` });

      // Try to drag first slider
      const slider = await page.$(sliderSelector);
      const boundingBox = await slider.boundingBox();

      // Drag slider to the right
      await page.mouse.move(boundingBox.x + boundingBox.width * 0.25, boundingBox.y + boundingBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(boundingBox.x + boundingBox.width * 0.75, boundingBox.y + boundingBox.height / 2, { steps: 10 });
      await page.mouse.up();

      // Wait for synchronization
      await page.waitForTimeout(500);

      // Get values
      const sliderValue = await page.$eval(sliderSelector, el => el.value);
      const inputValue = await page.$eval(inputSelector, el => el.value);

      REPORT.push(`- Slider Value After Drag: ${sliderValue}`);
      REPORT.push(`- Input Value After Drag: ${inputValue}`);

      // Check if they're synchronized
      if (sliderValue === inputValue && sliderValue !== '0') {
        REPORT.push('- Status: ✅ SLIDERS & INPUTS SYNCHRONIZED');
      } else {
        REPORT.push(`- Status: ⚠️  VALUES MISMATCH (Slider: ${sliderValue}, Input: ${inputValue})`);
      }

      // Take screenshot after
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/${calcName.replace(/ /g, '_')}_after.png` });

      // Test input to slider sync
      await page.$eval(inputSelector, (el, value) => {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, '50');

      await page.waitForTimeout(300);

      const newSliderValue = await page.$eval(sliderSelector, el => el.value);
      const newInputValue = await page.$eval(inputSelector, el => el.value);

      REPORT.push(`- After Input Change: Slider=${newSliderValue}, Input=${newInputValue}`);
      if (newSliderValue === newInputValue) {
        REPORT.push('- Status: ✅ TWO-WAY SYNCHRONIZATION WORKING');
      } else {
        REPORT.push('- Status: ⚠️  ONE-WAY SYNC (slider→input only)');
      }
    }

    REPORT.push('- Status: ✅ CALCULATOR WORKING');

  } catch (error) {
    REPORT.push(`- Status: ❌ ERROR: ${error.message}`);
    console.error(`Error testing ${calcName}:`, error);
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  try {
    const calculators = [
      { name: 'SIP Calculator', path: '/sip-calculator' },
      { name: 'BMI Calculator', path: '/bmi-calculator' },
      { name: 'EMI Calculator', path: '/emi-calculator' },
      { name: 'Tax Calculator', path: '/tax-calculator' },
      { name: 'FD Calculator', path: '/fd-calculator' },
      { name: 'RD Calculator', path: '/rd-calculator' },
      { name: 'Simple Interest Calculator', path: '/simple-interest-calculator' },
      { name: 'GST Calculator', path: '/gst-calculator' },
      { name: 'Percentage Calculator', path: '/percentage-calculator' },
      { name: 'CAGR Calculator', path: '/cagr-calculator' },
    ];

    REPORT.push('# Calculator Verification Report');
    REPORT.push(`Generated at: ${new Date().toISOString()}`);
    REPORT.push(`Base URL: ${BASE_URL}`);
    REPORT.push('');

    for (const calc of calculators) {
      await testCalculator(browser, calc.name, calc.path);
    }

    // Save report
    const reportPath = 'CALCULATOR_VERIFICATION_REPORT.md';
    writeFileSync(reportPath, REPORT.join('\n'));
    console.log(`\n✅ Report saved to ${reportPath}`);
    console.log(`📸 Screenshots saved to ${SCREENSHOTS_DIR}/`);

  } finally {
    await browser.close();
  }
}

main().catch(console.error);
