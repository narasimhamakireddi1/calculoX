const chromium = require('chromium-cli');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';
const REPORT = [];

async function testCalculator(browserPage, calcName, calcPath, testFn) {
  console.log(`\n📊 Testing ${calcName}...`);
  REPORT.push(`\n## ${calcName}`);

  try {
    await browserPage.goto(`${BASE_URL}${calcPath}`, { waitUntil: 'networkidle' });
    await browserPage.waitForLoadState('domcontentloaded');

    const result = await testFn(browserPage);
    REPORT.push(`✅ ${result.status}`);
    if (result.details) {
      REPORT.push(result.details);
    }
    console.log(`✅ ${calcName}: ${result.status}`);
  } catch (error) {
    REPORT.push(`❌ Error: ${error.message}`);
    console.error(`❌ ${calcName}: ${error.message}`);
  }
}

async function testSliderSync(page, sliderSelector, inputSelector) {
  try {
    // Test slider to input
    const slider = await page.$(sliderSelector);
    const input = await page.$(inputSelector);

    if (!slider || !input) {
      return { success: false, reason: 'Slider or input not found' };
    }

    // Drag slider
    const sliderBox = await slider.boundingBox();
    const startX = sliderBox.x + sliderBox.width / 4;
    const startY = sliderBox.y + sliderBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY);
    await page.mouse.up();

    // Wait for synchronization
    await page.waitForTimeout(500);

    // Check if input value changed
    const inputValue = await input.inputValue();

    if (inputValue && inputValue !== '0' && inputValue !== '') {
      return { success: true, inputValue };
    } else {
      return { success: false, reason: 'Input value did not update after slider drag' };
    }
  } catch (error) {
    return { success: false, reason: error.message };
  }
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Homepage
    console.log('🏠 Loading homepage...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const calculators = await page.$$('.grid a');
    console.log(`Found ${calculators.length} calculator links on homepage`);

    // Test SIP Calculator
    await testCalculator(page, 'SIP Calculator', '/sip-calculator', async (p) => {
      // Find sliders and inputs
      const sliders = await p.$$('input[type="range"]');
      const inputs = await p.$$('input[type="number"]');

      if (sliders.length < 2) {
        return { status: '❌ Not enough sliders found', details: `Found ${sliders.length} sliders, expected at least 4` };
      }

      if (inputs.length < 2) {
        return { status: '❌ Not enough number inputs found', details: `Found ${inputs.length} inputs, expected at least 4` };
      }

      // Test first slider
      const result = await testSliderSync(p, 'input[type="range"]:first-of-type', 'input[type="number"]:first-of-type');

      if (result.success) {
        return { status: '✅ Sliders and inputs working', details: `First slider synced with input (value: ${result.inputValue})` };
      } else {
        return { status: '❌ Slider synchronization failed', details: result.reason };
      }
    });

    // Test BMI Calculator
    await testCalculator(page, 'BMI Calculator', '/bmi-calculator', async (p) => {
      const sliders = await p.$$('input[type="range"]');
      const inputs = await p.$$('input[type="number"]');

      if (sliders.length < 1) {
        return { status: '❌ No sliders found' };
      }

      const result = await testSliderSync(p, 'input[type="range"]:first-of-type', 'input[type="number"]:first-of-type');

      if (result.success) {
        return { status: '✅ Sliders working', details: `Weight slider synced (value: ${result.inputValue})` };
      } else {
        return { status: '❌ Slider sync failed', details: result.reason };
      }
    });

    // Test EMI Calculator
    await testCalculator(page, 'EMI Calculator', '/emi-calculator', async (p) => {
      const sliders = await p.$$('input[type="range"]');
      const inputs = await p.$$('input[type="number"]');

      if (sliders.length < 3) {
        return { status: '❌ Not enough sliders', details: `Found ${sliders.length}, expected 3` };
      }

      const result = await testSliderSync(p, 'input[type="range"]:nth-of-type(1)', 'input[type="number"]:nth-of-type(1)');

      if (result.success) {
        return { status: '✅ EMI sliders working', details: `Principal slider synced` };
      } else {
        return { status: '❌ Slider sync failed', details: result.reason };
      }
    });

    // Test Tax Calculator
    await testCalculator(page, 'Tax Calculator', '/tax-calculator', async (p) => {
      const sliders = await p.$$('input[type="range"]');

      if (sliders.length < 1) {
        return { status: '❌ No sliders found' };
      }

      const result = await testSliderSync(p, 'input[type="range"]', 'input[type="number"]:nth-of-type(1)');

      if (result.success) {
        return { status: '✅ Tax sliders working', details: `Income slider synced` };
      } else {
        return { status: '❌ Slider sync failed', details: result.reason };
      }
    });

    // Test FD Calculator
    await testCalculator(page, 'FD Calculator', '/fd-calculator', async (p) => {
      const sliders = await p.$$('input[type="range"]');

      if (sliders.length < 2) {
        return { status: '❌ Not enough sliders', details: `Found ${sliders.length}, expected 2` };
      }

      const result = await testSliderSync(p, 'input[type="range"]:first-of-type', 'input[type="number"]:first-of-type');

      if (result.success) {
        return { status: '✅ FD sliders working', details: `Principal slider synced` };
      } else {
        return { status: '❌ Slider sync failed', details: result.reason };
      }
    });

    // Test RD Calculator
    await testCalculator(page, 'RD Calculator', '/rd-calculator', async (p) => {
      const sliders = await p.$$('input[type="range"]');

      if (sliders.length < 2) {
        return { status: '❌ Not enough sliders', details: `Found ${sliders.length}, expected 2` };
      }

      const result = await testSliderSync(p, 'input[type="range"]:first-of-type', 'input[type="number"]:first-of-type');

      if (result.success) {
        return { status: '✅ RD sliders working', details: `Monthly deposit slider synced` };
      } else {
        return { status: '❌ Slider sync failed', details: result.reason };
      }
    });

    // Test Simple Interest Calculator
    await testCalculator(page, 'Simple Interest Calculator', '/simple-interest-calculator', async (p) => {
      const sliders = await p.$$('input[type="range"]');

      if (sliders.length < 2) {
        return { status: '❌ Not enough sliders', details: `Found ${sliders.length}, expected 2` };
      }

      const result = await testSliderSync(p, 'input[type="range"]:first-of-type', 'input[type="number"]:first-of-type');

      if (result.success) {
        return { status: '✅ Simple Interest sliders working', details: `Principal slider synced` };
      } else {
        return { status: '❌ Slider sync failed', details: result.reason };
      }
    });

    // Test GST Calculator
    await testCalculator(page, 'GST Calculator', '/gst-calculator', async (p) => {
      const sliders = await p.$$('input[type="range"]');

      if (sliders.length < 1) {
        return { status: '❌ No sliders found' };
      }

      const result = await testSliderSync(p, 'input[type="range"]', 'input[type="number"]:first-of-type');

      if (result.success) {
        return { status: '✅ GST sliders working', details: `Amount slider synced` };
      } else {
        return { status: '❌ Slider sync failed', details: result.reason };
      }
    });

    // Test Percentage Calculator
    await testCalculator(page, 'Percentage Calculator', '/percentage-calculator', async (p) => {
      const sliders = await p.$$('input[type="range"]');

      if (sliders.length < 2) {
        return { status: '⚠️  Limited sliders', details: `Found ${sliders.length}, expected 2+` };
      }

      const result = await testSliderSync(p, 'input[type="range"]:first-of-type', 'input[type="number"]:first-of-type');

      if (result.success) {
        return { status: '✅ Percentage sliders working', details: `First value slider synced` };
      } else {
        return { status: '⚠️  Slider sync issue', details: result.reason };
      }
    });

    // Test CAGR Calculator
    await testCalculator(page, 'CAGR Calculator', '/cagr-calculator', async (p) => {
      const sliders = await p.$$('input[type="range"]');

      if (sliders.length < 2) {
        return { status: '❌ Not enough sliders', details: `Found ${sliders.length}, expected 3` };
      }

      const result = await testSliderSync(p, 'input[type="range"]:first-of-type', 'input[type="number"]:first-of-type');

      if (result.success) {
        return { status: '✅ CAGR sliders working', details: `Initial value slider synced` };
      } else {
        return { status: '❌ Slider sync failed', details: result.reason };
      }
    });

    // Save report
    const reportPath = path.join(process.cwd(), 'CALCULATOR_TEST_REPORT.md');
    fs.writeFileSync(reportPath, REPORT.join('\n'));
    console.log(`\n✅ Test report saved to ${reportPath}`);

  } finally {
    await browser.close();
  }
}

main().catch(console.error);
