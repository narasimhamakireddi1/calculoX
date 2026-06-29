// Utility for formatting calculator inputs for PDF export
export interface FormattedInput {
  label: string;
  value: string;
}

export const formatInputsForPDF = (inputs: FormattedInput[]): string => {
  return inputs
    .map(
      (input, idx) =>
        `<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; ${
          idx !== inputs.length - 1 ? 'border-bottom: 1px solid #e5e7eb;' : ''
        }">
          <span style="color: #6b7280; font-size: 13px; font-weight: 500;">${input.label}</span>
          <span style="color: #1f2937; font-size: 13px; font-weight: 600;">${input.value}</span>
        </div>`
    )
    .join('');
};

export const createInputsHTML = (formattedInputs: FormattedInput[]): string => {
  if (formattedInputs.length === 0) return '';

  const inputRows = formatInputsForPDF(formattedInputs);

  return `
    <div style="margin-bottom: 25px;">
      <h2 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">📝</span> Input Parameters
      </h2>
      <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb;">
        ${inputRows}
      </div>
    </div>
  `;
};
