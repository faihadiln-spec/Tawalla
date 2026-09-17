/**
 * Universal Arabic numeral and date formatters for Tawalla.
 * Converts numbers and dates into Eastern Arabic numerals (٠-٩).
 */

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/**
 * Converts any Latin digits (0-9) in a string or number to Eastern Arabic numerals (٠-٩).
 */
export function toArabicDigits(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[0-9]/g, (digit) => ARABIC_DIGITS[+digit]);
}

/**
 * Formats a number with thousands separators using Eastern Arabic numerals.
 * Example: 1250 -> "١٬٢٥٠", 227 -> "٢٢٧"
 */
export function formatArabicNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "٠";
  const num = typeof value === "number" ? value : Number(value);
  if (isNaN(num)) return toArabicDigits(String(value));
  
  // Format with standard grouping then map digits
  const parts = num.toLocaleString("en-US").split(".");
  const intPart = toArabicDigits(parts[0]);
  if (parts.length > 1) {
    return `${intPart}٫${toArabicDigits(parts[1])}`;
  }
  return intPart;
}

/**
 * Formats a date string or Date object into localized Arabic with Eastern Arabic numerals.
 * Example: "2026-09-17" -> "١٧ سبتمبر ٢٠٢٦"
 */
export function formatArabicDate(
  date: Date | string | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return toArabicDigits(String(date));

  const defaultOptions: Intl.DateTimeFormatOptions = options || {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  try {
    const formatted = d.toLocaleDateString("ar-SA-u-nu-arab", defaultOptions);
    return toArabicDigits(formatted);
  } catch {
    return toArabicDigits(d.toISOString().split("T")[0]);
  }
}
