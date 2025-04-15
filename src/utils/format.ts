
/**
 * Extracts a number from a currency string
 * @param value String in the format "R$ 1.000,00" or similar
 * @returns number
 */
export const extractNumberFromCurrency = (value: string | null | undefined): number => {
  if (!value) return 0;
  // Remove currency symbol, dots (thousand separators) and replace commas with dots
  const numericString = value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
  return parseFloat(numericString) || 0;
};

/**
 * Formats a number as Brazilian currency
 * @param value number
 * @returns string in the format "R$ 1.000,00"
 */
export const formatCurrency = (value: number): string => {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
