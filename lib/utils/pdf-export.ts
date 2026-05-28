import html2pdf from 'html2pdf.js';

export interface FormattedInput {
  label: string;
  value: string;
}

export interface PDFExportOptions {
  fileName: string;
  calculatorName: string;
  timestamp?: boolean;
  inputsSectionId?: string;
  resultsSectionId?: string;
  inputsData?: FormattedInput[];
}

const extractInputValues = (element: HTMLElement): Array<{ label: string; value: string }> => {
  const pairs: Array<{ label: string; value: string }> = [];

  // Strategy: Find all direct div children that contain a label + input structure
  const sections = Array.from(element.children).filter((child) => {
    const label = child.querySelector('label');
    const input = child.querySelector('input[type="number"], select');
    return label && input;
  });

  sections.forEach((section) => {
    const label = section.querySelector('label');
    let input: HTMLInputElement | null = null;

    // Find the last number input in this section (usually the actual value field, not the range)
    const allInputs = Array.from(section.querySelectorAll('input[type="number"]'));
    if (allInputs.length > 0) {
      input = allInputs[allInputs.length - 1] as HTMLInputElement;
    }

    if (label && input) {
      const labelText = label.textContent?.trim() || '';
      const inputValue = input.value || '';

      if (labelText && inputValue && inputValue !== '0') {
        if (!pairs.find(p => p.label === labelText)) {
          pairs.push({ label: labelText, value: inputValue });
        }
      }
    }
  });

  return pairs.slice(0, 10);
};

export const exportResultsAsPDF = (
  elementId: string,
  options: PDFExportOptions
) => {
  const resultsElement = options.resultsSectionId
    ? document.getElementById(options.resultsSectionId)
    : document.getElementById(elementId);

  const inputsElement = options.inputsSectionId
    ? document.getElementById(options.inputsSectionId)
    : null;

  if (!resultsElement) {
    console.error(`Element with ID "${elementId}" not found`);
    return;
  }

  const timestamp = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const pdfOptions: any = {
    margin: [12, 12, 12, 12],
    filename: `${options.fileName}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  const headerHTML = `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
      <div style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">🧮</div>
      <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700;">
        ${options.calculatorName}
      </h1>
      ${options.timestamp ? `<p style="margin: 0; font-size: 12px; opacity: 0.9;">Generated on ${timestamp}</p>` : ''}
    </div>
  `;

  let inputsHTML = '';

  // Use provided inputsData if available, otherwise try to extract from DOM
  let inputPairs: FormattedInput[] = options.inputsData || [];
  if (inputPairs.length === 0 && inputsElement) {
    inputPairs = extractInputValues(inputsElement);
  }

  if (inputPairs.length > 0) {
    const inputRows = inputPairs
      .map(
        (pair, idx) =>
          `<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; ${
            idx !== inputPairs.length - 1 ? 'border-bottom: 1px solid #e5e7eb;' : ''
          }">
            <span style="color: #6b7280; font-size: 13px; font-weight: 500;">${pair.label}</span>
            <span style="color: #1f2937; font-size: 13px; font-weight: 600;">${pair.value}</span>
          </div>`
      )
      .join('');

    inputsHTML = `
      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 18px;">📝</span> Input Parameters
        </h2>
        <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb;">
          ${inputRows}
        </div>
      </div>
    `;
  }

  const resultsClone = resultsElement.cloneNode(true) as HTMLElement;
  resultsClone.style.padding = '0';
  resultsClone.style.backgroundColor = '#ffffff';
  resultsClone.style.color = '#000000';
  resultsClone.classList.remove('dark');
  resultsClone.querySelectorAll('[class*="dark:"]').forEach((el) => {
    el.className = el.className.replace(/dark:\S+/g, '');
  });

  const resultsHTML = `
    <div style="margin-bottom: 25px;">
      <h2 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">📊</span> Calculation Results
      </h2>
      <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb;">
        ${resultsClone.innerHTML}
      </div>
    </div>
  `;

  const disclaimerHTML = `
    <div style="margin-bottom: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 4px;">
      <p style="margin: 0; color: #92400e; font-size: 11px; line-height: 1.5;">
        <strong>Disclaimer:</strong> These calculations are for informational purposes only. Actual amounts may vary based on various factors. Please consult a financial advisor for accurate guidance.
      </p>
    </div>
  `;

  const footerHTML = `
    <div style="border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 25px; text-align: center;">
      <p style="margin: 5px 0; color: #1f2937; font-weight: 600; font-size: 12px;">CalculoX</p>
      <p style="margin: 5px 0; color: #6b7280; font-size: 11px;">Premium Financial Calculators</p>
      <p style="margin: 5px 0; color: #9ca3af; font-size: 10px;">www.calculox.in</p>
    </div>
  `;

  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  container.innerHTML =
    headerHTML + inputsHTML + resultsHTML + disclaimerHTML + footerHTML;

  html2pdf().set(pdfOptions).from(container).save();
};

export const copyResultsToClipboard = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID "${elementId}" not found`);
    return false;
  }

  try {
    const text = element.innerText;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
