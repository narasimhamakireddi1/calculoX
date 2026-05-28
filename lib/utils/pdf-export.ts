import html2pdf from 'html2pdf.js';

export interface PDFExportOptions {
  fileName: string;
  calculatorName: string;
  timestamp?: boolean;
}

export const exportResultsAsPDF = (
  elementId: string,
  options: PDFExportOptions
) => {
  const element = document.getElementById(elementId);
  if (!element) {
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
    margin: [10, 10, 10, 10],
    filename: `${options.fileName}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  const headerHTML = `
    <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 15px;">
      <h1 style="margin: 0; color: #1f2937; font-size: 24px; font-weight: bold;">
        ${options.calculatorName}
      </h1>
      ${options.timestamp ? `<p style="margin: 8px 0 0 0; color: #6b7280; font-size: 12px;">Generated on ${timestamp}</p>` : ''}
    </div>
  `;

  const footerHTML = `
    <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #9ca3af;">
      <p style="margin: 5px 0;">CalculoX - Premium Financial Calculators</p>
      <p style="margin: 5px 0;">www.calculox.in</p>
    </div>
  `;

  // Create a clone of the element with styling preserved
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.padding = '20px';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#000000';

  // Remove dark mode classes
  clone.classList.remove('dark');
  clone.querySelectorAll('[class*="dark:"]').forEach((el) => {
    el.className = el.className.replace(/dark:\S+/g, '');
  });

  // Create container with header and footer
  const container = document.createElement('div');
  container.innerHTML = headerHTML + clone.innerHTML + footerHTML;

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
