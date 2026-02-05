/**
 * Format a number as Argentine Peso currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$450.000")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as Argentine Peso currency with cents
 * @param amount - The amount to format
 * @returns Formatted currency string with cents (e.g., "$450.000,50")
 */
export function formatCurrencyWithCents(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Parse a currency string back to a number
 * @param currencyStr - Currency string to parse
 * @returns The numeric value
 */
export function parseCurrency(currencyStr: string): number {
  return parseFloat(currencyStr.replace(/[^\d,-]/g, "").replace(",", "."));
}
