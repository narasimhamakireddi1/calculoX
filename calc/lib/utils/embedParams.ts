// Parses numeric query params for /embed/* pages (see app/embed/*/page.tsx) into a
// partial form-values object, used to pre-fill a calculator's Core component when an
// MCP host opens the widget with the tool's already-computed inputs in the URL.
// Silently skips missing/non-numeric values rather than throwing — an embed page with
// a partially-invalid query string should still render with sane defaults, not 500.
export function parseNumericEmbedParams<T extends Record<string, number>>(
  searchParams: Record<string, string | string[] | undefined>,
  keys: (keyof T)[]
): Partial<T> {
  const result: Partial<T> = {};
  for (const key of keys) {
    const raw = searchParams[key as string];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value === undefined) continue;
    const num = Number(value);
    if (Number.isFinite(num)) {
      result[key] = num as T[keyof T];
    }
  }
  return result;
}
