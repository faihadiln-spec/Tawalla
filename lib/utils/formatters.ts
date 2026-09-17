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

/**
 * Formats day differences accurately following Arabic grammar rules (المعدود).
 * Examples:
 *  diff = 0  -> "ينتهي اليوم!"
 *  diff = 1  -> "متبقي يوم واحد"
 *  diff = 2  -> "متبقي يومان"
 *  diff = 7  -> "متبقي ٧ أيام" (3-10: جمع مجرور)
 *  diff = 15 -> "متبقي ١٥ يوماً" (11+: مفرد منصوب)
 *  diff = -7 -> "منتهي منذ ٧ أيام"
 */
export function formatDaysRemaining(diffDays: number, feminine: boolean = false): string {
  if (diffDays < 0) {
    const abs = Math.abs(diffDays);
    const prefix = feminine ? "منتهية منذ" : "منتهي منذ";
    if (abs === 1) return `${prefix} يوم واحد`;
    if (abs === 2) return `${prefix} يومين`;
    if (abs >= 3 && abs <= 10) return `${prefix} ${toArabicDigits(abs)} أيام`;
    return `${prefix} ${toArabicDigits(abs)} يوماً`;
  }
  if (diffDays === 0) {
    return feminine ? "تنتهي اليوم!" : "ينتهي اليوم!";
  }
  if (diffDays === 1) {
    return "متبقي يوم واحد";
  }
  if (diffDays === 2) {
    return "متبقي يومان";
  }
  if (diffDays >= 3 && diffDays <= 10) {
    return `متبقي ${toArabicDigits(diffDays)} أيام`;
  }
  return `متبقي ${toArabicDigits(diffDays)} يوماً`;
}

/**
 * Formats duration in months according to Arabic grammar rules.
 * Examples:
 *  1  -> "شهر واحد"
 *  2  -> "شهران"
 *  6  -> "٦ أشهر" (3-10: جمع مجرور)
 *  24 -> "٢٤ شهراً" (11+: مفرد منصوب)
 */
export function formatMonthsCount(months: number | string | null | undefined): string {
  if (months === null || months === undefined) return "";
  const m = typeof months === "number" ? months : Number(months);
  if (isNaN(m) || m <= 0) return "";
  if (m === 1) return "شهر واحد";
  if (m === 2) return "شهران";
  if (m >= 3 && m <= 10) return `${toArabicDigits(m)} أشهر`;
  return `${toArabicDigits(m)} شهراً`;
}

/**
 * Formats warranties count for portal and summary cards.
 * Adheres to Arabic dual (مثنى) and plural (جمع) rules.
 */
export function formatWarrantiesCount(count: number): { main: string; suffix: string } {
  if (count <= 0) return { main: "لا توجد", suffix: "ضمانات محفوظة" };
  if (count === 1) return { main: "ضمان واحد", suffix: "محفوظ" };
  if (count === 2) return { main: "ضمانان", suffix: "محفوظان" };
  if (count >= 3 && count <= 10) return { main: toArabicDigits(count), suffix: "ضمانات محفوظة" };
  return { main: toArabicDigits(count), suffix: "ضماناً محفوظاً" };
}

/**
 * Formats documents count for portal and summary cards.
 * Adheres to Arabic dual (مثنى) and plural (جمع) rules.
 */
export function formatDocumentsCount(count: number): { main: string; suffix: string } {
  if (count <= 0) return { main: "لا توجد", suffix: "وثائق محفوظة" };
  if (count === 1) return { main: "وثيقة واحدة", suffix: "محفوظة" };
  if (count === 2) return { main: "وثيقتان", suffix: "محفوظتان" };
  if (count >= 3 && count <= 10) return { main: toArabicDigits(count), suffix: "وثائق محفوظة" };
  return { main: toArabicDigits(count), suffix: "وثيقة محفوظة" };
}

/**
 * Formats excluded subscriptions count grammatically (e.g. تم استبعاد اشتراكين / ٣ اشتراكات).
 */
export function formatExcludedSubscriptions(count: number): string {
  if (count <= 0) return "";
  if (count === 1) return "تم استبعاد اشتراك واحد";
  if (count === 2) return "تم استبعاد اشتراكين";
  if (count >= 3 && count <= 10) return `تم استبعاد ${toArabicDigits(count)} اشتراكات`;
  return `تم استبعاد ${toArabicDigits(count)} اشتراكاً`;
}

