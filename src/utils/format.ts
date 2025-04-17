
import { format, isValid, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

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

/**
 * Formats a date string to Brazilian format (dd/MM/yyyy)
 * @param dateString Date string in any parseable format
 * @returns Formatted date string or original input if parsing fails
 */
export const formatDateBR = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  try {
    // Try to parse ISO format first
    let date = new Date(dateString);
    
    // Check if we got a valid date
    if (!isNaN(date.getTime())) {
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    }
    
    // Try to parse DD/MM/YYYY format
    date = parse(dateString, 'dd/MM/yyyy', new Date());
    if (isValid(date)) {
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    }
    
    return dateString;
  } catch (e) {
    return dateString;
  }
};

/**
 * Parses a Brazilian date format (dd/MM/yyyy) to ISO format
 * @param dateString Date string in dd/MM/yyyy format
 * @returns ISO date string or null if parsing fails
 */
export const parseDateToISO = (dateString: string | null | undefined): string | null => {
  if (!dateString) return null;
  
  try {
    // Try to parse DD/MM/YYYY format
    const date = parse(dateString, 'dd/MM/yyyy', new Date());
    if (isValid(date)) {
      return date.toISOString();
    }
    return null;
  } catch (e) {
    return null;
  }
};
